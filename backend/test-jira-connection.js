// Test Jira connection and credentials
require('dotenv').config();

const {
  JIRA_BASE_URL,
  JIRA_EMAIL,
  JIRA_API_TOKEN,
  JIRA_PROJECT_KEY,
  JIRA_EPIC_LINK_FIELD_KEY,
  ATLASSIAN_ORG_ID,
  ATLASSIAN_TEAM_ID
} = process.env;

async function testJiraConnection() {
  console.log('🔍 Testing Jira Connection...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 1: Check environment variables
  console.log('📋 Step 1: Checking Environment Variables\n');
  
  const checks = {
    'JIRA_BASE_URL': JIRA_BASE_URL,
    'JIRA_EMAIL': JIRA_EMAIL,
    'JIRA_API_TOKEN': JIRA_API_TOKEN ? '***' + JIRA_API_TOKEN.slice(-4) : undefined,
    'JIRA_PROJECT_KEY': JIRA_PROJECT_KEY,
    'JIRA_EPIC_LINK_FIELD_KEY': JIRA_EPIC_LINK_FIELD_KEY,
    'ATLASSIAN_ORG_ID': ATLASSIAN_ORG_ID,
    'ATLASSIAN_TEAM_ID': ATLASSIAN_TEAM_ID
  };

  let missingVars = [];
  for (const [key, value] of Object.entries(checks)) {
    if (!value || value === 'undefined') {
      console.log(`❌ ${key}: NOT SET`);
      missingVars.push(key);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  }

  if (missingVars.length > 0) {
    console.log('\n❌ Missing required environment variables:');
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log('\nPlease set these in your .env file and try again.');
    return;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 2: Test authentication
  console.log('🔐 Step 2: Testing Authentication\n');
  
  try {
    const authRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/myself`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
        'Accept': 'application/json'
      }
    });

    if (!authRes.ok) {
      const error = await authRes.text();
      console.log(`❌ Authentication failed (${authRes.status})`);
      console.log('Response:', error);
      console.log('\n💡 Common issues:');
      console.log('   - Invalid API token (generate new one at: https://id.atlassian.com/manage-profile/security/api-tokens)');
      console.log('   - Wrong email address');
      console.log('   - Incorrect JIRA_BASE_URL format (should be: https://your-domain.atlassian.net)');
      return;
    }

    const user = await authRes.json();
    console.log(`✅ Authenticated as: ${user.displayName} (${user.emailAddress})`);
    console.log(`   Account ID: ${user.accountId}`);
  } catch (error) {
    console.log('❌ Authentication error:', error.message);
    return;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 3: Test project access
  console.log('📁 Step 3: Testing Project Access\n');
  
  try {
    const projectRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/project/${JIRA_PROJECT_KEY}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
        'Accept': 'application/json'
      }
    });

    if (!projectRes.ok) {
      const error = await projectRes.text();
      console.log(`❌ Cannot access project "${JIRA_PROJECT_KEY}" (${projectRes.status})`);
      console.log('Response:', error);
      console.log('\n💡 Common issues:');
      console.log('   - Project key is incorrect (check your Jira project settings)');
      console.log('   - User does not have access to this project');
      console.log('   - Project does not exist');
      return;
    }

    const project = await projectRes.json();
    console.log(`✅ Project found: ${project.name}`);
    console.log(`   Key: ${project.key}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Type: ${project.projectTypeKey}`);
  } catch (error) {
    console.log('❌ Project access error:', error.message);
    return;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 4: Test issue types
  console.log('📝 Step 4: Checking Available Issue Types\n');
  
  try {
    const issueTypesRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/project/${JIRA_PROJECT_KEY}/statuses`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
        'Accept': 'application/json'
      }
    });

    if (issueTypesRes.ok) {
      const issueTypes = await issueTypesRes.json();
      const types = issueTypes.map(it => it.name);
      console.log('✅ Available issue types:', types.join(', '));
      
      if (!types.includes('Epic')) {
        console.log('⚠️  Warning: "Epic" issue type not found. Epic creation may fail.');
      }
      if (!types.includes('Story')) {
        console.log('⚠️  Warning: "Story" issue type not found. Story creation may fail.');
      }
    }
  } catch (error) {
    console.log('⚠️  Could not fetch issue types:', error.message);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 5: Test create permission
  console.log('✏️  Step 5: Testing Create Issue Permission\n');
  
  try {
    const createMetaRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue/createmeta?projectKeys=${JIRA_PROJECT_KEY}&expand=projects.issuetypes.fields`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
        'Accept': 'application/json'
      }
    });

    if (!createMetaRes.ok) {
      console.log('❌ Cannot get create metadata');
      return;
    }

    const createMeta = await createMetaRes.json();
    if (createMeta.projects && createMeta.projects.length > 0) {
      console.log('✅ User has permission to create issues');
      const project = createMeta.projects[0];
      console.log(`   Available issue types: ${project.issuetypes.map(it => it.name).join(', ')}`);
    } else {
      console.log('❌ User does not have permission to create issues in this project');
      return;
    }
  } catch (error) {
    console.log('❌ Permission check error:', error.message);
    return;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Step 6: Test Atlassian Team API (optional)
  if (ATLASSIAN_ORG_ID && ATLASSIAN_TEAM_ID) {
    console.log('👥 Step 6: Testing Atlassian Team API\n');
    
    try {
      const teamRes = await fetch(`https://api.atlassian.com/public/teams/v1/org/${ATLASSIAN_ORG_ID}/teams/${ATLASSIAN_TEAM_ID}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')
        },
        body: JSON.stringify({ first: 10 })
      });

      if (!teamRes.ok) {
        const error = await teamRes.text();
        console.log(`⚠️  Team API failed (${teamRes.status}): ${error}`);
        console.log('   This is optional - tickets will still be created without team assignment');
      } else {
        const teamData = await teamRes.json();
        const members = teamData.members || teamData.results || [];
        console.log(`✅ Team API working - found ${members.length} members`);
      }
    } catch (error) {
      console.log('⚠️  Team API error:', error.message);
      console.log('   This is optional - tickets will still be created');
    }
  } else {
    console.log('⏭️  Step 6: Skipped (Atlassian Team API not configured)\n');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ ALL TESTS PASSED!\n');
  console.log('Your Jira integration is properly configured and ready to use.\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testJiraConnection().catch(error => {
  console.error('\n❌ Test failed with error:', error.message);
  console.error(error);
});
