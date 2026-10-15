# RaceRecall Frontend

Web app for looking back at Formula 1 race weekends. Browse a season round by round, see what's coming up next, open any session for the conditions at the start, the podium and the starting grid, and create an account to sign in.

**Live:** https://racerecall-frontend.vercel.app/
**Backend:** [racerecall-backend](https://github.com/alextrifan1/racerecall-backend) (Spring Boot REST API, data from [OpenF1](https://openf1.org))

## Features

- **Season browser:** pick any season from 2023 (the first year with OpenF1 data) to the current one and page through it, 4 weekends at a time. In-season it opens on the page with the next session.
- **Weekends:** numbered rounds (`R03 // 03/06–03/08 // AUSTRALIA`) with the country flag and every session. Pre-season testing and race weekends with no race held are labelled as such and don't get a round number.
- **Session status:** sessions that haven't run yet are marked upcoming, and the next one to start is highlighted. Times are shown in your local time zone.
- **Session details:** click a session for the air and track temperature, rain, the podium and the starting grid. Works with the keyboard (Escape closes it).
- **Light and dark themes:** follows your device setting on the first visit; the toggle in the navbar remembers your choice.
- **Accounts:** register and sign in. The JWT returned by the backend is kept in `localStorage` and sent with API requests.

## Tech stack

- React 19 with Vite 8
- React Router 7
- Axios (auth requests) and the Fetch API (session data)
- Plain CSS with CSS Modules, one stylesheet per component
- Styled with [Dotline](#design), a personal design system: tokens as CSS variables, Doto / IBM Plex Mono / Outfit fonts
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
├── api/axios.js            Axios instance: adds the JWT to requests, logs out on 401
├── context/
│   ├── AuthContext.jsx     AuthProvider: token, username, login, register, logout
│   └── useAuth.js          The auth context and its useAuth hook
├── styles/tokens.css       Dotline design tokens (colours, type, spacing) for both themes
├── pages/                  Login and Register
├── components/
│   ├── Navbar              Navigation, sign-in status and the theme toggle
│   ├── Mark                The A.T. logo mark
│   ├── ThemeToggle         Light/dark switch, saved in localStorage
│   ├── DotField/           Animated dot-wave background (still pixels with reduced motion)
│   ├── SeasonBrowser/      Season picker, pagination, weekend and session tiles
│   │   ├── useSeasonData.js    Loads a whole season in one request
│   │   ├── seasonHelpers.js    Groups sessions into weekends: rounds, testing, upcoming
│   │   └── SeasonSkeleton.jsx  Placeholder tiles while a season loads
│   ├── SessionModal/       Session details: weather, podium, starting grid
│   └── TrackMap            Outlines for a few circuits (none for the rest)
├── App.jsx                 Routes: /, /login, /register
└── main.jsx                Entry point
```

## Design

The UI uses **Dotline**, a personal design system: dark-first, black/white/red with dot-matrix type, a pale-blue dot texture and the A.T. mark. Its tokens live in `src/styles/tokens.css` as CSS variables, with a `[data-theme="light"]` override; components use only those variables, so switching `data-theme` on `<html>` re-themes everything. A small script in `index.html` sets the theme before the page draws, so it never flashes the wrong one.

## Roadmap

Planned improvements for the frontend and backend, and the step-by-step move to the Dotline design system, are tracked in [ROADMAP.md](ROADMAP.md).

## Deployment

The app is deployed on Vercel. Set `VITE_API_URL` in the Vercel project's environment variables to the deployed backend URL. Vite reads it at build time, so redeploy after changing it.

`vercel.json` sends every path that isn't a real file to `index.html`, so routes like `/login` work when opened or refreshed directly.
