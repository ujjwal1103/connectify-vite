import Avatar from '@/components/shared/Avatar'
import { cn, formatDate } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import {
  ArchiveIcon,
  BellOff,
  Ellipsis,
  MessageSquareX,
  ShieldBan,
  Trash2,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'
import { deleteConversation } from '@/api'

const truncateMessage = (message: string, maxLength = 50) => {
  if (message.length <= maxLength) {
    return message
  }
  return message.slice(0, maxLength) + '...'
}

const formatMessage = (message: string, messageType: string) => {
  if (messageType !== 'TEXT_MESSAGE') {
    return ''
  }
  return truncateMessage(message)
}

const Chat = ({ chat }: any) => {
  const { chatId } = useParams()
  const {
    selectChats,
    selectedChat,
    setSelectedChat,
    setMessagePage,
    setMessages,
    setSelectedChats,
    selectedChats,
    removeChat,
  } = useChatSlice()
  const [moreOptions, setMoreOptions] = useState(false)
  const [menuPosition, setMenuPosition] = useState<any>({
    top: 0,
    left: 0,
    bottom: 'auto',
    right: 'auto',
    origin: 'top left',
  })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const selectThisChat = () => {
    if (selectedChat?._id !== chat._id || !chatId) {
      setMessagePage(1)
      setMessages([])
      navigate(`/inbox/${chat._id}`)
      setSelectedChat(chat)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMoreOptions(false)
    }
  }

  const handleScroll = () => {
    setMoreOptions(false)
  }

  const handleMoreOptions = () => {
    setMoreOptions(true)
  }

  const handleDeleteChat = useCallback(async () => {
    const chatId = chat?._id
    setMoreOptions(false)
    removeChat(chatId)
    navigate('/inbox')
    await deleteConversation(chatId)
  }, [])

  useLayoutEffect(() => {
    if (moreOptions && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()

      const menuHeight = 216
      const isSmall = window.innerWidth <= 768
      let top = buttonRect.bottom + window.scrollY + 8
      let left = isSmall ? 'auto' : buttonRect.left + 24
      let bottom = 'auto'
      let right = isSmall ? 10 : 'auto'
      let origin = isSmall ? 'top right' : 'top left'

      console.log(buttonRect.top + window.screenY - menuHeight)

      if (window.innerHeight - buttonRect.bottom < menuHeight) {
        top = buttonRect.top + window.scrollY - menuHeight - 8
        origin = isSmall ? 'bottom right' : 'bottom left'
      }

      if (top < 0) {
        top = 8
        bottom = 'auto'
      }
      setMenuPosition({ top, left, bottom, right, origin })
    }
  }, [moreOptions])

  useEffect(() => {
    if (moreOptions) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('scroll', handleScroll, true)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [moreOptions])

  return (
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, y: -200 }}
      className={cn(
        'group relative flex w-full cursor-pointer items-center justify-between p-2 transition-colors duration-500 hover:bg-secondary',
        {
          'bg-secondary': chatId === chat?._id,
        }
      )}
      onClick={selectThisChat}
    >
      <AvatarAndCheckbox
        selectChats={selectChats}
        selectedChats={selectedChats}
        chat={chat}
        setSelectedChats={setSelectedChats}
      />
      <div
        className="flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.span className="text-xss">
          {formatDate(chat?.lastMessage?.createdAt!)}
        </motion.span>
        {chat?.unreadMessageCount && (
          <button className="h-4 w-4 rounded-full bg-gradient-to-l from-sky-900 to-indigo-900 text-xss text-sky-100">
            {chat?.unreadMessageCount}
          </button>
        )}

        <button
          ref={buttonRef}
          tabIndex={0}
          role="button"
          className="translate-x-7 self-end transition-transform duration-300 group-hover:inline-block group-hover:-translate-x-0"
          onClick={handleMoreOptions}
        >
          <Ellipsis />
        </button>

        {createPortal(
          <AnimatePresence>
            {moreOptions && (
              <motion.div
                ref={menuRef}
                className="absolute z-50 rounded bg-zinc-900 p-2 shadow-xl"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.3 }}
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                  bottom: menuPosition.bottom,
                  right: menuPosition.right,
                  transformOrigin: menuPosition.origin,
                }}
              >
                <ChatMenu handleDeleteChat={handleDeleteChat} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </motion.div>
  )
}
export default Chat

const ChatMenu = ({ handleDeleteChat }: any) => {
  return (
    <ul className="w-44">
      <li className="cursor-pointer rounded-md p-2 hover:bg-zinc-800">
        <button
          type="button"
          className="flex w-full items-center justify-between"
        >
          <span>
            <ArchiveIcon />
          </span>{' '}
          <span>Archive Chat</span>
        </button>
      </li>

      <li className="cursor-pointer rounded-md p-2 hover:bg-zinc-800">
        <button
          type="button"
          className="flex w-full items-center justify-between"
        >
          <span>
            <BellOff />
          </span>
          <span>Mute</span>
        </button>
      </li>
      <li className="cursor-pointer rounded-md p-2 hover:bg-zinc-800">
        <button
          type="button"
          className="flex w-full items-center justify-between"
        >
          <span>
            <MessageSquareX />
          </span>
          <span>Clear Chat</span>
        </button>
      </li>
      <li className="cursor-pointer rounded-md p-2 hover:bg-zinc-800">
        <button
          type="button"
          className="flex w-full items-center justify-between"
        >
          <span>
            <ShieldBan />
          </span>
          <span>Block</span>
        </button>
      </li>
      <li className="cursor-pointer rounded-md p-2 text-red-600 hover:bg-zinc-800">
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={handleDeleteChat}
        >
          <span>
            <Trash2 />
          </span>
          <span> Delete Chat</span>
        </button>
      </li>
    </ul>
  )
}

const AvatarAndCheckbox = ({
  selectChats,
  selectedChats,
  chat,
  setSelectedChats,
}: any) => {
  return (
    <div className="flex items-center space-x-2">
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn('-translate-x-10 transition-transform', {
          'translate-x-0': selectChats,
        })}
      >
        <input
          type="checkbox"
          name=""
          checked={selectedChats.includes(chat._id)}
          id=""
          className="text-red-400 accent-blue-900"
          onChange={() => {
            setSelectedChats(chat._id)
          }}
        />
      </div>
      <div
        className={cn(
          'flex -translate-x-5 items-center space-x-2 transition-transform',
          {
            'translate-x-0': selectChats,
          }
        )}
      >
        <Avatar
          src={
            chat.isGroup ? chat?.groupAvatar?.url : chat?.friend?.avatar?.url
          }
          name={chat.isGroup ? chat?.groupName : chat?.friend?.name}
          className="inline-block size-8 rounded-full bg-background object-cover duration-500 hover:scale-90"
        />
        <div className="flex flex-col leading-none">
          <span className="text-forground text-sm font-medium">
            {chat.isGroup ? chat?.groupName : chat?.friend?.name}
          </span>
          <span
            className="text-sm font-medium text-gray-500 dark:text-gray-400"
            title={chat?.lastMessage?.text}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              maxWidth: '200px',
            }}
          >
            {formatMessage(
              chat?.lastMessage?.text,
              chat?.lastMessage?.messageType
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
