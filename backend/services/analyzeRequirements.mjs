// analyzeRequirements.js
import OpenAI from "openai";
import mysql from "mysql2/promise";

/**
 * ENV:
 *  - NVIDIA_API_KEY
 *  - DB_HOST
 *  - DB_USER
 *  - DB_PASSWORD
 *  - DB_NAME (mcp_project_db)
 */

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1"
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mcp_project_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --------- SYSTEM MESSAGE (detailed, accurate, Jira/Slack suitable) ---------
const SYSTEM_MESSAGE = {
  role: "system",
  content:
    "You are an expert AI consultant embedded inside an NCN MCP environment. " +
    "The MCP server provides you with authoritative JSON objects from MySQL tables named company and project. " +
    "Treat this JSON as the single source of truth for all company- and project-specific details. " +
    "Your primary goal is to generate highly accurate, implementation-ready analysis reports " +
    "(functional, cost, market_research, and similar) that can be stored directly in a report or project_analysis table, " +
    "posted into Slack for stakeholders, and used as near-ready input for Jira ticket creation.\n\n" +
    "STRICT DATA & FACT HANDLING:\n" +
    "1. Use ONLY information explicitly present in the provided JSON plus well-established, generic industry knowledge and software-engineering best practices.\n" +
    "2. Do NOT invent or assume any company-specific facts, metrics, tooling, SLAs, or constraints that are not clearly supported by the input JSON.\n" +
    "3. Generic knowledge is allowed only for standard patterns (e.g., RESTful APIs, RBAC, logging, monitoring, CI/CD) and must be realistic and conservative.\n" +
    "4. If critical details are missing, do NOT fabricate precise values; instead provide clearly labeled assumptions, ranges, or options in the appropriate fields.\n\n" +
    "OUTPUT FORMAT & SCHEMA COMPLIANCE:\n" +
    "5. Every response MUST be a SINGLE valid minified JSON object. No markdown, no comments, no multiple objects, no extra prose.\n" +
    "6. The JSON MUST follow exactly the schema requested in the user prompt: same field names, nesting, and data types. Do NOT add arbitrary top-level fields.\n" +
    "7. All IDs (company_id, project_id) MUST be copied accurately from the provided JSON. Never alter them.\n" +
    "8. Ensure strict JSON validity at all times.\n\n" +
    "QUALITY, CONSISTENCY & JIRA/SLACK READINESS:\n" +
    "9. Content must be concise, concrete, and immediately useful to senior stakeholders (product owners, tech leads, architects).\n" +
    "10. Ensure internal consistency between scope, feasibility, risks, and cost/timeline expectations.\n" +
    "11. Each report MUST contain a short 'summary' plus structured fields that map cleanly into Jira tickets, including:\n" +
    "    - title or report_title\n" +
    "    - summary\n" +
    "    - recommended_actions (list)\n" +
    "    - epic_suggestions (list of epics)\n" +
    "    - ticket_outline (list of suggested ticket titles / work items with brief descriptions)\n" +
    "12. Do not include reasoning traces or chain-of-thought inside the final JSON. Reasoning, if streamed, is separate."
};

// --------- Nemotron Call (streaming, capture reasoning + content) ---------
async function callNemotron(messages) {
  const completion = await openai.chat.completions.create({
    model: "nvidia/nvidia-nemotron-nano-9b-v2",
    messages,
    temperature: 0.4,
    top_p: 0.9,
    max_tokens: 2048,
    stream: true,
    extra_body: {
      min_thinking_tokens: 512,
      max_thinking_tokens: 1536
    }
  });

  let content = "";
  let reasoning = "";

  for await (const chunk of completion) {
    const delta = chunk.choices?.[0]?.delta || {};
    if (delta.reasoning_content) {
      reasoning += delta.reasoning_content;
    }
    if (delta.content) {
      content += delta.content;
    }
  }

  // Content MUST be a single valid JSON object per our system prompt.
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse Nemotron JSON:", err, "\nRaw content:", content);
    throw new Error("Nemotron returned invalid JSON.");
  }

  return { parsed, reasoning, raw: content };
}

// --------- Prompt Builders (Jira-friendly structures) ---------
function buildFunctionalMessages(company, project) {
  return [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "Using ONLY the following JSON from NCN MCP, generate a FUNCTIONAL requirements report.\n" +
        "The report must help define implementation scope and be suitable for deriving Jira epics and tickets.\n" +
        "COMPANY_JSON:" + JSON.stringify(company) + "\n" +
        "PROJECT_JSON:" + JSON.stringify(project) + "\n\n" +
        "Return ONLY one minified JSON object with this exact schema:\n" +
        "{\n" +
        "  \"company_id\": " + company.company_id + ",\n" +
        "  \"project_id\": " + project.project_id + ",\n" +
        "  \"report_type\": \"functional\",\n" +
        "  \"report_title\": \"Functional Requirements & Scope Overview\",\n" +
        "  \"summary\": \"\",\n" +
        "  \"core_capabilities\": [\n" +
        "    {\"name\": \"\", \"description\": \"\", \"priority\": \"must-have|should-have|nice-to-have\"}\n" +
        "  ],\n" +
        "  \"non_functional_highlights\": [\"\"],\n" +
        "  \"integration_requirements\": [\"\"],\n" +
        "  \"security_and_access_requirements\": [\"\"],\n" +
        "  \"recommended_actions\": [\"\"],\n" +
        "  \"epic_suggestions\": [\n" +
        "    {\"epic_name\": \"\", \"epic_summary\": \"\"}\n" +
        "  ],\n" +
        "  \"ticket_outline\": [\n" +
        "    {\"title\": \"\", \"description\": \"\", \"related_epic\": \"\"}\n" +
        "  ]\n" +
        "}"
    }
  ];
}

function buildCostMessages(company, project) {
  return [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "Using ONLY the following JSON from NCN MCP, generate a COST analysis report.\n" +
        "Ensure the output is realistic, aligned with the project's estimated_budget and expected_timeline, " +
        "and structured so it can inform Jira planning (e.g., phases, cost drivers).\n" +
        "COMPANY_JSON:" + JSON.stringify(company) + "\n" +
        "PROJECT_JSON:" + JSON.stringify(project) + "\n\n" +
        "Return ONLY one minified JSON object with this exact schema:\n" +
        "{\n" +
        "  \"company_id\": " + company.company_id + ",\n" +
        "  \"project_id\": " + project.project_id + ",\n" +
        "  \"report_type\": \"cost\",\n" +
        "  \"report_title\": \"Cost & Effort Analysis\",\n" +
        "  \"summary\": \"\",\n" +
        "  \"assumptions\": [\"\"],\n" +
        "  \"infrastructure_costs\": {\n" +
        "    \"estimated_monthly_usd\": {\"min\": 0, \"max\": 0},\n" +
        "    \"notes\": \"\"\n" +
        "  },\n" +
        "  \"development_effort\": {\n" +
        "    \"suggested_team_size\": 0,\n" +
        "    \"estimated_duration_months\": 0,\n" +
        "    \"estimated_engineering_cost_usd\": {\"min\": 0, \"max\": 0},\n" +
        "    \"key_cost_drivers\": [\"\"]\n" +
        "  },\n" +
        "  \"operational_costs\": {\n" +
        "    \"estimated_monthly_maintenance_usd\": {\"min\": 0, \"max\": 0},\n" +
        "    \"support_needs\": [\"\"]\n" +
        "  },\n" +
        "  \"tco_projection\": {\n" +
        "    \"one_year_usd\": {\"min\": 0, \"max\": 0},\n" +
        "    \"three_year_usd\": {\"min\": 0, \"max\": 0}\n" +
        "  },\n" +
        "  \"recommended_actions\": [\"\"],\n" +
        "  \"epic_suggestions\": [\n" +
        "    {\"epic_name\": \"\", \"epic_summary\": \"\"}\n" +
        "  ],\n" +
        "  \"ticket_outline\": [\n" +
        "    {\"title\": \"\", \"description\": \"\", \"related_epic\": \"\"}\n" +
        "  ]\n" +
        "}"
    }
  ];
}

function buildMarketMessages(company, project) {
  return [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "Using ONLY the following JSON from NCN MCP, generate a MARKET_RESEARCH style report.\n" +
        "Focus on typical market context, solution relevance, buyer expectations, and validation steps. " +
        "The structure must support quick Slack reading and Jira task creation.\n" +
        "COMPANY_JSON:" + JSON.stringify(company) + "\n" +
        "PROJECT_JSON:" + JSON.stringify(project) + "\n\n" +
        "Return ONLY one minified JSON object with this exact schema:\n" +
        "{\n" +
        "  \"company_id\": " + company.company_id + ",\n" +
        "  \"project_id\": " + project.project_id + ",\n" +
        "  \"report_type\": \"market_research\",\n" +
        "  \"report_title\": \"Market Context & Validation Opportunities\",\n" +
        "  \"summary\": \"\",\n" +
        "  \"market_insights\": {\n" +
        "    \"problem_context\": \"\",\n" +
        "    \"target_users_and_needs\": [\"\"],\n" +
        "    \"competitive_signals\": [\"\"],\n" +
        "    \"differentiation_opportunities\": [\"\"]\n" +
        "  },\n" +
        "  \"risk_and_dependency_insights\": [\"\"],\n" +
        "  \"recommended_validation_steps\": [\"\"],\n" +
        "  \"recommended_actions\": [\"\"],\n" +
        "  \"epic_suggestions\": [\n" +
        "    {\"epic_name\": \"\", \"epic_summary\": \"\"}\n" +
        "  ],\n" +
        "  \"ticket_outline\": [\n" +
        "    {\"title\": \"\", \"description\": \"\", \"related_epic\": \"\"}\n" +
        "  ]\n" +
        "}"
    }
  ];
}

// --------- DB Helpers ---------
async function getCompanyAndProject(projectId) {
  const [rows] = await pool.query(
    `SELECT 
      p.*, 
      c.company_id AS company_id,
      c.name AS company_name,
      c.company_resources
    FROM project p
    JOIN company c ON p.company_id = c.company_id
    WHERE p.project_id = ?`,
    [projectId]
  );

  if (!rows || rows.length === 0) {
    throw new Error(`No project/company found for project_id=${projectId}`);
  }

  const row = rows[0];
  const company = {
    company_id: row.company_id,
    name: row.company_name,
    company_resources: row.company_resources,
    created_at: row.created_at
  };

  const project = {
    project_id: row.project_id,
    company_id: row.company_id,
    project_name: row.project_name,
    project_description: row.project_description,
    business_objectives: row.business_objectives,
    target_audience: row.target_audience,
    estimated_budget: row.estimated_budget,
    expected_timeline: row.expected_timeline,
    created_at: row.created_at,
    updated_at: row.updated_at
  };

  return { company, project };
}

async function insertReport(projectId, reportType, contentJson, reasoningContent) {
  await pool.query(
    `INSERT INTO report (project_id, report_type, report_content, reasoning_content)
     VALUES (?, ?, ?, ?)`,
    [projectId, reportType, JSON.stringify(contentJson), reasoningContent || null]
  );
}

// Upsert into project_analysis
async function upsertProjectAnalysis(projectId, functionalJson, costJson, marketJson) {
  await pool.query(
    `INSERT INTO project_analysis 
      (project_id, functionality_report, cost_analysis_report, market_analysis_report)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       functionality_report = VALUES(functionality_report),
       cost_analysis_report = VALUES(cost_analysis_report),
       market_analysis_report = VALUES(market_analysis_report),
       generated_at = CURRENT_TIMESTAMP`,
    [
      projectId,
      functionalJson ? JSON.stringify(functionalJson) : null,
      costJson ? JSON.stringify(costJson) : null,
      marketJson ? JSON.stringify(marketJson) : null
    ]
  );
}

// --------- Main Orchestrator (call this on "Analyze Requirements") ---------
export async function analyzeRequirementsForProject(projectId) {
  console.log(`\n🔍 Starting analysis for project ID: ${projectId}`);
  
  const { company, project } = await getCompanyAndProject(projectId);
  console.log(`📊 Company: ${company.name}, Project: ${project.project_name}`);

  // Generate Functional
  console.log("\n1️⃣ Generating Functional Requirements Report...");
  const functionalMessages = buildFunctionalMessages(company, project);
  const { parsed: functionalReport, reasoning: functionalReasoning } =
    await callNemotron(functionalMessages);
  await insertReport(project.project_id, "functional", functionalReport, functionalReasoning);
  console.log("✅ Functional report saved");

  // Generate Cost
  console.log("\n2️⃣ Generating Cost Analysis Report...");
  const costMessages = buildCostMessages(company, project);
  const { parsed: costReport, reasoning: costReasoning } =
    await callNemotron(costMessages);
  await insertReport(project.project_id, "cost", costReport, costReasoning);
  console.log("✅ Cost report saved");

  // Generate Market Research
  console.log("\n3️⃣ Generating Market Research Report...");
  const marketMessages = buildMarketMessages(company, project);
  const { parsed: marketReport, reasoning: marketReasoning } =
    await callNemotron(marketMessages);
  await insertReport(project.project_id, "market_research", marketReport, marketReasoning);
  console.log("✅ Market research report saved");

  // Upsert into project_analysis
  console.log("\n4️⃣ Saving to project_analysis table...");
  await upsertProjectAnalysis(
    project.project_id,
    functionalReport,
    costReport,
    marketReport
  );
  console.log("✅ Project analysis saved");

  // Return combined for immediate Slack print if needed
  return {
    project_id: project.project_id,
    functional: functionalReport,
    cost: costReport,
    market_research: marketReport
  };
}

// --------- Example usage (CLI/manual trigger) ---------
// run: node analyzeRequirements.js 3
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const projectId = parseInt(process.argv[2], 10);
  if (!projectId) {
    console.error("Usage: node analyzeRequirements.js <project_id>");
    process.exit(1);
  }

  analyzeRequirementsForProject(projectId)
    .then((res) => {
      console.log("\n✨ Analysis complete! You can now post these JSON reports to Slack or use them for Jira ticket generation.");
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error running analysis:", err);
      process.exit(1);
    });
}
