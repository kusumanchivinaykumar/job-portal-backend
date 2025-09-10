# Backend - Run Instructions (Job Portal)

Quick steps to run the backend locally (developer machine):

1. Open a terminal in the `Backend` folder.
2. Copy `.env` and fill real values (or create `.env` from `.env.example`):
   - MONGO_URI: MongoDB connection string (local or Atlas).
   - JWT_SECRET: any long secret string (used for signing tokens).
   - PORT: port to run backend (for example 5011).
   - CLOUDINARY credentials if you want image uploads (optional).
3. Install dependencies:
   ```bash
   npm install
   ```
4. For development (auto-restart on changes):
   ```bash
   npm run dev
   ```
   For production (simple start):
   ```bash
   npm start
   ```
5. The server exposes APIs under `/api/*` (for example `http://localhost:5011/api/user/login`).

Notes:
- Make sure MongoDB URI is reachable and the database user has required privileges.
- If you run the frontend from a different origin (port), ensure the backend CORS is configured (it already uses `cors()` in the code).
