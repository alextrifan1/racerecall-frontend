# RaceRecall Roadmap

Planned improvements for both repos, plus the gradual move to the Dotline design system. Within each list, items are sorted by importance first, then by how easy they are.

**Effort:** **S** = under an hour · **M** = an evening · **L** = a few sessions

- [Backend](#backend-racerecall-backend)
- [Frontend](#frontend-racerecall-frontend)
- [Dotline rollout](#dotline-rollout)

---

## Backend ([racerecall-backend](https://github.com/alextrifan1/racerecall-backend))

- [ ] **Rotate the Neon password and remove the fallback credentials** · Critical · S
  The password is a default value in `application.properties` on GitHub. Rotate it in Neon first, then remove the defaults so the app reads only environment variables.
- [ ] **Fix error responses** · High · S
  - [ ] Catch `IllegalStateException` for duplicate usernames, so they return 400
  - [ ] Permit `/error` in `SecurityConfig`, so real status codes show instead of 403
  - [ ] Catch `JwtException` in `JwtAuthenticationFilter`, so a bad token returns 401 instead of breaking public routes
  - [ ] Optional: one `@RestControllerAdvice` for all of the above
- [ ] **Stop caching failed calls, and add expiry** · High · S
  Add `unless = "#result == null || #result.isEmpty()"` to each `@Cacheable`, then switch to Caffeine with `expireAfterWrite`.
- [ ] **Return 404 for an unknown session** · High · S
  `fetchSessionByKey` can return `null`, which currently causes a `NullPointerException`.
- [ ] **Remove `@CrossOrigin("*")` and set `FRONTEND_URL` on the deployed backend** · Medium · S
- [ ] **Validate auth input** · Medium · S
  `@Valid` with `@NotBlank` and `@Size` on `AuthRequest`, matching the frontend's 6-character password rule.
- [ ] **Clean up `OpenF1Client`** · Medium · S–M
  - [ ] Replace the six copy-pasted methods with one shared helper
  - [ ] Use an SLF4J logger instead of `System.out`
  - [ ] Delete the unused `fetchDrivers` method
  - [ ] Remove the unreachable second `onErrorResume`
  - [ ] Put the jjwt dependencies on the same version
- [ ] **Add tests** · High · M
  - [ ] Unit tests for `SessionService` with a mocked client (pagination, podium merge)
  - [ ] `@WebMvcTest` tests for both controllers
- [ ] **CI and health check** · Medium · M
  GitHub Actions to build and test on every push (optionally build the Docker image), plus Spring Boot Actuator's `/actuator/health`.
- [ ] **Make the five OpenF1 calls in parallel** · Medium · M
  `Mono.zip` or `CompletableFuture`: one round trip of waiting instead of five in a row on a cold cache.
- [ ] **Flyway migrations instead of `ddl-auto=update`** · Medium · M
- [ ] **Favorites** · Feature · M
  `POST` / `GET` / `DELETE /api/favorites`, a `favorites` table linked to `users`. The first feature that needs the JWT setup.
- [ ] **Fuller session data** · Feature · M–L
  Full classification, fastest lap, driver standings for the season.
- [ ] **Stronger auth** · Low for now · L
  Rate limiting on login, refresh tokens.

---

## Frontend ([racerecall-frontend](https://github.com/alextrifan1/racerecall-frontend))

- [ ] **Check that refreshing `/login` works on the live site** · High if broken · S
  There is no `vercel.json`. If refresh gives a 404, add a rewrite rule that sends every path to `index.html`.
- [ ] **Fix session modal error handling** · High · S
  - [ ] Clear `details` when a fetch starts or fails (today a failed fetch shows the previous session's data)
  - [ ] Treat a non-200 response as an error instead of parsing it as data
  - [ ] Cancel the previous request with an `AbortController` when another session is clicked
- [ ] **Show the starting grid in the session modal** · High · S
  The backend already returns it as `startingGrid`.
- [ ] **Make the modal keyboard-friendly** · Medium · S
  Close on Escape, `role="dialog"` with `aria-modal`, move focus into the modal when it opens.
- [ ] **One API layer** · Medium · S
  Move the `fetch` calls into `src/api/sessions.js` using the existing Axios instance.
- [ ] **Handle expired tokens** · Medium · S
  Read the token's `exp` on load and log out when it has passed.
- [ ] **Small cleanups** · Low · S
  - [ ] Page title `racerecall-frontend` → `RaceRecall`
  - [ ] Delete the unused template assets (`hero.png`, `react.svg`, `vite.svg`)
  - [ ] Generate the year dropdown up to the current year
  - [ ] Fix "Next" opening an empty page when the last page has exactly 4 weekends
  - [ ] Fix the existing ESLint errors (mostly unused `React` imports)
- [ ] **Put state in the URL** · Medium · M
  Year and page as query params so refresh and the back button work; a `/session/:key` route for shareable sessions.
- [ ] **Loading skeletons** · Low · M
- [ ] **Tests and lint in CI** · Medium · M
  Vitest and React Testing Library, starting with `useSeasonData`'s grouping and the auth forms.
- [ ] **Favorites page** · Feature · M
  Depends on backend favorites. Uses `ProtectedRoute`.

---

## Dotline rollout

The app moves to the Dotline design system one component per step, staying in the light theme until the last step. Each step is one commit, checked on the live site before the next one starts. Components keep their own CSS Modules and use Dotline's tokens (`src/styles/tokens.css`) instead of Dotline's `bundle.css` classes.

- [x] **1. Foundation** · S
  Dotline tokens as CSS variables in `src/styles/tokens.css` (both themes), Doto / IBM Plex Mono / Outfit loaded from Google Fonts, `data-theme="light"` on `<html>`. No visible change.
- [x] **2. Navbar** · S
  Red bar mark with the name in Doto, numbered mono nav link with a red underline when active, pill buttons (`signal` Register, `ghost` Sign in, `raised` Sign out), no shadows.
- [x] **3. Auth pages** · S
  Square card with no shadow, `signal` pill submit button, `line-strong` input borders, `sky-text` focus ring, Outfit for form text, errors in `signal-text`.
- [ ] **4. Session modal** · M
  Square dialog with a red top rule over a flat `scrim`; podium rows as listings (`P1 // G RUSSELL`, team underneath in `ink-muted`); optionally dot counts for position.
- [x] **5. Season browser** · M
  Year in Doto as the page's one headline; weekends as listing rows (`09/19 // SINGAPORE`); replace the coloured left strips with a mono session-type label and a red dot for the race; square panels, no shadows.
- [x] **6. Dot wave** · M
  Animated `DotField` (still pixels when reduced motion is on): behind the sign-in and register pages, and rising behind the last weekends and pagination on the season page. Text always sits on a solid patch, never on the dots.
- [ ] **7. Dark theme** · S
  Switch `data-theme` to `dark` in `index.html`; check every page in both themes.
