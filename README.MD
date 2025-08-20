# 🚀 YouTube Clone — Backend (Node.js · Express · MongoDB)

> A full-featured backend for a YouTube-style application with user authentication, video management, and social features.

---

### Highlights
- ✅ JWT-based authentication with access + refresh tokens  
- ✅ Secure password hashing with `bcrypt`  
- ✅ Cloud media storage (Cloudinary) with `multer` for file uploads  
- ✅ RESTful API with consistent response patterns  
- ✅ Comprehensive MongoDB models (Users, Videos, Comments, Subscriptions, etc.)  
- ✅ Pagination support for large datasets
- ✅ Middleware for authentication and request validation
- ✅ Health check endpoint for monitoring

---

## Table of Contents
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)  
- [Project Structure](#project-structure)
- [Security & Best Practices](#security--best-practices)
- [Contributing](#contributing)
- [Contact](#contact)


---

## Features

### User Authentication
- Register, login, and logout functionality
- Email/password authentication with JWT
- Password reset flow
- Protected routes with JWT verification

### Video Management
- Upload and stream videos
- Video thumbnails and metadata
- Video search and filtering
- Video categorization and tags

### Social Features
- User subscriptions and channel following
- Like/dislike videos
- Comment system with replies
- User playlists

### Content Interaction
- Like/Dislike videos and comments
- Comment threading and replies
- View counting and engagement metrics

### User Experience
- User profiles with avatars
- Dashboard with user activity
- Subscription feed
- Watch history

---

## Tech Stack

### Core
- **Runtime:** Node.js (ES Modules)
- **Web Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, bcrypt

### File Handling
- **Uploads:** multer
- **Cloud Storage:** Cloudinary
- **File Processing:** Built-in streams

### Development
- **Environment Management:** dotenv
- **Code Formatting:** Prettier
- **Development Server:** nodemon

### API Features
- **Pagination:** mongoose-paginate-v2
- **CORS:** cors middleware
- **Request Parsing:** express.json, express.urlencoded

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account (for media storage)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Adityuhh11/backend-js.git
   cd backend-js
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:8000` by default.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
CORS_ORIGIN=*  # In production, replace with your frontend URL

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-db?retryWrites=true&w=majority

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Security Note:** Never commit the `.env` file. It's already included in `.gitignore`.
> For production, consider using a secrets manager like AWS Secrets Manager or environment variables in your hosting platform.

---

## Scripts

Available npm scripts in the project:

- `npm run dev` - Start the development server with hot-reload
- `npm start` - Start the production server (not configured by default)
- `npm run format` - Format code using Prettier
- `npm run lint` - Lint the codebase (ESLint configuration needed)
- `npm test` - Run tests (test setup needed)

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/me` - Get current user profile

### Videos
- `GET /api/v1/videos` - Get all videos (with pagination)
- `POST /api/v1/videos` - Upload a new video
- `GET /api/v1/videos/:videoId` - Get video details
- `PATCH /api/v1/videos/:videoId` - Update video details
- `DELETE /api/v1/videos/:videoId` - Delete a video

### Comments
- `GET /api/v1/comments/video/:videoId` - Get comments for a video
- `POST /api/v1/comments` - Add a comment
- `DELETE /api/v1/comments/:commentId` - Delete a comment

### Likes
- `POST /api/v1/likes/toggle/v/:videoId` - Toggle like on a video
- `POST /api/v1/likes/toggle/c/:commentId` - Toggle like on a comment

### Subscriptions
- `POST /api/v1/subscription/:channelId` - Subscribe to a channel
- `DELETE /api/v1/subscription/:channelId` - Unsubscribe from a channel
- `GET /api/v1/subscription/subscribed-to` - Get channels user is subscribed to
- `GET /api/v1/subscription/subscribers` - Get channel's subscribers

### Playlists
- `POST /api/v1/playlist` - Create a new playlist
- `GET /api/v1/playlist/user/:userId` - Get user's playlists
- `GET /api/v1/playlist/:playlistId` - Get playlist details
- `PATCH /api/v1/playlist/:playlistId` - Update playlist
- `DELETE /api/v1/playlist/:playlistId` - Delete playlist
- `POST /api/v1/playlist/add/:videoId/:playlistId` - Add video to playlist
- `DELETE /api/v1/playlist/remove/:videoId/:playlistId` - Remove video from playlist

### User Dashboard
- `GET /api/v1/dashboard/stats` - Get user dashboard statistics
- `GET /api/v1/dashboard/videos` - Get user's uploaded videos
- `GET /api/v1/dashboard/history` - Get user's watch history

### Health Check
- `GET /api/v1/healthcheck` - API health status

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


## Project Structure

```
src/
├── config/               # Configuration files
│   └── db.js            # Database connection
│
├── controllers/          # Route controllers
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── subscription.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── dashboard.controller.js
│   └── healthcheck.controller.js
│
├── middlewares/          # Custom middleware
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── models/               # Database models
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── subscription.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   └── tweet.model.js
│
├── routes/               # API routes
│   ├── user.routes.js
│   ├── video.routes.js
│   ├── comment.routes.js
│   ├── subscription.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── dashboard.routes.js
│   └── healthcheck.routes.js
│
├── utils/                # Utility functions
│   └── constants.js
│
├── app.js               # Express app configuration
└── index.js             # Application entry point
```

---

## Security & Best Practices

### Authentication & Authorization
- All sensitive routes are protected with JWT authentication
- Passwords are hashed using bcrypt with proper salting
- Refresh token rotation for enhanced security
- Role-based access control (RBAC) ready

### Data Protection
- Request validation for all incoming data
- Input sanitization to prevent XSS attacks
- Secure file upload handling with file type and size restrictions
- NoSQL injection prevention through Mongoose schema validation

### API Security
- CORS configured to restrict cross-origin requests
- Rate limiting on authentication endpoints
- CSRF protection via same-site cookies
- Security headers (helmet) for production

### Best Practices
- Environment-based configuration
- Centralized error handling
- Request validation middleware
- Proper logging and monitoring setup
- Regular dependency updates

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

