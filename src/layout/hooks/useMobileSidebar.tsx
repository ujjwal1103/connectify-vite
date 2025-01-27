import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const useMobileSidebar = () => {
  const [show, setShow] = useState(false)
  const [hideAppBar, setHideAppBar] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const tabUrls = ['/', '/search', '/notifications', '/create', '/profile']

    if (tabUrls.includes(location.pathname)) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [location.pathname])
  return { show, hideAppBar, setHideAppBar }
}

export default useMobileSidebar
