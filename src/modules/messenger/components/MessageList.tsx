import { getAllMessages } from '@/api'
import InfiniteScrollC from '@/components/shared/InfiniteScroll/InfiniteScrollC'
import { useChatSlice } from '@/redux/services/chatSlice'
import { Loader } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Message from './Message'
import { getCurrentUserId, getCurrentUsername } from '@/lib/localStorage'
import { IMessage } from '@/lib/types'
import { createNotification, formatDate } from '@/lib/utils'
import { toast } from 'react-toastify'
import { useSocket } from '@/context/SocketContext'
import { SEEN_MESSAGES } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'
import ChatProfileCard from './ChatProfileCard'
import DotLoading from '@/components/shared/Loading/DotLoading'
import { AnimatePresence } from 'framer-motion'

const MessageList = () => {
  const {
    messages = [],
    setMessages,
    selectedMessages,
    isLoadingMessages,
    addMessageFromSocket,
    setIsLoadingMessage,
    setCurrentMessageReply,
    markAllMessagesAsSeen,
    isAddingContent,
    setIsAddingContent,
  } = useChatSlice()

  const [loadingMore, setLoadingMore] = useState(false)
  const { chatId } = useParams()
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const hasNextRef = useRef(hasNext)
  const { socket } = useSocket()
  const navigate = useNavigate()

  const fetchMessages = useCallback(async () => {
    if (!hasNextRef.current) return

    try {
      if (page === 1) {
        setIsLoadingMessage(true)
        setMessages([])
      } else {
        setLoadingMore(true)
      }

      const res = await getAllMessages(chatId!, page)
      if (res) {
        if (res.messages?.length && res.messages?.[0]?.chat !== chatId) {
          navigate('/inbox', { replace: true })
          return
        }
        setMessages([...res.messages.reverse(), ...messages])
        setHasNext(res.pagination.hasNext)
        hasNextRef.current = res.pagination.hasNext
      }
    } catch (error) {
      navigate('/inbox', { replace: true })
      toast.error('Something went wrong')
    } finally {
      setIsLoadingMessage(false)
      setLoadingMore(false)
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
      setCurrentMessageReply(null)
    }
  }, [chatId])

  const loadMoreItems = () => {
    if (hasNextRef.current) {
      setPage((prev) => prev + 1)
    }
  }

  const event = `chat:${chatId}:message`

  const handleMessage = useCallback(
    async (data: any) => {
      createNotification()
      if (data.chat === chatId) {
        setIsAddingContent(true)
        addMessageFromSocket(data.message)
        if (socket) {
          socket!.emit(SEEN_MESSAGES, {
            to: data.from,
            chat: chatId,
            from: getCurrentUserId(),
            message: data.message._id,
            notification: `${getCurrentUsername()} seen your Messages`,
          })
        }
      }
    },
    [chatId, socket]
  )

  const handleSeenMessage = useCallback(
    async (data: any) => {
      if (data.chat === chatId) {
        markAllMessagesAsSeen()
      }
    },
    [chatId]
  )

  const eventHandlers = {
    [event]: handleMessage,
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

  const showProfileCard = !hasNextRef.current

  return (
    <InfiniteScrollC
      loadMore={loadMoreItems}
      id={chatId}
      isAddingContent={isAddingContent}
      setIsAddingContent={setIsAddingContent}
    >
      {showProfileCard && (
        <ChatProfileCard />
      )}
      {loadingMore && <LoadMoreIndicator />}
      <AnimatePresence>
        {messages?.map((message: IMessage, index) => (
          <>
            {shouldDisplayDateSeparator(index) && (
              <div className="mb-2 text-center text-sm text-gray-500">
                <span className="rounded-md bg-zinc-900 px-2">
                  {formatDate(message.createdAt, true)}
                </span>
              </div>
            )}
            <Message
              seen={false}
              key={message._id || message.tempId}
              currentUserMessage={message.isCurrentUserMessage!}
              message={message}
              isMessageSelected={selectedMessages?.some(
                (m) => m === message._id
              )}
              isLastMessagae={!messages[index + 1]}
              isNextMessageUsMine={messages[index + 1]?.from === message.from}
              isPreviousMessageIsUrs={
                messages[index - 1]?.from === message.from
              }
            />
          </>
        ))}
      </AnimatePresence>
    </InfiniteScrollC>
  )
}
export default memo(MessageList)

const LoadMoreIndicator = () => {
  return (
    <div className="my-2 flex items-center justify-center">
      <span className="rounded-md bg-background px-3 py-2">
        <DotLoading />
      </span>
    </div>
  )
}
