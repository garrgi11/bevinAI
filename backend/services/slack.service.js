// slack.service.js
// Service to push project reports to Slack via MCP

const { pool } = require('../config/database');

// ---------- ENV & CONFIG ----------
const {
  MCP_SLACK_REPORTS_URL,
  MCP_SLACK_AUTH_TOKEN = "",
  SLACK_REPORTS_CHANNEL_ID,
  SLACK_REPORTS_CHANNEL_NAME = "report_ai"
} = process.env;

const TARGET_CHANNEL =
  SLACK_REPORTS_CHANNEL_ID && SLACK_REPORTS_CHANNEL_ID.trim().length > 0
    ? SLACK_REPORTS_CHANNEL_ID.trim()
    : SLACK_REPORTS_CHANNEL_NAME || "report_ai";

// ---------- DB: Fetch joined data ----------
async function getProjectWithAnalysis(projectId) {
  const [rows] = await pool.query(
    `SELECT 
      p.project_id,
      p.project_name,
      p.business_objectives,
      p.target_audience,
      p.estimated_budget,
      p.expected_timeline,
      c.company_id,
      c.name AS company_name,
      pa.functionality_report,
      pa.cost_analysis_report,
      pa.market_analysis_report
    FROM project p
    JOIN company c ON p.company_id = c.company_id
    JOIN project_analysis pa ON p.project_id = pa.project_id
    WHERE p.project_id = ?`,
    [projectId]
  );

  if (!rows || rows.length === 0) {
    throw new Error(
      `No matching project + company + project_analysis found for project_id=${projectId}. ` +
      `Ensure all three AI reports are written into project_analysis before calling this.`
    );
  }

  return rows[0];
}

// ---------- Slack via MCP or Direct API ----------
async function postToSlackViaMcp({ channel, text }) {
  // Try MCP first if URL is set
  if (MCP_SLACK_REPORTS_URL) {
    try {
      const headers = {
        "Content-Type": "application/json"
      };

      if (MCP_SLACK_AUTH_TOKEN) {
        headers["Authorization"] = `Bearer ${MCP_SLACK_AUTH_TOKEN}`;
      }

      const res = await fetch(MCP_SLACK_REPORTS_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ channel, text })
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `MCP Slack post failed: HTTP ${res.status} ${res.statusText} - ${body}`
        );
      }
      
      console.log("✅ Posted to Slack via MCP");
      return;
    } catch (mcpError) {
      console.warn("⚠️ MCP Slack failed, trying direct API:", mcpError.message);
    }
  }

  // Fallback to direct Slack API
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  
  if (!SLACK_BOT_TOKEN) {
    console.warn("⚠️ Neither MCP_SLACK_REPORTS_URL nor SLACK_BOT_TOKEN set, skipping Slack notification");
    return;
  }

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SLACK_BOT_TOKEN}`
    },
    body: JSON.stringify({
      channel: channel,
      text: text,
      mrkdwn: true
    })
  });

  const result = await res.json();
  
  if (!result.ok) {
    throw new Error(`Slack API error: ${result.error}`);
  }
  
  console.log("✅ Posted to Slack via direct API");
}

// ---------- Helper: safe JSON parse ----------
function safeParse(jsonString) {
  if (!jsonString) return {};
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}

// ---------- Build Slack Message ----------
function buildSlackMessage(row) {
  const functional = safeParse(row.functionality_report);
  const cost = safeParse(row.cost_analysis_report);
  const market = safeParse(row.market_analysis_report);

  // Extract full summaries (no truncation)
  const fnSummary = functional.summary || "Functional report generated. See project_analysis for full details.";
  const csSummary = cost.summary || "Cost report generated. See project_analysis for full details.";
  const mkSummary = market.summary || "Market analysis report generated. See project_analysis for full details.";

  // Format core capabilities
  const formatCapabilities = (capabilities = []) => {
    if (!capabilities || capabilities.length === 0) return "";
    return capabilities
      .slice(0, 8)
      .map((cap, i) => `  ${i + 1}. ${cap}`)
      .join("\n");
  };

  const coreCapabilities = formatCapabilities(functional.core_capabilities);

  // Format epics with more detail
  const formatEpics = (epics = []) => {
    if (!epics || epics.length === 0) return "";
    return epics
      .filter(e => e && (e.epic_name || e))
      .slice(0, 5)
      .map((e, i) => {
        if (typeof e === 'string') return `  ${i + 1}. ${e}`;
        return `  ${i + 1}. *${e.epic_name || 'Epic'}*: ${e.epic_summary || e.description || ''}`;
      })
      .join("\n");
  };

  const fnEpics = formatEpics(functional.epic_suggestions);
  const csEpics = formatEpics(cost.epic_suggestions);
  const mkEpics = formatEpics(market.epic_suggestions);

  // Format recommended actions
  const formatActions = (actions = []) => {
    if (!actions || actions.length === 0) return "";
    return actions
      .slice(0, 6)
      .map((action, i) => `  ${i + 1}. ${action}`)
      .join("\n");
  };

  const fnActions = formatActions(functional.recommended_actions);
  const csActions = formatActions(cost.recommended_actions);
  const mkActions = formatActions(market.recommended_actions);

  // Format cost breakdown
  const formatCostBreakdown = (costData) => {
    let breakdown = "";
    
    if (costData.infrastructure_costs) {
      breakdown += "\n*Infrastructure Costs:*\n";
      Object.entries(costData.infrastructure_costs).forEach(([key, value]) => {
        breakdown += `  • ${key.replace(/_/g, ' ')}: $${value}\n`;
      });
    }
    
    if (costData.development_effort) {
      breakdown += "\n*Development Effort:*\n";
      Object.entries(costData.development_effort).forEach(([key, value]) => {
        breakdown += `  • ${key.replace(/_/g, ' ')}: $${value}\n`;
      });
    }
    
    if (costData.tco_projection) {
      breakdown += "\n*Total Cost of Ownership:*\n";
      if (costData.tco_projection.total_estimated_cost) {
        breakdown += `  • Total: $${costData.tco_projection.total_estimated_cost}\n`;
      }
      if (costData.tco_projection.breakdown) {
        Object.entries(costData.tco_projection.breakdown).forEach(([key, value]) => {
          breakdown += `  • ${key}: ${value}\n`;
        });
      }
    }
    
    return breakdown;
  };

  const costBreakdown = formatCostBreakdown(cost);

  // Format market insights
  const formatMarketInsights = (marketData) => {
    let insights = "";
    
    if (marketData.market_opportunity) {
      insights += "\n*Market Opportunity:*\n";
      Object.entries(marketData.market_opportunity).forEach(([key, value]) => {
        insights += `  • ${key.replace(/_/g, ' ')}: ${value}\n`;
      });
    }
    
    if (marketData.competitive_landscape && Array.isArray(marketData.competitive_landscape)) {
      insights += "\n*Competitive Landscape:*\n";
      marketData.competitive_landscape.slice(0, 5).forEach((comp, i) => {
        insights += `  ${i + 1}. ${comp}\n`;
      });
    }
    
    if (marketData.target_segments && Array.isArray(marketData.target_segments)) {
      insights += "\n*Target Segments:*\n";
      marketData.target_segments.slice(0, 4).forEach((seg, i) => {
        insights += `  ${i + 1}. ${seg}\n`;
      });
    }
    
    return insights;
  };

  const marketInsights = formatMarketInsights(market);

  // Format tickets with more detail
  const formatTickets = () => {
    const allTickets = [
      ...(functional.ticket_outline || []),
      ...(cost.ticket_outline || []),
      ...(market.ticket_outline || [])
    ]
      .filter(t => t && (t.title || t))
      .slice(0, 12);

    if (allTickets.length === 0) return "";

    return allTickets.map((t, i) => {
      if (typeof t === 'string') return `  ${i + 1}. ${t}`;
      
      let ticket = `  ${i + 1}. *${t.title}*`;
      if (t.related_epic) ticket += ` [Epic: ${t.related_epic}]`;
      if (t.description) ticket += `\n     ${t.description}`;
      if (t.priority) ticket += ` | Priority: ${t.priority}`;
      if (t.estimated_effort) ticket += ` | Effort: ${t.estimated_effort}`;
      
      return ticket;
    }).join("\n");
  };

  const tickets = formatTickets();

  // Build comprehensive message
  const header =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📡 *AI REQUIREMENTS ANALYSIS COMPLETE*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*Project:* ${row.project_name}\n` +
    `*Project ID:* ${row.project_id}\n` +
    `*Company:* ${row.company_name} (ID: ${row.company_id})\n` +
    `*Budget Range:* ${row.estimated_budget}\n` +
    `*Timeline:* ${row.expected_timeline}\n` +
    (row.business_objectives ? `*Business Objectives:* ${row.business_objectives}\n` : "") +
    (row.target_audience ? `*Target Audience:* ${row.target_audience}\n` : "") +
    `\n`;

  const functionalBlock =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*1️⃣ FUNCTIONAL REQUIREMENTS ANALYSIS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*Summary:*\n${fnSummary}\n` +
    (coreCapabilities ? `\n*Core Capabilities:*\n${coreCapabilities}\n` : "") +
    (fnEpics ? `\n*Recommended Epics:*\n${fnEpics}\n` : "") +
    (fnActions ? `\n*Recommended Actions:*\n${fnActions}\n` : "") +
    `\n`;

  const costBlock =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*2️⃣ COST & EFFORT ANALYSIS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*Summary:*\n${csSummary}\n` +
    (costBreakdown ? costBreakdown : "") +
    (csEpics ? `\n*Cost-Related Epics:*\n${csEpics}\n` : "") +
    (csActions ? `\n*Cost Optimization Actions:*\n${csActions}\n` : "") +
    `\n`;

  const marketBlock =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*3️⃣ MARKET & BUSINESS ANALYSIS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `*Summary:*\n${mkSummary}\n` +
    (marketInsights ? marketInsights : "") +
    (mkEpics ? `\n*Market-Driven Epics:*\n${mkEpics}\n` : "") +
    (mkActions ? `\n*Market Strategy Actions:*\n${mkActions}\n` : "") +
    `\n`;

  const ticketsBlock = tickets
    ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*🧩 JIRA TICKET RECOMMENDATIONS*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `${tickets}\n\n`
    : "";

  const footer =
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*📊 NEXT STEPS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `1. Review the analysis reports in detail\n` +
    `2. Validate assumptions with stakeholders\n` +
    `3. Create Jira epics based on recommendations\n` +
    `4. Break down epics into actionable tickets\n` +
    `5. Prioritize and schedule implementation\n\n` +
    `_🤖 Auto-generated by Bevin.AI from project_analysis table_\n` +
    `_📍 Channel: #${TARGET_CHANNEL} | Project ID: ${row.project_id}_`;

  return header + functionalBlock + costBlock + marketBlock + ticketsBlock + footer;
}

// ---------- Main orchestration ----------
async function pushProjectReportsToSlack(projectId) {
  try {
    console.log(`📤 Pushing reports to Slack for project ID: ${projectId}`);
    console.log(`📍 Target channel: ${TARGET_CHANNEL}`);
    
    const row = await getProjectWithAnalysis(projectId);
    const text = buildSlackMessage(row);
    
    await postToSlackViaMcp({ channel: TARGET_CHANNEL, text });
    
    console.log(`✅ Reports pushed to Slack channel: ${TARGET_CHANNEL}`);
    return { ok: true };
  } catch (error) {
    console.error("❌ Error pushing reports to Slack:", error.message);
    console.log("💡 To enable Slack notifications:");
    console.log("   1. Go to https://api.slack.com/apps");
    console.log("   2. Select your app → OAuth & Permissions");
    console.log("   3. Add 'chat:write' and 'chat:write.public' scopes");
    console.log("   4. Reinstall app and update SLACK_BOT_TOKEN in .env");
    // Don't throw - we don't want to fail the whole process if Slack fails
    return { ok: false, error: error.message };
  }
}

module.exports = { pushProjectReportsToSlack };
