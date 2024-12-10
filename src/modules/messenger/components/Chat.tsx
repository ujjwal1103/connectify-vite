import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  ArchiveIcon,
  AudioLines,
  BellOff,
  Ellipsis,
  ImageIcon,
  MessageSquareX,
  ShieldBan,
  Trash2,
  VideoIcon,
} from 'lucide-react'
import { useChatSlice } from '@/redux/services/chatSlice'
import Avatar from '@/components/shared/Avatar'
import { cn, formatDate, tranformUrl } from '@/lib/utils'
import { deleteConversation } from '@/api'
import { IChat } from '@/lib/types'
import { useSocket } from '@/context/SocketContext'
import useSocketEvents from '@/hooks/useSocketEvent'
import DropDownMenuItem from '@/components/shared/dialogs/DropDownMenu/DropDownMenuItem'
import DropDownMenu from '@/components/shared/dialogs/DropDownMenu/DropDownMenu'

const formatMessage = (message: string, messageType: string) => {
  if (messageType === 'IMAGE') {
    return (
      <span className="flex items-center gap-1 text-xs">
        <ImageIcon className="size-3" /> Image
      </span>
    )
  }
  if (messageType === 'VIDEO') {
    return (
      <span className="flex items-center gap-1 text-xs">
        <VideoIcon className="size-3" /> Image
      </span>
    )
  }
  if (messageType === 'AUDIO') {
    return (
      <span className="flex items-center gap-1 text-xs">
        <AudioLines className="size-3" /> Image
      </span>
    )
  }
  if (messageType === 'TEXT_MESSAGE') {
    return message
  }
  return ''
}

interface ChatProps {
  chat: IChat
}

const Chat = ({ chat }: ChatProps) => {
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
    setChatToFirst,
  } = useChatSlice()
  const { socket } = useSocket()
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
      navigate(`/inbox/${chat._id}`, { replace: true })
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
      console.log(buttonRect)

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

  const handleMessage = useCallback((data: any) => {
    if (data.chat) {
      console.log('updating chat index')
      setChatToFirst({
        message: data.message,
        shouldSetUnseenMessageCount: chatId !== data.chat,
      })
    }
  }, [])

  const event = `chat:${chat._id}:message`

  const eventHandlers = {
    [event]: handleMessage,
  }

  useSocketEvents(socket, eventHandlers)

  return (
    <motion.div
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
      {chat?.unseenMessagesCount! > 0 && (
        <button className="ml-auto mr-3 h-5 w-5 rounded-full bg-gradient-to-l from-sky-900 to-indigo-900 text-xss text-sky-100">
          {chat?.unseenMessagesCount}
        </button>
      )}
      <div
        className="flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.span className="text-xss">
          {formatDate(chat?.lastMessage?.createdAt!)}
        </motion.span>
        <DropDownMenu items={[
           {
            title:"Archive Chat",
            icon: ArchiveIcon
           },
           {
            title:"Mute",
            icon: BellOff
           },
           {
            title:"Clear Chat",
            icon: MessageSquareX
           },
           {
            title:"Block",
            icon: MessageSquareX
           },
           {
            title:"Delete Chat",
            icon: Trash2,
            onPress:handleDeleteChat
           }
        ]} className="translate-x-7 self-end transition-transform duration-300 group-hover:inline-block group-hover:-translate-x-0">
          <span className="">
            <Ellipsis />
          </span>
        </DropDownMenu>
      </div>
    </motion.div>
  )
}
export default Chat
interface ChatMenuProps {
  handleDeleteChat: () => void
}

const ChatMenu = ({ handleDeleteChat }: ChatMenuProps) => {
  return (
    <ul className="w-44 p-1.5 text-foreground">
      <DropDownMenuItem
        label="Archive Chat"
        onClick={() => {}}
        icon={ArchiveIcon}
      />
      <DropDownMenuItem label="Mute" onClick={() => {}} icon={BellOff} />
      <DropDownMenuItem
        label="Clear Chat"
        onClick={() => {}}
        icon={MessageSquareX}
      />
      <DropDownMenuItem label="Block" onClick={() => {}} icon={ShieldBan} />
      <DropDownMenuItem
        label="Delete Chat"
        onClick={handleDeleteChat}
        icon={Trash2}
      />
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
          src={tranformUrl(
            chat.isGroup ? chat?.groupAvatar?.url : chat?.friend?.avatar?.url,
            50
          )}
          name={chat.isGroup ? chat?.groupName : chat?.friend?.name}
          className="inline-block size-8 rounded-full bg-background object-cover duration-500 hover:scale-90"
        />
        <div className="relative flex flex-col leading-none">
          <span className="text-forground text-sm font-medium">
            {chat.isGroup ? chat?.groupName : chat?.friend?.name}
          </span>
          <div
            className="block max-w-32 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-gray-500 dark:text-gray-400"
            title={chat?.lastMessage?.text}
          >
            {formatMessage(
              chat?.lastMessage?.text,
              chat?.lastMessage?.messageType
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
