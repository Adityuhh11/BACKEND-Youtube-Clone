# 🚀 YouTube Clone — Backend (Node.js · Express · MongoDB)

> A simple, backend for a YouTube-style app (Practice project)

---

### Highlights
- ✅ JWT-based auth with access + refresh tokens  
- ✅ Secure password hashing with `bcrypt`  
- ✅ Cloud media storage (Cloudinary) + `multer` upload flow  
- ✅ Clear API contract via `ApiResponse` / `ApiError` patterns  
- ✅ MongoDB models for Users, Subscriptions, Videos (extensible)  
- ✅ Middleware-friendly (auth, rate-limiting, validation-ready)

---

## Table of contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment (.env) Example](#environment-env-example)  
- [Scripts](#scripts)  
- [Folder Structure](#folder-structure)  


---

## Features
- **Secure user auth** — register / login / logout flows, password hashing, role-ready.  
- **JWT access + refresh tokens** with middleware `VerifyJWT` for protected routes.  
- **Cloud media** — Cloudinary integration for avatars, covers, and video thumbnails.  
- **Efficient uploads** — `multer` for temporary uploads + cleanup to avoid disk bloat.  
- **Subscription model** — many-to-many relationships so users can subscribe to channels.  
- **Consistent API responses** — `ApiResponse` / `ApiError` classes for predictable client handling.  
- **Async safety** — `asyncHandler` to centralize async error bubbling.  
- **Extensible** — add streaming, comments, likes/dislikes, analytics easily.

---

## Tech stack
- **Runtime:** Node.js  
- **Web framework:** Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Auth:** JWT, bcrypt  
- **File uploads:** multer → Cloudinary  
- **Config:** dotenv  

---

## Getting started

### Requirements
- Node.js (>= 18 recommended)  
- npm or yarn  
- MongoDB instance / Atlas  
- Cloudinary account (for uploads)

### Quickstart
```bash
# clone
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_NAME>

# install
npm install

# run (production)
npm start

# run (dev - auto reload)
npm run dev
```

Server runs by default at `http://localhost:8000` (if `PORT=8000`).

---

## Environment (`.env`) example
Create a `.env` file in the project root with the following (don't commit this):

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/your-db?retryWrites=true&w=majority
CORS_ORIGIN=*            # refine for prod
ACCESS_TOKEN_SECRET=<a-long-random-string>
REFRESH_TOKEN_SECRET=<another-long-random-string>

CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# optional
NODE_ENV=development
```

> Tip: use a secrets manager in production (AWS Secrets Manager / Azure Key Vault / GitHub Secrets).

---

## Scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "lint": "eslint . --fix",
    "test": "jest --runInBand"
  }
}
```

---

## API Endpoints (examples)
> These are example routes — update them to match your actual router files.

### Auth
- `POST /api/v1/users/register` — Register new user  
  Request: `{ "username", "email", "password" }`  
  Response: `ApiResponse` with `accessToken`, `refreshToken`, `user`

- `POST /api/v1/users/login` — Login  
  Request: `{ "email", "password" }`

- `POST /api/v1/users/logout` — Logout (secure route)

### User
- `GET /api/v1/users/me` — Get current user (secure)
- `POST /api/v1/users/update/avatar` — Update avatar (secure, file upload)
- `PUT /api/v1/users/:id` — Update user profile (secure)

### Subscriptions
- `POST /api/v1/subscriptions/:channelId` — Subscribe to a channel (secure)
- `DELETE /api/v1/subscriptions/:channelId` — Unsubscribe (secure)
- `GET /api/v1/subscriptions/:userId` — Get subscriptions for user

### Example cURL (login)
```bash
curl -X POST http://localhost:8000/api/v1/users/login   -H "Content-Type: application/json"   -d '{"email":"you@example.com","password":"password123"}'
```


## Folder structure (recommended)
```
src/
├─ controllers/
├─ routes/
├─ models/
├─ middlewares/
│  ├─ auth.js         # VerifyJWT
│  └─ asyncHandler.js
├─ services/
│  └─ cloudinaryService.js
├─ utils/
│  ├─ ApiResponse.js
│  └─ ApiError.js
├─ config/
│  └─ db.js
└─ server.js
```

---

## Security & best practices
- **Never commit `.env`** — add it to `.gitignore`.  
- **Hash & salt passwords** with `bcrypt` (use a proper salt rounds count).  
- **Rotate secrets** periodically.  
- **Validate & sanitize** request payloads (use `Joi` or `express-validator`).  
- **Rate limit** authentication endpoints (e.g., `express-rate-limit`) to reduce brute force risk.  
- **Content type checks** for uploads. Limit allowed file sizes & types.  
- **Use HTTPS** in production, and set secure cookie flags for tokens if storing them in cookies.

---

## Contributing
Love contributions. Quick guide:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/awesome`
3. Code, add tests, run linter
4. Open a PR with a clear description and relevant tests

Please follow the repo’s code style and include tests for new functionality.


## Contact
Created by **Aditya**

- Email: `saipremaditya@gmail.com`  
- GitHub: `github.com/Adityuhh11/`

