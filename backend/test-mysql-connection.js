require('dotenv').config();
const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };

  console.log('📋 Connection Config:');
  console.log(`   Host: ${config.host}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' + config.password.slice(-3) : '(empty)'}`);
  console.log('');

  try {
    console.log('🔄 Attempting to connect...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL!');
    
    // Test query
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`📊 MySQL Version: ${rows[0].version}`);
    
    await connection.end();
    console.log('\n✨ Connection test passed!');
    console.log('\nYou can now run: npm run db:init');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   1. Check your MySQL password in .env file');
      console.error('   2. Try connecting with MySQL CLI: mysql -u root -p');
      console.error('   3. If you have no password, leave DB_PASSWORD empty in .env');
      console.error('   4. You might need to set a password for root user');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   1. Make sure MySQL server is running');
      console.error('   2. Check if MySQL is running on port 3306');
      console.error('   3. Try: sudo service mysql start (Linux)');
      console.error('   4. Or start MySQL from XAMPP/WAMP/MAMP control panel');
    } else {
      console.error('   Error code:', error.code);
    }
  }
}

testMySQLConnection();
