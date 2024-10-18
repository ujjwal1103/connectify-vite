import { useCallback, useRef, useState } from 'react'
import ChatListHeader from './ChatListHeader'
import { Loader, Search, X, XIcon } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Chat from './Chat'
import { useGetQuery } from '@/hooks/useGetQuery'
import { useChatSlice } from '@/redux/services/chatSlice'
import { useDebounce } from '@/hooks/useDebounce'
import { getConversations } from '@/api'
import { cn } from '@/lib/utils'
import { useParams } from 'react-router-dom'
import { NEW_CHAT } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'
import { useSocket } from '@/context/SocketContext'
import { IChat } from '@/lib/types'

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouceSearch = useDebounce(searchTerm, 400)
  const { socket } = useSocket()
  const { chatId } = useParams()
  const {
    chats,
    setChats,
    selectChats,
    setSelectChats,
    selectedChats,
    resetSelectedChats,
    setChat,
  } = useChatSlice()
  const { isLoading } = useGetQuery({
    fn: () => {
      if (debouceSearch) {
        setIsSearching(true)
      }
      return getConversations(debouceSearch)
    },
    deps: [debouceSearch],
    onSuccess: (data: any) => {
      setChats(data.chats)
      setIsSearching(false)
    },
    onError: () => {
      setIsSearching(false)
    },
  })

  const handleMessage = useCallback((data: IChat) => {
    console.log(data._id)
    if (data?._id) {
      setChat(data)
    }
  }, [])

  const eventHandlers = {
    [NEW_CHAT]: handleMessage,
  }

  useSocketEvents(socket, eventHandlers)

  return (
    <div
      className={cn(
        'flex h-dvh flex-1 flex-col border-r border-border bg-card scrollbar-none md:flex-[0.4]',
        { 'hidden md:flex': chatId }
      )}
    >
      <ChatListHeader />
      <div className="flex flex-[0.05] items-center">
        {!selectChats && (
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

        {selectChats && (
          <div className="my-2 flex h-[40px] items-center gap-3 px-3">
            <button
              onClick={() => {
                setSelectChats(false)
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
        className={cn('overflow-y-scroll scrollbar-none md:flex-[0.85]')}
      >
        {isLoading && !isSearching ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Loader className="animate-spin" />
            <span className="text-sm">Loading Chats...</span>
          </div>
        ) : (
          <InfiniteScroll
            className="flex h-full flex-col scrollbar-none"
            dataLength={1}
            next={() => {}}
            hasMore={false}
            loader={[12].map(() => (
              <li className="flex w-full items-center justify-center gap-3 px-2 py-2">
                <Loader className="animate-spin" />
              </li>
            ))}
            scrollableTarget={'scrollableDiv'}
          >
            {chats?.map((chat: IChat) => <Chat key={chat._id} chat={chat} />)}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}
export default ChatList
