import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'

const SessionExpire = () => {
  const { logout } = useAuth()
  return (
    <section className="h-dvh bg-background">
      <div className="flex h-full items-center justify-center px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">
            401
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            Session Expire
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Your session has expired due to inactivity. Please log in again to
            continue.
          </p>
          <Link
            to="/login"
            onClick={logout}
            className="focus:ring-primary-300 my-4 inline-flex rounded-md bg-orange-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-800 hover:text-white focus:outline-none focus:ring-4 dark:focus:ring-orange-900"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SessionExpire
