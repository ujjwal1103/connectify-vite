import ReactDOM from 'react-dom/client'
import './globle.css'
import { ThemeProvider } from '@/components/ThemeProvider.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext.tsx'
import { Provider } from 'react-redux'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './redux/store.ts'
import { lazy } from 'react'
import { Toaster } from 'sonner'
const App = lazy(() => import('./App'))

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <App />
          </AuthProvider>
          <Toaster
            toastOptions={{
              unstyled: true,
              classNames: {
                toast: 'bg-background p-3 rounded-md text-foreground',
                title: 'text-red-400',
                description: 'text-red-400',
                actionButton: 'bg-zinc-400',
                cancelButton: 'bg-orange-400',
                closeButton: 'bg-lime-400',
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </Router>
)
