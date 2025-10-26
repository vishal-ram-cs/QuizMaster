# QuizMaster – Learn & Excel
 create by vishal Ramanathan for naan mudhalvan project 
A modern, full-stack Quiz Management platform for students and teachers. Create, browse, take, and analyze quizzes in a clean SaaS-style dashboard.

- Frontend: React + Vite + Tailwind + React Router + Axios + Lucide + (optional) Framer Motion
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT (HttpOnly cookies) + bcrypt + express-validator
- Features: Auth with roles, quiz CRUD (teacher), attempts/results, leaderboard, analytics

---

## ✨ Features

Student portal
- Dashboard with stats and featured quizzes
- Browse available quizzes
- Take quizzes with timed duration
- View my results
- Leaderboard

Teacher tools
- Create quiz (category, difficulty, duration, pass %, questions with options)
- My quizzes (manage/edit/delete)
- Analytics (quick aggregates over attempts)

Security and DX
- JWT in HttpOnly cookies
- Password hashing with bcrypt
- AuthZ middleware for teacher-only routes
- Validation with express-validator
- CORS configured for client URL

---

## 🧱 Tech Stack

| Layer     | Tech                                                     |
|----------|-----------------------------------------------------------|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios, Lucide |
| Backend  | Node.js, Express, Mongoose, JWT, bcrypt, express-validator|
| DB       | MongoDB (Local, Docker, or MongoDB Atlas)                 |
| Tooling  | Node --watch or Nodemon, dotenv, Helmet, Morgan           |

---

## 📁 Monorepo Structure

```
quizmaster/
  client/                # React app (Vite)
    src/
      components/        # Sidebar, cards, protected route
      context/           # AuthContext (login/signup/me/logout)
      pages/             # Dashboard, Quizzes, Results, Leaderboard, Create, etc.
  server/                # Node/Express API
    src/
      config/            # db.js (Mongo connection)
      middleware/        # auth (JWT), roles (teacher)
      models/            # User, Quiz, Attempt (Mongoose)
      routes/            # auth, quizzes, attempts, leaderboard
      seed/seed.js       # sample users + quizzes
      index.js           # API entrypoint
```

---

## ✅ Prerequisites

- Node.js v18+ (v20 recommended)
- npm v9+
- One of:
  - Local MongoDB Server (Windows service)
  - OR Docker Desktop (to run a MongoDB container)
  - OR MongoDB Atlas (cloud connection string)

---

## 🚀 Quick Start (Local Dev)

1) Backend (API)
- Open a terminal:
  - cd server
  - npm install
  - Create .env (copy example below)
  - Start MongoDB:
    - Windows service: ensure MongoDB service is Running
    - OR Docker: docker run -d --name quizmongo -p 27017:27017 -v quizmongo_data:/data/db mongo:7
  - Seed the DB: npm run seed
  - Start API (auto-reload): npm run dev
  - API will run at http://localhost:5000

2) Frontend (Web)
- Open a second terminal:
  - cd client
  - npm install
  - Create .env (copy example below)
  - Start dev server: npm run dev
  - Open http://localhost:5173

3) Login (if seeded)
- Teacher: vishal@example.com / password123
- Student: student@example.com / password123

---

## 🔐 Environment Variables

Server (.env at server/.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/quizmaster   # or your Atlas URI
JWT_SECRET=change_me
CLIENT_URL=http://localhost:5173                  # must match the Vite URL
NODE_ENV=development
```

Client (.env at client/.env)
```
VITE_API_URL=http://localhost:5000
```

Notes
- For production with a separate frontend domain, set:
  - CLIENT_URL=https://your-frontend-domain
  - Use HTTPS and set cookies secure: true, sameSite: "none" in the backend auth route (already automatic when NODE_ENV=production).
- If you change Vite port, update CLIENT_URL and restart the server.

---

## 🧪 Seeding

Seeds a teacher, a student, and sample quizzes:
- cd server
- npm run seed

If you see ECONNREFUSED 127.0.0.1:27017:
- Ensure MongoDB is running locally or use Docker/Atlas (see prerequisites).

---

## 📜 Available Scripts

Server (run in server/)
- npm run dev — start API in watch mode (Node --watch or nodemon)
- npm run start — start API once
- npm run seed — seed DB with sample users and quizzes

Client (run in client/)
- npm run dev — start Vite dev server (default: http://localhost:5173)
- npm run build — production build
- npm run preview — serve the built app locally (default: http://localhost:4173)

---

## 🔗 API Overview

Base URL
- Local: http://localhost:5000

Auth
- POST /api/auth/signup
  - body: { name, email, password, role? "student"|"teacher" }
  - sets HttpOnly JWT cookie on success
- POST /api/auth/login
  - body: { email, password }
  - sets HttpOnly JWT cookie on success
- POST /api/auth/logout
  - clears cookie
- GET  /api/auth/me
  - returns current user from cookie

Quizzes
- GET  /api/quizzes
  - query: category?, difficulty?, limit?
  - returns quizzes without correct answers (sanitized)
- GET  /api/quizzes/:id
  - returns sanitized quiz (no correctIndex)
- GET  /api/quizzes/mine  (teacher only)
  - quizzes created by the authenticated teacher
- POST /api/quizzes       (teacher only)
  - body: { title, description, category, difficulty, duration, passPercent, questions[] }
- PUT  /api/quizzes/:id   (teacher only, owner)
- DELETE /api/quizzes/:id (teacher only, owner)

Attempts
- GET  /api/attempt/me
  - attempts by the current user
- POST /api/attempt
  - body: { quizId, answers [index per question], timeTaken? }
  - returns score, total, percentage, passed

Leaderboard
- GET /api/leaderboard?quizId?&limit?
  - best percentages grouped by user; optionally scoped to a quiz

Example curl (with cookie jar for HttpOnly cookie)
```
# signup
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","role":"student"}' \
  http://localhost:5000/api/auth/signup

# login
curl -i -c cookies.txt -b cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"vishal@example.com","password":"password123"}' \
  http://localhost:5000/api/auth/login

# get quizzes
curl -s -b cookies.txt http://localhost:5000/api/quizzes

# create quiz (teacher only)
curl -i -b cookies.txt -H "Content-Type: application/json" \
  -d '{"title":"Sample","category":"Programming","difficulty":"Easy","duration":15,"passPercent":60,"questions":[{"text":"2+2?","options":["3","4"],"correctIndex":1,"marks":1}]}' \
  http://localhost:5000/api/quizzes
```

---

## 🗂️ Data Models (Mongoose)

User
- name: String (required)
- email: String (unique, required)
- password: String (hashed)
- role: "student" | "teacher"
- timestamps

Quiz
- title: String (required)
- description: String
- category: String (required)
- difficulty: "Easy" | "Medium" | "Hard"
- duration: Number (minutes)
- passPercent: Number
- questions: [{ text, options [String], correctIndex, marks }]
- creator: ObjectId (User)
- timestamps

Attempt
- user: ObjectId (User)
- quiz: ObjectId (Quiz)
- answers: [Number] (index per question)
- score: Number
- total: Number
- percentage: Number
- passed: Boolean
- timeTaken: Number (seconds)
- timestamps

---

## 🖥️ Frontend Pages

- Login / Signup
- Dashboard
  - Welcome banner, stat cards, featured quizzes, quick actions
- Available Quizzes
- Take Quiz
- My Results
- Leaderboard
- Teacher: Create Quiz, My Quizzes, Analytics
- Sidebar with user profile and logout

Routing/Protection
- ProtectedRoute component:
  - Redirects to /login if not authenticated
  - Optional role prop for teacher-only pages

---

## 🔒 Auth & Security

- JWT stored in HttpOnly cookie to mitigate XSS token theft
- Cookie options:
  - HttpOnly: true
  - sameSite: "lax" in development; "none" in production (cross-site)
  - secure: true in production (HTTPS)
- Passwords hashed with bcrypt
- Auth middleware validates and attaches req.user
- Role guard middleware (teacher-only routes)
- Helmet for sensible headers
- CORS configured to CLIENT_URL with credentials: true

---

## 🛠️ Configuration Tips

- Always set CLIENT_URL to your frontend URL so CORS/cookies work.
- If you change Vite port, update CLIENT_URL and restart the API.
- Production domain:
  - Serve over HTTPS
  - NODE_ENV=production → cookies will be secure, sameSite=none
- Vite must use VITE_API_URL env to call your API origin.
- On Windows, ensure you run backend scripts from the server folder, not the repo root.

---

## 📦 Build & Deploy

Frontend
- Build: cd client && npm run build
- Preview locally: npm run preview (default http://localhost:4173)
- Deploy to Netlify/Vercel:
  - Set env: VITE_API_URL=https://your-api
  - Build command: npm run build
  - Output: dist

Backend
- Deploy to Render/Railway/Heroku or your VM
- Set env variables:
  - PORT (if needed)
  - MONGO_URI (Atlas recommended)
  - JWT_SECRET
  - CLIENT_URL (your deployed frontend URL)
  - NODE_ENV=production
- Ensure your platform sends cookies to/from the frontend domain (CORS + credentials)

---

## 🐳 Optional: Docker (example compose)

Copy to docker-compose.yml at repo root if you want all-in-one local setup.
```
version: "3.9"
services:
  mongo:
    image: mongo:7
    container_name: quizmongo
    ports:
      - "27017:27017"
    volumes:
      - quizmongo_data:/data/db

  server:
    build: ./server
    command: node --watch ./src/index.js
    env_file:
      - ./server/.env
    environment:
      - MONGO_URI=mongodb://mongo:27017/quizmaster
      - CLIENT_URL=http://localhost:5173
      - NODE_ENV=development
    ports:
      - "5000:5000"
    depends_on:
      - mongo

  client:
    build: ./client
    command: npm run dev
    environment:
      - VITE_API_URL=http://localhost:5000
    ports:
      - "5173:5173"
    depends_on:
      - server

volumes:
  quizmongo_data:
```
Note: You may want separate Dockerfiles for server/client or use dev containers. For prod, serve a static build.

---

## 🧰 Troubleshooting

- “Cannot find module .../src/index.js”
  - Run npm commands from server/ (not repo root).
  - Ensure server/package.json exists with scripts.
  - Avoid a nodemon.json at repo root (only inside server).
  - As a last resort on Windows, use absolute paths in scripts:
    - "dev": "node --watch \"%cd%\\src\\index.js\""

- “nodemon not recognized”
  - npm i -D nodemon (in server/)
  - Or use node --watch instead of nodemon

- Signup failed
  - Password must be 6+ chars
  - Email unique
  - Client should display express-validator messages (already handled)

- Cookies not set (after login)
  - Axios must use withCredentials (already true)
  - Server CLIENT_URL must match the actual Vite URL
  - Restart server after changing env

- MongoDB connection error (ECONNREFUSED)
  - Start local service (or Docker/Atlas)
  - Test: Test-NetConnection 127.0.0.1 -Port 27017 (Windows)

- Notepad can’t create .env
  - Use quotes and “All files (*.*)” when saving: ".env"
  - Or create with PowerShell/VS Code

---

## 🗺️ Roadmap (ideas)

- Quiz editing UI
- Timers and autosave for attempts
- Richer analytics (per-question accuracy, trends)
- Pagination and search filters
- Rate limiting, account verification, password reset
- File/image uploads for questions

---

## 🤝 Contributing

- Fork, create a feature branch, open a PR
- Please include clear descriptions and test your changes locally

---

## 📝 License

MIT — free to use, modify, and distribute.

---

If you want, I can generate a tailored README with your deployment URLs and environment specifics, or add a Postman collection.
