import { getAllMessages } from '@/api'
import InfiniteScrollC from '@/components/shared/InfiniteScroll/InfiniteScrollC'
import { useChatSlice } from '@/redux/services/chatSlice'
import { Loader } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Message from './Message'
import { getCurrentUserId, getCurrentUsername } from '@/lib/localStorage'
import { IMessage } from '@/lib/types'
import { createNotification, formatDate } from '@/lib/utils'
import { toast } from 'react-toastify'
import { useSocket } from '@/context/SocketContext'
import { NEW_MESSAGE, SEEN_MESSAGES } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'
import Avatar from '@/components/shared/Avatar'
import { useAuth } from '@/context/AuthContext'

const MessageList = () => {
  const {
    messages = [],
    setMessages,
    selectedMessages,
    isLoadingMessages,
    addMessageFromSocket,
    setIsLoadingMessage,
    selectedChat,
    seenMessage,
  } = useChatSlice()

  const { chatId } = useParams()
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const hasNextRef = useRef(hasNext)
  const { socket } = useSocket()
  const { user } = useAuth()
  const fetchMessages = useCallback(async () => {
    if (!hasNextRef.current) return

    try {
      if (page === 1) {
        setIsLoadingMessage(true)
        setMessages([])
      }

      const res = await getAllMessages(chatId!, page)
      if (res) {
        setMessages([...res.messages.reverse(), ...messages])
        setHasNext(res.pagination.hasNext)
        hasNextRef.current = res.pagination.hasNext
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoadingMessage(false)
    }
  }, [chatId, page])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    return () => {
      setPage(1)
      setMessages([])
      setHasNext(true)
      hasNextRef.current = true
    }
  }, [chatId])

  const loadMoreItems = () => {
    if (hasNextRef.current) {
      setPage((prev) => prev + 1)
    }
  }

  const handleMessage = useCallback(
    async (data: any) => {
      createNotification()
      if (data.chat === chatId) {
        addMessageFromSocket(data.message)
        socket!.emit(SEEN_MESSAGES, {
          to: data.from,
          chat: chatId,
          from: getCurrentUserId(),
          message: data.message._id,
          notification: `${getCurrentUsername()} seen your Messages`,
        })
      }
    },
    [chatId]
  )
  const handleSeenMessage = useCallback(
    async (data: any) => {
      if (data.chat === chatId) {
        seenMessage(data.message)
      }
    },
    [chatId]
  )

  const eventHandlers = {
    [NEW_MESSAGE]: handleMessage,
    [SEEN_MESSAGES]: handleSeenMessage,
  }

  useSocketEvents(socket, eventHandlers)

  if (isLoadingMessages) {
    return (
      <div className="flex flex-[0.95] items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  const shouldDisplayDateSeparator = (currentMessageIndex: number) => {
    const currentMessage = messages[currentMessageIndex]
    const previousMessage = messages[currentMessageIndex - 1]
    if (!previousMessage) {
      return true // Display date separator for the first message
    }
    return (
      new Date(currentMessage.createdAt).toDateString() !==
      new Date(previousMessage.createdAt).toDateString()
    )
  }

  return (
    <InfiniteScrollC
      loadMore={loadMoreItems}
      className="h-full flex-[0.9] overflow-y-scroll py-3 scrollbar-thin"
      id={chatId}
    >
      {!hasNextRef.current && !selectedChat?.isGroup && (
        <div className="relative flex h-44 w-full flex-col items-center justify-center gap-2">
          <div className="relative flex h-full w-full">
            <div className="absolute left-[50%] top-1/2 flex -translate-y-1/2 flex-col items-center justify-center rounded-full">
              <Avatar
                className="size-28 -rotate-6"
                src={selectedChat?.friend?.avatar?.url}
              />
              <span>{selectedChat?.friend?.username}</span>
            </div>
            <div className="absolute right-[49%] top-1/2 flex -translate-y-1/2 flex-col items-center justify-center rounded-full">
              <Avatar className="size-28 rotate-6" src={user?.avatar?.url} />
              <span>{user?.username}</span>
            </div>
          </div>
          <div>You Follow Each Other on Instagram</div>
        </div>
      )}
      {messages?.map((message: IMessage, index) => (
        <>
          {/* Display date separator if required */}
          {shouldDisplayDateSeparator(index) && (
            <div className="mb-2 text-center text-sm text-gray-500">
              <span className="rounded-md bg-zinc-900 px-2">
                {formatDate(message.createdAt, true)}
              </span>
            </div>
          )}
          {/* Render message component */}
          <Message
            seen={false}
            key={message._id}
            currentUserMessage={message.from === getCurrentUserId()}
            message={message}
            isMessageSelected={selectedMessages?.some((m) => m === message._id)}
            isLastMessagae={!messages[index + 1]}
            isNextMessageUsMine={messages[index + 1]?.from === message.from}
          />
        </>
      ))}
    </InfiniteScrollC>
  )
}
export default MessageList
