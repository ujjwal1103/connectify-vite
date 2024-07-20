import { updateGroupName } from "@/api";
import Avatar from "@/components/shared/Avatar";
import UsernameLink from "@/components/shared/UsernameLink";
import { IChat } from "@/lib/types";
import { useChatSlice } from "@/redux/services/chatSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PencilLineIcon, X } from "lucide-react";
import { useState } from "react";

const ChatInfo = ({ onClose }: any) => {
  const { selectedChat, setGroupName } = useChatSlice();
  const { isGroup, friend, members, _id, groupAvatar, groupName } =
    selectedChat as IChat;
  const [editGroupName, setEditGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(groupName);
  const [imagePreview, setImagePreview] = useState<string | null | undefined>(
    null
  );

  const handleChangeNewName = async () => {
    setGroupName({ chatId: _id, newGroupName });
    await updateGroupName(_id, newGroupName!);
    setEditGroupName(false);
  };

  return (
    <div className="p-2 z-100">
      <div className="flex items-center gap-4">
        <span className="cursor-pointer" onClick={onClose}>
          <X />
        </span>
        <span className="text-xl py-3">Chat Info</span>
      </div>
      <div className="flex items-center flex-col gap-2">
        <motion.div
          layoutId={_id}
          onClick={() =>
            setImagePreview(isGroup ? groupAvatar?.url : friend?.avatar?.url)
          }
        >
          <Avatar
            src={isGroup ? groupAvatar?.url : friend?.avatar?.url}
            className="size-24 z-100"
          />
        </motion.div>
        <div>
          {isGroup ? (
            <div className="flex items-center gap-2">
              <div>
                {editGroupName ? (
                  <input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="p-1.5 bg-secondary focus-visible:outline-none "
                  />
                ) : (
                  <span>{groupName}</span>
                )}
              </div>
              {!editGroupName ? (
                <button onClick={() => setEditGroupName(true)}>
                  <PencilLineIcon size={15} />
                </button>
              ) : (
                <button
                  onClick={handleChangeNewName}
                  className="disabled:opacity-70"
                  disabled={groupName === newGroupName}
                >
                  <Check size={15} />
                </button>
              )}
            </div>
          ) : (
            <div>{friend.username}</div>
          )}
        </div>
        {isGroup && <span>Group: {members?.length} members</span>}
      </div>
      {isGroup && (
        <div className="max-h-64 scrollbar-none  overflow-y-scroll overflow-x-hidden  mt-6">
          <p>Group Members</p>
          <div className="h-full space-y-2">
            {selectedChat?.members?.map((member) => {
              return (
                <div className="flex h-full  mt-3 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div>
                      <Avatar
                        src={member?.avatar?.url}
                        className="size-8 h-full "
                      />
                    </div>
                    <div>
                      <UsernameLink username={member.username}>
                        <span>{member.username}</span>
                      </UsernameLink>
                    </div>
                  </div>
                  <div></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImagePreview(null)}
            className="fixed inset-0 h-dvh w-screen bg-background bg-opacity-60 z-100  flex items-center justify-center"
          >
            <div className="w-1/3 aspect-square">
              <motion.div layoutId={_id}>
                <img
                  src={imagePreview}
                  alt="image preview"
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInfo;
