import { Outlet, useLocation } from 'react-router-dom'
import useMobileSidebar from '../hooks/useMobileSidebar'
import TabBar from './Sidebar/TabBar'
import { lazy } from 'react'
import Appbar from './Sidebar/AppBar'

const Sidebar = lazy(() => import('./Sidebar/Sidebar'))

const MainContainer = () => {
  const { show, hideAppBar, setHideAppBar } = useMobileSidebar()
  const location = useLocation()
  return (
    <main className="flex h-full w-full min-w-80 flex-1 flex-col bg-background-secondary text-foreground sm:flex-row">
      <Sidebar />
      <Appbar
        hideAppBar={hideAppBar || location.pathname !== '/'}
        show={show}
      />

      <main
        key={location.pathname}
        className="flex h-dvh flex-1 flex-col sm:w-full md:bg-inherit lg:flex-1"
      >
        <Outlet context={setHideAppBar} />
      </main>

      <TabBar hideAppBar={hideAppBar} show={show} />
    </main>
  )
}

export default MainContainer
