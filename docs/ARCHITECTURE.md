# SPEED Architecture Documentation

## Overview

SPEED (Software Practice Empirical Evidence Database) is a full-stack web application built with a modern technology stack following best practices for scalability, maintainability, and security.

## Technology Stack

### Backend

- **Framework:** Nest.js (Node.js)
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** class-validator, class-transformer

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios

## Project Structure

```
speed/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication & Authorization
│   │   │   ├── guards/        # JWT, Roles guards
│   │   │   ├── strategies/    # Passport strategies
│   │   │   ├── decorators/    # @Roles decorator
│   │   │   └── dto/           # Login, Register DTOs
│   │   ├── users/             # User management
│   │   │   ├── schemas/       # User schema
│   │   │   └── dto/           # User DTOs
│   │   ├── articles/          # Article management
│   │   │   ├── schemas/       # Article schema
│   │   │   └── dto/           # Article DTOs
│   │   ├── evidence/          # Evidence management
│   │   │   ├── schemas/       # Evidence schema
│   │   │   └── dto/           # Evidence DTOs
│   │   ├── search/            # Search functionality
│   │   └── app.module.ts      # Root module
│   └── package.json
│
├── frontend/
│   ├── app/                   # Next.js App Router
│   │   ├── (pages)/           # Page components
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── contexts/              # React contexts (Auth)
│   ├── lib/                   # Utilities (API client)
│   ├── types/                 # TypeScript types
│   └── package.json
│
└── docs/                      # Documentation
```

## Database Schema

### User Schema

- `email` (unique, required)
- `password` (hashed with bcrypt)
- `firstName`, `lastName`
- `roles` (array of UserRole enum)
- `isActive` (boolean)
- `lastLogin` (Date)

### Article Schema

- `title` (required)
- `authors` (array of strings)
- `publicationYear` (required)
- `doi` (optional, unique)
- `journalName`, `volume`, `pages`
- `abstract`, `url`
- `submittedBy` (User reference)
- `status` (enum: pending_review, approved, rejected, etc.)
- `reviewedBy`, `reviewedAt`
- `analyzedBy`, `analyzedAt`

### Evidence Schema

- `articleId` (Article reference, unique)
- `sePractice` (required)
- `claim` (required)
- `evidenceResult` (enum: supports, opposes, neutral)
- `researchType` (enum)
- `participantType` (enum)
- `participantCount`
- `summary`, `notes`
- `analyzedBy` (User reference)
- `isPublished` (boolean)

## Authentication & Authorization

### JWT Authentication Flow

1. User submits credentials (email/password)
2. Backend validates credentials
3. Backend generates JWT with user info and roles
4. Client stores JWT in localStorage
5. Client includes JWT in Authorization header for protected routes

### Role-Based Access Control (RBAC)

- **Guards:** `JwtAuthGuard` validates JWT, `RolesGuard` checks user roles
- **Decorator:** `@Roles()` specifies required roles for endpoints
- **Roles:** submitter, moderator, analyst, admin

### Permission Matrix

See main README.md for detailed permission matrix.

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/profile` - Get current user profile (protected)

### Articles

- `GET /articles` - List all articles (public)
- `GET /articles/:id` - Get article details (public)
- `POST /articles` - Submit new article (authenticated)
- `GET /articles/my-submissions` - Get user's submissions (authenticated)
- `GET /articles/pending-review` - Get pending articles (moderator/admin)
- `GET /articles/pending-analysis` - Get pending analysis (analyst/admin)
- `POST /articles/:id/approve` - Approve article (moderator/admin)
- `POST /articles/:id/reject` - Reject article (moderator/admin)
- `PATCH /articles/:id` - Update article (conditional)
- `DELETE /articles/:id` - Delete article (admin)

### Evidence

- `GET /evidence` - List all evidence (public)
- `GET /evidence/:id` - Get evidence details (public)
- `GET /evidence/article/:articleId` - Get evidence for article (public)
- `POST /evidence` - Create evidence (analyst/admin)
- `PATCH /evidence/:id` - Update evidence (analyst/admin)
- `DELETE /evidence/:id` - Delete evidence (admin)

### Search

- `GET /search/articles?q=query` - Search articles by title
- `GET /search/se-practice?practice=name` - Search by SE practice
- `GET /search/claim?claim=text` - Search by claim
- `GET /search/advanced` - Advanced search with multiple filters

### Users (Admin only)

- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Security Considerations

1. **Password Hashing:** bcrypt with salt rounds
2. **JWT Security:** Secure secret, expiration time
3. **Input Validation:** DTOs with class-validator
4. **CORS:** Configured for specific origins
5. **Role-Based Access:** Guards and decorators
6. **SQL Injection:** Not applicable (NoSQL), but input sanitization still important

## Development Workflow

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

- Backend: `.env` file with MongoDB URI, JWT secret, etc.
- Frontend: `.env.local` with API URL

## Testing Strategy

- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Frontend component tests with React Testing Library

## Deployment

- **Frontend:** Vercel (recommended for Next.js)
- **Backend:** Any Node.js hosting (Heroku, AWS, DigitalOcean)
- **Database:** MongoDB Atlas (cloud) or self-hosted

## Future Enhancements

- Bibtex file upload and parsing
- Advanced search with filters
- User ratings and reviews
- Email notifications
- Admin dashboard
- Analytics and reporting
- API rate limiting
- Caching layer (Redis)
