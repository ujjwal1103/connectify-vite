import { getAllMessages, seenMessages } from '@/api'
import InfiniteScrollC from '@/components/shared/InfiniteScroll/InfiniteScrollC'
import { useChatSlice } from '@/redux/services/chatSlice'
import { Loader } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Message from './Message';
import { IMessage } from '@/lib/types'
import { createNotification, formatDate } from '@/lib/utils'
import { useSocket } from '@/context/SocketContext'
import useSocketEvents from '@/hooks/useSocketEvent'
import ChatProfileCard from './ChatProfileCard'
import DotLoading from '@/components/shared/Loading/DotLoading'
import { AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import useNewMessages from '@/zustand/useNewMessages'

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
    removeMessage,
    setIsAddingContent,
    selectedChat,
    editMessageById
  } = useChatSlice()

  const { setScrollToBottom } = useNewMessages()
  const [loadingMore, setLoadingMore] = useState(false)
  const { chatId } = useParams()
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const hasNextRef = useRef(hasNext)
  const [isTyping, setIsTyping] = useState(false)
  const { socket } = useSocket()
  const navigate = useNavigate()
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)

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
        if (page > 1)
          setLastMessageId(res.messages[res.messages.length - 1]._id)
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

  const NEW_MESSAGE = `chat:${chatId}:message`
  const TYPING = `TYPING:${chatId}`
  const DELETE_MESSAGE = `delete:${chatId}:message`
  const DELETE_ALL_MESSAGE = `delete:${chatId}:messages`
  const SEEN_MESSAGES = `seen:${chatId}:message`
  const EDIT_MESSAGE = `edit:${chatId}:message`

  const onDeleteAllMessages = (data: any) => {
    console.log(data)
    setMessages([])
    setPage(1)
  }

  const handleNewMessage = async (message: IMessage) => {
    try {
      createNotification()
      if (message.chat === chatId) {
        addMessageFromSocket(message)
        setScrollToBottom(true)
        toast(
          <div>
            <span>New Message </span>
            <span>{message?.text.slice(0, 80)}</span>
          </div>,
          {
            position: 'top-right',
          }
        )
        if (!selectedChat?.members) return
        await seenMessages({
          chatId: chatId,
          members: selectedChat?.members?.map((m) => m._id),
          messageId: message._id,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSeenMessage = useCallback(
    async (data: any) => {
      console.log({data})
      if (data.chatId === chatId) {
        markAllMessagesAsSeen()
      }
    },
    [chatId]
  )

  const handleTyping = (data: { isTyping: boolean }) => {
    setIsTyping(data.isTyping)
  }

  const handleDeleteMessage = (message: IMessage) => {
    if (message.chat === chatId) {
      removeMessage(message._id)
    }
  }
  
  const editMessage = (data: any)=>{
    editMessageById({ text: data.text, messageId: data?.messageId })
  }

  const eventHandlers = {
    [NEW_MESSAGE]: handleNewMessage,
    [SEEN_MESSAGES]: handleSeenMessage,
    [TYPING]: handleTyping,
    [DELETE_MESSAGE]: handleDeleteMessage,
    [DELETE_ALL_MESSAGE]: onDeleteAllMessages,
    [EDIT_MESSAGE]: editMessage,
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
      setLastMessageId={setLastMessageId}
      lastMessageId={lastMessageId}
    >
      {showProfileCard && <ChatProfileCard key="chatProfile" />}
      {loadingMore && <LoadMoreIndicator key={'upLoader'} />}
      <AnimatePresence key={'animatePresence'}>
        {messages?.map((message: IMessage, index) => (
          <div key={message.tempId || message._id} id={message._id}>
            {shouldDisplayDateSeparator(index) && (
              <div className="mb-2 text-center text-sm text-gray-500">
                <span className="rounded-md bg-zinc-900 px-2">
                  {formatDate(message.createdAt, true)}
                </span>
              </div>
            )}
            <Message
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
          </div>
        ))}
      </AnimatePresence>
      {isTyping && (
        <div className="absolute bottom-12 z-100 w-full bg-black/60">
          <LoadMoreIndicator />
        </div>
      )}
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
