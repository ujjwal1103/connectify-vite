import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser } from '@/lib/localStorage'
import { Edit, EllipsisVertical } from 'lucide-react'
import { useRef, useState } from 'react'
import { useClickOutside } from '@react-hookz/web'
import { useChatSlice } from '@/redux/services/chatSlice'
import Modal from '@/components/shared/modal/Modal'
import AddNewUser from './NewChat'
import useModalStore from '@/zustand/newChatStore'
import Tooltip from '@/components/shared/Tooltip'
import { Button } from '@/components/ui/button'

const ChatListHeader = () => {
  const [open, setOpen] = useState(false)
  const { isModalOpen, closeModal, openModal } = useModalStore()
  const user = getCurrentUser()
  const { selectChats, setSelectChats } = useChatSlice()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useClickOutside(menuRef, (e: Event) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
      return
    }
    setOpen(false)
  })

  return (
    <div className="flex flex-[0.1] items-center">
      <div className="flex w-full items-center justify-between gap-2 p-2 md:gap-4">
        <Avatar
          src={user?.avatar?.url}
          className="inline-block size-9 rounded-full object-cover duration-500 hover:scale-90 lg:size-12"
        />
        <div className="0 flex-1 text-base">
          <h4 className="line-clamp-1 text-sm font-semibold leading-4">
            {user?.name}
          </h4>
          <UsernameLink
            username={user?.username}
            className="text-xss text-foreground lg:text-base"
          >
            <span className="text-sm"> {user?.username}</span>
          </UsernameLink>
        </div>
        <div className="flex">
          <Tooltip text="New Chat">
            <Button size={'icon'}
                variant="ghost" className="" onClick={openModal}>
              <Edit />
            </Button>
          </Tooltip>
          <div className="relative inline-block">
            <Tooltip text="Menu">
              <Button
                size={'icon'}
                variant="ghost"
                ref={buttonRef}
                onClick={() => {
                  setOpen(!open)
                }}
              >
                <EllipsisVertical />
              </Button>
            </Tooltip>

            <AnimatePresence>
              {open && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{
                    top: '32',
                    right: '8px',
                    width: '170px',
                    transformOrigin: 'top right',
                  }}
                  className="absolute z-[90] rounded bg-primary-foreground shadow-lg"
                >
                  <ul tabIndex={0} className="menu z-[100] p-2 shadow">
                    <li className="text-sm">
                      <span>Profile</span>
                    </li>
                    <li className="text-sm">
                      <button
                        onClick={() => {
                          setSelectChats(!selectChats)
                          setOpen(false)
                        }}
                      >
                        <span>Select Chats</span>
                      </button>
                    </li>
                    <li className="text-sm">
                      <span>Clear Chat</span>
                    </li>
                    <li className="text-sm">
                      <span>Delete Chat</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            overlayClasses={'bg-opacity-80'}
            showCloseButton={false}
            shouldCloseOutsideClick={false}
            onClose={closeModal}
          >
            <AddNewUser />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
export default ChatListHeader
