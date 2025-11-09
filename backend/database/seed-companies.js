require('dotenv').config();
const mcpService = require('../services/mcp.service');
const { testConnection } = require('../config/database');

const companies = [
  { name: 'Acme Corporation', resources: null },
  { name: 'TechStart Inc.', resources: null },
  { name: 'Global Enterprises', resources: null },
  { name: 'Startup Ventures', resources: null },
  { name: 'Innovation Labs', resources: null },
  { name: 'Digital Solutions Co.', resources: null },
  { name: 'CloudTech Systems', resources: null },
  { name: 'NextGen Software', resources: null },
  { name: 'Quantum Innovations', resources: null },
  { name: 'Apex Technologies', resources: null },
  { name: 'Velocity Ventures', resources: null },
  { name: 'Horizon Digital', resources: null },
  { name: 'Pinnacle Systems', resources: null },
  { name: 'Fusion Tech Group', resources: null },
  { name: 'Catalyst Innovations', resources: null }
];

async function seedCompanies() {
  console.log('🌱 Seeding companies...\n');

  try {
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    for (const company of companies) {
      // Check if company already exists
      const existing = await mcpService.getCompanyByName(company.name);
      
      if (existing) {
        console.log(`⏭️  Skipping "${company.name}" - already exists`);
      } else {
        const result = await mcpService.createCompany(company.name, company.resources);
        console.log(`✅ Created "${company.name}" - ID: ${result.companyId}`);
      }
    }

    console.log('\n✨ Company seeding complete!');
    console.log(`\n📊 Total companies: ${companies.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    process.exit(0);
  }
}

seedCompanies();
