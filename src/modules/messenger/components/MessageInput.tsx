import {
  ImageFill,
  MusicLibrary,
  Send,
  VideoLibrary,
} from "@/components/icons";
import { RefObject, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@react-hookz/web";
import { IoClose } from "react-icons/io5";

import { BiMicrophone } from "react-icons/bi";

import { FaTrash } from "react-icons/fa";
import Input from "@/components/shared/Input";
import { useParams } from "react-router-dom";
import { useChatSlice } from "@/redux/services/chatSlice";
import AudioRecorder from "./AudioRecorder";
import { deleteMessagesByIds } from "@/api";
import useSendMessage from "./useSendMessage";
import { cn, readFileAsDataURL } from "@/lib/utils";
import { PlusIcon, Smile } from "lucide-react";
import EmojiPicker from "@emoji-mart/react";

function blobToFile(blob: Blob, filename: string): File {
  const file = new File([blob], filename, {
    type: blob.type,
    lastModified: new Date().getTime(),
  });

  return file;
}

export const Loader = () => {
  return (
    <div className="flex-center">
      <motion.div
        className="w-24 h-4 bg-zinc-800 rounded-full"
        animate={{ width: "100%" }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
    </div>
  );
};

const MessageInput = () => {
  const [messageText, setMessageText] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [openDial, setOpenDial] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const speedDialRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const emojiRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const speedDialButtonRef: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);
  const emojiButtonRef: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null);
  const { send, sendAttachment } = useSendMessage();
  const {
    isSelectMessages,
    selectedMessages,
    setIsSelectMessages,
    deleteAllMessagesByIds,
    selectedChat,
  } = useChatSlice();

  //   const { socket } = useSocket();
  const handleTextChange = (e: any) => {
    setMessageText(e.target.value);
  };

  const handleSend = async () => {
    if (!messageText) return;

    const newMessage = {
      text: messageText,
      messageType: "TEXT_MESSAGE",
      to: selectedChat?.friend?._id!,
    };
    setMessageText("");
    await send(newMessage, chatId!);
  };

  const handleSendAttachement = async (e: any, messageType: string) => {
    setOpenDial(false);
    const files = e.target.files;
    const formData = new FormData();
    const dataUrl: string[] = [];

    for (let i = 0; i < files.length; i++) {
      formData.append("messageAttachement", files[i]);
    }
    formData.append("messageType", messageType);
    formData.append("to", selectedChat?.friend?._id!);

    for (let i = 0; i < files.length; i++) {
      const dataURL: string = (await readFileAsDataURL(files[i])) as any;
      dataUrl.push(dataURL);
    }

    await sendAttachment(formData, chatId!, dataUrl);
  };

  const onCloseSpeedDial = (e: any) => {
    if (
      speedDialButtonRef.current &&
      speedDialButtonRef.current.contains(e.target)
    ) {
      return;
    }
    setOpenDial(false);
  };
  const onCloseEmoji = (e: any) => {
    if (emojiButtonRef.current && emojiButtonRef.current.contains(e.target)) {
      return;
    }
    setEmoji(false);
  };

  useClickOutside(speedDialRef, onCloseSpeedDial);
  useClickOutside(emojiRef, onCloseEmoji);

  const handleClose = () => {
    setIsSelectMessages(false);
  };

  const handleDeleteMessages = async () => {
    const res = await deleteMessagesByIds(selectedMessages);
    if (res.isSuccess) {
      deleteAllMessagesByIds(selectedMessages);
    }
  };

  if (isRecording) {
    return (
      <div className="flex-[0.05] bg-secondary">
        <AudioRecorder
          handleClose={() => setIsRecording(false)}
          handleSendRecording={(recording: any) => {
            const file = blobToFile(recording, `${Date.now() + "webm"}`);
            handleSendAttachement(
              { target: { files: [file] } },
              "VOICE_MESSAGE"
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-[0.05] relative">
      <AnimatePresence mode="sync">
        {isSelectMessages ? (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            className=" bg-secondary  "
          >
            <div className="px-4 py-2 flex gap-3 items-center">
              <button onClick={handleClose}>
                <IoClose size={24} />
              </button>
              <span>{selectedMessages.length} selected</span>

              <button
                onClick={handleDeleteMessages}
                disabled={!selectedMessages.length}
                className="ml-auto text-gray-400 disabled:text-gray-400 hover:text-white"
              >
                <FaTrash size={24} className="" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div className="flex items-center gap-3 p-2 bg-secondary">
            <Input
              className="w-full  text-gray-200 border-none bg-background focus:outline-none rounded-md px-12 pl-20"
              value={messageText}
              onChange={handleTextChange}
              placeholder="Type..."
              onKeyDown={(e: any) => {
                if (e.key === "Enter" && messageText && e.target.value) {
                  handleSend();
                }
              }}
              prefix={
                <div className="flex items-center gap-2">
                  <motion.button
                    ref={emojiButtonRef}
                    className={cn(
                      "cursor-pointer flex items-center transition-transform  ease-linear justify-center",
                      {
                        "text-blue-700": emoji,
                      }
                    )}
                    onClick={() => setEmoji((prev) => !prev)}
                  >
                    <Smile className=" fill-black" />
                  </motion.button>
                  <motion.button
                    ref={speedDialButtonRef}
                    className={cn(
                      "cursor-pointer flex items-center transition-transform  ease-linear justify-center",
                      {
                        "rotate-45 text-blue-700": openDial,
                      }
                    )}
                    onClick={() => setOpenDial((prev) => !prev)}
                  >
                    <PlusIcon className="dark:fill-white fill-black" />
                  </motion.button>
                </div>
              }
              sufix={
                <button
                  disabled={!messageText}
                  onClick={handleSend}
                  className="cursor-pointer px-3 disabled:pointer-events-none"
                >
                  <Send />
                </button>
              }
              type={""}
              error={undefined}
              autoFocus={false}
              sufixClassname={""}
              disabled={false} // disabled={sending}
            />
            <div>
              <button
                type="button"
                className=""
                onClick={() => setIsRecording(true)}
              >
                <BiMicrophone size={24} />
              </button>
            </div>
            <AnimatePresence>
              {emoji && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  ref={emojiRef}
                  className="absolute  bottom-16 overflow-hidden shadow-xl origin-bottom-left rounded-md left-4 z-[999] flex items-center"
                >
                  <div className="">
                    <motion.div className="flex gap-3">
                      <EmojiPicker
                        searchPosition="none"
                        previewPosition="none"
                        navPosition="bottom"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {openDial && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  layoutId="test1"
                  ref={speedDialRef}
                  layout
                  className="absolute overflow-hidden bottom-16 shadow-xl origin-bottom-left bg-secondary rounded-md left-4 z-[999] flex items-center  gap-2  "
                >
                  <div className="p-3 flex gap-3">
                    <motion.label
                      layout
                      htmlFor="imageFile"
                      className="bg-black w-10  flex justify-center items-center cursor-pointer ring-2 ring-zinc-700 h-10 rounded-md  "
                    >
                      <ImageFill className="dark:fill-white fill-black size-5" />
                      <input
                        type="file"
                        id="imageFile"
                        hidden
                        multiple
                        onChange={(e) => handleSendAttachement(e, "IMAGE")}
                        accept="image/*, webp"
                      />
                    </motion.label>
                    <motion.label
                      layout
                      htmlFor="audioFile"
                      className="bg-black w-10  flex justify-center items-center cursor-pointer ring-2 ring-zinc-700 h-10 rounded-md  "
                    >
                      <MusicLibrary className="dark:fill-white fill-black size-5" />
                      <input
                        type="file"
                        id="audioFile"
                        hidden
                        multiple
                        onChange={(e) => handleSendAttachement(e, "AUDIO")}
                        accept="audio/*"
                      />
                    </motion.label>
                    <motion.label
                      layout
                      htmlFor="videoFile"
                      className="bg-black w-10  flex justify-center items-center cursor-pointer ring-2 ring-zinc-700 h-10 rounded-md  "
                    >
                      <VideoLibrary className="dark:fill-white fill-black size-5" />
                      <input
                        type="file"
                        id="videoFile"
                        hidden
                        multiple
                        onChange={(e) => handleSendAttachement(e, "VIDEO")}
                        accept="video/*"
                      />
                    </motion.label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageInput;
