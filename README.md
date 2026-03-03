# React TypeScript Boilerplate

A production-ready SPA boilerplate: React 19 + TypeScript 5 (strict) + Vite, with theming, routing, data fetching, i18n, and testing pre-configured.

## Stack

| Layer | Library |
|---|---|
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Bundler | Vite |
| Styling | styled-components v6 + theme tokens |
| Routing | React Router v7 (lazy routes) |
| Data fetching | TanStack Query v5 + `fetch` wrapper |
| i18n | react-i18next |
| Testing | Vitest + React Testing Library + jsdom |
| Linting | ESLint 9 (flat config) + typescript-eslint |
| Formatting | Prettier |

## Project Structure

```
src/
  features/          # Feature modules (colocate component + query + types)
    posts/
      PostsList.tsx  # Example: useQuery + api.get()
  lib/
    api.ts           # Fetch wrapper — api.get/post/put/delete<T>()
    queryClient.ts   # Singleton QueryClient
  pages/
    Home.tsx
    NotFound.tsx
  routes/
    AppRouter.tsx    # createBrowserRouter, lazy routes
    routes.ts        # ROUTES constants
  shared/
    components/      # Button, Card, ErrorBoundary, Spinner
    styles/          # theme, GlobalStyles, styled.d.ts
  i18n/              # i18next setup + en/common.json
  test/              # setup.ts, utils.tsx (custom render + providers)
  main.tsx
```

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `https://jsonplaceholder.typicode.com` | Base URL for API requests |

## API Client

`src/lib/api.ts` is a thin `fetch` wrapper with typed responses:

```ts
import { api } from '@/lib/api'

// Returns { data: T }
const { data } = await api.get<Post[]>('/posts', { params: { _limit: 10 } })
await api.post<Post>('/posts', { title: 'Hello', body: '...' })
await api.put<Post>('/posts/1', { title: 'Updated' })
await api.delete<void>('/posts/1')
```

## Adding a Feature

1. Create `src/features/<name>/` with your component
2. Use `useQuery` from TanStack Query + `api.get()` for data
3. Add a route in `src/routes/AppRouter.tsx` if needed
4. Add locale keys to `src/i18n/locales/en/common.json`

## Testing

Tests use a custom `render` from `src/test/utils.tsx` that wraps components with `QueryClientProvider`, `ThemeProvider`, and `MemoryRouter`:

```ts
import { render, screen } from '@/test/utils'
import { MyComponent } from './MyComponent'

it('renders', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```
