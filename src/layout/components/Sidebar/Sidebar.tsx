import ConnectifyIcon from '@/components/icons/Connectify'
import ConnectifyLogoText from '@/components/icons/ConnectifyLogoText'
import SidePannel, { Menu } from '@/components/shared/SidePannel/SidePannel'
import { cn } from '@/lib/utils'
import Search from '@/modules/search/Search'
import {
  Compass,
  Heart,
  Home,
  Menu as MenuIcon,
  Search as SearchIcon,
  Send,
  SquarePlay,
  SquarePlus,
  User2,
} from 'lucide-react'

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import CreateNewPost from '../NewPost/CreateNewPost'
import MoreMenu from '@/components/shared/MoreMenu'
import Notification from '@/modules/notifications/Notifications'
import { AnimatePresence } from 'framer-motion'
import Modal from '@/components/shared/modal/Modal'
import {
  ModalStateNames,
  useModalStateSlice,
} from '@/redux/services/modalStateSlice'

const sidebarRoutes: SidebarRoute[] = [
  { route: '/', label: 'Home', icon: <Home /> },
  {
    route: '/search',
    label: 'Search',
    icon: <SearchIcon />,
    modal: true,
    modalName: 'searchSheet',
  },
  { route: '/explore', label: 'Explore', icon: <Compass /> },
  { route: '/reels', label: 'Reels', icon: <SquarePlay /> },
  { route: '/inbox', label: 'Messages', icon: <Send /> },
  {
    route: '/notifications',
    label: 'Notifications',
    icon: <Heart />,
    modal: true,
    modalName: 'notiSheet',
  },
  {
    route: '/create',
    label: 'Create',
    icon: <SquarePlus />,
    modal: true,
    modalName: 'openPostModal',
  },
  { route: '/profile', label: 'Profile', icon: <User2 /> },
  {
    route: '/more',
    label: 'More',
    icon: <MenuIcon />,
    modal: true,
    modalName: 'moreOptions',
  },
]

interface SidebarRoute {
  route: string
  label: string
  icon: JSX.Element
  modal?: boolean
  modalName?: ModalStateNames
}

const Sidebar = () => {
  const {
    setModalState,
    notiSheet,
    searchSheet,
    moreOptions,
    openPostModal,
    resetModalState,
  } = useModalStateSlice()

  const sidebarRef = useRef<any>()
  const location = useLocation()

  const isMessenger = useMemo(
    () => location.pathname.includes('inbox'),
    [location.pathname]
  )

  const handleResize = useCallback(() => {
    resetModalState()
  }, [])

  useEffect(() => {
    handleResize()
  }, [location.pathname])

  const handleModalToggle = (modalName: ModalStateNames) => {
    setModalState(modalName)
  }

  const handleModalClose = (
    modalName: ModalStateNames,
    id: string,
    target: EventTarget
  ) => {
    if (!sidebarRef.current) return

    const modalElement = sidebarRef.current.querySelector(
      `#${id.toLowerCase()}`
    )
    if (modalElement && modalElement.contains(target as Node)) return

    setModalState(modalName)
  }

  const renderRouteItem = useCallback(
    ({ route, label, icon, modal, modalName }: SidebarRoute) => {
      const isDisabled = modal
        ? notiSheet || searchSheet || moreOptions || openPostModal
        : false
      return (
        <li key={route} className="last:mt-auto" id={label.toLowerCase()}>
          <NavLink
            to={route}
            className={({ isActive }) =>
              cn(
                'inline-block items-center rounded p-2 transition-all duration-200 ease-linear hover:bg-primary-foreground lg:flex lg:gap-2',
                {
                  'bg-primary-foreground shadow-lg': isActive,
                  'shadow-inner ring ring-background': isDisabled,
                }
              )
            }
            onClick={(e) => {
              if (modal) {
                e.preventDefault()
                handleModalToggle(modalName!)
              }
            }}
          >
            <div className="mx-2">{icon}</div>
            <div
              className={cn('hidden sm:hidden lg:inline-block', {
                'lg:hidden': isMessenger,
              })}
            >
              <span className="text-lg">{label}</span>
            </div>
          </NavLink>
        </li>
      )
    },
    []
  )

  return (
    <>
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          'z-30 hidden h-dvh max-w-[300px] flex-col bg-background p-2 font-semibold text-foreground md:flex lg:flex-[0.1]',
          { 'lg:flex-[0.001]': isMessenger }
        )}
      >
        <div className="z-20 flex h-10 w-full items-center justify-around gap-2">
          <Link to={'/'}>
            <ConnectifyIcon size={42} />
          </Link>
          <Link
            to={'/'}
            className={cn('sm:hidden lg:block', { 'lg:hidden': isMessenger })}
          >
            <ConnectifyLogoText w="200" h="44" />
          </Link>
        </div>
        <ul className="flex flex-[1] flex-col gap-2 py-3">
          {sidebarRoutes.map(renderRouteItem)}
        </ul>
      </aside>

      <AnimatePresence>
        {searchSheet && (
          <SidePannel
            width={searchSheet ? sidebarRef?.current?.offsetWidth : -400}
            onClose={(e: any) =>
              handleModalClose('searchSheet', 'search', e.target)
            }
          >
            <Search />
          </SidePannel>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notiSheet && (
          <SidePannel
            onClose={(e: any) =>
              handleModalClose('notiSheet', 'notifications', e.target)
            }
            width={notiSheet ? sidebarRef?.current?.offsetWidth : -400}
          >
            <Notification />
          </SidePannel>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openPostModal && (
          <Modal
            shouldCloseOutsideClick={false}
            showCloseButton={false}
            onClose={(e: any) =>
              handleModalClose('openPostModal', 'create', e?.target)
            }
          >
            <CreateNewPost />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {moreOptions && (
          <Menu
            left={sidebarRef?.current?.offsetWidth}
            onClose={(e: any) =>
              handleModalClose('moreOptions', 'more', e?.target)
            }
          >
            <MoreMenu />
          </Menu>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Sidebar)
