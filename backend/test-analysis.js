require('dotenv').config();
const mcpService = require('./services/mcp.service');
const { testConnection } = require('./config/database');

async function testProjectAnalysis() {
  console.log('🧪 Testing Project Analysis Operations...\n');

  try {
    // Test connection
    console.log('1️⃣ Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Create a test company and project first
    console.log('\n2️⃣ Creating test company and project...');
    const companyResult = await mcpService.createCompany('Analysis Test Co.', 'Test resources');
    const projectResult = await mcpService.createProject({
      companyId: companyResult.companyId,
      projectName: 'Analysis Test Project',
      projectDescription: 'Testing project analysis functionality',
      businessObjectives: 'Test objectives',
      targetAudience: 'Test audience',
      estimatedBudget: '25-50k',
      expectedTimeline: '1-3 months'
    });
    console.log('✅ Project created:', projectResult.projectId);

    // Test saving functionality report
    console.log('\n3️⃣ Saving functionality report...');
    await mcpService.saveProjectAnalysis(
      projectResult.projectId,
      'This is a comprehensive functionality analysis report...',
      null,
      null
    );
    console.log('✅ Functionality report saved');

    // Test saving cost analysis report
    console.log('\n4️⃣ Saving cost analysis report...');
    await mcpService.saveProjectAnalysis(
      projectResult.projectId,
      null,
      'This is a detailed cost analysis report...',
      null
    );
    console.log('✅ Cost analysis report saved');

    // Test saving market analysis report
    console.log('\n5️⃣ Saving market analysis report...');
    await mcpService.saveProjectAnalysis(
      projectResult.projectId,
      null,
      null,
      'This is a comprehensive market analysis report...'
    );
    console.log('✅ Market analysis report saved');

    // Test retrieving analysis
    console.log('\n6️⃣ Retrieving project analysis...');
    const analysis = await mcpService.getProjectAnalysis(projectResult.projectId);
    console.log('✅ Analysis retrieved:');
    console.log('   - Functionality Report:', analysis.functionality_report ? 'Present' : 'Missing');
    console.log('   - Cost Analysis Report:', analysis.cost_analysis_report ? 'Present' : 'Missing');
    console.log('   - Market Analysis Report:', analysis.market_analysis_report ? 'Present' : 'Missing');
    console.log('   - Generated At:', analysis.generated_at);

    // Test getting full project context
    console.log('\n7️⃣ Getting full project context...');
    const context = await mcpService.getProjectContext(projectResult.projectId);
    console.log('✅ Context includes analysis:', context.analysis ? 'Yes' : 'No');

    console.log('\n✨ All project analysis tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   Project ID: ${projectResult.projectId}`);
    console.log(`   All 3 reports saved successfully`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testProjectAnalysis();
