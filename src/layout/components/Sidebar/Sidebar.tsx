import SidePannel, { Menu } from '@/components/shared/SidePannel/SidePannel'
import { cn } from '@/lib/utils'
import Search from '@/modules/search/Search'
import {
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import CreateNewPost from '../NewPost/CreateNewPost'
import MoreMenu from '@/components/shared/MoreMenu'
import Notification from '@/modules/notifications/Notifications'
import { AnimatePresence } from 'framer-motion'
import Modal from '@/components/shared/modal/Modal'
import {
  ModalStateNames,
  useModalStateSlice,
} from '@/redux/services/modalStateSlice'
import { SidebarRoute, sidebarRoutes } from './sidebarRoutes'
import SidebarHeader from './SidebarHeader'
import Route from './Route'
import { useSocket } from '@/context/SocketContext'
import { LIKE_POST, NEW_MESSAGE, NEW_REQUEST } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'

const Sidebar = () => {
  const [counts, setCounts] = useState({
    messenger: 0,
    notification: 0,
  })
  const { socket } = useSocket()
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
  const handleNewMessage = () => {
    setCounts((prev) => ({ ...prev, messenger: prev.messenger + 1 }))
  }
  const handleNewNotification = () => {
    setCounts((prev) => ({ ...prev, notification: prev.notification + 1 }))
  }

  const eventHandlers = {
    [NEW_MESSAGE]: handleNewMessage,
    [LIKE_POST]: handleNewNotification,
    [NEW_REQUEST]: handleNewNotification,
  }

  useSocketEvents(socket, eventHandlers)

  const handleModalClick = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    modalName: ModalStateNames,
    modal?: boolean
  ) => {
    if (modal) {
      e.preventDefault()
      handleModalToggle(modalName!)
    }
  }

  const renderRouteItem = useCallback(
    (route: SidebarRoute) => {
      const isDisabled = route.modal
        ? notiSheet || searchSheet || moreOptions || openPostModal
        : false
      const count = route.badge
        ? route.label === 'Messages'
          ? counts.messenger
          : counts.notification
        : null
      return (
        <Route
          {...route}
          key={route.label}
          handleModalClick={handleModalClick}
          isDisabled={isDisabled}
          count={count}
        />
      )
    },
    [counts.messenger, counts.notification]
  )

  return (
    <>
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          'z-30 hidden h-dvh max-w-[300px] flex-col bg-background p-2 font-semibold text-foreground sm:flex lg:flex-[0.1]'
        )}
      >
        <SidebarHeader />
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
