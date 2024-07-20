import { useRef, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import { Loader, Search, X, XIcon } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Chat from "./Chat";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useChatSlice } from "@/redux/services/chatSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { getConversations } from "@/api";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouceSearch = useDebounce(searchTerm, 400);
  const { chatId } = useParams();
  const {
    chats,
    setChats,
    selectChats,
    setSelectChats,
    selectedChats,
    resetSelectedChats,
  } = useChatSlice();
  const { isLoading } = useGetQuery({
    fn: () => {
      if (debouceSearch) {
        setIsSearching(true);
      }
      return getConversations(debouceSearch);
    },
    deps: [debouceSearch],
    onSuccess: (data: any) => {
      setChats(data.chats);
      setIsSearching(false);
    },
    onError: () => {
      setIsSearching(false); // Set searching to false if query fails
    },
  });

  return (
    <div
      className={cn(
        "md:flex-[0.3] flex-1 flex flex-col scrollbar-none bg-card h-dvh border-r border-border",
        { "hidden md:flex ": chatId }
      )}
    >
      <ChatListHeader />
      <div className="flex  flex-[0.05] items-center ">
        {!selectChats && (
          <div className="bg-secondary mx-3 my-2 h-[40px] w-full flex items-center rounded-[8px]">
            <span
              className="ml-2 cursor-pointer text-foreground rounded-full "
              onClick={() => {
                setSearchTerm("");
              }}
            >
              <Search size={20} />
            </span>
            <input
              autoFocus={false}
              className="bg-transparent text-foreground focus:outline-none px-3 placeholder:text-foreground text-sm w-full"
              placeholder="Search"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={searchTerm}
            />
            {searchTerm && !isSearching && (
              <span
                className="mr-2 cursor-pointer text-secondary rounded-full bg-foreground"
                onClick={() => {
                  setSearchTerm("");
                }}
              >
                <X size={16} />
              </span>
            )}
            {isSearching && (
              <span
                className="mr-2 cursor-pointer  rounded-full animate-spin"
                onClick={() => {
                  setSearchTerm("");
                }}
              >
                <Loader size={16} />
              </span>
            )}
          </div>
        )}

        {selectChats && (
          <div className=" flex  my-2 h-[40px] items-center gap-3 px-3">
            <button
              onClick={() => {
                setSelectChats(false);
                resetSelectedChats();
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
        className={cn("md:flex-[0.85]  scrollbar-none overflow-y-scroll")}
      >
        {isLoading && !isSearching ? (
          <div className="flex items-center justify-center h-full flex-col gap-2">
            <Loader className="animate-spin" />
            <span className="text-sm">Loading Chats...</span>
          </div>
        ) : (
          <InfiniteScroll
            className="flex flex-col scrollbar-none h-full"
            dataLength={1}
            next={() => {}}
            hasMore={false}
            loader={[12].map(() => (
              <li className="flex py-2 justify-center  gap-3 w-full items-center px-2">
                <Loader className="animate-spin" />
              </li>
            ))}
            
            scrollableTarget={"scrollableDiv"}
          >
            {chats?.map((chat: any, index: number) => (
              <Chat key={chat._id} chat={chat} index={index} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
export default ChatList;
