# DAY-FLOW-X

**DAY-FLOW-X** is a professional, full-stack intelligent productivity and daily life management platform designed to help users structure their schedules, trace daily focus sessions, set long-term goals, and visualize their productivity analytics.

---

## 1. Problem Statement
In today's fast-paced digital world, users struggle with fragmented productivity tooling. Having tasks in one app, time blocking in another, a Pomodoro timer in a third, and no consolidated view of how their focus correlates to completion makes tracking performance tedious and inefficient.

## 2. Solution
**DAY-FLOW-X** solves this fragmentation by offering a single unified database and dashboard. It syncs scheduled tasks, daily calendar time blocks, Pomodoro focus sessions, achievements, and goals, and aggregates them into visually appealing analytics charts.

---

## 3. Technology Stack

### Frontend
- **React.js & Vite:** Core rendering engine and rapid dev environment.
- **Tailwind CSS (v4.0):** Modern styling framework.
- **React Router Dom:** SPA navigation layout routing.
- **Lucide React:** Iconography.
- **Recharts:** Interactive data visualization curves and pie charts.
- **Context API:** Global state management for authentication and tasks.

### Backend
- **Node.js & Express.js:** Fast, minimalist backend web framework.
- **JWT (JSON Web Tokens):** Secure session credentials token.
- **Bcrypt.js:** Safe hashing for user passwords.

### Database
- **SQLite:** Lightweight, disk-persistent SQL database.
- **Prisma ORM:** Modern database access, schemas, and migrations.

---

## 4. Platform Features
- **Modern SaaS Dashboard:** Clean layouts with completion gauges, daily logs, streaks, and a quick task creation form.
- **Task Workspace:** Full task tracker offering toggles between List View and Kanban Board columns with filters.
- **Daily Time Planner:** Schedule tasks into hourly time blocks from 7:00 AM to 10:00 PM.
- **Pomodoro Focus Timer:** 25-minute focus cycles with automatic focus logs synced to the backend SQLite DB.
- **Milestones & Goals:** Set numerical goals (e.g. complete 100 modules) and adjust progress bars.
- **Live Notifications:** Stay updated on task schedules, streak achievements, and Pomodoro focus completes.

---

## 5. Folder Structure
```
DAY-FLOW-X/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Layouts, Navbar sidebar wrappers
│   │   ├── pages/            # Dashboard, Focus, Analytics, Goals, etc.
│   │   ├── context/          # AuthContext, TaskContext providers
│   │   ├── services/         # Centralized api.js service calls
│   │   ├── App.jsx           # Routing mapping
│   │   ├── main.jsx          # Entry point mounting
│   │   └── index.css         # Tailwind stylesheets
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma database schemas
│   │   └── dev.db            # SQLite database file
│   ├── src/
│   │   ├── middleware/       # JWT Authentication checks
│   │   ├── routes/           # Auth, Tasks, Analytics, Goals routers
│   │   ├── db.js             # DB client singleton
│   │   └── server.js         # API entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 6. Installation & Local Setup

### Prerequisite
Ensure [Node.js (v18+)](https://nodejs.org/) and npm are installed on your machine.

### Clone the Repository
```bash
git clone https://github.com/thamil06/DAY-FLOW-X.git
cd DAY-FLOW-X
```

### 1. Database & Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables. Rename `.env.example` to `.env` or create it manually:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="replace-with-a-secure-random-key"
   ```
4. Push the database schema and generate Prisma client:
   ```bash
   npx prisma db push
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server runs at: `http://localhost:5000`*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client app runs at: `http://localhost:5173`*

---

## 7. API Endpoints

### Authentication
- `POST /api/auth/register` - Create user. Returns JWT token and user info.
- `POST /api/auth/login` - Authenticate user credentials. Returns JWT.
- `GET /api/auth/me` - Fetch profile of logged-in user.

### Tasks
- `GET /api/tasks` - Get all tasks. Supports optional status/priority/category/date filters.
- `POST /api/tasks` - Create a task.
- `PUT /api/tasks/:id` - Edit task details or status.
- `DELETE /api/tasks/:id` - Delete task.

### Goals
- `GET /api/goals` - Fetch user goals.
- `POST /api/goals` - Create a new goal.
- `PUT /api/goals/:id` - Update goal progress or title.
- `DELETE /api/goals/:id` - Delete goal.

### Analytics
- `GET /api/analytics/summary` - Get total tasks, completion rates, streaks, and focus hours.
- `GET /api/analytics/weekly` - Weekly trend counts.
- `GET /api/analytics/categories` - Categories distribution stats.
- `POST /api/analytics/focus` - Increments logged focus minutes for the day.

### Notifications
- `GET /api/notifications` - Get user alerts.
- `PUT /api/notifications/:id/read` - Mark notification as read.
- `PUT /api/notifications/read-all` - Mark all notifications as read.
- `DELETE /api/notifications/:id` - Delete notification.

---

## 8. Future Enhancements
- **Intelligent Focus Soundscapes:** Integrated ambient sounds (white noise, rain, lofi).
- **Group Collaborations:** Team task channels and collective focus challenges.
- **Calendar Integrations:** Sync with Google Calendar, Outlook, and Apple Calendar.

## 9. Contributors
- [Thamil](https://github.com/thamil06) - Lead Developer & Architect.
