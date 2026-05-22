# Tasko — Full Stack MERN Todo App

A production-grade Todo application built with MongoDB, Express, React, and Node.js.

## ✨ Features

1. **Full CRUD** — Create, Read, Update, Delete tasks
2. **Priority Levels** — High / Medium / Low with color-coded badges
3. **Categories & Due Dates** — Organize tasks by category and track deadlines
4. **Smart Filters** — Filter by status (All / Pending / Completed), priority, and sort by date/priority/name
5. **Live Search** — Instant search across title and description
6. **Stats Dashboard** — Total, completed, pending, overdue counters + completion progress bar
7. **Optimistic UI** — Instant checkbox toggle feedback without loading states
8. **Clear Completed** — Bulk delete all completed tasks

## 🗂️ Folder Structure

```
todo-app/
├── package.json              # Root - runs both server & client
├── server/
│   ├── index.js              # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   └── Todo.js           # Mongoose schema
│   ├── routes/
│   │   └── todos.js          # All REST API routes
│   └── middleware/
│       └── errorHandler.js   # Global error handler
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── context/
        │   └── TodoContext.jsx   # Global state (React Context)
        ├── components/
        │   ├── StatsBar.jsx
        │   ├── AddTodoForm.jsx
        │   ├── FilterControls.jsx
        │   ├── TodoList.jsx
        │   ├── TodoItem.jsx
        │   └── EditModal.jsx
        └── utils/
            └── api.js            # Axios instance + API methods
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/todo-app.git
cd todo-app

# 2. Install all dependencies
npm run install-all

# 3. Setup environment variables
cp server/.env.example server/.env
# Edit server/.env and set your MONGODB_URI

# 4. Run development servers
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoapp
NODE_ENV=development
```

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos (supports ?status, ?priority, ?search, ?sortBy) |
| GET | /api/todos/stats | Get statistics |
| GET | /api/todos/:id | Get single todo |
| POST | /api/todos | Create todo |
| PUT | /api/todos/:id | Update todo |
| PATCH | /api/todos/:id/toggle | Toggle completed |
| DELETE | /api/todos/:id | Delete todo |
| DELETE | /api/todos | Delete all completed todos |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Context |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| HTTP | Axios |
| Validation | express-validator |
| Toasts | react-hot-toast |
| Dates | date-fns |
