# React TypeScript Boilerplate Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a full production-ready React + TypeScript + Vite SPA boilerplate with styled-components theming, React Router v7 (lazy routes + auth guard), TanStack Query + Zustand state, i18n, axios client, Vitest + RTL unit tests, Playwright E2E, and GitHub Actions CI.

**Architecture:** Feature-based folder structure (`src/features/<name>/`) with shared components, a demo `posts` feature that exercises all patterns (TanStack Query fetch → styled-components cards → Zustand auth guard), and a `lib/` layer for axios and QueryClient configuration.

**Tech Stack:** React 19, TypeScript 5 (strict), Vite 6, styled-components v6, React Router v7, TanStack Query v5, Zustand v5, axios, react-i18next, Vitest + React Testing Library + MSW, Playwright, ESLint 9 (flat config), Prettier.

---

## Environment Notes

- Working directory: project root (already has `docs/plans/`)
- Package manager: `npm`
- Node 20+ required
- Vitest globals enabled — `describe`, `it`, `expect`, `vi`, `beforeEach` etc. available without imports in test files
- Path alias `@/*` maps to `src/*` in both TypeScript and Vite

---

## Phase 1: Project Scaffolding & Tooling

### Task 1: Initialize Vite project

**Files:**
- Creates: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`

**Step 1: Scaffold into current directory**

```bash
npm create vite@latest . -- --template react-ts
```

When prompted about non-empty directory, press **Enter** (or select "Ignore files and continue"). When prompted for package name, use `react-boilerplate`.

**Step 2: Install base dependencies**

```bash
npm install
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: `http://localhost:5173/` opens React + Vite default page. Stop with `Ctrl+C`.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: initialize vite react-ts project"
```

---

### Task 2: Install all project dependencies

**Step 1: Install runtime dependencies**

```bash
npm install \
  react-router-dom \
  @tanstack/react-query \
  zustand \
  styled-components \
  axios \
  react-i18next \
  i18next
```

**Step 2: Install dev dependencies**

```bash
npm install --save-dev \
  vitest \
  @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  msw \
  @playwright/test \
  eslint \
  @eslint/js \
  globals \
  typescript-eslint \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  prettier \
  eslint-config-prettier
```

**Step 3: Install Playwright browsers**

```bash
npx playwright install chromium
```

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install all project dependencies"
```

---

### Task 3: Clean up default Vite scaffold

**Files:**
- Delete: `src/App.css`, `src/index.css`, `src/assets/react.svg`, `public/vite.svg`
- Modify: `src/App.tsx`, `src/main.tsx`

**Step 1: Remove unused default files**

```bash
rm src/App.css src/index.css
rm -rf src/assets
rm public/vite.svg
```

**Step 2: Replace `src/App.tsx` with a placeholder**

Replace the entire file content with:

```tsx
export default function App() {
  return <div>App</div>
}
```

**Step 3: Replace `src/main.tsx` with a minimal entry**

Replace the entire file content with:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove default vite scaffold files"
```

---

### Task 4: Configure TypeScript (strict mode + path aliases)

**Files:**
- Modify: `tsconfig.json`
- Modify: `tsconfig.node.json`

**Step 1: Replace `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 2: Replace `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "vitest.config.ts", "playwright.config.ts"]
}
```

**Step 3: Verify TypeScript is happy**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 4: Commit**

```bash
git add tsconfig.json tsconfig.node.json
git commit -m "chore: configure typescript strict mode and path aliases"
```

---

### Task 5: Configure Vite with path aliases

**Files:**
- Modify: `vite.config.ts`

**Step 1: Replace `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

**Step 2: Verify build works**

```bash
npm run build
```

Expected: `dist/` created, no errors. Clean up:

```bash
rm -rf dist
```

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: configure vite path aliases"
```

---

### Task 6: Configure ESLint (flat config)

**Files:**
- Create: `eslint.config.js`
- Delete: `.eslintrc.*` (if present)
- Modify: `package.json` (add script)

**Step 1: Create `eslint.config.js`**

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
)
```

**Step 2: Add lint script to `package.json`**

Add to the `"scripts"` section:

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

**Step 3: Run lint to verify**

```bash
npm run lint
```

Expected: No errors (warnings about unused imports are OK at this point).

**Step 4: Commit**

```bash
git add eslint.config.js package.json
git commit -m "chore: configure eslint 9 flat config"
```

---

### Task 7: Configure Prettier

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `package.json` (add scripts)

**Step 1: Create `.prettierrc`**

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**Step 2: Create `.prettierignore`**

```
dist
coverage
playwright-report
node_modules
*.md
```

**Step 3: Add Prettier scripts to `package.json`**

```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

**Step 4: Format the entire project**

```bash
npm run format
```

Expected: Files reformatted. No errors.

**Step 5: Commit**

```bash
git add .prettierrc .prettierignore package.json
git add -u
git commit -m "chore: configure prettier"
```

---

## Phase 2: Test Infrastructure (set up before writing code)

### Task 8: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (add scripts)

**Step 1: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/main.tsx', 'src/i18n/**', '**/*.d.ts'],
      thresholds: {
        statements: 80,
        branches: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

**Step 2: Create `src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

**Step 3: Add test scripts to `package.json`**

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
"typecheck": "tsc --noEmit"
```

**Step 4: Write a smoke test to verify setup**

Create `src/test/setup.test.ts`:

```typescript
describe('vitest setup', () => {
  it('jest-dom matchers work', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    expect(div).toBeInTheDocument()
  })
})
```

**Step 5: Run tests**

```bash
npm test
```

Expected: 1 test passes.

**Step 6: Remove smoke test**

```bash
rm src/test/setup.test.ts
```

**Step 7: Commit**

```bash
git add vitest.config.ts src/test/setup.ts package.json
git commit -m "test: configure vitest with jsdom and jest-dom"
```

---

### Task 9: Create test utilities (custom render + providers)

**Files:**
- Create: `src/test/utils.tsx`

Note: This file imports from modules not yet created (`@/shared/styles/theme`, etc.). We'll create a version with placeholders and update it in Phase 3 once the theme exists.

**Step 1: Create placeholder `src/test/utils.tsx`**

```tsx
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement, ReactNode } from 'react'

// ThemeProvider will be added in Task 12 once theme is created.
// For now, wrap with QueryClient + Router only.

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

export function createWrapper() {
  const queryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

**Step 2: Commit**

```bash
git add src/test/utils.tsx
git commit -m "test: add custom render utility with providers"
```

---

## Phase 3: Core Infrastructure

### Task 10: Set up styled-components theme

**Files:**
- Create: `src/shared/styles/theme.ts`
- Create: `src/shared/styles/styled.d.ts`
- Create: `src/shared/styles/GlobalStyles.ts`
- Create: `src/shared/styles/index.ts`

**Step 1: Create `src/shared/styles/theme.ts`**

```typescript
export const theme = {
  colors: {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      muted: '#94a3b8',
    },
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#22c55e',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
} as const

export type Theme = typeof theme
```

**Step 2: Create `src/shared/styles/styled.d.ts`**

```typescript
import 'styled-components'
import type { Theme } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

**Step 3: Create `src/shared/styles/GlobalStyles.ts`**

```typescript
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }
`
```

**Step 4: Create `src/shared/styles/index.ts`**

```typescript
export { theme } from './theme'
export { GlobalStyles } from './GlobalStyles'
export type { Theme } from './theme'
```

**Step 5: Update `src/test/utils.tsx` to include ThemeProvider**

Replace the file entirely:

```tsx
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'
import type { ReactElement, ReactNode } from 'react'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

export function createWrapper() {
  const queryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>{children}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    )
  }
}

function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

**Step 6: Verify TypeScript is happy**

```bash
npx tsc --noEmit
```

Expected: No errors.

**Step 7: Commit**

```bash
git add src/shared/styles/ src/test/utils.tsx
git commit -m "feat: add styled-components theme, GlobalStyles, and typed DefaultTheme"
```

---

### Task 11: Set up i18n

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/locales/en/common.json`

**Step 1: Create `src/i18n/locales/en/common.json`**

```json
{
  "nav": {
    "home": "Home",
    "login": "Login",
    "logout": "Logout"
  },
  "auth": {
    "email": "Email",
    "password": "Password",
    "signIn": "Sign In",
    "loginTitle": "Welcome back",
    "invalidCredentials": "Invalid email or password"
  },
  "posts": {
    "title": "Posts",
    "error": "Failed to load posts",
    "noResults": "No posts found"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again",
    "notFound": "Page not found",
    "goHome": "Go to home"
  }
}
```

**Step 2: Create `src/i18n/index.ts`**

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './locales/en/common.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n
```

**Step 3: Commit**

```bash
git add src/i18n/
git commit -m "feat: add react-i18next with english locale"
```

---

### Task 12: Set up axios API client and TanStack Query client

**Files:**
- Create: `src/lib/api.ts`
- Create: `src/lib/queryClient.ts`

**Step 1: Create `src/lib/queryClient.ts`**

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

**Step 2: Create `src/lib/api.ts`**

Note: This imports from the auth store which doesn't exist yet. We'll add the interceptors in Task 14 (auth store). For now, create the base instance:

```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth interceptors are added in src/features/auth/store/authStore.ts
// after the store is initialized to avoid circular imports.
```

**Step 3: Create `.env.example`**

```bash
VITE_API_URL=https://jsonplaceholder.typicode.com
```

**Step 4: Create `.env` from example**

```bash
cp .env.example .env
```

**Step 5: Add `.env` to `.gitignore`**

Open `.gitignore` and add:
```
.env
.env.local
```

**Step 6: Commit**

```bash
git add src/lib/ .env.example .gitignore
git commit -m "feat: add axios api client and tanstack query client"
```

---

## Phase 4: Auth Store & Routing

### Task 13: Create Zustand auth store (TDD)

**Files:**
- Create: `src/features/auth/store/authStore.ts`
- Create: `src/features/auth/store/authStore.test.ts`

**Step 1: Write the failing test first**

Create `src/features/auth/store/authStore.test.ts`:

```typescript
import { act, renderHook } from '@testing-library/react'
import { useAuthStore } from './authStore'

const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }
const mockToken = 'fake-jwt-token'

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
})

describe('authStore', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })

  it('sets auth state on login', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser, mockToken))
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
  })

  it('clears auth state on logout', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login(mockUser, mockToken))
    act(() => result.current.logout())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- src/features/auth/store/authStore.test.ts
```

Expected: FAIL — `Cannot find module './authStore'`.

**Step 3: Create `src/features/auth/store/authStore.ts`**

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
```

**Step 4: Run test to verify it passes**

```bash
npm test -- src/features/auth/store/authStore.test.ts
```

Expected: 3 tests PASS.

**Step 5: Update `src/lib/api.ts` to add auth interceptors**

Replace the file entirely:

```typescript
import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)
```

**Step 6: Create `src/features/auth/index.ts`**

```typescript
export { useAuthStore } from './store/authStore'
export type { User } from './store/authStore'
```

**Step 7: Commit**

```bash
git add src/features/auth/ src/lib/api.ts
git commit -m "feat: add zustand auth store with persist middleware and axios interceptors"
```

---

### Task 14: Set up React Router with lazy routes and ProtectedRoute

**Files:**
- Create: `src/routes/routes.ts`
- Create: `src/routes/ProtectedRoute.tsx`
- Create: `src/routes/AppRouter.tsx`

**Step 1: Create `src/routes/routes.ts`**

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
} as const
```

**Step 2: Create `src/routes/ProtectedRoute.tsx`**

```tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ROUTES } from './routes'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return <>{children}</>
}
```

**Step 3: Create placeholder page files** (will be filled in Phase 6)

```bash
mkdir -p src/pages
```

Create `src/pages/Home.tsx`:
```tsx
export default function Home() {
  return <div>Home</div>
}
```

Create `src/pages/Login.tsx`:
```tsx
export default function Login() {
  return <div>Login</div>
}
```

Create `src/pages/NotFound.tsx`:
```tsx
export default function NotFound() {
  return <div>404</div>
}
```

**Step 4: Create `src/shared/components/Spinner.tsx`** (needed by AppRouter's Suspense fallback)

```tsx
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const SpinnerRing = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.6s linear infinite;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

interface Props {
  size?: number
  centered?: boolean
}

export function Spinner({ size = 32, centered = true }: Props) {
  const ring = <SpinnerRing $size={size} aria-label="Loading" role="status" />
  return centered ? <Wrapper>{ring}</Wrapper> : ring
}
```

**Step 5: Create `src/routes/AppRouter.tsx`**

```tsx
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from './routes'
import { ProtectedRoute } from './ProtectedRoute'
import { Spinner } from '@/shared/components/Spinner'

const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Spinner />}>
          <Home />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<Spinner />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Spinner />}>
        <NotFound />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
```

**Step 6: Update `src/main.tsx` to wire everything together**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { queryClient } from '@/lib/queryClient'
import { theme, GlobalStyles } from '@/shared/styles'
import { AppRouter } from '@/routes/AppRouter'
import '@/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

**Step 7: Remove placeholder `src/App.tsx`**

```bash
rm src/App.tsx
```

**Step 8: Verify dev server works**

```bash
npm run dev
```

Expected: App loads, redirects to `/login` (showing "Login" text since unauthenticated).

**Step 9: Commit**

```bash
git add src/routes/ src/pages/ src/shared/components/Spinner.tsx src/main.tsx
git rm src/App.tsx
git commit -m "feat: add react router v7 with lazy routes and protected route"
```

---

## Phase 5: Shared Components

### Task 15: Create Button component (TDD)

**Files:**
- Create: `src/shared/components/Button.tsx`
- Create: `src/shared/components/Button.test.tsx`

**Step 1: Write the failing test**

Create `src/shared/components/Button.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@/test/utils'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('shows "Loading..." when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument()
  })

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- src/shared/components/Button.test.tsx
```

Expected: FAIL — `Cannot find module './Button'`.

**Step 3: Create `src/shared/components/Button.tsx`**

```tsx
import styled, { css } from 'styled-components'
import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.background};
    }
  `,
}

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `,
}

const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.15s ease;
  border: none;

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} disabled={disabled || isLoading} {...props}>
      {isLoading ? 'Loading...' : children}
    </StyledButton>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- src/shared/components/Button.test.tsx
```

Expected: 5 tests PASS.

**Step 5: Commit**

```bash
git add src/shared/components/Button.tsx src/shared/components/Button.test.tsx
git commit -m "feat: add Button component with variant and size props"
```

---

### Task 16: Create ErrorBoundary component

**Files:**
- Create: `src/shared/components/ErrorBoundary.tsx`

No unit test needed — class ErrorBoundaries are tested via E2E. (React Testing Library doesn't simulate `componentDidCatch` cleanly.)

**Step 1: Create `src/shared/components/ErrorBoundary.tsx`**

```tsx
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <Container>
          <p>Something went wrong.</p>
          <Button variant="secondary" onClick={this.handleReset}>
            Try again
          </Button>
        </Container>
      )
    }
    return this.props.children
  }
}
```

**Step 2: Update `src/main.tsx` to wrap app in ErrorBoundary**

Add import and wrap `<AppRouter />`:

```tsx
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
```

Wrap in main.tsx:

```tsx
<ThemeProvider theme={theme}>
  <GlobalStyles />
  <ErrorBoundary>
    <AppRouter />
  </ErrorBoundary>
</ThemeProvider>
```

**Step 3: Commit**

```bash
git add src/shared/components/ErrorBoundary.tsx src/main.tsx
git commit -m "feat: add ErrorBoundary component"
```

---

### Task 17: Create Card and shared components barrel export

**Files:**
- Create: `src/shared/components/Card.tsx`
- Create: `src/shared/components/index.ts`

**Step 1: Create `src/shared/components/Card.tsx`**

```tsx
import styled from 'styled-components'

export const Card = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`
```

**Step 2: Create `src/shared/components/index.ts`**

```typescript
export { Button } from './Button'
export type { ButtonVariant, ButtonSize } from './Button'
export { Card } from './Card'
export { ErrorBoundary } from './ErrorBoundary'
export { Spinner } from './Spinner'
```

**Step 3: Commit**

```bash
git add src/shared/components/Card.tsx src/shared/components/index.ts
git commit -m "feat: add Card component and shared components barrel export"
```

---

## Phase 6: Pages

### Task 18: Create NotFound and Login pages

**Files:**
- Modify: `src/pages/NotFound.tsx`
- Modify: `src/pages/Login.tsx`

**Step 1: Replace `src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ROUTES } from '@/routes/routes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const Code = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  &:hover { text-decoration: underline; }
`

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <Container>
      <Code>404</Code>
      <p>{t('common.notFound')}</p>
      <HomeLink to={ROUTES.HOME}>{t('common.goHome')}</HomeLink>
    </Container>
  )
}
```

**Step 2: Replace `src/pages/Login.tsx`**

```tsx
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/shared/components/Button'
import { ROUTES } from '@/routes/routes'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`

const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const Hint = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

// Demo credentials: any email + password "password"
export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== 'password') {
      setError(t('auth.invalidCredentials'))
      return
    }
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 400)) // simulate network delay
    login({ id: '1', email, name: email.split('@')[0] }, 'demo-token')
    navigate(ROUTES.HOME)
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit} aria-label={t('auth.loginTitle')}>
        <Title>{t('auth.loginTitle')}</Title>
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <Field>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </Field>
        <Field>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Field>
        <Button type="submit" isLoading={isLoading}>
          {t('auth.signIn')}
        </Button>
        <Hint>Demo: any email + password "password"</Hint>
      </Form>
    </Container>
  )
}
```

**Step 3: Commit**

```bash
git add src/pages/NotFound.tsx src/pages/Login.tsx
git commit -m "feat: build NotFound and Login pages with styled-components"
```

---

## Phase 7: Posts Demo Feature

### Task 19: Create posts API hook (TDD)

**Files:**
- Create: `src/features/posts/hooks/usePostsQuery.ts`
- Create: `src/features/posts/hooks/usePostsQuery.test.ts`

**Step 1: Write the failing test**

Create `src/features/posts/hooks/usePostsQuery.test.ts`:

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { usePostsQuery } from './usePostsQuery'
import { createWrapper } from '@/test/utils'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

const mockPosts = [
  { id: 1, userId: 1, title: 'First Post', body: 'First body' },
  { id: 2, userId: 1, title: 'Second Post', body: 'Second body' },
]

const server = setupServer(
  http.get(`${BASE_URL}/posts`, () => HttpResponse.json(mockPosts)),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('usePostsQuery', () => {
  it('fetches and returns posts', async () => {
    const { result } = renderHook(() => usePostsQuery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockPosts)
  })

  it('returns error state on network failure', async () => {
    server.use(
      http.get(`${BASE_URL}/posts`, () => HttpResponse.error()),
    )
    const { result } = renderHook(() => usePostsQuery(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- src/features/posts/hooks/usePostsQuery.test.ts
```

Expected: FAIL — `Cannot find module './usePostsQuery'`.

**Step 3: Create `src/features/posts/hooks/usePostsQuery.ts`**

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export const postsKeys = {
  all: ['posts'] as const,
  list: () => [...postsKeys.all, 'list'] as const,
}

async function fetchPosts(): Promise<Post[]> {
  const { data } = await api.get<Post[]>('/posts', { params: { _limit: 10 } })
  return data
}

export function usePostsQuery() {
  return useQuery({
    queryKey: postsKeys.list(),
    queryFn: fetchPosts,
  })
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- src/features/posts/hooks/usePostsQuery.test.ts
```

Expected: 2 tests PASS.

**Step 5: Commit**

```bash
git add src/features/posts/hooks/
git commit -m "feat: add usePostsQuery hook with msw tests"
```

---

### Task 20: Create PostCard component (TDD)

**Files:**
- Create: `src/features/posts/components/PostCard.tsx`
- Create: `src/features/posts/components/PostCard.test.tsx`

**Step 1: Write the failing test**

Create `src/features/posts/components/PostCard.test.tsx`:

```tsx
import { render, screen } from '@/test/utils'
import { PostCard } from './PostCard'

const mockPost = {
  id: 1,
  userId: 1,
  title: 'my test post title',
  body: 'Some body text here.',
}

describe('PostCard', () => {
  it('renders the post title', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('my test post title')).toBeInTheDocument()
  })

  it('renders the post body', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Some body text here.')).toBeInTheDocument()
  })

  it('renders as an article element', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
```

**Step 2: Run test to verify it fails**

```bash
npm test -- src/features/posts/components/PostCard.test.tsx
```

Expected: FAIL — `Cannot find module './PostCard'`.

**Step 3: Create `src/features/posts/components/PostCard.tsx`**

```tsx
import styled from 'styled-components'
import type { Post } from '../hooks/usePostsQuery'

const StyledCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: capitalize;
`

const Body = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`

interface Props {
  post: Post
}

export function PostCard({ post }: Props) {
  return (
    <StyledCard>
      <Title>{post.title}</Title>
      <Body>{post.body}</Body>
    </StyledCard>
  )
}
```

**Step 4: Run test to verify it passes**

```bash
npm test -- src/features/posts/components/PostCard.test.tsx
```

Expected: 3 tests PASS.

**Step 5: Commit**

```bash
git add src/features/posts/components/
git commit -m "feat: add PostCard component"
```

---

### Task 21: Create PostsList component and Home page

**Files:**
- Create: `src/features/posts/components/PostsList.tsx`
- Create: `src/features/posts/index.ts`
- Modify: `src/pages/Home.tsx`

**Step 1: Create `src/features/posts/components/PostsList.tsx`**

```tsx
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { usePostsQuery } from '../hooks/usePostsQuery'
import { PostCard } from './PostCard'
import { Spinner } from '@/shared/components/Spinner'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`

const Message = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xl};
`

export function PostsList() {
  const { t } = useTranslation()
  const { data: posts, isLoading, isError } = usePostsQuery()

  if (isLoading) return <Spinner />
  if (isError) return <Message>{t('posts.error')}</Message>
  if (!posts?.length) return <Message>{t('posts.noResults')}</Message>

  return (
    <Grid>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Grid>
  )
}
```

**Step 2: Create `src/features/posts/index.ts`**

```typescript
export { PostsList } from './components/PostsList'
export { PostCard } from './components/PostCard'
export { usePostsQuery } from './hooks/usePostsQuery'
export type { Post } from './hooks/usePostsQuery'
```

**Step 3: Replace `src/pages/Home.tsx`**

```tsx
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/features/auth/store/authStore'
import { PostsList } from '@/features/posts/components/PostsList'
import { Button } from '@/shared/components/Button'

const Layout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.lg}`};
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`

export default function Home() {
  const { t } = useTranslation()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <Layout>
      <Header>
        <Title>{t('posts.title')}</Title>
        <UserInfo>
          {user && <UserName>{user.name}</UserName>}
          <Button variant="ghost" onClick={logout}>
            {t('nav.logout')}
          </Button>
        </UserInfo>
      </Header>
      <PostsList />
    </Layout>
  )
}
```

**Step 4: Run all tests**

```bash
npm test
```

Expected: All tests PASS.

**Step 5: Test the app manually**

```bash
npm run dev
```

- Visit `http://localhost:5173` → should redirect to `/login`
- Log in with any email + password `password` → should go to home, show posts grid
- Click Logout → should redirect back to `/login`

**Step 6: Commit**

```bash
git add src/features/posts/components/PostsList.tsx src/features/posts/index.ts src/pages/Home.tsx
git commit -m "feat: add PostsList component and complete Home page"
```

---

## Phase 8: E2E Tests

### Task 22: Configure Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/smoke.spec.ts`
- Modify: `package.json` (add script)

**Step 1: Create `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 2: Add E2E script to `package.json`**

```json
"test:e2e": "playwright test"
```

**Step 3: Create `e2e/smoke.spec.ts`**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('login form has email and password fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('can log in with demo credentials and see posts', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('demo@example.com')
    await page.getByLabel(/password/i).fill('password')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: /posts/i })).toBeVisible()
  })

  test('shows error for wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('demo@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('404 page renders for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
  })
})
```

**Step 4: Run E2E tests**

```bash
npm run test:e2e
```

Expected: 5 tests PASS. (This builds the app and runs Playwright against the preview server — may take ~30 seconds.)

**Step 5: Add Playwright artifacts to `.gitignore`**

Add to `.gitignore`:

```
playwright-report/
test-results/
```

**Step 6: Commit**

```bash
git add playwright.config.ts e2e/ package.json .gitignore
git commit -m "test: add playwright e2e smoke tests"
```

---

## Phase 9: CI

### Task 23: Add GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create `.github/workflows/ci.yml`**

```bash
mkdir -p .github/workflows
```

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check

  typecheck:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    needs: typecheck
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run test:coverage

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**Step 2: Commit**

```bash
git add .github/
git commit -m "ci: add github actions workflow with lint, typecheck, test, build, e2e"
```

---

## Phase 10: Final Verification

### Task 24: Full verification pass

**Step 1: Run all unit tests with coverage**

```bash
npm run test:coverage
```

Expected: All tests pass. Coverage ≥ 80% on statements and branches.

**Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No errors.

**Step 3: Run lint**

```bash
npm run lint
```

Expected: No errors (warnings OK).

**Step 4: Run E2E tests**

```bash
npm run test:e2e
```

Expected: 5 tests pass.

**Step 5: Build for production**

```bash
npm run build
```

Expected: `dist/` created, no errors.

**Step 6: Final commit**

```bash
git add -A
git status  # verify nothing unexpected is staged
git commit -m "chore: boilerplate complete — all tests green"
```

---

## Summary

When complete, the boilerplate will have:

- **23 tasks** → ~24 commits, each atomic and focused
- **~15 unit/component tests** covering auth store, Button, PostCard, usePostsQuery
- **5 Playwright smoke tests** covering the full login → posts flow
- **GitHub Actions CI** with 5 sequential jobs
- A working demo (posts feature) that shows every pattern in action

To start a new project from this boilerplate: clone the repo, run `npm install`, delete `src/features/posts/`, and build from `src/features/`.
