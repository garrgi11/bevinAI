# Testing Guide

## Prerequisites

1. MySQL server running on localhost
2. Database credentials configured in `.env`

## Step 1: Initialize Database

```bash
npm run db:init
```

This will create:
- Database: `mcp_project_db`
- Tables: `company`, `project`, `report`

## Step 2: Test Database Operations

```bash
npm run test:db
```

This will:
1. Test database connection
2. Create a test company
3. Create a test project
4. Save a test report
5. Retrieve and display all data

Expected output:
```
✅ Database connected successfully
✅ Company created: { companyId: 1 }
✅ Project created: { projectId: 1 }
✅ Report saved: { reportId: 1 }
```

## Step 3: Start Backend Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## Step 4: Test Frontend Integration

1. Start the frontend (in another terminal):
```bash
cd ../frontend
npm run dev
```

2. Open browser: `http://localhost:3000/requirements`

3. Fill out the form:
   - Project Name: "Test E-commerce Platform"
   - Project Description: "Build a modern e-commerce site"
   - Business Objectives: "Increase sales by 50%"
   - Target Audience: "B2C customers"
   - Budget Range: "$50,000 - $100,000"
   - Timeline: "3-6 Months"

4. Click "Analyze Requirements"

5. Check the alert message for:
   - Project ID
   - Company ID
   - Success confirmation

## Step 5: Verify Data in Database

### Option A: Using MySQL CLI
```bash
mysql -u root -p
USE mcp_project_db;

-- Check companies
SELECT * FROM company;

-- Check projects
SELECT * FROM project;

-- Check reports
SELECT * FROM report;
```

### Option B: Using API Endpoints

```bash
# Get all companies
curl http://localhost:5000/api/v1/companies

# Get all projects
curl http://localhost:5000/api/v1/projects

# Get specific project
curl http://localhost:5000/api/v1/projects/1

# Get project reports
curl http://localhost:5000/api/v1/projects/1/reports
```

## Expected Flow

1. User submits form → Frontend sends data to backend
2. Backend creates/finds company → Saves to `company` table
3. Backend creates project → Saves to `project` table
4. Backend analyzes with LLM → Generates PRD
5. Backend saves report → Saves to `report` table
6. Backend returns success with IDs

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Run `npm run db:init` again

### CORS Error
- Backend must be running on port 5000
- Frontend must use `http://localhost:5000` as API URL

### Form Submission Error
- Check backend console for errors
- Verify `.env.local` in frontend has correct API URL
- Check network tab in browser DevTools
