import { memo, useCallback, useEffect, useRef, useState } from 'react'
import ChatListHeader from './ChatListHeader'
import { Loader, Search, X, XIcon } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useGetQuery } from '@/hooks/useGetQuery'
import { useChat, useMessage } from '@/redux/services/chatSlice'
import { useDebounce } from '@/hooks/useDebounce'
import { ConverstionsReponse, getConversations } from '@/api'
import { cn } from '@/lib/utils'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { NEW_CHAT, REFETCH_CHATS } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'
import { useSocket } from '@/context/SocketContext'
import { IChat, IMessage } from '@/lib/types'
import { Button } from '@/components/ui/button'
import useModalStore from '@/zustand/newChatStore'
import Chat from './Chat'
import { toast } from 'sonner'
import { useChatStore } from '@/stores/Chats'

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const openModal = useModalStore((state) => state.openModal)
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouceSearch = useDebounce(searchTerm, 400)
  const { socket } = useSocket()
  const { chatId } = useParams()
  const navigate = useNavigate()

  const location = useLocation()
  const { setChat, setSelectedChat } = useChat()

  const {
    chats,
    setChats,
    hasNext,
    page,
    setPage,
    allowSelection,
    setAllowSelection,
    selectedChats,
    resetSelectedChats,
  } = useChatStore()
  const { setMessagePage, setMessages } = useMessage()

  const { isLoading, isSuccess, refech } = useGetQuery({
    fn: () => {
      if (debouceSearch) {
        setIsSearching(true)
      }
      return getConversations(page, debouceSearch)
    },
    deps: [page, debouceSearch],
    onSuccess: (data: ConverstionsReponse) => {
      setChats({
        chats: data.chats,
        hasNext: data.pagination.hasNext,
      })
      setIsSearching(false)
    },
    onError: () => {
      setIsSearching(false)
    },
  })

  useEffect(() => {
    return () => {
      setPage(1)
      setChats({
        chats: [],
        hasNext: true,
      })
    }
  }, [])

  const handleMessage = useCallback((data: IChat) => {
    if (data?._id) {
      setChat(data)
    }
  }, [])

  const handleReftch = useCallback((message: IMessage) => {
    if (message.chat === chatId) return
    toast(
      <div>
        <span>New Message </span>
        <span>{message.text}</span>
      </div>,
      {
        position: 'top-right',
      }
    )
    refech()
  }, [])

  const eventHandlers = {
    [NEW_CHAT]: handleMessage,
    [REFETCH_CHATS]: handleReftch,
  }

  useSocketEvents(socket, eventHandlers)

  const handleSelect = useCallback(
    (chat: IChat) => {
      if (!(chatId && chatId === chat._id)) {
        setMessagePage(1)
        setMessages([])
        setSelectedChat(chat)
        navigate(
          {
            pathname: `/inbox/${chat._id}`,
          },
          { replace: location.pathname !== '/inbox' }
        )
      }
    },
    [chatId]
  )

  const handleLoadMore = () => {
    if (hasNext) {
      setPage(page + 1)
    }
  }

  return (
    <div
      className={cn(
        'flex h-dvh flex-1 flex-col border-r border-border bg-card scrollbar-none md:flex-[0.35]',
        { 'hidden md:flex': chatId }
      )}
    >
      <ChatListHeader />

      <div className="flex flex-[0.05] items-center">
        {!allowSelection && (
          <div className="mx-3 my-2 flex h-[40px] w-full items-center rounded-[8px] bg-secondary">
            <span
              className="ml-2 cursor-pointer rounded-full text-foreground"
              onClick={() => {
                setSearchTerm('')
              }}
            >
              <Search size={20} />
            </span>
            <input
              autoFocus={false}
              className="w-full bg-transparent px-3 text-sm text-foreground placeholder:text-foreground focus:outline-none"
              placeholder="Search"
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              value={searchTerm}
            />
            {searchTerm && !isSearching && (
              <span
                className="mr-2 cursor-pointer rounded-full bg-foreground text-secondary"
                onClick={() => {
                  setSearchTerm('')
                }}
              >
                <X size={16} />
              </span>
            )}
            {isSearching && (
              <span
                className="mr-2 animate-spin cursor-pointer rounded-full"
                onClick={() => {
                  setSearchTerm('')
                }}
              >
                <Loader size={16} />
              </span>
            )}
          </div>
        )}

        {allowSelection && (
          <div className="my-2 flex h-[40px] items-center gap-3 px-3">
            <button
              onClick={() => {
                setAllowSelection(false)
                resetSelectedChats()
              }}
            >
              <XIcon />
            </button>
            <span>{selectedChats.length} Selected</span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        id="scrollableDiv"
        className={cn('overflow-y-scroll scrollbar-none md:flex-[0.85]')}
      >
        {isSuccess && Boolean(!chats.length) && (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="text-xl font-semibold"> No chats yet. </div>
            <div className="text-foreground/50">Send a message to start!</div>

            <Button onClick={openModal} variant="outline" className="mt-3">
              New Chat
            </Button>
          </div>
        )}
        {isLoading && !isSearching ? (
          <div className="flex h-full flex-col items-center gap-2">
            <span className="text-sm">Loading Chats...</span>
          </div>
        ) : (
          <InfiniteScroll
            className="flex h-full flex-col scrollbar-none"
            dataLength={chats.length}
            next={handleLoadMore}
            hasMore={hasNext}
            loader={[12].map(() => (
              <li className="flex w-full items-center justify-center gap-3 px-2 py-2">
                <Loader className="animate-spin" />
              </li>
            ))}
            scrollableTarget={'scrollableDiv'}
          >
            {chats?.map((chat: IChat) => (
              <Chat
                key={chat._id}
                isChatSelected={Boolean(chatId && chatId === chat._id)}
                chat={chat}
                handleSelect={handleSelect}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}
export default memo(ChatList)
