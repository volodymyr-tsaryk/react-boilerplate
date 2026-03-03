import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { queryClient } from '@/api/queryClient'
import { theme, GlobalStyles } from '@/shared/styles'
import { AppRouter } from '@/routes/AppRouter'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
