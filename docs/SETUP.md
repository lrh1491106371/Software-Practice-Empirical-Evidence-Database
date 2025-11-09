# SPEED Setup Guide

This guide will help you set up and run the SPEED project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm/yarn
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "Software Practice Empirical Evidence Database"
```

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/speed
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Important:**

- For local MongoDB: Use `mongodb://localhost:27017/speed`
- For MongoDB Atlas: Use your connection string from Atlas dashboard
- Change `JWT_SECRET` to a secure random string in production

### 2.3 Start MongoDB

**Local MongoDB:**

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas:**

- No local setup needed, just use your connection string

### 2.4 Run Backend

```bash
npm run start:dev
```

The backend should now be running on `http://localhost:3001`

## Step 3: Frontend Setup

### 3.1 Install Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3.3 Run Frontend

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## Step 4: Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the SPEED homepage
3. Try registering a new user
4. Try logging in with your credentials

## Step 5: Create Admin User (Optional)

To create an admin user, you can either:

### Option A: Using MongoDB Shell

```bash
mongosh speed
```

Then run:

```javascript
db.users.insertOne({
  email: "admin@example.com",
  password: "$2b$10$YourHashedPasswordHere", // Use bcrypt to hash
  firstName: "Admin",
  lastName: "User",
  roles: ["admin"],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### Option B: Using the API

1. Register a user through the frontend
2. Connect to MongoDB and manually update the user's roles:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { roles: ["admin"] } }
);
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**

- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For Atlas, ensure your IP is whitelisted

**Port Already in Use:**

- Change `PORT` in `.env` to a different port
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**JWT Errors:**

- Ensure `JWT_SECRET` is set in `.env`
- Clear browser localStorage if experiencing auth issues

### Frontend Issues

**API Connection Error:**

- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

**Build Errors:**

- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Development Workflow

### Running Both Services

**Terminal 1 (Backend):**

```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

### Making Changes

- Backend changes are automatically reloaded (watch mode)
- Frontend changes are hot-reloaded by Next.js
- Restart servers if you modify environment variables

## Next Steps

1. Review the [Architecture Documentation](./ARCHITECTURE.md)
2. Check the [Iteration Plan](./ITERATION_PLAN.md)
3. Start implementing features according to your iteration plan

## Production Deployment

### Backend

- Set `NODE_ENV=production`
- Use a secure `JWT_SECRET`
- Configure proper CORS origins
- Use MongoDB Atlas or managed MongoDB service
- Set up process manager (PM2, systemd, etc.)

### Frontend

- Build: `npm run build`
- Start: `npm start`
- Deploy to Vercel (recommended) or any Node.js hosting

## Support

For issues or questions:

1. Check the documentation in `/docs`
2. Review error logs in console
3. Check MongoDB connection and data
