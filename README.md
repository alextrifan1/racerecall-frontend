# RaceRecall Frontend

Web app for looking back at Formula 1 race weekends. Browse a season weekend by weekend, open any session to see the conditions at the start and the top 3 finishers, and create an account to sign in.

**Live:** https://racerecall-frontend.vercel.app/
**Backend:** [racerecall-backend](https://github.com/alextrifan1/racerecall-backend) (Spring Boot REST API, data from [OpenF1](https://openf1.org))

## Features

- **Season browser:** pick a season from 2023 to 2026 and page through it, 4 grand prix weekends at a time.
- **Weekend cards:** each weekend shows its country flag and sessions, color-coded by type (practice, qualifying, sprint, race).
- **Session details:** click a session to open a modal with air and track temperature, rain, and the podium.
- **Accounts:** register and sign in. The JWT returned by the backend is kept in `localStorage` and sent with API requests.

## Tech stack

- React 19 with Vite 8
- React Router 7
- Axios (auth requests) and the Fetch API (session data)
- Plain CSS with CSS Modules, one stylesheet per component
- Deployed on Vercel

## Running locally

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite)
- The [backend](https://github.com/alextrifan1/racerecall-backend) running locally, or the URL of a deployed instance

### 1. Install dependencies

```bash
npm install
```

### 2. Point the app at the backend

By default the app calls `http://localhost:8080`. To use a different backend, create a `.env.local` file in the project root (it is git-ignored):

```env
VITE_API_URL=https://your-backend-url.example.com
```

### 3. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173. The backend allows this origin by default, so no CORS setup is needed for local development.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── api/axios.js          Axios instance: adds the JWT to requests, logs out on 401
├── context/AuthContext   Auth state (token, username) plus login, register and logout
├── pages/                Login and Register
├── components/
│   ├── Navbar            Navigation and sign-in status
│   ├── SeasonBrowser/    Season picker, pagination, weekend and session cards
│   │   └── useSeasonData.js   Fetches sessions and groups them by weekend
│   ├── SessionModal/     Session details: weather and podium
│   └── TrackMap          Simple SVG outline for a few circuits
├── App.jsx               Routes: /, /login, /register
└── main.jsx              Entry point
```

## Roadmap

Planned improvements for the frontend and backend, and the step-by-step move to the Dotline design system, are tracked in [ROADMAP.md](ROADMAP.md).

## Deployment

The app is deployed on Vercel. Set `VITE_API_URL` in the Vercel project's environment variables to the deployed backend URL. Vite reads it at build time, so redeploy after changing it.
