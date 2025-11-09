require('dotenv').config();
const mcpService = require('./services/mcp.service');
const { testConnection } = require('./config/database');

async function testDatabase() {
  console.log('🧪 Testing Database Operations...\n');

  try {
    // Test connection
    console.log('1️⃣ Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Test creating a company
    console.log('\n2️⃣ Creating test company...');
    const companyResult = await mcpService.createCompany(
      'Test Company Inc.',
      'Software development, Cloud services'
    );
    console.log('✅ Company created:', companyResult);

    // Test creating a project
    console.log('\n3️⃣ Creating test project...');
    const projectResult = await mcpService.createProject({
      companyId: companyResult.companyId,
      projectName: 'E-commerce Platform',
      projectDescription: 'Build a modern e-commerce platform with payment integration',
      businessObjectives: 'Increase online sales by 50%',
      targetAudience: 'B2C customers aged 25-45',
      estimatedBudget: '50-100k',
      expectedTimeline: '3-6 months'
    });
    console.log('✅ Project created:', projectResult);

    // Test retrieving project
    console.log('\n4️⃣ Retrieving project...');
    const project = await mcpService.getProjectById(projectResult.projectId);
    console.log('✅ Project retrieved:', {
      id: project.project_id,
      name: project.project_name,
      company: project.company_name
    });

    // Test saving a report
    console.log('\n5️⃣ Saving test report...');
    const reportResult = await mcpService.saveReport(
      projectResult.projectId,
      'prd',
      'This is a test PRD report content',
      'This is the reasoning behind the analysis'
    );
    console.log('✅ Report saved:', reportResult);

    // Test retrieving reports
    console.log('\n6️⃣ Retrieving reports...');
    const reports = await mcpService.getReportsByProject(projectResult.projectId);
    console.log('✅ Reports retrieved:', reports.length, 'report(s)');

    // Test getting project context
    console.log('\n7️⃣ Getting project context for LLM...');
    const context = await mcpService.getProjectContext(projectResult.projectId);
    console.log('✅ Context retrieved:');
    console.log(context.context);

    console.log('\n✨ All database tests passed!');
    console.log('\n📊 Summary:');
    console.log(`   Company ID: ${companyResult.companyId}`);
    console.log(`   Project ID: ${projectResult.projectId}`);
    console.log(`   Report ID: ${reportResult.reportId}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
