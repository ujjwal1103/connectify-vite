import Avatar from '@/components/shared/Avatar'
import DropDownMenuItem from '@/components/shared/dialogs/DropDownMenu/DropDownMenuItem'
import { tranformUrl } from '@/lib/utils'
import { useClickOutside } from '@react-hookz/web'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Ellipsis,
  Info,
  ListChecks,
  MessageSquareX,
  Trash2,
} from 'lucide-react'
import { useState, useRef, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat, useMessage } from '@/redux/services/chatSlice'
import { IChat } from '@/lib/types'

type MessageListHeaderProps = {
  selectedChat: IChat | null
}

const MessageListHeader = ({ selectedChat }: MessageListHeaderProps) => {
  const { toggleShowChat } = useChat()
  const { setIsSelectMessages } = useMessage()
  const [open, setOpen] = useState(false)

  const menuRef = useRef<any>(null)
  const buttonRef = useRef<any>(null)
  const navigate = useNavigate()

  useClickOutside(menuRef, (e) => {
    if (buttonRef.current && buttonRef.current.contains(e.target)) {
      return
    }
    buttonRef?.current?.focus()
    setOpen(false)
  })

  useEffect(() => {
    return () => {
      setIsSelectMessages(false)
    }
  }, [selectedChat?._id])

  const handleButtonClick = () => setOpen((prev) => !prev)

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="relative z-100 flex flex-[0.05] items-center bg-background px-4 py-2">
      <button className="pr-2" onClick={handleGoBack}>
        <ChevronLeft size={24} />
      </button>
      <div
        className="flex items-center gap-3 font-semibold"
        onClick={toggleShowChat}
      >
        <Avatar
          src={tranformUrl(
            selectedChat?.isGroup
              ? selectedChat?.groupAvatar?.url
              : selectedChat?.friend?.avatar?.url
          )}
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
              className="absolute right-10 z-100 w-44 origin-top-right rounded bg-accent"
            >
              <ul ref={menuRef} tabIndex={0} className="z-100 p-1 shadow">
                <DropDownMenuItem
                  label="Chat Info"
                  icon={Info}
                  onClick={() => {
                    setOpen(false)
                    toggleShowChat()
                  }}
                />
                <DropDownMenuItem
                  label="Select Messages"
                  icon={ListChecks}
                  onClick={() => {
                    setIsSelectMessages(true)
                    setOpen(false)
                  }}
                />
                <DropDownMenuItem label="Clear Chat" icon={MessageSquareX} />
                <DropDownMenuItem label="Delete Chat" icon={Trash2} />
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
export default memo(MessageListHeader)
