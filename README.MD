# 🚀 YouTube Clone — Backend (Node.js · Express · MongoDB)

> A full-featured backend for a YouTube-style application with user authentication, video management, and social features.


### Highlights
- ✅ JWT-based authentication with access + refresh tokens  
- ✅ Secure password hashing with `bcrypt`  
- ✅ Cloud media storage (Cloudinary) with `multer` for file uploads  
- ✅ Video transcoding with background workers for optimized streaming
- ✅ **Advanced video search & indexing** with MongoDB text search
- ✅ **Multi-resolution video support** with automatic transcoding
- ✅ **Intelligent video filtering** by title, description, views, and date
- ✅ RESTful API with consistent response patterns  
- ✅ Comprehensive MongoDB models with optimized indexing
- ✅ Advanced pagination with MongoDB aggregation pipelines
- ✅ Background job processing with BullMQ and Redis
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
- **Smart Video Upload** with automatic file validation and processing
- **Multi-Resolution Transcoding** - Automatic conversion to 360p, 720p, 1080p
- **Advanced Search Engine** - Full-text search across titles and descriptions
- **Intelligent Filtering** - Sort by views, upload date, duration, and relevance
- **MongoDB Text Indexing** - Optimized search performance with compound indexes
- **Video Analytics** - View counting, engagement metrics, and performance tracking
- **Thumbnail Management** - Automatic thumbnail generation and cloud storage
- **Publication Control** - Draft/published status with visibility management

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
- **Video Transcoding:** FFmpeg
- **Background Jobs:** BullMQ, Redis

### Development
- **Environment Management:** dotenv
- **Code Formatting:** Prettier
- **Development Server:** nodemon

### API Features
- **Advanced Pagination:** MongoDB aggregation pipelines with mongoose-paginate-v2
- **Full-Text Search:** MongoDB text indexes for lightning-fast video discovery
- **Smart Filtering:** Multi-criteria sorting and filtering capabilities
- **Background Processing:** BullMQ with Redis for video transcoding queues
- **CORS:** cors middleware with configurable origins
- **Request Parsing:** express.json, express.urlencoded with file upload support

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- MongoDB instance (local or MongoDB Atlas) with text search support
- Redis server (for background job processing)
- Cloudinary account (for media storage)
- FFmpeg (for video transcoding - auto-installed with dependencies)

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

# Redis Configuration (Required for video processing)
REDIS_URI=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
REDIS_PORT=6379

# JWT Token Expiry
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

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
- `npm run queue:listen` - Start the video transcoding queue listener

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/me` - Get current user profile

### Videos
- `GET /api/v1/videos/getVideos` - Get all videos with advanced search & filtering
  - Query params: `page`, `limit`, `query`, `sortBy`, `sortType`, `userId`
  - Supports full-text search across titles and descriptions
  - Sort by: views, createdAt, duration (asc/desc)
- `POST /api/v1/videos/videoupload` - Upload a new video with thumbnail
- `GET /api/v1/videos/Video/:videoId` - Get video details with owner info
- `POST /api/v1/videos/updateVideo/:videoId` - Update video title and description
- `POST /api/v1/videos/updateThumbnail/:videoId` - Update video thumbnail
- `POST /api/v1/videos/updatePublication/:videoId` - Toggle publication status
- `POST /api/v1/videos/deleteVideo/:videoId` - Delete video and associated files

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

## 🔍 Advanced Search & Indexing Features

### MongoDB Text Search
- **Full-text indexing** on video titles and descriptions
- **Case-insensitive search** with regex pattern matching
- **Compound indexes** for optimized query performance
- **Search relevance scoring** for better result ranking

### Smart Video Filtering
```javascript
// Example API call with search and filtering
GET /api/v1/videos/getVideos?query=javascript&sortBy=views&sortType=desc&page=1&limit=10
```

**Supported Query Parameters:**
- `query` - Search term for title/description matching
- `sortBy` - Sort field: `views`, `createdAt`, `duration`
- `sortType` - Sort order: `asc` or `desc`
- `page` - Page number for pagination
- `limit` - Results per page (max 50)
- `userId` - Filter by specific user's videos


### Search Performance Features
- **Aggregation pipelines** for complex queries
- **Pagination optimization** with MongoDB skip/limit
- **Index hints** for query optimization
- **Result caching** ready (Redis integration available)

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
├── queues/               # Background job queues
│   └── video.queue.js
│
├── workers/              # Background job workers
│   └── videoTranscoder.js
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
│   ├── ApiError.js
│   ├── ApiRespons.js
│   ├── asynchandler.js
│   ├── clouddinary.js
│   ├── deleteCloydinary.js
│   ├── downloadCloudinary.js
│   └── transcoder.js
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

