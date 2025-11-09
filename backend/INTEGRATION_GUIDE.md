# Integration Guide: Requirements Analysis Flow

## Overview

When a user submits the requirements form, the following happens:

### Step-by-Step Flow

1. **Frontend Submission** (`frontend/app/requirements/page.tsx`)
   - User fills out company selection and project details
   - Clicks "Analyze Requirements"
   - Loading animation starts (4 steps shown)

2. **Backend Processing** (`POST /api/v1/requirements/submit`)
   
   **Phase 1: Data Insertion (Immediate)**
   - Validates company ID
   - Updates company resources if changed
   - Creates project record in `project` table
   - Returns project ID immediately
   
   **Phase 2: AI Analysis (Background)**
   - Calls `analyzeRequirementsForProject(projectId)`
   - Generates 3 comprehensive reports:
     1. **Functional Requirements** (~2-3 seconds)
        - Core capabilities
        - Integration requirements
        - Security requirements
        - Jira epic suggestions
        - Ticket outline
     
     2. **Cost Analysis** (~2-3 seconds)
        - Infrastructure costs
        - Development effort
        - Operational costs
        - TCO projections
        - Cost-based epics
     
     3. **Market Research** (~2-3 seconds)
        - Market insights
        - Competitive signals
        - Risk analysis
        - Validation steps
        - Market-focused epics
   
   **Phase 3: Data Storage**
   - Saves each report to `report` table (with reasoning)
   - Upserts consolidated analysis to `project_analysis` table

3. **Frontend Completion**
   - Loading animation completes
   - Success message shows project ID
   - User can view results

## Database Tables Updated

### `company`
- Updates `company_resources` if changed

### `project`
- Inserts new project record
- Links to company via `company_id`

### `report`
- Inserts 3 separate reports:
  - `report_type = 'functional'`
  - `report_type = 'cost'`
  - `report_type = 'market_research'`
- Each includes `reasoning_content` from LLM

### `project_analysis`
- Upserts single record with all 3 reports
- Columns: `functionality_report`, `cost_analysis_report`, `market_analysis_report`
- Auto-updates `generated_at` timestamp

## API Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Requirements analyzed and saved successfully",
  "data": {
    "projectId": 5,
    "companyId": 2,
    "projectName": "E-commerce Platform",
    "reports": {
      "functional": {
        "company_id": 2,
        "project_id": 5,
        "report_type": "functional",
        "report_title": "Functional Requirements & Scope Overview",
        "summary": "...",
        "core_capabilities": [...],
        "epic_suggestions": [...],
        "ticket_outline": [...]
      },
      "cost": {
        "company_id": 2,
        "project_id": 5,
        "report_type": "cost",
        "report_title": "Cost & Effort Analysis",
        "summary": "...",
        "infrastructure_costs": {...},
        "development_effort": {...},
        "tco_projection": {...}
      },
      "market_research": {
        "company_id": 2,
        "project_id": 5,
        "report_type": "market_research",
        "report_title": "Market Context & Validation Opportunities",
        "summary": "...",
        "market_insights": {...},
        "recommended_validation_steps": [...]
      }
    }
  }
}
```

### Error Response (Analysis Failed)
```json
{
  "success": false,
  "error": "Analysis failed",
  "message": "Nemotron returned invalid JSON.",
  "data": {
    "projectId": 5,
    "companyId": 2,
    "projectName": "E-commerce Platform",
    "note": "Project was saved but analysis failed. You can retry analysis later."
  }
}
```

## Testing the Integration

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test the Flow
1. Navigate to `http://localhost:3000/requirements`
2. Select a company from dropdown
3. Fill in company resources (if first time)
4. Fill in project details:
   - Project Name
   - Project Description (detailed)
   - Business Objectives
   - Target Audience
   - Budget Range
   - Timeline
5. Click "Analyze Requirements"
6. Watch loading animation (4 steps)
7. Wait for completion (~10 seconds total)
8. Check success message

### 4. Verify Data in Database

```bash
# Check project was created
curl http://localhost:5000/api/v1/projects

# Check reports were generated
curl http://localhost:5000/api/v1/projects/5/reports

# Check project analysis
curl http://localhost:5000/api/v1/projects/5/analysis
```

### 5. Manual Analysis Test

You can also run analysis manually for any existing project:

```bash
npm run analyze 5
```

## Troubleshooting

### Issue: "Analysis failed"
- Check NVIDIA API key in `.env`
- Verify project exists in database
- Check backend console for detailed error
- Try manual analysis: `npm run analyze <project_id>`

### Issue: "Invalid company ID"
- Ensure company is selected in dropdown
- Run `npm run db:seed` to create companies
- Check company exists: `curl http://localhost:5000/api/v1/companies`

### Issue: Loading animation doesn't complete
- Check backend is running
- Check browser console for errors
- Verify API URL in `frontend/.env.local`

### Issue: Reports not in database
- Check `report` table: `SELECT * FROM report WHERE project_id = 5;`
- Check `project_analysis` table: `SELECT * FROM project_analysis WHERE project_id = 5;`
- Verify MySQL connection

## Next Steps

After successful integration:
1. Create results page to display reports
2. Add Jira integration to create tickets from epic suggestions
3. Add Slack integration to post reports
4. Add retry mechanism for failed analyses
5. Add progress streaming for real-time updates
