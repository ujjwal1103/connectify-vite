import Avatar from "@/components/shared/Avatar";
import { useChatSlice } from "@/redux/services/chatSlice";
import { useClickOutside } from "@react-hookz/web";
import { motion, AnimatePresence } from "framer-motion";
import { Ellipsis } from "lucide-react";
import { useState, useRef } from "react";

const MessageListHeader = ({
  toggleShowInfo,
}: {
  toggleShowInfo: () => void;
}) => {
  const { selectedChat, setIsSelectMessages } = useChatSlice();
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const menuRef = useRef<any>(null);
  const buttonRef = useRef<any>(null);

  useClickOutside(menuRef, (e) => {
    if (buttonRef.current && buttonRef.current.contains(e.target)) {
      return;
    }
    buttonRef?.current?.focus();
    setOpen(false);
  });

  const handleButtonClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      console.log(rect);
      setMenuPosition({ top: rect.bottom, left: rect.left });
      setOpen(!open);
    }
  };

  return (
    <div className="bg-secondary flex-[0.05] flex py-2 px-4 items-center">
      <div
        className="flex items-center gap-3 font-semibold"
        onClick={toggleShowInfo}
      >
        <Avatar
          
          src={
            selectedChat?.isGroup
              ? selectedChat?.groupAvatar?.url
              : selectedChat?.friend?.avatar?.url
          }
        />
        <span>
          {selectedChat?.isGroup
            ? selectedChat.groupName
            : selectedChat?.friend?.name}
        </span>
      </div>

      <div className=" ml-auto">
        <button ref={buttonRef} onClick={handleButtonClick}>
          <Ellipsis />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              layout
              transition={{ type: "tween" }}
              className="absolute z-[100] bg-zinc-900 rounded origin-top-right"
              style={{ top: menuPosition.top, left: menuPosition.left - 140 }}
            >
              <ul
                ref={menuRef}
                tabIndex={0}
                className=" z-[100]  menu p-2 shadow  "
              >
                <li className="text-sm ">
                  <span>Profile</span>
                </li>
                <li className="text-sm ">
                  <button
                    onClick={() => {
                      setIsSelectMessages(true);
                      setOpen(false);
                    }}
                  >
                    <span>Select Messages</span>
                  </button>
                </li>
                <li className="text-sm ">
                  <span>Clear Chat</span>
                </li>
                <li className="text-sm ">
                  <span>Delete Chat</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default MessageListHeader;
