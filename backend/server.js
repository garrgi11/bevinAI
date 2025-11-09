const express = require('express');
const cors = require('cors');
require('dotenv').config();

const llmService = require('./services/llm.service');
const mcpService = require('./services/mcp.service');
const { testConnection } = require('./config/database');
const { analyzeRequirementsForProject } = require('./services/analyzeRequirements.wrapper');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bevin.AI API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Requirements submission endpoint
app.post('/api/v1/requirements/submit', async (req, res) => {
  try {
    const {
      projectName,
      projectDescription,
      businessObjectives,
      targetAudience,
      budgetRange,
      timeline,
      companyName
    } = req.body;

    console.log('📝 Received requirements:', { projectName, companyName });

    // Step 1: Get company by ID
    const company = await mcpService.getCompanyById(req.body.companyId);
    
    if (!company) {
      return res.status(400).json({
        success: false,
        error: 'Invalid company ID'
      });
    }

    // Step 2: Update company resources if provided and different
    if (req.body.companyResources && req.body.companyResources !== company.company_resources) {
      console.log('📝 Updating company resources...');
      await mcpService.updateCompany(
        company.company_id,
        company.name,
        req.body.companyResources
      );
    }

    // Step 3: Map budget and timeline to ENUM values
    const budgetMap = {
      'Flexible': '<25k',
      '<$25,000': '<25k',
      '$25,000 - $50,000': '25-50k',
      '$50,000 - $100,000': '50-100k',
      '$100,000+': '100k+'
    };

    const timelineMap = {
      'Flexible': 'flexible',
      'Under 1 Month': 'under 1 month',
      '1-3 Months': '1-3 months',
      '3-6 Months': '3-6 months',
      '6+ Months': '6+ months'
    };

    const mappedBudget = budgetMap[budgetRange] || '<25k';
    const mappedTimeline = timelineMap[timeline] || 'flexible';

    // Step 4: Create project in database
    console.log('💾 Saving project to database...');
    const projectResult = await mcpService.createProject({
      companyId: company.company_id,
      projectName,
      projectDescription,
      businessObjectives,
      targetAudience,
      estimatedBudget: mappedBudget,
      expectedTimeline: mappedTimeline
    });

    console.log('✅ Project saved with ID:', projectResult.projectId);

    // Step 5: Run comprehensive analysis with LLM MCP
    console.log('🤖 Starting comprehensive AI analysis...');
    console.log('   This will generate:');
    console.log('   1. Functional Requirements Report');
    console.log('   2. Cost Analysis Report');
    console.log('   3. Market Research Report');
    
    try {
      const analysisResults = await analyzeRequirementsForProject(projectResult.projectId);
      
      console.log('✅ All reports generated and saved successfully');

      // Push reports to Slack (non-blocking)
      const { pushProjectReportsToSlack } = require('./services/slack.service');
      pushProjectReportsToSlack(projectResult.projectId).catch(err => {
        console.error('⚠️ Slack notification failed (non-critical):', err.message);
      });

      res.json({
        success: true,
        message: 'Requirements analyzed and saved successfully',
        data: {
          projectId: projectResult.projectId,
          companyId: company.company_id,
          projectName,
          reports: {
            functional: analysisResults.functional,
            cost: analysisResults.cost,
            market_research: analysisResults.market_research
          }
        }
      });
    } catch (analysisError) {
      console.error('❌ Analysis failed:', analysisError);
      
      // Project is saved, but analysis failed
      res.status(500).json({
        success: false,
        error: 'Analysis failed',
        message: analysisError.message,
        data: {
          projectId: projectResult.projectId,
          companyId: company.company_id,
          projectName,
          note: 'Project was saved but analysis failed. You can retry analysis later.'
        }
      });
    }
  } catch (error) {
    console.error('❌ Error processing requirements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process requirements',
      message: error.message
    });
  }
});

// Test LLM endpoint
app.post('/api/v1/llm/test', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const result = await llmService.generateCompletion(
      '/think',
      prompt || 'Hello, how are you?',
      { max_tokens: 512 }
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ LLM test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== COMPANY ENDPOINTS ====================

app.post('/api/v1/companies', async (req, res) => {
  try {
    const { name, companyResources } = req.body;
    const result = await mcpService.createCompany(name, companyResources);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/companies', async (req, res) => {
  try {
    const companies = await mcpService.getAllCompanies();
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/companies/:id', async (req, res) => {
  try {
    const company = await mcpService.getCompanyById(req.params.id);
    if (company) {
      res.json({ success: true, data: company });
    } else {
      res.status(404).json({ success: false, error: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PROJECT ENDPOINTS ====================

app.post('/api/v1/projects', async (req, res) => {
  try {
    const result = await mcpService.createProject(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/projects', async (req, res) => {
  try {
    const projects = await mcpService.getAllProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/projects/:id', async (req, res) => {
  try {
    const project = await mcpService.getProjectById(req.params.id);
    if (project) {
      res.json({ success: true, data: project });
    } else {
      res.status(404).json({ success: false, error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/projects/:id/context', async (req, res) => {
  try {
    const context = await mcpService.getProjectContext(req.params.id);
    if (context) {
      res.json({ success: true, data: context });
    } else {
      res.status(404).json({ success: false, error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PROJECT ANALYSIS ENDPOINTS ====================

app.post('/api/v1/projects/:id/analysis', async (req, res) => {
  try {
    const { functionalityReport, costAnalysisReport, marketAnalysisReport } = req.body;
    const result = await mcpService.saveProjectAnalysis(
      req.params.id,
      functionalityReport,
      costAnalysisReport,
      marketAnalysisReport
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/projects/:id/analysis', async (req, res) => {
  try {
    const analysis = await mcpService.getProjectAnalysis(req.params.id);
    if (analysis) {
      res.json({ success: true, data: analysis });
    } else {
      res.status(404).json({ success: false, error: 'Analysis not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/v1/projects/:id/analysis', async (req, res) => {
  try {
    const result = await mcpService.deleteProjectAnalysis(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== REPORT ENDPOINTS ====================

app.post('/api/v1/reports', async (req, res) => {
  try {
    const { projectId, reportType, reportContent, reasoningContent } = req.body;
    const result = await mcpService.saveReport(projectId, reportType, reportContent, reasoningContent);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/v1/projects/:id/reports', async (req, res) => {
  try {
    const { type } = req.query;
    const reports = await mcpService.getReportsByProject(req.params.id, type);
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get individual report by report_id (from report table)
app.get('/api/v1/report/:reportId', async (req, res) => {
  try {
    const report = await mcpService.getReportById(req.params.reportId);
    if (report) {
      res.json({ success: true, data: report });
    } else {
      res.status(404).json({ success: false, error: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TECH STACK DECISION ENDPOINT ====================

app.post('/api/v1/techstack/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log(`🔧 Generating tech stack decision for project ID: ${projectId}`);
    
    // Get project, company, and analysis data
    const project = await mcpService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const company = await mcpService.getCompanyById(project.company_id);
    const analysis = await mcpService.getProjectAnalysis(projectId);
    
    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis reports not found' });
    }
    
    // Build messages for tech stack decision
    const { buildTechStackDecisionMessages } = require('./services/buildTechStackDecisionMessages');
    const messages = buildTechStackDecisionMessages(company, project, analysis);
    
    // Call LLM to generate tech stack decision using OpenAI client directly
    console.log('🤖 Calling LLM for tech stack decision...');
    const OpenAI = require('openai').default;
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1"
    });
    
    const completion = await openai.chat.completions.create({
      model: "nvidia/nvidia-nemotron-nano-9b-v2",
      messages,
      temperature: 0.4,
      top_p: 0.9,
      max_tokens: 4096,
      stream: false // Don't stream for simpler parsing
    });
    
    const content = completion.choices[0].message.content;
    
    // Parse the JSON response
    let decisionData;
    try {
      decisionData = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ Failed to parse LLM response as JSON:', parseError);
      console.log('Raw content:', content.substring(0, 500));
      return res.status(500).json({ success: false, error: 'Invalid JSON response from LLM' });
    }
    
    // Store in database
    await mcpService.saveTechStackDecision(projectId, decisionData);
    
    console.log('✅ Tech stack decision generated and saved');
    
    res.json({
      success: true,
      data: decisionData
    });
  } catch (error) {
    console.error('❌ Error generating tech stack decision:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate tech stack decision',
      message: error.message
    });
  }
});

app.get('/api/v1/techstack/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const decision = await mcpService.getTechStackDecision(projectId);
    
    if (!decision) {
      return res.status(404).json({ success: false, error: 'Tech stack decision not found' });
    }
    
    res.json({
      success: true,
      data: JSON.parse(decision.decision_json)
    });
  } catch (error) {
    console.error('❌ Error fetching tech stack decision:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tech stack decision',
      message: error.message
    });
  }
});

// ==================== REPORTS ENDPOINT ====================

app.get('/api/v1/reports/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log(`📊 Fetching reports for project ID: ${projectId}`);
    
    // Get project details
    const project = await mcpService.getProjectById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    // Get analysis reports from project_analysis table
    const reports = await mcpService.getProjectAnalysis(projectId);
    
    console.log('📊 Reports from database:', {
      hasReports: !!reports,
      functionalityLength: reports?.functionality_report?.length || 0,
      costLength: reports?.cost_analysis_report?.length || 0,
      marketLength: reports?.market_analysis_report?.length || 0
    });
    
    if (!reports) {
      return res.status(404).json({
        success: false,
        error: 'Reports not found for this project'
      });
    }
    
    // Helper function to format JSON report into readable text
    const formatReport = (reportJson, reportName) => {
      if (!reportJson) return 'Report not available';
      
      try {
        let parsed = reportJson;
        if (typeof reportJson === 'string') {
          parsed = JSON.parse(reportJson);
        }
        
        // Build formatted text from JSON fields
        let text = '';
        
        if (parsed.report_title) {
          text += `${parsed.report_title}\n\n`;
        }
        
        if (parsed.summary) {
          text += `SUMMARY\n${parsed.summary}\n\n`;
        }
        
        if (parsed.core_capabilities && Array.isArray(parsed.core_capabilities)) {
          text += `CORE CAPABILITIES\n`;
          parsed.core_capabilities.forEach((cap, i) => text += `${i + 1}. ${cap}\n`);
          text += '\n';
        }
        
        if (parsed.infrastructure_costs) {
          text += `INFRASTRUCTURE COSTS\n`;
          Object.entries(parsed.infrastructure_costs).forEach(([key, value]) => {
            text += `- ${key.replace(/_/g, ' ')}: $${value}\n`;
          });
          text += '\n';
        }
        
        if (parsed.development_effort) {
          text += `DEVELOPMENT EFFORT\n`;
          Object.entries(parsed.development_effort).forEach(([key, value]) => {
            text += `- ${key.replace(/_/g, ' ')}: $${value}\n`;
          });
          text += '\n';
        }
        
        if (parsed.tco_projection) {
          text += `TOTAL COST OF OWNERSHIP\n`;
          if (parsed.tco_projection.total_estimated_cost) {
            text += `Total: $${parsed.tco_projection.total_estimated_cost}\n`;
          }
          if (parsed.tco_projection.breakdown) {
            text += 'Breakdown:\n';
            Object.entries(parsed.tco_projection.breakdown).forEach(([key, value]) => {
              text += `  - ${key}: ${value}\n`;
            });
          }
          text += '\n';
        }
        
        if (parsed.market_opportunity) {
          text += `MARKET OPPORTUNITY\n`;
          Object.entries(parsed.market_opportunity).forEach(([key, value]) => {
            text += `- ${key.replace(/_/g, ' ')}: ${value}\n`;
          });
          text += '\n';
        }
        
        if (parsed.competitive_landscape && Array.isArray(parsed.competitive_landscape)) {
          text += `COMPETITIVE LANDSCAPE\n`;
          parsed.competitive_landscape.forEach((comp, i) => text += `${i + 1}. ${comp}\n`);
          text += '\n';
        }
        
        if (parsed.recommended_actions && Array.isArray(parsed.recommended_actions)) {
          text += `RECOMMENDED ACTIONS\n`;
          parsed.recommended_actions.forEach((action, i) => text += `${i + 1}. ${action}\n`);
          text += '\n';
        }
        
        if (parsed.epic_suggestions && Array.isArray(parsed.epic_suggestions)) {
          text += `EPIC SUGGESTIONS\n`;
          parsed.epic_suggestions.forEach((epic, i) => text += `${i + 1}. ${epic}\n`);
          text += '\n';
        }
        
        if (parsed.ticket_outline && Array.isArray(parsed.ticket_outline)) {
          text += `TICKET OUTLINE\n`;
          parsed.ticket_outline.forEach((ticket, i) => text += `${i + 1}. ${ticket}\n`);
          text += '\n';
        }
        
        // If we couldn't extract any text, return formatted JSON
        if (!text.trim()) {
          text = JSON.stringify(parsed, null, 2);
        }
        
        return text;
      } catch (e) {
        console.error(`Error formatting ${reportName}:`, e);
        return typeof reportJson === 'string' ? reportJson : JSON.stringify(reportJson, null, 2);
      }
    };
    
    const functionalityReport = formatReport(reports.functionality_report, 'Functionality Report');
    const costAnalysisReport = formatReport(reports.cost_analysis_report, 'Cost Analysis Report');
    const marketAnalysisReport = formatReport(reports.market_analysis_report, 'Market Analysis Report');
    
    console.log('📊 Formatted reports lengths:', {
      functionality: functionalityReport.length,
      cost: costAnalysisReport.length,
      market: marketAnalysisReport.length
    });
    
    res.json({
      success: true,
      data: {
        project_name: project.project_name,
        functionality_report: functionalityReport,
        cost_analysis_report: costAnalysisReport,
        market_analysis_report: marketAnalysisReport,
        generated_at: reports.generated_at
      }
    });
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports',
      message: error.message
    });
  }
});

// ==================== JIRA TICKETS ENDPOINT ====================

app.post('/api/v1/jira/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log(`🎫 Generating Jira tickets for project ID: ${projectId}`);
    
    const { generateAndCreateJiraTickets } = require('./services/jira.service');
    const result = await generateAndCreateJiraTickets(projectId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Error generating Jira tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Jira tickets',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await testConnection();
});
