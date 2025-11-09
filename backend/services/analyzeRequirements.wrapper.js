// Direct integration - convert ES module to CommonJS compatible
const { pool } = require('../config/database');
const OpenAI = require('openai').default;

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1"
});

// System message
const SYSTEM_MESSAGE = {
  role: "system",
  content:
    "You are an expert AI consultant. Generate highly accurate, implementation-ready analysis reports. " +
    "Use ONLY information from the provided JSON. Do NOT invent facts. " +
    "Every response MUST be a SINGLE valid JSON object. No markdown, no comments. " +
    "Include: summary, recommended_actions, epic_suggestions, and ticket_outline in every report."
};

// Call Nemotron
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

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse Nemotron JSON:", err, "\nRaw content:", content);
    throw new Error("Nemotron returned invalid JSON.");
  }

  return { parsed, reasoning, raw: content };
}

// Build prompts
function buildFunctionalMessages(company, project) {
  return [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "Generate a FUNCTIONAL requirements report.\n" +
        "COMPANY:" + JSON.stringify(company) + "\n" +
        "PROJECT:" + JSON.stringify(project) + "\n\n" +
        "Return JSON with: company_id, project_id, report_type='functional', report_title, summary, " +
        "core_capabilities[], recommended_actions[], epic_suggestions[], ticket_outline[]"
    }
  ];
}

function buildCostMessages(company, project) {
  return [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "Generate a COST analysis report.\n" +
        "COMPANY:" + JSON.stringify(company) + "\n" +
        "PROJECT:" + JSON.stringify(project) + "\n\n" +
        "Return JSON with: company_id, project_id, report_type='cost', report_title, summary, " +
        "infrastructure_costs{}, development_effort{}, tco_projection{}, recommended_actions[], epic_suggestions[]"
    }
  ];
}

function buildMarketMessages(company, project) {
  return [
    SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "Generate a MARKET_RESEARCH report.\n" +
        "COMPANY:" + JSON.stringify(company) + "\n" +
        "PROJECT:" + JSON.stringify(project) + "\n\n" +
        "Return JSON with: company_id, project_id, report_type='market_research', report_title, summary, " +
        "market_insights{}, recommended_validation_steps[], recommended_actions[], epic_suggestions[]"
    }
  ];
}

// DB helpers
async function getCompanyAndProject(projectId) {
  const [rows] = await pool.query(
    `SELECT p.*, c.company_id, c.name AS company_name, c.company_resources
     FROM project p
     JOIN company c ON p.company_id = c.company_id
     WHERE p.project_id = ?`,
    [projectId]
  );

  if (!rows || rows.length === 0) {
    throw new Error(`No project found for project_id=${projectId}`);
  }

  const row = rows[0];
  return {
    company: {
      company_id: row.company_id,
      name: row.company_name,
      company_resources: row.company_resources
    },
    project: {
      project_id: row.project_id,
      company_id: row.company_id,
      project_name: row.project_name,
      project_description: row.project_description,
      business_objectives: row.business_objectives,
      target_audience: row.target_audience,
      estimated_budget: row.estimated_budget,
      expected_timeline: row.expected_timeline
    }
  };
}

async function insertReport(projectId, reportType, contentJson, reasoningContent) {
  await pool.query(
    `INSERT INTO report (project_id, report_type, report_content, reasoning_content)
     VALUES (?, ?, ?, ?)`,
    [projectId, reportType, JSON.stringify(contentJson), reasoningContent || null]
  );
}

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

// Main function
async function analyzeRequirementsForProject(projectId) {
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

  // Generate Market
  console.log("\n3️⃣ Generating Market Research Report...");
  const marketMessages = buildMarketMessages(company, project);
  const { parsed: marketReport, reasoning: marketReasoning } =
    await callNemotron(marketMessages);
  await insertReport(project.project_id, "market_research", marketReport, marketReasoning);
  console.log("✅ Market research report saved");

  // Upsert to project_analysis
  console.log("\n4️⃣ Saving to project_analysis table...");
  await upsertProjectAnalysis(
    project.project_id,
    functionalReport,
    costReport,
    marketReport
  );
  console.log("✅ Project analysis saved");

  return {
    project_id: project.project_id,
    functional: functionalReport,
    cost: costReport,
    market_research: marketReport
  };
}

module.exports = { analyzeRequirementsForProject };
