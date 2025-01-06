/* eslint-disable import/no-unresolved */
import SidePannel, { Menu } from '@/components/shared/SidePannel/SidePannel'
import { cn } from '@/lib/utils'
import Search from '@/modules/search/Search'
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { XIcon } from 'lucide-react'
import { NewStory } from '@/modules/story/NewStory/NewStory'

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
    e: React.MouseEvent<HTMLAnchorElement>,
    modalName: ModalStateNames,
    modal?: boolean
  ) => {
    if (modal) {
      e.preventDefault()
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
    handleModalClose('openPostModal', 'create', e.target!)
  }
  const handleOpenNewStory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    handleModalClick(e, 'newStory', true)
    handleModalClose('openPostModal', 'create', e.target!)
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          'z-[120] hidden h-dvh w-64 flex-col border-r-[0.2px] border-zinc-800 bg-background p-2 font-semibold text-foreground sm:flex',
          isInboxOpen && 'hidden transition-all duration-300 sm:flex w-auto'
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
            onClose={(e: { target: EventTarget }) =>
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
          <PostOptions
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
              handleModalClose('newPost', 'newpost', e?.target)
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
                handleModalClose('moreOptions', 'more', e.target)
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
                handleModalClose('newStory', 'New Story', e.target)
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Sidebar)

const StoryModal = ({ onClose }: {onClose:(e: React.MouseEvent<HTMLButtonElement>)=>void}) => {
  return (
    <div className="relative h-96 w-screen bg-black md:w-96">
      <button className="absolute right-3 top-3" onClick={onClose}>
        <XIcon />
      </button>
      <NewStory />
    </div>
  )
}

const PostOptions = ({ handleOpenNewPost, handleOpenNewStory }: any) => {
  const [top, setBottom] = useState('144px')
  useLayoutEffect(() => {
    const createButton = document.getElementById('create')

    const rect = createButton?.getBoundingClientRect()
    console.log(rect)
    if (rect?.top) {
      setBottom(rect?.top + rect.height + 8 + 'px')
    }
  }, [])

  return (
    <ul
      className="absolute z-[200] w-60 rounded-md border border-border bg-background"
      style={{
        top,
        left: '8px',
      }}
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
    </ul>
  )
}
