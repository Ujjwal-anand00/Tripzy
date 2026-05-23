# Tripzy

Tripzy is a travel planning app with a React Native frontend and a Node.js + Express + MongoDB backend. It includes JWT authentication, trip management, AI chat, AI itinerary generation, and a destination map explorer.

## Folder Structure

```text
Tripzy/
|-- api/
|   |-- server.js
|   |-- package.json
|   `-- src/
|       |-- app.js
|       |-- config/
|       |-- constants/
|       |-- controllers/
|       |-- middleware/
|       |-- models/
|       |-- routes/
|       |-- services/
|       `-- utils/
|-- assets/
|-- navigation/
|-- screens/
|-- src/
|   |-- api/
|   |-- components/
|   |-- constants/
|   |-- context/
|   |-- hooks/
|   |-- navigation/
|   |-- screens/
|   |-- services/
|   |-- storage/
|   |-- types/
|   `-- utils/
|-- App.tsx
`-- package.json
```

## Implemented Features

- JWT signup, login, and authenticated session restore
- Secure token storage with `expo-secure-store` and `AsyncStorage` fallback for web
- Trip CRUD with MongoDB persistence
- AI chat endpoint with per-user stored chat sessions
- AI itinerary generation with MongoDB storage and trip linkage
- Destination discovery screen with `react-native-maps`
- Protected backend routes with auth middleware
- Shared frontend API client, reusable UI components, typed navigation, and service re-exports

## What Was Fixed

- Hardened backend validation for numbers, arrays, status values, and object IDs
- Fixed auth middleware so non-JWT errors are not incorrectly reported as token failures
- Improved OpenAI service error handling and response text extraction
- Prevented duplicate itineraries from accumulating for the same trip regeneration flow
- Added frontend request parsing safeguards for non-JSON and offline server responses
- Added runtime error states and refresh flows for home, trips, chat, and map screens
- Completed legacy root-level navigation wrappers so old imports still work
- Added richer auth form handling, reusable inline alerts, stronger button/input primitives, and dashboard stats
- Added in-screen itinerary preview rendering and smoother chat history behavior

## Setup

### 1. Frontend

Create `.env` in the project root:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
```

Use `http://localhost:5000/api` for web or iOS simulator if needed.

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run start
```

### 2. Backend

Create `api/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tripzy
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8081
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-5-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

Install backend dependencies:

```bash
cd api
npm install
```

Start the API:

```bash
npm run dev
```

Or from the repo root:

```bash
npm run api:dev
```

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/trips`
- `POST /api/trips`
- `GET /api/trips/:tripId`
- `PATCH /api/trips/:tripId`
- `DELETE /api/trips/:tripId`
- `POST /api/itineraries/generate`
- `GET /api/itineraries`
- `GET /api/itineraries/:itineraryId`
- `GET /api/chat/sessions`
- `GET /api/chat/sessions/:sessionId`
- `POST /api/chat/messages`
- `GET /api/destinations`

## Dependencies

### Frontend

- `expo@~54.0.31`
- `react@19.1.0`
- `react-native@0.81.5`
- `@react-navigation/native@7.1.28`
- `@react-navigation/bottom-tabs@7.10.1`
- `@react-navigation/native-stack@7.10.1`
- `@react-native-async-storage/async-storage@2.2.0`
- `expo-secure-store@~15.0.8`
- `expo-location@~19.0.8`
- `react-native-maps@1.20.1`

### Backend

- `express@5.2.1`
- `mongoose@9.1.4`
- `jsonwebtoken@9.0.2`
- `bcryptjs@2.4.3`
- `cors@2.8.5`
- `dotenv@17.2.3`
- `nodemon@3.1.11`

## Verification

```bash
npm run typecheck
npm run api:check
```

## Notes

- AI features require valid `OPENAI_API_KEY` and `OPENAI_MODEL` values in `api/.env`.
- The `screens/` and `navigation/` folders at the repo root remain compatibility exports while the app itself lives under `src/`.
