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
import { clearAllMessages } from '@/api'
import { toast } from 'sonner'

type MessageListHeaderProps = {
  selectedChat: IChat | null
}

const MessageListHeader = ({ selectedChat }: MessageListHeaderProps) => {
  const { toggleShowChat } = useChat()
  const { setIsSelectMessages, setMessages, setMessagePage } = useMessage()
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

  const confirmDeleteAllMessages = async () => {
    const response = confirm('This will delete all messages from chat.')
    if (response) {
      setIsSelectMessages(false)
      setOpen(false)
      setMessages([])
      setMessagePage(1)

      const res = await clearAllMessages(selectedChat!._id)
      toast.success('All Messages deleted successfully.')
      console.log(res)
    }
  }

  return (
    <div className="relative z-100 flex flex-[0.05] items-center bg-background py-2 pr-3">
      <button className="block pl-2 md:hidden" onClick={handleGoBack}>
        <ChevronLeft size={24} />
      </button>
      <div
        className="ml-2 flex items-center gap-3 font-semibold"
        onClick={() => toggleShowChat('Chat Info')}
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
                    toggleShowChat('Chat Info')
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
                <DropDownMenuItem
                  label="Clear Chat"
                  icon={MessageSquareX}
                  onClick={confirmDeleteAllMessages}
                />
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
