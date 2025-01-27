import { motion } from 'framer-motion'
import { memo, useCallback } from 'react'
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
import { useChat } from '@/redux/services/chatSlice'
import Avatar from '@/components/shared/Avatar'
import { cn, formatDate } from '@/lib/utils'
import { deleteConversation } from '@/api'
import { IChat } from '@/lib/types'
import { useSocket } from '@/context/SocketContext'
import useSocketEvents from '@/hooks/useSocketEvent'
import DropDownMenu from '@/components/shared/dialogs/DropDownMenu/DropDownMenu'
import { useChatStore } from '@/stores/Chats'

const items = [
  {
    title: 'Archive Chat',
    icon: ArchiveIcon,
  },
  {
    title: 'Mute',
    icon: BellOff,
  },
  {
    title: 'Clear Chat',
    icon: MessageSquareX,
  },
  {
    title: 'Block',
    icon: ShieldBan,
  },
  {
    title: 'Delete Chat',
    icon: Trash2,
  },
]

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
  isChatSelected: boolean
  handleSelect: (chat: IChat) => void
}

const Chat = ({ chat, isChatSelected, handleSelect }: ChatProps) => {
  const { removeChat, setChatToFirst } = useChat()

  const { allowSelection, selectChat, selectedChats, removeSelection } =
    useChatStore()

  const { socket } = useSocket()

  const handleDeleteChat = useCallback(async () => {
    const chatId = chat?._id
    removeChat(chatId)
    await deleteConversation(chatId)
  }, [])

  const handleMessage = useCallback((data: any) => {
    if (data.chat) {
      setChatToFirst({
        message: data,
        shouldSetUnseenMessageCount: chat._id !== data.chat,
      })
    }
  }, [])

  const event = `chat:${chat._id}:message`

  const eventHandlers = {
    [event]: handleMessage,
  }

  useSocketEvents(socket, eventHandlers)

  const isChecked = selectedChats.includes(chat._id)

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      layout
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, y: -200 }}
      className={cn(
        'group relative flex w-full cursor-pointer items-center justify-between p-2 transition-colors duration-500 hover:bg-secondary',
        {
          'bg-secondary': isChatSelected,
        }
      )}
      onClick={() => handleSelect(chat)}
    >
      <AvatarAndCheckbox
        selectChats={allowSelection}
        isChecked={isChecked}
        chat={chat}
        onSelectChat={selectChat}
        onRemoveChat={removeSelection}
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
        <DropDownMenu
          onPressItem={(title: string) => {
            if (title === 'Delete Chat') {
              handleDeleteChat()
            }
          }}
          items={items}
          className="translate-x-7 self-end rounded transition-transform duration-300 group-hover:inline-block group-hover:-translate-x-0 hover:bg-background/50 focus-visible:translate-x-0 focus-visible:bg-background/50 focus-visible:outline-none"
        >
          <span className="">
            <Ellipsis />
          </span>
        </DropDownMenu>
      </div>
    </motion.div>
  )
}
export default memo(Chat)

const AvatarAndCheckbox = ({
  onSelectChat,
  selectChats,
  isChecked,
  chat,
  onRemoveChat,
}: any) => {
  const chatId = chat._id

  const handleSelection = () => {
    if (isChecked) {
      onRemoveChat(chatId)
    } else {
      onSelectChat(chatId)
    }
  }
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
          name={chatId}
          checked={isChecked}
          id={chat.id}
          className="text-red-400 accent-blue-900"
          onChange={handleSelection}
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
