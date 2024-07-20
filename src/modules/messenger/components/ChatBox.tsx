import { useState } from "react";
import ChatInfo from "./ChatInfo";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import MessageListHeader from "./MessageListHeader";
import { AnimatePresence, motion } from "framer-motion";

const ChatBox = () => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="md:flex-1 flex flex-row flex-1  max-h-dvh w-full relative">
      <motion.div className="flex-1 flex flex-col">
        <MessageListHeader
          toggleShowInfo={() => {
            setShowInfo(!showInfo);
          }}
        />
        <MessageList />
        <MessageInput />
      </motion.div>
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ width: 0, x: 288 }}
            animate={{ width: 288, x: 0 }}
            exit={{ width: 0, x: 288 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 md:static bg-background border-l border-border h-dvh md:w-auto"
          >
            <ChatInfo
              onClose={() => {
                setShowInfo(!showInfo);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatBox;
