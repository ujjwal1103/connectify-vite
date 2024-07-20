import { Outlet, useParams } from "react-router-dom";
import ChatList from "./components/ChatList";
import { MessengerLine } from "@/components/icons";
import { useChatSlice } from "@/redux/services/chatSlice";
import { useEffect } from "react";
import { getChatByChatId } from "@/api";
const NoSelectedChat = () => {
  return (
    <div className="flex-1  hidden  dark:text-gray-50 t h-screen lg:flex md:flex justify-center items-center">
      <div className="flex flex-col justify-center items-center ">
        <div className="w-10 h-10 p-2 border border-white rounded-full flex justify-center items-center dark:text-gray-50 ">
          <MessengerLine size={40} />
        </div>
        <h1 className="dark:text-gray-50">Your Messages</h1>
        <p>Send private photos and messages to a friend or group</p>
      </div>
    </div>
  );
};

const Messenger = () => {
  const { chatId } = useParams();
  const { selectedChat, setSelectedChat, setMessagePage, setMessages } =
    useChatSlice();

  const selectThisChat = (chat: any) => {
    setMessagePage(1);
    setMessages([]);
    setSelectedChat(chat);
  };

  const fetchChat = async () => {
    try {
      const res = (await getChatByChatId(chatId)) as any;
      if (res.isSuccess) {
        selectThisChat(res.chat);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!selectedChat && chatId) {
      fetchChat();
    }
  }, []);

  

  return (
    <div className="flex-1 flex">
      <ChatList />
      {chatId ? (
        <Outlet />
      ) : (
        <div className="md:flex-1 md:block hidden flex-1 w-full">
          <NoSelectedChat />
        </div>
      )}
    </div>
  );
};
export default Messenger;
