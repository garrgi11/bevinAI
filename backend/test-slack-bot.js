// Test script to get Slack bot info
require('dotenv').config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

async function testSlackBot() {
  console.log('🔍 Testing Slack Bot...\n');
  
  // Get bot info
  const authRes = await fetch('https://slack.com/api/auth.test', {
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`
    }
  });
  
  const authData = await authRes.json();
  
  if (authData.ok) {
    console.log('✅ Bot authenticated successfully!\n');
    console.log('Bot Info:');
    console.log('  Bot ID:', authData.user_id);
    console.log('  Bot Name:', authData.user);
    console.log('  Team:', authData.team);
    console.log('  Team ID:', authData.team_id);
    console.log('\nTo invite this bot to a channel, type in Slack:');
    console.log(`  /invite @${authData.user}`);
  } else {
    console.error('❌ Authentication failed:', authData.error);
  }
}

testSlackBot().catch(console.error);
