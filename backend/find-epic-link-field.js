// Find the correct Epic Link field ID for your Jira instance
require('dotenv').config();

const {
  JIRA_BASE_URL,
  JIRA_EMAIL,
  JIRA_API_TOKEN,
  JIRA_PROJECT_KEY
} = process.env;

async function findEpicLinkField() {
  console.log('🔍 Finding Epic Link Field ID...\n');

  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
    console.error('❌ Missing Jira credentials in .env file');
    return;
  }

  const auth = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  try {
    // Get all fields
    console.log('📋 Fetching all Jira fields...\n');
    const fieldsRes = await fetch(`${JIRA_BASE_URL}/rest/api/3/field`, {
      headers: {
        'Authorization': auth,
        'Accept': 'application/json'
      }
    });

    if (!fieldsRes.ok) {
      console.error('❌ Failed to fetch fields:', await fieldsRes.text());
      return;
    }

    const fields = await fieldsRes.json();

    // Look for Epic Link field
    console.log('🔎 Searching for Epic-related fields...\n');
    
    const epicFields = fields.filter(f => 
      f.name.toLowerCase().includes('epic') ||
      f.id.includes('epic') ||
      (f.schema && f.schema.custom && f.schema.custom.includes('epic'))
    );

    if (epicFields.length === 0) {
      console.log('⚠️  No Epic-related fields found.');
      console.log('\n💡 Your Jira project might not have Epic functionality enabled.');
      console.log('   You can either:');
      console.log('   1. Enable Epics in your Jira project settings');
      console.log('   2. Set JIRA_EPIC_LINK_FIELD_KEY to empty string in .env to skip epic linking');
      return;
    }

    console.log('✅ Found Epic-related fields:\n');
    epicFields.forEach(field => {
      console.log(`Field ID: ${field.id}`);
      console.log(`  Name: ${field.name}`);
      console.log(`  Type: ${field.schema?.type || 'unknown'}`);
      if (field.schema?.custom) {
        console.log(`  Custom: ${field.schema.custom}`);
      }
      console.log('');
    });

    // Find the most likely Epic Link field
    const epicLinkField = epicFields.find(f => 
      f.name.toLowerCase() === 'epic link' ||
      f.id.toLowerCase().includes('epiclink') ||
      (f.schema && f.schema.custom && f.schema.custom.includes('epiclink'))
    );

    if (epicLinkField) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('✅ RECOMMENDED EPIC LINK FIELD:\n');
      console.log(`JIRA_EPIC_LINK_FIELD_KEY=${epicLinkField.id}\n`);
      console.log('Add this to your .env file!');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('⚠️  Could not determine the exact Epic Link field.');
      console.log('\nTry one of these field IDs in your .env:\n');
      epicFields.forEach(f => {
        console.log(`JIRA_EPIC_LINK_FIELD_KEY=${f.id}  # ${f.name}`);
      });
      console.log('\nOr set it to empty to skip epic linking:');
      console.log('JIRA_EPIC_LINK_FIELD_KEY=');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    // Also check if we can get create metadata for the project
    console.log('\n📝 Checking Story issue type fields...\n');
    const metaRes = await fetch(
      `${JIRA_BASE_URL}/rest/api/3/issue/createmeta?projectKeys=${JIRA_PROJECT_KEY}&issuetypeNames=Story&expand=projects.issuetypes.fields`,
      {
        headers: {
          'Authorization': auth,
          'Accept': 'application/json'
        }
      }
    );

    if (metaRes.ok) {
      const meta = await metaRes.json();
      if (meta.projects && meta.projects[0] && meta.projects[0].issuetypes && meta.projects[0].issuetypes[0]) {
        const storyFields = meta.projects[0].issuetypes[0].fields;
        const epicFieldInStory = Object.entries(storyFields).find(([key, field]) => 
          field.name.toLowerCase().includes('epic')
        );
        
        if (epicFieldInStory) {
          console.log(`✅ Epic field found in Story issue type: ${epicFieldInStory[0]}`);
          console.log(`   Name: ${epicFieldInStory[1].name}`);
          console.log(`\nUse this in your .env:`);
          console.log(`JIRA_EPIC_LINK_FIELD_KEY=${epicFieldInStory[0]}`);
        } else {
          console.log('⚠️  No Epic field found in Story issue type');
          console.log('   Stories cannot be linked to Epics in this project');
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findEpicLinkField();
