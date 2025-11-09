const express = require('express');
const cors = require('cors');
require('dotenv').config();

const llmService = require('./services/llm.service');
const mcpService = require('./services/mcp.service');
const { testConnection } = require('./config/database');

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

    // Step 5: Analyze requirements with LLM
    console.log('🤖 Analyzing requirements with AI...');
    const analysis = await llmService.analyzeRequirements({
      projectName,
      projectDescription,
      businessObjectives,
      targetAudience,
      budgetRange,
      timeline
    });

    // Step 6: Save the PRD report
    console.log('📄 Saving PRD report...');
    await mcpService.saveReport(
      projectResult.projectId,
      'prd',
      analysis.content,
      analysis.reasoning
    );

    res.json({
      success: true,
      message: 'Requirements analyzed and saved successfully',
      data: {
        projectId: projectResult.projectId,
        companyId: company.company_id,
        projectName,
        analysis: analysis.content,
        reasoning: analysis.reasoning,
        usage: analysis.usage
      }
    });
  } catch (error) {
    console.error('❌ Error analyzing requirements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze requirements',
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

app.get('/api/v1/reports/:id', async (req, res) => {
  try {
    const report = await mcpService.getReportById(req.params.id);
    if (report) {
      res.json({ success: true, data: report });
    } else {
      res.status(404).json({ success: false, error: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
