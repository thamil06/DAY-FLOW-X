# DAY-FLOW-X

DAY-FLOW-X is a full-stack productivity and daily life management platform that combines task management, a daily planner, Pomodoro focus sessions, goals, and analytics.

---

## 1. Problem Statement

In today's fast-paced digital world, users struggle with fragmented productivity tools. Having tasks in one app, time blocking in another, a Pomodoro timer in a third, and no consolidated view of how focus correlates to task completion makes tracking performance tedious and inefficient.

## 2. Solution

**DAY-FLOW-X** solves this fragmentation by offering a single unified database and dashboard. It synchronizes scheduled tasks, daily calendar time blocks, Pomodoro focus sessions, achievements, and goals, and presents them through visually appealing analytics charts.

---

## 3. Technology Stack

### Frontend

- **React.js & Vite** - Core rendering engine and rapid development environment.
- **Tailwind CSS** - Modern styling framework.
- **React Router DOM** - SPA navigation and routing.
- **Lucide React** - Iconography.
- **Recharts** - Interactive data visualization.
- **Context API** - Global state management for authentication and tasks.

### Backend

- **Node.js & Express.js** - Backend web framework.
- **JWT** - Authentication and secure session tokens.
- **Bcrypt.js** - Password hashing.

### Database

- **SQLite** - Lightweight local SQL database.
- **Prisma ORM** - Database schema management and data access.

---

## 4. Platform Features

- **Modern SaaS Dashboard** - Completion gauges, daily logs, streaks, and quick task creation.
- **Task Workspace** - Task management with List View and Kanban Board.
- **Daily Time Planner** - Schedule tasks into hourly time blocks from 7:00 AM to 10:00 PM.
- **Pomodoro Focus Timer** - 25-minute focus cycles with focus logs.
- **Milestones & Goals** - Create goals and track progress.
- **Live Notifications** - Task reminders, achievements, and focus completion notifications.
- **Productivity Analytics** - Visualize task completion and productivity trends.

---

## 5. Folder Structure

```text
DAY-FLOW-X/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── db.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── README.md
└── .gitignore