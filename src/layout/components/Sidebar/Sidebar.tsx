import SidePannel, { Menu } from '@/components/shared/SidePannel/SidePannel'
import { cn } from '@/lib/utils'
import Search from '@/modules/search/Search'
import { memo, MouseEvent, useCallback, useEffect, useRef } from 'react'
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

  const handleModalClick = (e:MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, modalName: ModalStateNames, modal?:boolean) => {
    if (modal) {
      e.preventDefault()
      handleModalToggle(modalName!)
    }
  }

  const renderRouteItem = useCallback((route: SidebarRoute) => {
    const isDisabled = route.modal
      ? notiSheet || searchSheet || moreOptions || openPostModal
      : false
    return (
      <Route
        {...route}
        handleModalClick={handleModalClick}
        isDisabled={isDisabled}
      />
    )
  }, [])

  return (
    <>
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          'z-30 hidden h-dvh max-w-[300px] flex-col bg-background p-2 font-semibold text-foreground md:flex lg:flex-[0.1]'
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
