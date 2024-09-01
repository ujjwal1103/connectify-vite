  import { useAuth } from '@/context/AuthContext'
  import { Navigate } from 'react-router-dom'
  import MainContainer from './components/MainContainer'
  import { SocketProvider } from '@/context/SocketContext'

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
