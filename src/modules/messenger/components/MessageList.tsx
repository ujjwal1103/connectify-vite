import { getAllMessages } from '@/api'
import InfiniteScrollC from '@/components/shared/InfiniteScroll/InfiniteScrollC'
import { useChatSlice } from '@/redux/services/chatSlice'
import { Loader } from 'lucide-react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Message from './Message'
import { getCurrentUserId } from '@/lib/localStorage'
import { IMessage } from '@/lib/types'
import { createNotification, formatDate } from '@/lib/utils'
import { toast } from 'react-toastify'
import { useSocket } from '@/context/SocketContext'
import { NEW_MESSAGE } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'

const MessageList = () => {
  const {
    messages = [],
    setMessages,
    selectedMessages,
    isLoadingMessages,
    addMessageFromSocket,
    setIsLoadingMessage,
    selectedChat,
  } = useChatSlice()

  const { chatId } = useParams()

  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const hasNextRef = useRef(hasNext)
  const { socket } = useSocket()

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
    async (data:any) => {
      createNotification()
      if (data.from === selectedChat?.friend?._id) {
        addMessageFromSocket(data.message)
      }
    },
    [chatId]
  )

  const eventHandlers = {
    [NEW_MESSAGE]: handleMessage,
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
    // Compare timestamps of current and previous messages
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
      <div></div>
      {messages?.map((message: IMessage, index) => (
        <Fragment key={message._id}>
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
            seen={true}
            key={message._id}
            currentUserMessage={message.from === getCurrentUserId()}
            message={message}
            isMessageSelected={selectedMessages?.some((m) => m === message._id)}
            isLastMessagae={!messages[index + 1]}
            isNextMessageUsMine={messages[index + 1]?.from === message.from}
          />
        </Fragment>
      ))}
    </InfiniteScrollC>
  )
}
export default MessageList
