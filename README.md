# RaceRecall — Frontend

[![CI](https://github.com/alextrifan1/racerecall-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/alextrifan1/racerecall-frontend/actions/workflows/ci.yml)

A web app for looking back at Formula 1 race weekends: browse a season round by round, see what's coming up next, and open any session for its conditions, podium and starting grid.

**Live demo:** [racerecall-frontend.vercel.app](https://racerecall-frontend.vercel.app/)
**Backend:** [racerecall-backend](https://github.com/alextrifan1/racerecall-backend) — Spring Boot REST API with data from [OpenF1](https://openf1.org)

---

## Features

- **Season browser** — every season from 2023 (the first year with OpenF1 data) to today, four weekends per page. During a season it opens on the page with the next session.
- **Race weekends** — numbered rounds with country flags and every session. Pre-season testing and cancelled races are labelled and left unnumbered.
- **Session status** — upcoming sessions are marked and the next one is highlighted. All times are shown in the visitor's time zone.
- **Session details** — air and track temperature, rainfall, the podium and the full starting grid, in a keyboard-accessible dialog.
- **Accounts** — register and sign in with JWT authentication.
- **Light and dark themes** — follows the device setting on the first visit and remembers the visitor's choice, with no flash of the wrong theme.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, React Router 7 |
| Build | Vite 8 |
| HTTP | Axios (auth), Fetch API (session data) |
| Styling | Plain CSS Modules, one stylesheet per component, design tokens as CSS variables |
| Quality | ESLint, GitHub Actions CI, Dependabot |
| Hosting | Vercel |

## Getting started

### Prerequisites

- Node.js 22 (or 20.19+)
- The [backend](https://github.com/alextrifan1/racerecall-backend) running locally, or the URL of a deployed instance

### Install and run

```bash
git clone https://github.com/alextrifan1/racerecall-frontend.git
cd racerecall-frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and calls the backend at `http://localhost:8080` by default. The backend allows this origin out of the box, so no CORS setup is needed.

### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend API |

To point at another backend, create a git-ignored `.env.local` file in the project root:

```env
VITE_API_URL=https://your-backend.example.com
```

Vite reads the variable at build time, so restart the dev server (or rebuild) after changing it.

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
├── api/            Axios instance: attaches the JWT, handles 401 responses
├── context/        Auth state (token, username, login, register, logout)
├── pages/          Login and Register
├── components/
│   ├── SeasonBrowser/   Season page: data loading, weekend grouping, session tiles
│   ├── SessionModal/    Session details dialog: weather, podium, starting grid
│   ├── DotField/        Animated dot-wave background
│   └── ...              Navbar, theme toggle, logo mark, track outlines
├── styles/tokens.css    Design tokens for both themes
├── App.jsx              Routes
└── main.jsx             Entry point
```

The season page loads a whole season in one request. `seasonHelpers.js` then groups the sessions into weekends, numbers the rounds and finds the next session, so paging happens on the client without further requests.

## Design

The UI is built on **Dotline**, a personal design system: dark-first, black, white and red, with dot-matrix typography (Doto, IBM Plex Mono, Outfit). Components use only the tokens in `src/styles/tokens.css`; switching `data-theme` on `<html>` re-themes the whole app. An inline script in `index.html` applies the theme before the first paint.

## Development workflow

- Work is planned as issues on the [RaceRecall project board](https://github.com/users/alextrifan1/projects/N), shared with the backend.
- `main` is protected: changes land through pull requests with a passing CI run, merged with squash.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Dependabot opens weekly PRs for npm packages and GitHub Actions.

## Deployment

Vercel deploys `main` to production and builds a preview for every pull request. Set `VITE_API_URL` in the Vercel project's environment variables to the deployed backend URL and redeploy after changing it.

`vercel.json` rewrites every path that isn't a static file to `index.html`, so client-side routes such as `/login` work when opened or refreshed directly.