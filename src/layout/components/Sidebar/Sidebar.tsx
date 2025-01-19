import SidePannel, { Menu } from '@/components/shared/SidePannel/SidePannel'
import { cn } from '@/lib/utils'
import Search from '@/modules/search/Search'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CreateNewPost from '../NewPost/CreateNewPost'
import MoreMenu from '@/components/shared/MoreMenu'
import Notification from '@/modules/notifications/Notifications'
import { AnimatePresence, motion } from 'framer-motion'
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
import { XIcon } from 'lucide-react'
import { NewStory } from '@/modules/story/NewStory/NewStory'
import { useClickOutside } from '@react-hookz/web'

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
    newStory,
    newPost,
    resetModalState,
    setPostion,
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
    target: HTMLElement
  ) => {
    if (!sidebarRef.current) return

    console.log(modalName, id, target)
    if (target.id.toLocaleLowerCase() === id.toLocaleLowerCase()) return

    // const modalElement = sidebarRef.current.querySelector(
    //   `#${id.toLowerCase()}`
    // )
    // if (modalElement && modalElement.contains(target as Node)) return

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
    e: React.MouseEvent<HTMLAnchorElement>,
    modalName: ModalStateNames,
    modal?: boolean
  ) => {
    if (modal) {
      e.preventDefault()
      if (modalName === 'openPostModal') {
        const rect = e.currentTarget.getBoundingClientRect()

        const top = rect.top + rect.height + 10
        const left = rect.left

        setPostion({
          top,
          left,
          bottom: 'auto',
          right: 'auto',
        })
      }

      handleModalToggle(modalName!)
    }
  }

  const isInboxOpen = location.pathname.includes('/inbox')

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
          isHidden={isInboxOpen}
        />
      )
    },
    [
      counts.messenger,
      counts.notification,
      isInboxOpen,
      handleModalClick,
      moreOptions,
      notiSheet,
      openPostModal,
      searchSheet,
    ]
  )

  const handleOpenNewPost = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleModalClick(e, 'newPost', true)
    handleModalClose('openPostModal', 'create', e.target as HTMLElement)
  }
  const handleOpenNewStory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleModalClick(e, 'newStory', true)
    handleModalClose('openPostModal', 'create', e.target as HTMLElement)
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          'z-[120] hidden h-dvh w-auto flex-col border-r-[0.2px] border-zinc-800 bg-background p-2 font-semibold text-foreground sm:flex',
          isInboxOpen && 'hidden w-auto transition-all duration-300 sm:flex'
        )}
      >
        <SidebarHeader hide={isInboxOpen} />
        <ul className={cn('flex flex-[1] flex-col gap-2 py-3')}>
          {sidebarRoutes.map(renderRouteItem)}
        </ul>
      </aside>

      <AnimatePresence>
        {searchSheet && (
          <SidePannel
            width={searchSheet ? sidebarRef?.current?.offsetWidth : -400}
            onClose={(e: any) =>
              handleModalClose('searchSheet', 'search', e.target as HTMLElement)
            }
          >
            <Search />
          </SidePannel>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notiSheet && (
          <SidePannel
            onClose={(e: { target: EventTarget }) =>
              handleModalClose(
                'notiSheet',
                'notifications',
                e.target as HTMLElement
              )
            }
            width={notiSheet ? sidebarRef?.current?.offsetWidth : -400}
          >
            <Notification />
          </SidePannel>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openPostModal && (
          <PostOptions
            onClose={(e: { target: EventTarget }) =>
              handleModalClose(
                'openPostModal',
                'create',
                e.target as HTMLElement
              )
            }
            handleOpenNewPost={handleOpenNewPost}
            handleOpenNewStory={handleOpenNewStory}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {newPost && (
          <Modal
            shouldCloseOutsideClick={false}
            showCloseButton={false}
            onClose={(e) => {
              handleModalClose('newPost', 'newpost', e?.target as HTMLElement)
            }}
          >
            <CreateNewPost />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {moreOptions && (
          <Menu
            left={sidebarRef?.current?.offsetWidth}
            onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (e.target) {
                handleModalClose('moreOptions', 'more', e.target as HTMLElement)
              }
            }}
          >
            <MoreMenu />
          </Menu>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {newStory && (
          <StoryModal
            onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (e.target) {
                handleModalClose(
                  'newStory',
                  'New Story',
                  e.target as HTMLElement
                )
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Sidebar)

const StoryModal = ({
  onClose,
}: {
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  return (
    <div className="relative h-96 w-screen bg-black md:w-96">
      <button className="absolute right-3 top-3" onClick={onClose}>
        <XIcon />
      </button>
      <NewStory />
    </div>
  )
}

const PostOptions = ({
  handleOpenNewPost,
  handleOpenNewStory,
  onClose,
}: any) => {
  const { postMenuPosition } = useModalStateSlice()
  const menuRef = useRef<HTMLUListElement>(null)

  useClickOutside(menuRef, onClose)

  return (
    <motion.ul
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      ref={menuRef}
      className="absolute z-[200] md:w-60 w-44  rounded-md border overflow-hidden border-border bg-background origin-bottom"
      style={postMenuPosition}
    >
      <li className="p-2 hover:bg-secondary" onClick={handleOpenNewPost}>
        Post
      </li>
      <li onClick={handleOpenNewStory} className="p-2 hover:bg-secondary">
        Reel
      </li>
      <li onClick={handleOpenNewStory} className="p-2 hover:bg-secondary">
        Story
      </li>
    </motion.ul>
  )
}
