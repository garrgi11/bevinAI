# Database Migrations

## How to Run Migrations

### Option 1: Using MySQL Command Line (Windows)
```bash
# Navigate to backend directory
cd backend

# Run the migration
Get-Content database/migrations/add_tech_stack_decision.sql | mysql -u root -p
```

### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. Open the migration file: `database/migrations/add_tech_stack_decision.sql`
4. Execute the script

### Option 3: Copy and Paste
1. Open your MySQL client
2. Copy the contents of `add_tech_stack_decision.sql`
3. Paste and execute in your MySQL client

## Migration: add_tech_stack_decision.sql

**Purpose:** Adds the `tech_stack_decision` table to store AI-generated technology stack recommendations.

**What it does:**
- Creates a new table `tech_stack_decision`
- Stores JSON data containing:
  - 3 technology stack options
  - Scores and analysis for each option
  - Recommended option with confidence level
  - Jira-ready action items
- Links to the `project` table via `project_id`

**Fields:**
- `project_id`: Links to the project (Primary Key, Foreign Key)
- `decision_json`: Stores the complete tech stack decision as JSON (LONGTEXT)
- `generated_at`: Timestamp of when the decision was generated/updated

## Verification

After running the migration, verify it worked:

```sql
USE mcp_project_db;
SHOW TABLES;
DESCRIBE tech_stack_decision;
```

You should see the `tech_stack_decision` table listed.
