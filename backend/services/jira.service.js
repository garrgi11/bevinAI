// jira.service.js
// Service to generate and create Jira tickets from AI analysis

const { pool } = require('../config/database');

// ------------ ENV ------------
const {
  NVIDIA_API_KEY,
  JIRA_BASE_URL,
  JIRA_EMAIL,
  JIRA_API_TOKEN,
  JIRA_PROJECT_KEY,
  JIRA_EPIC_LINK_FIELD_KEY,
  ATLASSIAN_ORG_ID,
  ATLASSIAN_TEAM_ID,
  FRONTEND_DEV_ACCOUNT_ID,
  FRONTEND_DEV_NAME,
  BACKEND_DEV_ACCOUNT_ID,
  BACKEND_DEV_NAME,
  DEVOPS_DEV_ACCOUNT_ID,
  DEVOPS_DEV_NAME,
  FULLSTACK_DEV_ACCOUNT_ID,
  FULLSTACK_DEV_NAME,
  GITLAB_REPO_PATH = "gitlab-group/project-repo",
  GITLAB_BRANCH_PREFIX = "feature",
  GITLAB_MR_TITLE_PREFIX = "feat"
} = process.env;

// ------------ ROLE -> DEV CONFIG ------------
const ROLE_ENV_MAP = {
  frontend: {
    name: FRONTEND_DEV_NAME || "Frontend Dev",
    accountId: FRONTEND_DEV_ACCOUNT_ID || null
  },
  backend: {
    name: BACKEND_DEV_NAME || "Backend Dev",
    accountId: BACKEND_DEV_ACCOUNT_ID || null
  },
  devops: {
    name: DEVOPS_DEV_NAME || "DevOps Dev",
    accountId: DEVOPS_DEV_ACCOUNT_ID || null
  },
  fullstack: {
    name: FULLSTACK_DEV_NAME || "Fullstack Dev",
    accountId: FULLSTACK_DEV_ACCOUNT_ID || null
  }
};

// ------------ HELPERS: DB ------------
async function getProject(projectId) {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS company_name 
     FROM project p 
     JOIN company c ON p.company_id = c.company_id 
     WHERE p.project_id = ?`,
    [projectId]
  );
  if (!rows.length) throw new Error(`No project found for project_id=${projectId}`);
  return rows[0];
}

async function getProjectAnalysis(projectId) {
  const [rows] = await pool.query(
    "SELECT * FROM project_analysis WHERE project_id = ?",
    [projectId]
  );
  if (!rows.length) throw new Error(`No project_analysis found for project_id=${projectId}`);
  return rows[0];
}

async function getTechStackDecision(projectId) {
  const [rows] = await pool.query(
    "SELECT decision_json FROM tech_stack_decision WHERE project_id = ?",
    [projectId]
  );
  if (!rows.length) return null;
  try {
    return JSON.parse(rows[0].decision_json);
  } catch {
    return null;
  }
}

function safeParse(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// ------------ HELPERS: ATLASSIAN TEAM MEMBERS ------------
async function getTeamMembers() {
  if (!ATLASSIAN_ORG_ID || !ATLASSIAN_TEAM_ID) {
    console.warn("⚠️ Atlassian team config missing, using default assignees");
    return [];
  }

  try {
    const url = `https://api.atlassian.com/public/teams/v1/org/${ATLASSIAN_ORG_ID}/teams/${ATLASSIAN_TEAM_ID}/members`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
      },
      body: JSON.stringify({ first: 50 })
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn(`⚠️ Failed to fetch team members: ${res.status} ${body}`);
      return [];
    }

    const data = await res.json();
    console.log("Team API response:", JSON.stringify(data).substring(0, 200));
    
    // Handle different response structures
    let members = [];
    if (Array.isArray(data)) {
      members = data;
    } else if (data.members && Array.isArray(data.members)) {
      members = data.members;
    } else if (data.results && Array.isArray(data.results)) {
      members = data.results;
    } else {
      console.warn("⚠️ Unexpected team API response structure, using empty array");
      return [];
    }
    
    return members
      .map(m => ({
        accountId: m.accountId || m.accountID || m.id,
        name: m.displayName || m.name || "Team Member"
      }))
      .filter(m => m.accountId);
  } catch (error) {
    console.warn("⚠️ Error fetching team members:", error.message);
    return [];
  }
}

function createRoundRobinSelector(members) {
  const index = { any: 0 };
  return function next() {
    if (!members.length) return null;
    const i = index.any % members.length;
    index.any += 1;
    return members[i];
  };
}

function inferRoleFromComponent(component) {
  const c = (component || "").toLowerCase();
  if (c.includes("front")) return "frontend";
  if (c.includes("back")) return "backend";
  if (c.includes("devops")) return "devops";
  if (c.includes("full")) return "fullstack";
  return "backend";
}

function chooseAssignee(role, rrNext, teamMembers) {
  const normalizedRole = (role || "").toLowerCase();
  const fromEnv = ROLE_ENV_MAP[normalizedRole];
  
  if (fromEnv && fromEnv.accountId) {
    return {
      accountId: fromEnv.accountId,
      name: fromEnv.name
    };
  }
  
  const fallback = rrNext();
  if (!fallback) return null;
  
  return {
    accountId: fallback.accountId,
    name: fallback.name
  };
}

// ------------ LLM: GENERATE PLAN ------------
async function generatePlanWithLLM(projectId) {
  const OpenAI = require('openai').default;
  const openai = new OpenAI({
    apiKey: NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
  });

  const project = await getProject(projectId);
  const analysis = await getProjectAnalysis(projectId);
  const techStack = await getTechStackDecision(projectId);

  const functionality = safeParse(analysis.functionality_report);
  const cost = safeParse(analysis.cost_analysis_report);
  const market = safeParse(analysis.market_analysis_report);

  const system = {
    role: "system",
    content:
      "You are an AI Technical Lead generating Jira epics and tickets for a B2B software project. " +
      "You receive: project JSON, functional/cost/market reports, and tech stack decision JSON. " +
      "Use ONLY that context plus standard engineering best practices.\n" +
      "Output ONE valid minified JSON object with clear, implementation-ready Epics and Stories. " +
      "Each ticket must include summary, description, AC, DoD, priority, component, role, and GitLab hints."
  };

  const user = {
    role: "user",
    content:
      "CONTEXT_START\n" +
      "PROJECT_JSON:" + JSON.stringify(project) + "\n" +
      "FUNCTIONALITY_REPORT_JSON:" + JSON.stringify(functionality) + "\n" +
      "COST_REPORT_JSON:" + JSON.stringify(cost) + "\n" +
      "MARKET_REPORT_JSON:" + JSON.stringify(market) + "\n" +
      "TECH_STACK_DECISION_JSON:" + JSON.stringify(techStack) + "\n" +
      "CONTEXT_END\n\n" +
      "Generate a Jira plan with 3-5 epics and 10-15 stories. Use this schema:\n" +
      JSON.stringify({
        project_key: JIRA_PROJECT_KEY,
        epics: [{
          summary: "",
          description: "",
          labels: ["ai-generated", "epic"],
          priority: "High"
        }],
        tickets: [{
          summary: "",
          description: "",
          issue_type: "Story",
          priority: "High",
          labels: ["ai-generated"],
          component: "Frontend|Backend|DevOps|Fullstack",
          assignee: { role: "frontend|backend|devops|fullstack" },
          epic_link: "",
          story_points: 0,
          acceptance_criteria: [""],
          definition_of_done: [""],
          gitlab: {
            repo: GITLAB_REPO_PATH,
            branch_naming: `${GITLAB_BRANCH_PREFIX}/...`,
            mr_title_template: `${GITLAB_MR_TITLE_PREFIX}(...): ...`
          }
        }]
      })
  };

  const completion = await openai.chat.completions.create({
    model: "nvidia/nvidia-nemotron-nano-9b-v2",
    messages: [system, user],
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 4096,
    stream: false
  });

  const raw = completion.choices[0]?.message?.content || "";
  
  // Try to parse JSON
  try {
    return JSON.parse(raw);
  } catch (parseError) {
    console.error("Failed to parse LLM JSON:", parseError.message);
    console.log("Raw content:", raw.substring(0, 500));
    
    // Try to extract JSON from markdown code blocks
    let jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      jsonMatch = raw.match(/```\s*([\s\S]*?)\s*```/);
    }
    if (jsonMatch) {
      try {
        const extracted = jsonMatch[1].trim();
        return JSON.parse(extracted);
      } catch (e) {
        console.error("Failed to parse extracted JSON from code block");
      }
    }
    
    // Try to fix common JSON issues
    let fixed = raw.trim();
    
    // Remove any text before first {
    const firstBrace = fixed.indexOf('{');
    if (firstBrace > 0) {
      fixed = fixed.substring(firstBrace);
    }
    
    // Remove any text after last }
    const lastBrace = fixed.lastIndexOf('}');
    if (lastBrace > 0 && lastBrace < fixed.length - 1) {
      fixed = fixed.substring(0, lastBrace + 1);
    }
    
    try {
      return JSON.parse(fixed);
    } catch (e) {
      // If all parsing fails, return a minimal valid structure
      console.error("All JSON parsing attempts failed, returning minimal structure");
      return {
        project_key: JIRA_PROJECT_KEY,
        epics: [
          {
            summary: "Project Implementation",
            description: "Main epic for project implementation based on AI analysis",
            labels: ["ai-generated", "epic"],
            priority: "High"
          }
        ],
        tickets: [
          {
            summary: "Setup project infrastructure",
            description: "Initialize project with required dependencies and configuration",
            issue_type: "Story",
            priority: "High",
            labels: ["ai-generated", "setup"],
            component: "Backend",
            assignee: { role: "backend" },
            epic_link: "Project Implementation",
            story_points: 5,
            acceptance_criteria: ["Project structure created", "Dependencies installed"],
            definition_of_done: ["Code reviewed", "Tests passing"],
            gitlab: {
              repo: GITLAB_REPO_PATH,
              branch_naming: `${GITLAB_BRANCH_PREFIX}/setup-infrastructure`,
              mr_title_template: `${GITLAB_MR_TITLE_PREFIX}(setup): Initialize project`
            }
          }
        ]
      };
    }
  }
}

// ------------ JIRA HELPERS ------------
async function createJiraIssue(fields) {
  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    throw new Error("Jira credentials not configured. Check JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN in .env");
  }

  console.log(`Creating Jira issue: ${fields.summary}`);
  
  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
    },
    body: JSON.stringify({ fields })
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`Jira API error (${res.status}):`, body);
    throw new Error(`Jira issue create failed (${res.status}): ${body}`);
  }

  const result = await res.json();
  console.log(`✅ Created: ${result.key}`);
  return result;
}

async function transitionIssueToTodo(issueKey) {
  // Get available transitions
  const transitionsRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`, {
    headers: {
      "Authorization": "Basic " + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64"),
      "Accept": "application/json"
    }
  });

  if (!transitionsRes.ok) {
    throw new Error(`Failed to get transitions for ${issueKey}`);
  }

  const { transitions } = await transitionsRes.json();
  
  // Find "To Do" transition (common names: "To Do", "TODO", "Open", "Backlog")
  const todoTransition = transitions.find(t => 
    t.name.toLowerCase().includes('to do') ||
    t.name.toLowerCase().includes('todo') ||
    t.name.toLowerCase() === 'open' ||
    t.to.name.toLowerCase().includes('to do')
  );

  if (!todoTransition) {
    console.log(`   No "To Do" transition available for ${issueKey}`);
    return;
  }

  // Perform transition
  const transitionRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString("base64")
    },
    body: JSON.stringify({
      transition: { id: todoTransition.id }
    })
  });

  if (transitionRes.ok) {
    console.log(`   ✅ Transitioned to: ${todoTransition.to.name}`);
  }
}

function normalizePriority(p) {
  const allowed = ["Highest", "High", "Medium", "Low", "Lowest"];
  if (!p) return "Medium";
  const m = allowed.find(a => a.toLowerCase() === p.toLowerCase());
  return m || "Medium";
}

function mapComponentName(component) {
  const c = (component || "").toLowerCase();
  if (c.includes("front")) return "Frontend";
  if (c.includes("back")) return "Backend";
  if (c.includes("devops")) return "DevOps";
  if (c.includes("full")) return "Fullstack";
  return null;
}

// Convert plain text to Atlassian Document Format (ADF)
function convertToADF(text) {
  if (!text) {
    return {
      version: 1,
      type: "doc",
      content: []
    };
  }

  // Split text into paragraphs
  const paragraphs = text.split('\n').filter(line => line.trim());
  
  const content = paragraphs.map(para => {
    // Check if it's a list item
    if (para.trim().startsWith('-') || para.trim().startsWith('•')) {
      return {
        type: "bulletList",
        content: [{
          type: "listItem",
          content: [{
            type: "paragraph",
            content: [{
              type: "text",
              text: para.trim().replace(/^[-•]\s*/, '')
            }]
          }]
        }]
      };
    }
    
    // Regular paragraph
    return {
      type: "paragraph",
      content: [{
        type: "text",
        text: para
      }]
    };
  });

  return {
    version: 1,
    type: "doc",
    content: content.length > 0 ? content : [{
      type: "paragraph",
      content: [{
        type: "text",
        text: text
      }]
    }]
  };
}

// ------------ MAIN ORCHESTRATION ------------
async function generateAndCreateJiraTickets(projectId) {
  console.log(`🎫 Starting Jira ticket generation for project ID: ${projectId}`);

  const teamMembers = await getTeamMembers();
  const nextTeamMember = createRoundRobinSelector(teamMembers);
  
  console.log(`👥 Found ${teamMembers.length} team members`);

  const plan = await generatePlanWithLLM(projectId);
  
  if (plan.project_key !== JIRA_PROJECT_KEY) {
    plan.project_key = JIRA_PROJECT_KEY;
  }

  const epicKeyMap = {};
  const createdIssues = { epics: [], tickets: [] };

  // Create Epics
  if (Array.isArray(plan.epics)) {
    console.log(`📋 Creating ${plan.epics.length} epics...`);
    
    for (const epic of plan.epics) {
      if (!epic.summary) continue;

      const fields = {
        project: { key: plan.project_key },
        summary: epic.summary,
        description: convertToADF(epic.description || ""),
        issuetype: { name: "Epic" },
        labels: epic.labels || ["ai-generated", "epic"],
        priority: { name: normalizePriority(epic.priority || "High") }
      };

      const created = await createJiraIssue(fields);
      epicKeyMap[epic.summary] = created.key;
      createdIssues.epics.push({ key: created.key, summary: epic.summary });
      
      console.log(`✅ Created Epic ${created.key}: ${epic.summary}`);
    }
  }

  // Create Tickets
  if (Array.isArray(plan.tickets)) {
    console.log(`🎫 Creating ${plan.tickets.length} tickets...`);
    
    for (const t of plan.tickets) {
      if (!t.summary) continue;

      const role = (t.assignee && t.assignee.role) || inferRoleFromComponent(t.component);
      const assignee = chooseAssignee(role, nextTeamMember, teamMembers);
      const componentName = mapComponentName(t.component);
      
      const epicKeyFromSummary =
        (t.epic_link && epicKeyMap[t.epic_link]) ||
        epicKeyMap[Object.keys(epicKeyMap)[0]] ||
        null;

      const ac = (t.acceptance_criteria || [])
        .filter(Boolean)
        .map(i => `- ${i}`)
        .join("\n") || "";
      
      const dod = (t.definition_of_done || [])
        .filter(Boolean)
        .map(i => `- ${i}`)
        .join("\n") || "";

      const gitlab = t.gitlab || {};
      const gitlabBlock = gitlab.repo
        ? `\n\nGitLab:\n- Repo: ${gitlab.repo}\n- Branch: ${gitlab.branch_naming}\n- MR: ${gitlab.mr_title_template}`
        : "";

      const description =
        (t.description || "") +
        (ac ? `\n\nAcceptance Criteria:\n${ac}` : "") +
        (dod ? `\n\nDefinition of Done:\n${dod}` : "") +
        gitlabBlock;

      const fields = {
        project: { key: plan.project_key },
        summary: t.summary,
        description: convertToADF(description),
        issuetype: { name: t.issue_type || "Story" },
        priority: { name: normalizePriority(t.priority) },
        labels: t.labels || ["ai-generated"],
        components: componentName ? [{ name: componentName }] : []
      };

      // Try to create with assignee first
      let created;
      if (assignee && assignee.accountId) {
        try {
          fields.assignee = { accountId: assignee.accountId };
          created = await createJiraIssue(fields);
        } catch (assignError) {
          // If assignee fails, try without assignee
          if (assignError.message.includes('cannot be assigned')) {
            console.warn(`⚠️  User ${assignee.accountId} cannot be assigned, creating without assignee`);
            delete fields.assignee;
            created = await createJiraIssue(fields);
          } else {
            throw assignError;
          }
        }
      } else {
        created = await createJiraIssue(fields);
      }
      
      // Try to transition to "To Do" status
      try {
        await transitionIssueToTodo(created.key);
      } catch (transitionError) {
        console.warn(`⚠️  Could not transition ${created.key} to To Do:`, transitionError.message);
      }
      
      createdIssues.tickets.push({ 
        key: created.key, 
        summary: t.summary,
        assignee: assignee ? assignee.name : "Unassigned"
      });
      
      console.log(`✅ Created ${created.key} [${role || "auto"}] -> ${assignee ? assignee.name : "unassigned"}`);
    }
  }

  console.log("✅ Jira tickets generated successfully!");
  console.log(`📊 Created ${createdIssues.epics.length} epics and ${createdIssues.tickets.length} tickets`);
  
  // Verify at least some tickets were created
  if (createdIssues.epics.length === 0 && createdIssues.tickets.length === 0) {
    throw new Error("No Jira tickets were created. Check Jira credentials and permissions.");
  }
  
  return {
    success: true,
    projectKey: plan.project_key,
    epics: createdIssues.epics,
    tickets: createdIssues.tickets,
    totalCreated: createdIssues.epics.length + createdIssues.tickets.length,
    jiraUrl: `${JIRA_BASE_URL}/browse/${plan.project_key}`
  };
}

module.exports = { generateAndCreateJiraTickets };
