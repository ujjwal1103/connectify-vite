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
          <Toaster  expand={true}/>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </Router>
)
