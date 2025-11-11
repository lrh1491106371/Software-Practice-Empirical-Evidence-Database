# SPEED Iteration Plan

This document outlines the three-iteration development plan for the SPEED project.

## Iteration 1: MVP Core - "Concept Validation & Basic User Flow"

**Duration:** 3-4 weeks

### Goals

- Establish foundational functionality
- Validate core concepts
- Demonstrate basic user journeys

### Features

#### 1. User Authentication & Authorization (MVP)

- ✅ Basic user registration (all roles, manual assignment)
- ✅ User login/logout
- ✅ JWT authentication for API protection
- ✅ Frontend login/logout UI

#### 2. Article Submission Module (Basic)

- ✅ Simple web form for minimal article details
  - Title, Authors, Publication Year, DOI
- ✅ Store submissions in MongoDB
- ✅ Mark articles as "pending_review"
- ✅ Basic input validation

#### 3. Search & Results Display (Public Access)

- ✅ Public search page
- ✅ Text-based search on article titles
- ✅ Basic table display (Title, Authors, Year)
- ✅ No advanced filtering/sorting

#### 4. Infrastructure & Deployment

- ✅ Nest.js backend setup with MongoDB
- ✅ Next.js frontend setup with routing
- ✅ Git/GitHub repository
- ✅ Basic CI/CD configuration

### Deliverables

- Working authentication system
- Article submission form
- Basic search functionality
- Deployed application (staging)

---

## Iteration 2: Workflow & Enhancement - "Core Process & Search Refinement"

**Duration:** 4-5 weeks

### Goals

- Implement moderation and analysis workflows
- Enhance search capabilities
- Improve usability for internal team

### Features

#### 1. User Authentication & Authorization (Enhanced)

- ✅ Refined RBAC with RolesGuard
- ✅ Dynamic UI based on user roles
- ✅ Role-based navigation links

#### 2. Article Submission Module (Enhanced)

- ✅ Extended form with more fields
  - Journal name, volume, pages, abstract, URL
- ✅ **Bibtex file upload** and parsing (已实现前端上传与解析并预填表单)
- ✅ Submitter can view their submissions and status
- ✅ Submission feedback and success messages

#### 3. Article Moderation Module (Complete)

- ✅ Moderator dashboard with pending queue（已实现 `/moderate`）
- ✅ Full article detail view（已实现 `/articles/:id`）
- ✅ Approve/Reject functionality（已实现）
- ✅ Basic duplicate checking (DOI/title)
- ⏳ Email notifications (optional)

#### 4. Article Analysis Module (Basic)

- ✅ Analyst dashboard with pending queue（已实现 `/analyze`）
- ✅ Evidence input interface（已实现弹窗录入）
  - SE Practice, Claim, Evidence Result
  - Research Type, Participant Type
- ✅ Auto-fill article bibliographic info
- ✅ Save evidence data

#### 5. Search & Results Display (Enhanced)

- ✅ Search by predefined SE Practice
- ✅ Search by Claims (related to SE Practice)
- ✅ Filter by publication year range
- ✅ Sortable results table（客户端排序已接入）
- ✅ Article detail page with all data（已实现）
- ✅ User article rating (1-5 stars)（已实现）
- ✅ Display average ratings（搜索列表与详情页均展示）

### Deliverables

- Complete moderation workflow
- Evidence analysis interface
- Enhanced search with filters
- User rating system

---

## Iteration 3: Refinement & Administration - "Production Readiness & Quality"

**Duration:** 3-4 weeks

### Goals

- Finalize core features
- Build administrative tools
- Ensure system robustness
- Prepare for production

### Features

#### 1. User Authentication & Authorization (Complete)

- ⏳ Password reset functionality
- ⏳ Granular permissions (e.g., submitter edits own pending articles)

#### 2. Article Submission Module (Optimized)

- ⏳ Improved feedback and error messages
- ⏳ Allow submitters to edit pending submissions

#### 3. Article Analysis Module (Complete)

- ⏳ Optimized evidence input with dropdowns
- ⏳ Support for saving analysis drafts
- ⏳ Version control for analysis data (optional)

#### 4. Search & Results Display (Advanced)

- ⏳ User-configurable result columns
- ⏳ Save and manage custom queries
- ⏳ ChatBot integration for query assistance (stretch goal)

#### 5. Admin Module (Complete)

- ⏳ User management (CRUD)
- ⏳ System configuration management
  - SE Practices, Claims, Research Types, Participant Types
- ⏳ Article and evidence data management
- ⏳ System health monitoring dashboard (optional)

#### 6. Cross-Cutting Concerns

- ⏳ Comprehensive error handling and logging
- ⏳ Database performance optimization (indexes)
- ⏳ UI/UX improvements and accessibility
- ⏳ Unit and integration tests
- ⏳ Final deployment and monitoring setup

### Deliverables

- Production-ready application
- Complete admin interface
- Comprehensive test suite
- Performance optimizations
- Documentation

---

## Progress Tracking

### Iteration 1 Status: ✅ Complete

- All core features implemented
- Basic infrastructure in place

### Iteration 2 Status: 🚧 In Progress

- Backend APIs ready
- Frontend components need implementation

### Iteration 3 Status: ⏳ Planned

- Features to be implemented in next phase

---

## Notes

- Features marked with ✅ are implemented
- Features marked with ⏳ are planned
- Features marked with 🚧 are in progress
- Optional features can be deferred if time is limited
