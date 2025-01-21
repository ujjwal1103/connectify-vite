import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'
import { SocketProvider } from '@/context/SocketContext'
import { lazy } from 'react';

const MainContainer = lazy(() => import("./components/MainContainer"));

const AppLayout = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />
  }

  return (
    <SocketProvider>
      <MainContainer />
    </SocketProvider>
  )
}

export default AppLayout
