const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔄 Initializing database...\n');

    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');
    
    console.log('📝 Executing schema...');
    await connection.query(schema);
    
    console.log('✅ Database schema created successfully');
    console.log('\n📊 Database: mcp_project_db');
    console.log('📋 Tables created:');
    console.log('   - company');
    console.log('   - project');
    console.log('   - report');
    console.log('   - project_analysis');
    
    console.log('\n✨ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
