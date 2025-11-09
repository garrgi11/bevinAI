# Bevin.AI Backend

Node.js/Express backend API for Bevin.AI platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure MySQL database in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mcp_project_db
```

4. Initialize database:
```bash
npm run db:init
```

5. Start development server:
```bash
npm run dev
```

6. Start production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /` - Welcome message
- `GET /api/health` - Check API status

### Companies
- `POST /api/v1/companies` - Create a new company
- `GET /api/v1/companies` - Get all companies
- `GET /api/v1/companies/:id` - Get company by ID

### Projects
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:id` - Get project by ID
- `GET /api/v1/projects/:id/context` - Get project context for LLM

### Reports
- `POST /api/v1/reports` - Save a generated report
- `GET /api/v1/projects/:id/reports` - Get reports for a project
- `GET /api/v1/reports/:id` - Get report by ID

### Project Analysis
- `POST /api/v1/projects/:id/analysis` - Save/update project analysis
- `GET /api/v1/projects/:id/analysis` - Get project analysis
- `DELETE /api/v1/projects/:id/analysis` - Delete project analysis

### Requirements
- `POST /api/v1/requirements/submit` - Submit project requirements (with AI analysis)

### LLM
- `POST /api/v1/llm/test` - Test LLM with custom prompt

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `NVIDIA_API_KEY` - NVIDIA API key for Nemotron LLM

## Testing

Test the LLM service:
```bash
npm run test:llm
```

## Database Schema

### Tables
- **company** - Stores company/client information
- **project** - Stores project requirements
- **report** - Stores generated reports (functional, cost, market research, PRD)
- **project_analysis** - Stores comprehensive analysis reports (functionality, cost, market)

### Relationships
- One company can have multiple projects
- One project can have multiple reports
- One project has one project_analysis (1:1 relationship)

## Tech Stack

- Node.js
- Express.js
- MySQL (with mysql2)
- CORS
- dotenv
- OpenAI SDK (for NVIDIA Nemotron)
