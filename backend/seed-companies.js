// Seed companies script
require('dotenv').config();
const { pool } = require('./config/database');

const companies = [
  {
    name: 'TechVision Solutions',
    resources: 'Cloud infrastructure (AWS), 15-person engineering team, $2M annual tech budget, CI/CD pipeline, Kubernetes cluster'
  },
  {
    name: 'DataFlow Analytics',
    resources: 'Big data platform (Hadoop/Spark), 20 data scientists, GPU cluster, $3M R&D budget, ML infrastructure'
  },
  {
    name: 'CloudScale Systems',
    resources: 'Multi-cloud setup (AWS/Azure/GCP), 25 DevOps engineers, $5M infrastructure budget, Terraform/Ansible automation'
  },
  {
    name: 'FinTech Innovations',
    resources: 'PCI-DSS compliant infrastructure, 30-person dev team, $4M security budget, Real-time payment processing'
  },
  {
    name: 'HealthTech Partners',
    resources: 'HIPAA-compliant cloud, 12 full-stack developers, $1.5M annual budget, Telemedicine platform'
  },
  {
    name: 'EduLearn Platform',
    resources: 'Scalable LMS infrastructure, 18 developers, $2.5M budget, Video streaming CDN, 1M+ active users'
  },
  {
    name: 'RetailNext Commerce',
    resources: 'E-commerce platform, 22 engineers, $3.5M budget, Microservices architecture, High-traffic handling'
  },
  {
    name: 'GreenEnergy Systems',
    resources: 'IoT infrastructure, 15 embedded engineers, $2M budget, Real-time monitoring, Edge computing'
  },
  {
    name: 'LogiTrack Solutions',
    resources: 'GPS tracking platform, 20 developers, $2.8M budget, Real-time data processing, Mobile apps'
  },
  {
    name: 'SocialConnect Media',
    resources: 'Social platform infrastructure, 35 engineers, $6M budget, Real-time messaging, Content delivery network'
  }
];

async function seedCompanies() {
  console.log('🌱 Seeding companies...\n');

  for (const company of companies) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO company (name, company_resources) VALUES (?, ?)',
        [company.name, company.resources]
      );
      console.log(`✅ Created: ${company.name} (ID: ${result.insertId})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️  Skipped: ${company.name} (already exists)`);
      } else {
        console.error(`❌ Error creating ${company.name}:`, error.message);
      }
    }
  }

  // Show total count
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM company');
  console.log(`\n📊 Total companies in database: ${rows[0].total}`);

  await pool.end();
  console.log('\n✅ Seeding complete!');
}

seedCompanies().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
