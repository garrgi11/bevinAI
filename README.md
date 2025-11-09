# BEVIN - Business Enhancement via Intelligent Navigation

> AI-powered project management system that automates the entire software development lifecycle from requirements gathering to deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-5.0+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18.2+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup and Installation](#-setup-and-installation)
- [Detailed Workflow](#-detailed-workflow)
- [MCP Integration](#-mcp-integration)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

**BEVIN** (Business Enhancement via Intelligent Navigation) is an AI-powered project management system that automates the entire software development lifecycle from requirements gathering to deployment. Built on NVIDIA NIM and integrated with MCP (Model Context Protocol), BEVIN intelligently manages projects, generates technical specifications, creates JIRA tickets, validates code, and produces comprehensive reports.

### Key Capabilities

- **Dual Project Manager Modes**: Separate workflows for creating new services vs updating existing services
- **Intelligent Requirement Analysis**: AI-driven market research and feasibility studies
- **Automated Tech Stack Selection**: Multi-criteria decision-making with cost-benefit analysis
- **JIRA Integration**: Automatic ticket generation and sprint planning
- **Code Generation & Validation**: AI-assisted development with acceptance criteria checking
- **Cost Optimization**: Infrastructure analysis and resource optimization recommendations
- **Evidence-Based Reporting**: Comprehensive project documentation and insights

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BEVIN AI SYSTEM                          │
│                      Landing Page Entry                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TEMPLATE SELECTION PAGE                       │
│                                                                 │
│  "Choose Your Project Manager Type"                            │
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │  CREATE NEW SERVICE  │    │ UPDATE EXISTING      │          │
│  │  Start from scratch  │    │    SERVICE           │          │
│  │  Full SDLC workflow  │    │ Enhance/modify       │          │
│  └──────────────────────┘    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
    [NEW SERVICE]                  [UPDATE SERVICE]
    (Full workflow)                (Different workflow - TBD)
```

### Create New Service - Complete Architecture

The system follows a 7-phase workflow for creating new services:

#### Phase 1: Client Requirements Gathering (5-10 minutes)

**Step 1: Initial Requirements Input**
- Client Name
- Project Description
- Business Objectives
- Target Audience
- Expected Timeline
- Budget Range

**Step 2: AI-Powered Market Research & Analysis**

NVIDIA NIM Processing includes:
- **Competitor Analysis**: Direct competitors, market positioning, feature comparison
- **Market Trends Discovery**: Industry trends, technology adoption rates, future predictions
- **Technology & Tools Research**: Best frameworks, recommended libraries, infrastructure options
- **Feasibility Assessment**: Technical feasibility, business viability, risk analysis

**Step 3: Cost Analysis Engine**

Comprehensive cost breakdown:
- **Infrastructure Costs**: AWS, Azure, GCP pricing comparison
- **Development Costs**: Developer hours estimate, team size recommendation, timeline cost projection
- **Operational Costs**: Maintenance (monthly/yearly), scaling costs, support requirements
- **Total Cost of Ownership (TCO)**: 1-year, 3-year, and 5-year projections

**Step 4: Functionality Analysis**
- Feature Breakdown
- Technical Requirements
- Integration Points
- API Requirements
- Security Requirements
- Performance Targets

**Step 5: Infrastructure Compatibility Check**

Company Infrastructure Assessment:
- Current Infrastructure Audit
- Capacity Analysis
- Compatibility Check
- Gap Identification

Decision Logic:
```
IF requirements > infrastructure
THEN generate alternatives
ELSE proceed to satisfaction
```

**Step 6: Generated Reports & Recommendations**
- 📊 Cost Analysis Report
- 📈 Functionality Analysis Report
- 🏗️ Infrastructure Assessment Report
- 💡 Alternative Solutions (if needed)
  - Option A: Scaled-down version
  - Option B: Phased approach
  - Option C: Hybrid solution

**Step 7: CLIENT SATISFACTION CHECKPOINT**

Review all generated reports and choose:
- ✅ **SATISFIED** → Proceed to Phase 2
- ❌ **NOT SATISFIED** → Loop back to Step 1

#### Phase 2: Tech Stack Selection (3-5 minutes)

**AI-Powered Multi-Criteria Decision Analysis**

Evaluation Criteria:
- Performance (weight: 25%)
- Scalability (weight: 20%)
- Cost (weight: 20%)
- Maintainability (weight: 15%)
- Team Expertise (weight: 10%)
- Community Support (weight: 5%)
- Learning Curve (weight: 5%)

**Three Tech Stack Options Generated**

Each option includes:
- Frontend technologies
- Backend technologies
- Database solutions
- Infrastructure choices
- ✅ Pros
- ❌ Cons
- 💰 Cost estimates
- Overall score

⭐ **HIGHLY RECOMMENDED**: Option with highest confidence score and detailed rationale

#### Phase 3: MCP Server Orchestration (2-3 minutes)

**MCP Server Initialization & Integration**

Connected Services:
- ✓ NVIDIA NIM API (Nemotron 70B)
- ✓ JIRA Cloud API v3
- ✓ Confluence Cloud API
- ✓ Slack Bolt SDK
- ✓ GitHub REST API v3
- ✓ PostgreSQL Database
- ✓ Redis Cache

NVIDIA Nemotron Bots Active:
- Orchestration Bot
- JIRA Automation Bot
- Code Generation Bot
- Validation Bot
- Reporting Bot

#### Phase 4: JIRA Ticket Generation (2-3 minutes)

**AI-Generated JIRA Ticket Structure**

```
📦 EPIC: Build Payment Processing Service
    Key: BEVAN-1001
    Story Points: 89
    │
    ├─ 📖 USER STORY: Setup Infrastructure
    │   Key: BEVAN-1002
    │   Sprint: Sprint 1
    │   Story Points: 13
    │   │
    │   ├─ ✓ TASK: Configure AWS Resources
    │   │   Key: BEVAN-1003
    │   │   Estimate: 8 hours
    │   │   ├─ SUBTASK: Setup VPC & Subnets
    │   │   ├─ SUBTASK: Configure Security Groups
    │   │   └─ SUBTASK: Setup Load Balancer
    │   │
    │   ├─ ✓ TASK: Setup Database Schema
    │   │   Key: BEVAN-1004
    │   │   Estimate: 5 hours
    │   │
    │   └─ ✓ TASK: Configure CI/CD Pipeline
    │       Key: BEVAN-1005
    │       Estimate: 6 hours
    │
    ├─ 📖 USER STORY: Implement Payment Gateway
    │   Key: BEVAN-1006
    │   Sprint: Sprint 2
    │   Story Points: 21
    │   │
    │   │   ACCEPTANCE CRITERIA:
    │   │   ✓ User can process credit card payments
    │   │   ✓ System handles payment failures gracefully
    │   │   ✓ Transaction logs are complete
    │   │   ✓ PCI compliance requirements met
    │   │
    │   ├─ ✓ TASK: Stripe Integration
    │   │   Key: BEVAN-1007
    │   │   Estimate: 12 hours
    │   │
    │   ├─ ✓ TASK: Payment Validation Logic
    │   │   Key: BEVAN-1008
    │   │
    │   └─ ✓ TASK: Transaction Logging Service
    │       Key: BEVAN-1009
    │
    └─ 📖 USER STORY: Build Frontend Interface
        Key: BEVAN-1010
        Sprint: Sprint 2
        Story Points: 13
        │
        ├─ ✓ TASK: Payment Form Component
        ├─ ✓ TASK: Confirmation Screen
        └─ ✓ TASK: Error Display & Retry Logic
```

#### Phase 5: AI-Assisted Code Generation (Variable time)

**NVIDIA NIM Code Generation for Each Task**

For each JIRA Task:
1. Analyze Task Requirements
2. Generate Django Backend Code
   - Models (ORM)
   - Views/ViewSets (DRF)
   - Serializers
   - URLs
   - Tests
   - Documentation
3. Generate Frontend Code (if needed)
4. Generate Unit Tests
5. Generate Integration Tests
6. Generate API Documentation
7. Security Scan
8. Performance Optimization

#### Phase 6: Pull Request & Validation (Per feature)

**Automated PR Creation & Validation Pipeline**

**Step 1: Create Feature Branch**
```bash
git checkout -b feature/payment-gateway
# AI commits code with detailed messages
```

**Step 2: Push & Create PR**

PR includes:
- Changes summary
- JIRA ticket links
- Test coverage
- Breaking changes

**Step 3: Automated Validation Checks**

🔍 **DIFF CHECKER**
- Line-by-line analysis
- Identify modified files
- Detect code patterns
- Flag suspicious changes

✅ **ACCEPTANCE CRITERIA VALIDATOR**
- Check against JIRA requirements
- Verify each criterion met
- Test acceptance tests
- Score: 95/100 (Passing)

📊 **CODE QUALITY METRICS**
- Complexity: Low ✓
- Coverage: 87% ✓
- Duplication: 2% ✓
- Maintainability: A ✓
- Security: No issues ✓

🔐 **SECURITY SCAN**
- Dependency vulnerabilities: 0
- SQL injection: Safe ✓
- XSS vulnerabilities: None ✓
- Authentication: Secure ✓

⚡ **PERFORMANCE TESTS**
- API response time: 45ms ✓
- Database queries: Optimized ✓
- Memory usage: Normal ✓
- Load test: 1000 req/s ✓

**Step 4: JSON Output Comparison**

Compare Service Behavior:

BEFORE:
```json
{
  "payment": null
}
```

AFTER:
```json
{
  "payment": {
    "status": "success",
    "amount": 99.99,
    "transaction_id": "txn_123456"
  }
}
```

✅ New functionality added  
✅ No breaking changes  
✅ Backward compatible

**Step 5: Final Validation Decision**

ALL CHECKS PASSED ✅

- Acceptance Criteria: 95/100 ✓
- Code Quality: A ✓
- Security: Pass ✓
- Performance: Pass ✓
- Tests: Pass (87% coverage) ✓

🎯 **READY FOR AUTO-MERGE**

**GitHub Actions - Post-Merge Automation**
1. Merge to main branch ✓
2. Run full test suite ✓
3. Build Docker images ✓
4. Deploy to staging ✓
5. Run smoke tests ✓
6. Update JIRA ticket status ✓
7. Notify Slack channel ✓
8. Update Confluence docs ✓

#### Phase 7: Optimization & Reporting (Post-Development)

**Service Analysis & Optimization Recommendations**

🔍 **Post-Deployment Analysis:**

**1. Feature Usage Analytics**
- Payment gateway: 98% usage
- Transaction logs: 100% usage
- Error handling: 85% coverage
- Unused: Legacy fallback (0%)

**2. Performance Metrics**
- Avg response time: 45ms
- P95 response time: 120ms
- Error rate: 0.2%
- Throughput: 850 req/s

**3. Cost Analysis**
- Current monthly cost: $5,200
- Projected annual: $62,400
- Cost per transaction: $0.008

**4. Redundancy Detection**
- Unused API endpoints: 3
- Redundant database queries: 12
- Over-provisioned resources: 2
- Duplicate code blocks: 5

💡 **OPTIMIZATION OPPORTUNITIES:**

✅ Remove Legacy Fallback Module  
Impact: -$200/month, -2% complexity

✅ Optimize Database Queries  
Impact: -15% response time

✅ Right-size EC2 Instances  
Impact: -$800/month

✅ Enable CloudFront Caching  
Impact: -30% bandwidth costs

📊 **TOTAL POTENTIAL SAVINGS:**
- Monthly: $1,560 (30%)
- Annual: $18,720
- Performance gain: +25%

**Evidence-Based Final Report**

📄 **Complete Project Report Structure**

**SECTION 1: EXECUTIVE SUMMARY**
- Project Overview
- Key Achievements
- Timeline Summary
- Budget vs Actual
- ROI Projection

**SECTION 2: REQUIREMENTS ANALYSIS**
- Original Client Requirements
- Market Research Findings (with screenshots)
- Feasibility Studies
- Cost Analysis
- Final Requirements Document

**SECTION 3: TECH STACK JUSTIFICATION**
- Decision-Making Process
- Options Evaluated (comparison tables)
- Final Selection Rationale
- Risk Mitigation Strategy

**SECTION 4: DEVELOPMENT PROCESS**
- JIRA Workflow (screenshots, velocity charts, burndown charts)
- AI-Assisted Code Generation (statistics, quality metrics)
- PR Validation Process
  - Total PRs created: 47
  - Auto-merged: 42 (89%)
  - Manual review: 5 (11%)
  - Average validation time: 3.2 min
- Quality Assurance
  - Test coverage: 87%
  - Security issues: 0
  - Code quality: Grade A

**SECTION 5: PERFORMANCE BENCHMARKS**
- System Metrics (response time graphs, throughput charts)
- Load Testing Results
  - Concurrent users: 10,000
  - Peak throughput: 1,200 req/s
  - Success rate: 99.8%
- Comparison with Requirements
- Scalability Analysis

**SECTION 6: COST-BENEFIT ANALYSIS**
- Development Costs
  - Budgeted: $150,000
  - Actual: $142,000
  - Savings: $8,000 (5.3%)
- Infrastructure Costs
  - Monthly: $5,200
  - Annual projection: $62,400
- ROI Calculation
  - Revenue projection: $500K/year
  - Total costs: $204,400/year
  - Net profit: $295,600
  - ROI: 145%
- Break-even Analysis: Month 4

**SECTION 7: OPTIMIZATION RECOMMENDATIONS**
- Immediate Optimizations (Week 1)
- Short-term Optimizations (Month 1)
- Medium-term Optimizations (Quarter 1)
- Long-term Optimizations (Year 1)
- Total Potential Savings: $23,520 annually

**SECTION 8: LESSONS LEARNED**
- What Went Well
- Challenges Faced
- Solutions Implemented
- Future Recommendations

**SECTION 9: VISUAL EVIDENCE**
- Screenshots (UI, dashboards, JIRA, PR pipeline)
- Logs & Metrics
- Code Samples
- Architecture Diagrams

**SECTION 10: CONCLUSION & NEXT STEPS**
- Project Success Metrics
- Business Impact
- Recommended Next Steps

## 🛠️ Technology Stack

### Frontend Layer (React + TypeScript)

```yaml
Core Framework: React 18.2+
Language: TypeScript 5.0+
UI Framework: Tailwind CSS 3.3+
Component Library: shadcn/ui
State Management: Zustand / Redux Toolkit
Data Fetching: TanStack Query (React Query)
Forms: React Hook Form + Zod
Charts & Visualization: 
  - Recharts
  - D3.js
  - Plotly
Routing: React Router v6
Build Tool: Vite
Testing: Vitest + React Testing Library
Hosting: AWS Amplify
```

### Backend Layer (Django + Python)

```yaml
Language: Python 3.11+
Framework: Django 5.0+
REST API: Django REST Framework (DRF) 3.14+
Authentication: 
  - Django REST Framework JWT
  - OAuth 2.0 (django-oauth-toolkit)
Task Queue: Celery 5.3+
Message Broker: Redis 7.2+
ORM: Django ORM
Database Migrations: Django Migrations
API Documentation: 
  - drf-spectacular (OpenAPI 3.0)
  - Swagger UI
Testing: pytest + pytest-django
Code Quality: 
  - Black (formatter)
  - isort (import sorting)
  - flake8 (linting)
  - mypy (type checking)
```

### AI & ML Layer

```yaml
Primary Model: NVIDIA NIM (Nemotron 70B Instruct)
MCP Protocol: Model Context Protocol
LLM Framework: LangChain 0.1+
Vector Database: Pinecone / Weaviate
Embeddings: 
  - OpenAI text-embedding-3
  - Cohere embeddings
AI Agent Framework: LangGraph
Prompt Management: LangSmith
Context Window: Up to 128K tokens
```

### Database Layer

```yaml
Primary Database: PostgreSQL 15+
  - Extensions: pgvector, pg_trgm, uuid-ossp
Document Store: MongoDB 7.0+ (for unstructured data)
Cache Layer: Redis 7.2+
  - Use cases: Session, API cache, Celery broker
Vector Search: Pinecone (for semantic search)
Time Series: InfluxDB 2.7+ (for metrics)
```

### Integration Layer

```yaml
JIRA: 
  - Library: jira-python
  - API Version: v3 (Cloud)
Confluence:
  - Library: atlassian-python-api
  - API Version: Cloud REST API
Slack:
  - Library: slack-bolt
  - Features: Interactive messages, slash commands
GitHub:
  - Library: PyGithub
  - API Version: REST API v3
AWS Services:
  - boto3 (SDK)
  - Services: S3, EC2, RDS, Lambda, CloudWatch
```

### MCP Server

```yaml
Runtime: Python 3.11+
Framework: FastAPI 0.109+
Async: asyncio + aiohttp
WebSockets: websockets
Orchestration: Custom orchestrator
NVIDIA Integration: NVIDIA NIM Python SDK
Database: PostgreSQL + Redis
Monitoring: Prometheus + Grafana
```

### DevOps & Infrastructure

```yaml
Containerization: Docker 24+
Container Orchestration: Docker Compose / Kubernetes (optional)
CI/CD: GitHub Actions
Infrastructure as Code: Terraform / AWS CDK
Monitoring: 
  - Datadog / New Relic
  - Prometheus + Grafana
Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
Error Tracking: Sentry
APM: Django Silk / django-debug-toolbar (dev)
Cloud Provider: AWS
  - Compute: EC2, ECS, Lambda
  - Database: RDS (PostgreSQL), ElastiCache (Redis)
  - Storage: S3
  - CDN: CloudFront
  - Load Balancer: ALB
```

## 📁 Project Structure

```
bevan-ai-pm/
├── frontend/                           # React + TypeScript frontend
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Shared components
│   │   │   ├── landing/
│   │   │   ├── template/              # Template selection
│   │   │   ├── new-service/           # Create New Service workflow
│   │   │   │   ├── requirements/
│   │   │   │   ├── techstack/
│   │   │   │   ├── jira/
│   │   │   │   ├── development/
│   │   │   │   ├── validation/
│   │   │   │   └── reporting/
│   │   │   └── update-service/        # Update Existing Service (TBD)
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                            # Django + Python backend
│   ├── config/                         # Django project settings
│   ├── apps/
│   │   ├── requirements/              # Requirements gathering app
│   │   ├── techstack/                 # Tech stack selection app
│   │   ├── jira_integration/          # JIRA integration app
│   │   ├── code_generation/           # AI code generation app
│   │   ├── github_integration/        # GitHub integration app
│   │   ├── validation/                # PR validation app
│   │   ├── reporting/                 # Evidence-based reporting app
│   │   ├── integrations/              # External integrations app
│   │   └── users/                     # User management app
│   ├── core/                          # Core utilities
│   ├── manage.py
│   └── requirements/
│
├── mcp_server/                        # MCP orchestration server
│   ├── src/
│   │   ├── main.py                    # FastAPI application
│   │   ├── handlers/
│   │   ├── orchestrator/
│   │   ├── nevatron/
│   │   ├── models/
│   │   ├── services/
│   │   ├── api/
│   │   └── utils/
│   └── requirements.txt
│
├── database/                          # Database schemas and migrations
│   ├── schemas/
│   ├── migrations/
│   └── seeds/
│
├── shared/                            # Shared utilities and types
│   ├── python/
│   └── typescript/
│
├── docs/                              # Documentation
│   ├── architecture/
│   ├── api/
│   ├── setup/
│   ├── workflows/
│   ├── integrations/
│   └── development/
│
├── scripts/                           # Utility scripts
│   ├── setup/
│   ├── database/
│   ├── deployment/
│   ├── testing/
│   └── utilities/
│
├── .github/                           # GitHub configuration
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker/                            # Docker configuration
│   ├── frontend/
│   ├── backend/
│   ├── mcp_server/
│   └── nginx/
│
├── terraform/                         # Infrastructure as Code (optional)
│   ├── modules/
│   └── environments/
│
├── tests/                             # Integration & E2E tests
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── Makefile
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## 🚀 Setup and Installation

### Prerequisites

**Required Software:**
- Python 3.11+ and pip
- Node.js 20+ and npm/yarn
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- MongoDB 7+ (optional)
- Git
- AWS CLI (for deployment)

**Required Accounts & API Keys:**
- NVIDIA NIM API Key
- JIRA Cloud Account + API Token
- Confluence Access + API Token
- Slack Workspace + Bot Token
- GitHub Personal Access Token
- AWS Account (for Amplify & services)

### Local Development Setup

**1. Clone the Repository**

```bash
git clone https://github.com/your-org/bevan-ai-pm.git
cd bevan-ai-pm
```

**2. Setup Environment Variables**

```bash
# Copy example environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp mcp_server/.env.example mcp_server/.env

# Edit .env files with your API keys and configuration
```

**3. Start Services with Docker Compose**

```bash
# Start all services (PostgreSQL, Redis, MongoDB)
docker-compose up -d

# Verify services are running
docker-compose ps
```

**4. Setup Backend**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load seed data (optional)
python manage.py loaddata ../database/seeds/development/*.json

# Run development server
python manage.py runserver
```

**5. Setup Frontend**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**6. Setup MCP Server**

```bash
cd mcp_server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run MCP server
python src/main.py
```

**7. Access the Application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs
- Django Admin: http://localhost:8000/admin
- MCP Server: http://localhost:8001

### Running Tests

**Backend Tests:**

```bash
cd backend
pytest
pytest --cov=apps --cov-report=html
```

**Frontend Tests:**

```bash
cd frontend
npm run test
npm run test:coverage
```

**Integration Tests:**

```bash
cd tests/integration
pytest
```

**E2E Tests:**

```bash
cd tests/e2e
npx playwright test
```

## 📚 Detailed Workflow

### Create New Service Workflow

1. **Landing Page** → Select "Create New Service"
2. **Requirements Gathering** → Input project details
3. **AI Analysis** → Market research, cost analysis, feasibility
4. **Review Reports** → Approve or revise
5. **Tech Stack Selection** → Choose from AI-recommended options
6. **JIRA Generation** → Automatic ticket creation
7. **Code Generation** → AI-assisted development
8. **PR Validation** → Automated quality checks
9. **Deployment** → Auto-merge and deploy
10. **Optimization** → Post-deployment analysis and recommendations

### Update Existing Service Workflow

Coming soon - Different workflow for enhancing existing systems.

## 🔌 MCP Integration

BEVIN uses the Model Context Protocol (MCP) to orchestrate multiple AI agents and integrate with external services.

### MCP Architecture

- **Orchestration Bot**: Manages workflow and coordinates other bots
- **JIRA Automation Bot**: Handles JIRA ticket creation and updates
- **Code Generation Bot**: Generates code using NVIDIA NIM
- **Validation Bot**: Validates PRs and code quality
- **Reporting Bot**: Generates comprehensive reports

### Connected Services

- NVIDIA NIM (Nemotron 70B Instruct)
- JIRA Cloud API
- Confluence Cloud API
- Slack API
- GitHub API
- AWS Services

## 📖 API Documentation

API documentation is available at:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- OpenAPI Schema: http://localhost:8000/api/schema

### Key Endpoints

**Requirements API:**
- `POST /api/requirements/` - Create new requirements
- `GET /api/requirements/{id}/` - Get requirements details
- `POST /api/requirements/{id}/analyze/` - Trigger AI analysis

**Tech Stack API:**
- `POST /api/techstack/evaluate/` - Evaluate tech stack options
- `GET /api/techstack/recommendations/{id}/` - Get recommendations

**JIRA API:**
- `POST /api/jira/generate-tickets/` - Generate JIRA tickets
- `GET /api/jira/tickets/{project_id}/` - Get project tickets

**Validation API:**
- `POST /api/validation/pr/` - Validate pull request
- `GET /api/validation/results/{pr_id}/` - Get validation results

**Reporting API:**
- `GET /api/reporting/project/{id}/` - Get project report
- `GET /api/reporting/optimization/{id}/` - Get optimization suggestions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Python: Follow PEP 8, use Black formatter
- TypeScript: Follow ESLint configuration
- Commit messages: Use conventional commits
- Tests: Maintain >80% coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NVIDIA NIM for AI capabilities
- Django and React communities
- All contributors and supporters

## 📞 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-org/bevan-ai-pm/issues)
- Discussions: [GitHub Discussions](https://github.com/your-org/bevan-ai-pm/discussions)

---

Made with ❤️ by the BEVIN Team
