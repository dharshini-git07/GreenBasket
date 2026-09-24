# GreenBasket 🌱 — Shop Better. Live Greener.

> Production-quality, AI-enhanced sustainable e-commerce website.

## 🚀 Module 1 — Foundation & Authentication

Module 1 sets up the complete full-stack architecture, design system, database connections, and authentication workflow.

### 🌟 Key Features Built in Module 1:
- **Frontend Stack**: React 18 (Vite), Tailwind CSS v4, React Router v6, Axios, Firebase Web SDK.
- **Backend Stack**: Express REST API, Mongoose, Firebase Admin SDK, CORS, Centralized Error Handler.
- **Design System**: Modern Minimal Eco-Commerce theme with custom colors (`#2E7D32` primary green, `#1B4332` dark green, `#E8F5E9` light green, `#F8FAF8` background), Poppins typography, responsive layout system.
- **Authentication System**:
  - Firebase Email/Password Register & Login.
  - Google Sign-In authentication.
  - Automatic MongoDB User record synchronization upon login/register.
  - AuthContext provider handling persistent login states.
  - Protected Route guards (`/profile`).
- **Database**: MongoDB Atlas schema for Users with role management (`user`, `admin`).
- **Storage Foundation**: Firebase Storage initialized for future product imagery.

---

## 🛠 Project Structure

```
GreenBasket/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── assets/         # Static visual assets & logos
│   │   ├── components/     # Reusable UI components (Navbar, Footer, UI cards)
│   │   ├── context/        # AuthContext for global user state
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   ├── layouts/        # Root Layout wrapper
│   │   ├── pages/          # Home, Login, Register, Profile pages
│   │   ├── routes/         # Protected & Public route guards
│   │   ├── services/       # Firebase & Axios API integration
│   │   ├── utils/          # Helper utilities
│   │   ├── App.jsx         # Main router setup
│   │   └── main.jsx        # App entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                 # Express + Node.js Backend API
│   ├── config/             # DB connection (MongoDB Atlas) & Firebase config
│   ├── controllers/        # User sync & Auth controllers
│   ├── middleware/         # Auth verification & Centralized Error Middleware
│   ├── models/             # Mongoose schemas (User Model)
│   ├── routes/             # REST API Endpoints (/api/health, /api/users)
│   ├── services/           # Backend services
│   ├── server.js           # Server entry point
│   └── package.json
│
├── .gitignore
├── package.json            # Root scripts runner
└── README.md
```

---

## ⚙️ Environment Configuration

### Client (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/greenbasket?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

---

## ⚡ Quick Start

1. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Run Backend Development Server**:
   ```bash
   npm run dev:server
   ```
   *Health check available at:* `http://localhost:5000/api/health`

3. **Run Frontend Development Server**:
   ```bash
   npm run dev:client
   ```
   *App running at:* `http://localhost:5173`
