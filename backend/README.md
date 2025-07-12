# Authentication Backend with Supabase

A Node.js/Express backend for authentication using Supabase as the database and auth provider.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your project URL and API keys from the project settings
3. Note down:
   - Project URL
   - Anon/Public Key
   - Service Role Key (for admin operations)

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication Routes

All routes are prefixed with `/api/auth`

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/signup` | Register a new user | No |
| POST | `/signin` | Sign in user | No |
| POST | `/signout` | Sign out user | No |
| GET | `/me` | Get current user | Yes |
| POST | `/refresh` | Refresh access token | No |
| POST | `/reset-password` | Send password reset email | No |
| PUT | `/profile` | Update user profile | Yes |

### Request Examples

#### Sign Up
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "user_metadata": {
      "name": "John Doe"
    }
  }'
```

#### Sign In
```bash
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Current User (Protected)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Response Format

Successful responses include:
- `message`: Success message
- `user`: User object (for auth operations)
- `session`: Session object with access and refresh tokens

Error responses include:
- `error`: Error message

## Security Features

- JWT token verification using Supabase
- CORS configuration for frontend integration
- Protected routes with authentication middleware
- Password hashing (handled by Supabase)
- Session management

## Frontend Integration

To use this backend with your React frontend:

1. Store the access token from login responses
2. Include the token in Authorization header for protected requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${accessToken}`,
     'Content-Type': 'application/json'
   }
   ```
3. Handle token refresh when access tokens expire

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `PORT` | Server port (default: 3001) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No | 