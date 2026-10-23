# SubSense

SubSense is a SaaS subscription and expense analytics dashboard project for a college major project.

## Project structure

- `client/` - React + Vite frontend
- `server/` - Node.js + Express backend

## Technology stack

- Frontend: React.js + Vite
- Styling: Tailwind CSS
- Routing: React Router
- HTTP client: Axios
- Charts: Recharts
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT
- Password hashing: bcrypt/bcryptjs

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally on `mongodb://localhost:27017` or a MongoDB Atlas connection string

## Setup

1. Install dependencies in the frontend and backend.
2. Copy environment files and update values if needed.
3. Start MongoDB locally or provide a valid `MONGODB_URI`.
4. Start the backend and frontend.

## Environment files

### Frontend

Copy `client/.env.example` to `client/.env` if needed.

```bash
VITE_API_URL=http://localhost:5000/api
```

### Backend

Copy `server/.env.example` to `server/.env` if needed.

```bash
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/subsense
```

## Run the app

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev -- --host 0.0.0.0
```

## Verify

- Frontend should load at `http://localhost:5173`
- Backend should run at `http://localhost:5000`
- Health endpoint: `http://localhost:5000/api/health`

## Notes

This is the initial setup phase only. Authentication, subscriptions, analytics, and dashboard features are intentionally not implemented yet.
