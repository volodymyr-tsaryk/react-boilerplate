# React TypeScript Boilerplate — Design Document

**Date:** 2026-03-03
**Stack:** React + TypeScript + Vite + Vitest + styled-components
**Scope:** Full production-ready boilerplate with demo feature

---

## Overview

A production-ready React TypeScript boilerplate that demonstrates all key patterns through a minimal working demo (posts feature). Developers can strip the demo and immediately have a well-configured, opinionated starting point for new SPAs.

---

## Project Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/       # LoginForm, etc.
│   │   ├── hooks/            # useAuth, useLogin
│   │   ├── store/            # authStore (Zustand)
│   │   └── index.ts
│   └── posts/                # demo feature
│       ├── components/
│       ├── hooks/            # usePostsQuery (TanStack Query)
│       └── index.ts
├── shared/
│   ├── components/           # Button, Card, ErrorBoundary, Spinner
│   ├── hooks/                # useLocalStorage, useDebounce
│   ├── styles/               # GlobalStyles, theme, breakpoints
│   └── utils/
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   └── NotFound.tsx
├── routes/
│   ├── AppRouter.tsx         # React Router v7 setup
│   ├── ProtectedRoute.tsx    # Auth guard
│   └── routes.ts             # route constants
├── store/                    # global Zustand stores
├── lib/
│   ├── api.ts                # axios instance + interceptors
│   └── queryClient.ts        # TanStack Query client config
├── i18n/
│   ├── index.ts
│   └── locales/en/common.json
├── types/                    # global TS types
└── main.tsx

e2e/                          # Playwright E2E tests
.github/workflows/ci.yml      # GitHub Actions CI
```

---

## Core Libraries

| Concern | Library | Version |
|---|---|---|
| Build | Vite | 6 |
| Styling | styled-components | 6 |
| Routing | React Router | v7 |
| Server state | TanStack Query | v5 |
| Client state | Zustand | v5 |
| HTTP | axios | latest |
| i18n | react-i18next | latest |
| Unit/component tests | Vitest + React Testing Library | latest |
| E2E | Playwright | latest |
| Lint | ESLint 9 (flat config) + Prettier | latest |

---

## Key Patterns

### Theming
- `src/shared/styles/theme.ts` exports a `theme` object (colors, spacing, typography, breakpoints)
- `src/shared/styles/styled.d.ts` extends `DefaultTheme` for full type inference on `props.theme`
- `GlobalStyles` component resets and applies base styles
- `ThemeProvider` wraps the app in `main.tsx`

### Routing
- `AppRouter.tsx` uses `createBrowserRouter` from React Router v7
- All page-level components are lazy-loaded via `React.lazy` + `Suspense`
- `ProtectedRoute.tsx` reads `isAuthenticated` from Zustand auth store, redirects to `/login` if false
- Route constants in `routes.ts` prevent magic strings

### Auth Skeleton
- `authStore` (Zustand) holds `{ user, token, isAuthenticated, login, logout }`
- Token persisted to `localStorage` via Zustand `persist` middleware
- `lib/api.ts` request interceptor attaches `Authorization: Bearer <token>`
- `lib/api.ts` response interceptor clears auth on 401

### API Pattern
- `lib/api.ts` exports a configured axios instance
- Feature hooks use TanStack Query: `useQuery` for fetches, `useMutation` for writes
- `queryClient.ts`: `staleTime: 60_000`, `retry: 1`, `refetchOnWindowFocus: false`

### Error Handling
- `<ErrorBoundary>` component in `shared/components/` wraps all routes
- TanStack Query error states surfaced per-feature with consistent UI
- 404 route → `NotFound.tsx`

---

## Testing Strategy

### Vitest + React Testing Library
- `vitest.config.ts`: jsdom environment, `@testing-library/jest-dom` setup file
- Tests co-located with source: `features/posts/components/PostCard.test.tsx`
- `src/test/` holds: custom render with all providers, mock factories, MSW handlers
- Coverage via v8 provider, threshold: 80% statements/branches

### Playwright
- `e2e/` at project root
- Smoke test suite: home page renders, login form exists and accepts input
- Runs against `vite preview` in CI

---

## GitHub Actions CI

`.github/workflows/ci.yml` — sequential jobs:

1. **lint** — ESLint + Prettier check
2. **typecheck** — `tsc --noEmit`
3. **test** — Vitest with coverage
4. **build** — `vite build`
5. **e2e** — Playwright against `vite preview`

Node modules cached via `actions/cache`. Runs on push to `main` and all PRs.

---

## TypeScript Configuration

- `tsconfig.json` — strict mode, path aliases (`@/*` → `src/*`)
- `tsconfig.node.json` — for Vite config file
- `vite.config.ts` — aliases match tsconfig paths
