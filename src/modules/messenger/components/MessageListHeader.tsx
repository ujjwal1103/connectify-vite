import Avatar from '@/components/shared/Avatar'
import { useChatSlice } from '@/redux/services/chatSlice'
import { useClickOutside } from '@react-hookz/web'
import { motion, AnimatePresence } from 'framer-motion'
import { Ellipsis } from 'lucide-react'
import { useState, useRef } from 'react'

const MessageListHeader = ({
  toggleShowInfo,
}: {
  toggleShowInfo: () => void
}) => {
  const { selectedChat, setIsSelectMessages } = useChatSlice()
  const [open, setOpen] = useState(false)

  const menuRef = useRef<any>(null)
  const buttonRef = useRef<any>(null)

  useClickOutside(menuRef, (e) => {
    if (buttonRef.current && buttonRef.current.contains(e.target)) {
      return
    }
    buttonRef?.current?.focus()
    setOpen(false)
  })

  const handleButtonClick = () => setOpen((prev) => !prev)

  return (
    <div className="relative z-100 flex flex-[0.05] items-center bg-secondary px-4 py-2">
      <div
        className="flex items-center gap-3 font-semibold"
        onClick={toggleShowInfo}
      >
        <Avatar
          src={
            selectedChat?.isGroup
              ? selectedChat?.groupAvatar?.url
              : selectedChat?.friend?.avatar?.url
          }
        />
        <span>
          {selectedChat?.isGroup
            ? selectedChat.groupName
            : selectedChat?.friend?.name}
        </span>
      </div>

      <div className="ml-auto">
        <button ref={buttonRef} onClick={handleButtonClick}>
          <Ellipsis />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              layout
              transition={{ type: 'tween' }}
              className="absolute right-10 z-100 origin-top-right rounded bg-zinc-900"
            >
              <ul ref={menuRef} tabIndex={0} className="menu z-100 p-2 shadow">
                <li className="text-sm">
                  <span>Chat Info</span>
                </li>
                <li className="text-sm">
                  <button
                    onClick={() => {
                      setIsSelectMessages(true)
                      setOpen(false)
                    }}
                  >
                    <span>Select Messages</span>
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
  )
}
export default MessageListHeader
