# 🎓 CampusConnect

A **modern campus social media platform** built for real-time communication and expressive interactions within campus communities.
It features **profiles, posts with media, likes, comments, real-time chat, notifications**, and **secure JWT authentication** — all wrapped in a sleek, minimal UI.

---

## ✨ Key Features

* 🔐 **User Authentication:** Register/login with JWT
* 👤 **Profiles:** Create and edit user profiles
* 📝 **Posts:** Text and media (image/video) uploads
* ❤️ **Likes & Comments:** Interact with posts
* 👥 **Follow System:** Follow/unfollow & discover users
* 💬 **Real-Time Chat:** One-to-one messaging via WebSocket
* 🔔 **Live Notifications:** Likes, comments, follows, and messages
* ☁️ **Media Uploads:** Cloudinary integration
* 🎨 **Frontend:** TypeScript + Vite + Tailwind + shadcn-ui

---

## 🏗 Architecture Overview

CampusConnect is a **full-stack project** split into:

* **Backend (Node.js + Express)**
  Handles APIs, authentication, database, WebSockets, media uploads, and business logic.

* **Frontend (React + TypeScript + Vite)**
  Manages UI, routing, WebSocket connections, and API communication.

Both reside in the same repo:

```
backend/
Frontend/
```

---

## 📂 Folder Structure (High-Level)

### 🧱 Backend

```
backend/
│ app.js, server.js           → Express setup & server entry
│ package.json                → Backend dependencies
│
├─ config/
│   ├─ db.js                  → MongoDB connection
│   └─ cloudinaryConfig.js    → Cloudinary media setup
│
├─ controllers/               → Core request handlers (auth, user, post, message, etc.)
├─ middleware/                → Auth (JWT) & upload (multipart) middleware
├─ models/                    → Mongoose schemas (User, Post, Message, Notification)
├─ routes/                    → Route definitions (auth, user, post, message, search...)
├─ services/                  → Business logic (userService, postService, etc.)
├─ sockets/                   → WebSocket handlers (socket.js, notificationSocket.js)
└─ utils/                     → Helper utilities (encryption, validation)
```

### 💻 Frontend

```
Frontend/
│ package.json                → Frontend dependencies
│
└─ src/
    ├─ api/                   → API wrappers (auth.ts, post.ts, user.ts, chat.ts, notification.ts)
    ├─ components/            → Reusable components + UI system (shadcn-ui)
    ├─ hooks/                 → Custom hooks (use-mobile, use-toast)
    ├─ layouts/               → AuthLayout, MainLayout
    ├─ lib/                   → Socket client & helpers
    ├─ pages/                 → Feed, Chat, Discover, Notifications, Profile, Auth
    ├─ routes/                → AppRouter & AuthRoute
    ├─ styles/ & theme/       → Tailwind and theme setup
```

---

## ⚙️ Backend — Technical Notes

* **API Organization:** Routes → Controllers → Services
* **Authentication:** JWT tokens handled by `authMiddleware.js`
* **Media Uploads:** Via Cloudinary (`cloudinaryConfig.js`, upload middleware)
* **Real-Time Features:** Socket.io-based chat & notifications under `sockets/`
* **Database:** MongoDB connection in `config/db.js`; models in `models/`

### API Groups

| Route Base           | Description                                      |
| -------------------- | ------------------------------------------------ |
| `/api/auth`          | Register, login, refresh token, logout           |
| `/api/users`         | Profile management, follow/unfollow, suggestions |
| `/api/posts`         | CRUD posts, feed, like/unlike, comments          |
| `/api/messages`      | Real-time messaging (socket + persistence)       |
| `/api/notifications` | List & mark notifications                        |
| `/api/search`        | Search users/posts                               |

---

## 💡 Frontend — Technical Notes

* Built with **Vite + React + TypeScript**
* UI powered by **Tailwind CSS** and **shadcn-ui**
* Client APIs (`src/api/*`) encapsulate all backend requests
* WebSocket client setup in `src/lib/socket.ts` for chat & notifications
* Clean component architecture with layouts and hooks for responsive design

---

## 🔑 Environment Variables

### 🧩 Backend (`backend/.env`)

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

### 🌐 Frontend (`Frontend/.env`)

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

💡 Add a `.env.example` file listing variable names (without secrets) for contributors.

---

## 🧪 Run Locally (Development)

Open two terminals:

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd Frontend
npm install
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.
Ensure backend `CLIENT_URL` and socket origins match frontend URL.

---

## 🧹 Testing & Code Quality

* Currently no automated tests (recommended: Jest/Mocha + React Testing Library)
* Add **ESLint** and **Prettier** for consistent formatting

---

## ☁️ Deployment Guide

| Component      | Recommended Host                            |
| -------------- | ------------------------------------------- |
| **Frontend**   | Vercel, Netlify (static build from `dist/`) |
| **Backend**    | Render, Railway, VPS (use pm2 or Docker)    |
| **Database**   | MongoDB Atlas                               |
| **Media**      | Cloudinary                                  |
| **WebSockets** | Use Redis adapter for multi-instance setups |

---

## 🔒 Security Guidelines

* Never commit `.env` or secrets (JWT, Cloudinary keys)
* Use HTTPS in production
* Sanitize user input (server & client)
* Validate request payloads and enforce auth middleware

---

## 🧭 Developer Quick Reference

| Area                      | File(s)                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| **Server entry**          | `backend/server.js`, `backend/app.js`                                    |
| **DB config**             | `backend/config/db.js`                                                   |
| **Auth logic**            | `backend/controllers/authController.js`, `middleware/authMiddleware.js`  |
| **Post logic**            | `backend/controllers/postController.js`, `services/postService.js`       |
| **Sockets**               | `backend/sockets/socket.js`, `socketHandler.js`, `notificationSocket.js` |
| **Frontend routes/pages** | `Frontend/src/pages/`, `Frontend/src/routes/`                            |
| **Client APIs**           | `Frontend/src/api/`                                                      |
