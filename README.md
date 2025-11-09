# Software Practice Empirical Evidence Database (SPEED)

A web application for collecting, storing, and presenting empirical evidence on Software Engineering (SE) practices. Built with Next.js, Nest.js, MongoDB, and TypeScript.

## Project Overview

SPEED provides a searchable platform that makes academic research findings on SE practices easily accessible and analyzable for students, researchers, and practitioners, facilitating evidence-based decision-making.

## Technology Stack

### Frontend

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Zustand
- **HTTP Client:** Axios / Fetch API

### Backend

- **Framework:** Nest.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)

## Project Structure

```
speed/
├── frontend/          # Next.js application
├── backend/           # Nest.js application
├── docs/              # Project documentation
└── README.md          # This file
```

## Development Plan

### Iteration 1: MVP Core - "Concept Validation & Basic User Flow"

- Basic user authentication (registration, login, JWT)
- Simple article submission form
- Public search page (title-based search)
- Basic result display

### Iteration 2: Workflow & Enhancement - "Core Process & Search Refinement"

- Enhanced RBAC with RolesGuard
- Bibtex upload functionality
- Moderator dashboard and workflow
- Analyst dashboard and evidence input
- Enhanced search with SE Practice and Claims filtering

### Iteration 3: Refinement & Administration - "Production Readiness & Quality"

- Admin module (user management, system configuration)
- Advanced search features
- Password reset
- Comprehensive testing and optimization

## Role-Based Access Control (RBAC)

The system supports five user roles:

1. **Unauthenticated User (Public Searcher):** Basic search and view access
2. **Submitter:** Can submit articles and track submissions
3. **Moderator:** Reviews and approves/rejects submitted articles
4. **Analyst:** Extracts and inputs empirical evidence from approved articles
5. **Admin:** Full system control and management

## Getting Started

For detailed setup instructions, see [SETUP.md](./docs/SETUP.md).

### Quick Start

1. **Prerequisites:** Node.js 18+, MongoDB, Git

2. **Install dependencies:**

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

3. **Configure environment variables:**

   - Backend: Copy `backend/.env.example` to `backend/.env`
   - Frontend: Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001`

4. **Start development servers:**

```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed installation and configuration
- [Architecture](./docs/ARCHITECTURE.md) - System architecture and design
- [Iteration Plan](./docs/ITERATION_PLAN.md) - Development roadmap

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/speed
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Contributing

This project follows Agile/Iterative development methodology. Please refer to the iteration plans for feature development priorities.

## License

[Specify your license here]
