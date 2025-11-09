// buildTechStackDecisionMessages.js
// 1) System message: consistent with your previous rules, tuned for tech-stack decision
const TECH_STACK_SYSTEM_MESSAGE = {
  role: "system",
  content:
    "You are an expert solution architect embedded inside an NCN MCP environment. " +
    "You receive authoritative JSON objects from MySQL tables (company, project, project_analysis). " +
    "Treat these as the single source of truth for company- and project-specific details. " +
    "Your task is to perform a rigorous, AI-powered multi-criteria decision analysis to recommend technology stacks.\n\n" +
    "DATA & FACT RULES:\n" +
    "1. Use ONLY information from the provided JSON plus well-established, generic industry knowledge.\n" +
    "2. Do NOT invent company-specific constraints or commitments that are not supported by the JSON.\n" +
    "3. You MAY propose reasonable technology choices (frameworks, clouds, databases, AI/LLM services, observability tools) based on the project requirements, budget band, and timeline.\n" +
    "4. When suggesting AI/LLM or NVIDIA-related components (e.g., NIM microservices, vector DBs, RAG patterns), include them ONLY if they are relevant to the described use case.\n\n" +
    "OUTPUT RULES:\n" +
    "5. Every response MUST be a SINGLE valid minified JSON object. No markdown, no comments, no extra prose.\n" +
    "6. Follow EXACTLY the schema requested in the user prompt below. Do not change field names or types. Do not add extra top-level fields.\n" +
    "7. All IDs (company_id, project_id) MUST match the input JSON. Never alter them.\n" +
    "8. Ensure strict JSON validity: double quotes, no trailing commas, correct types.\n\n" +
    "EVALUATION & JIRA/SLACK READINESS:\n" +
    "9. Use the following weighted criteria for scoring each option: " +
    "Performance(25%), Scalability(20%), Cost(20%), Maintainability(15%), Team_Expertise(10%), Community_Support(5%), Learning_Curve(5%).\n" +
    "10. For each option, compute 0-10 scores per criterion (integers or one decimal), and an overall weighted_score (0-10).\n" +
    "11. Provide exactly THREE tech stack options plus ONE recommended_option that clearly references one of those three, with rationale and confidence.\n" +
    "12. All descriptions must be concise, implementation-ready, and suitable for: " +
    "    (a) sharing directly into Slack, and " +
    "    (b) being turned into Jira epics/tickets without rewriting.\n" +
    "13. Do NOT include chain-of-thought or internal reasoning; only the final JSON object.",
};

/**
 * 2) Prompt builder:
 * Pass:
 *  - company: from company
 *  - project: from project
 *  - analysis: from project_analysis (already contains functionality_report, cost_analysis_report, market_analysis_report)
 *
 * Nemotron will:
 *  - Look at all three reports + project context
 *  - Generate 3 stack options + 1 recommended
 *  - Output JSON matching the schema below
 */
function buildTechStackDecisionMessages(company, project, analysis) {
  return [
    TECH_STACK_SYSTEM_MESSAGE,
    {
      role: "user",
      content:
        "You are given the normalized data below from NCN MCP.\n" +
        "Use it to generate a TECH_STACK_DECISION report.\n\n" +
        "COMPANY_JSON:" +
        JSON.stringify(company) +
        "\n" +
        "PROJECT_JSON:" +
        JSON.stringify(project) +
        "\n" +
        "PROJECT_ANALYSIS_JSON:" +
        JSON.stringify(analysis) +
        "\n\n" +
        "Use the existing functionality_report, cost_analysis_report, and market_analysis_report inside PROJECT_ANALYSIS_JSON " +
        "as primary inputs. Derive three viable end-to-end technology stack options for implementing this project.\n\n" +
        "REQUIREMENTS:\n" +
        "1. Each option must be realistic for the given estimated_budget and expected_timeline.\n" +
        "2. Each option MUST specify at least the following fields: frontend, backend, database, infrastructure, devops_tooling, " +
        "   and any relevant ai_llm_components (if applicable to the project).\n" +
        "3. For each option, include pros, cons, per-criterion scores, and an overall weighted_score based on the given criteria.\n" +
        "4. After defining the three options, select one HIGHLY RECOMMENDED option that best aligns with the analysis, " +
        "   and provide a clear rationale and confidence percentage.\n" +
        "5. Additionally, generate exactly three short tech_tags that summarize the overall recommended direction " +
        '   (e.g., "modern-react-aws", "low-maintenance-lts-stack"). These tags will be used for Slack and Jira labeling.\n\n' +
        "Return ONLY one minified JSON object using EXACTLY this schema:\n" +
        "{\n" +
        '  "company_id": ' +
        company.company_id +
        ",\n" +
        '  "project_id": ' +
        project.project_id +
        ",\n" +
        '  "report_type": "tech_stack_decision",\n' +
        '  "decision_framework": {\n' +
        '    "criteria_weights": {\n' +
        '      "performance": 0.25,\n' +
        '      "scalability": 0.20,\n' +
        '      "cost": 0.20,\n' +
        '      "maintainability": 0.15,\n' +
        '      "team_expertise": 0.10,\n' +
        '      "community_support": 0.05,\n' +
        '      "learning_curve": 0.05\n' +
        "    }\n" +
        "  },\n" +
        '  "tech_tags": [\n' +
        '    "",\n' +
        '    "",\n' +
        '    ""\n' +
        "  ],\n" +
        '  "options": [\n' +
        "    {\n" +
        '      "id": "option_1",\n' +
        '      "label": "",\n' +
        '      "frontend": [""],\n' +
        '      "backend": [""],\n' +
        '      "database": [""],\n' +
        '      "infrastructure": [""],\n' +
        '      "devops_tooling": [""],\n' +
        '      "ai_llm_components": [""],\n' +
        '      "pros": [""],\n' +
        '      "cons": [""],\n' +
        '      "estimated_monthly_cost_usd": 0,\n' +
        '      "scores": {\n' +
        '        "performance": 0,\n' +
        '        "scalability": 0,\n' +
        '        "cost": 0,\n' +
        '        "maintainability": 0,\n' +
        '        "team_expertise": 0,\n' +
        '        "community_support": 0,\n' +
        '        "learning_curve": 0\n' +
        "      },\n" +
        '      "weighted_score": 0\n' +
        "    },\n" +
        "    {\n" +
        '      "id": "option_2",\n' +
        '      "label": "",\n' +
        '      "frontend": [""],\n' +
        '      "backend": [""],\n' +
        '      "database": [""],\n' +
        '      "infrastructure": [""],\n' +
        '      "devops_tooling": [""],\n' +
        '      "ai_llm_components": [""],\n' +
        '      "pros": [""],\n' +
        '      "cons": [""],\n' +
        '      "estimated_monthly_cost_usd": 0,\n' +
        '      "scores": {\n' +
        '        "performance": 0,\n' +
        '        "scalability": 0,\n' +
        '        "cost": 0,\n' +
        '        "maintainability": 0,\n' +
        '        "team_expertise": 0,\n' +
        '        "community_support": 0,\n' +
        '        "learning_curve": 0\n' +
        "      },\n" +
        '      "weighted_score": 0\n' +
        "    },\n" +
        "    {\n" +
        '      "id": "option_3",\n' +
        '      "label": "",\n' +
        '      "frontend": [""],\n' +
        '      "backend": [""],\n' +
        '      "database": [""],\n' +
        '      "infrastructure": [""],\n' +
        '      "devops_tooling": [""],\n' +
        '      "ai_llm_components": [""],\n' +
        '      "pros": [""],\n' +
        '      "cons": [""],\n' +
        '      "estimated_monthly_cost_usd": 0,\n' +
        '      "scores": {\n' +
        '        "performance": 0,\n' +
        '        "scalability": 0,\n' +
        '        "cost": 0,\n' +
        '        "maintainability": 0,\n' +
        '        "team_expertise": 0,\n' +
        '        "community_support": 0,\n' +
        '        "learning_curve": 0\n' +
        "      },\n" +
        '      "weighted_score": 0\n' +
        "    }\n" +
        "  ],\n" +
        '  "recommended_option": {\n' +
        '    "option_id": "option_1",\n' +
        '    "reason": "",\n' +
        '    "confidence_percent": 0\n' +
        "  },\n" +
        '  "summary": "Short explanation of why the recommended stack is the best fit.",\n' +
        '  "jira_ready_actions": [\n' +
        '    "Define epics and tickets based on the recommended stack components.",\n' +
        '    "Validate assumptions with key stakeholders.",\n' +
        '    "Plan PoC or initial milestone for the recommended option."\n' +
        "  ]\n" +
        "}",
    },
  ];
}

module.exports = { buildTechStackDecisionMessages };
