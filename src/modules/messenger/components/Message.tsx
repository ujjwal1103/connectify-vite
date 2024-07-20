import { memo, useState, useEffect, useRef, Suspense } from "react";

import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import BubbleNotch from "@/components/icons/BubbleNotch";

import { Link } from "react-router-dom";
import { useChatSlice } from "@/redux/services/chatSlice";
import { FaPause, FaPlay } from "react-icons/fa";
import { DoubleCheckIcon, HeadSet } from "@/components/icons";
import Modal from "@/components/shared/modal/Modal";
import Avatar from "@/components/shared/Avatar";
import UsernameLink from "@/components/shared/UsernameLink";
import { cn, getReadableTime, tranformUrl } from "@/lib/utils";
import { Check, Loader, Smile } from "lucide-react";
import { useWaveProgress } from "@/hooks/useWaveProgress";
import { Menu } from "@/components/shared/SidePannel/SidePannel";

const Message = ({
  currentUserMessage,
  seen: allSeen,
  isMessageSelected,
  message,
  isNextMessageUsMine,
  isLastMessagae,
}: any) => {
  const {
    createdAt,
    seen,
    messageType,
    _id,
    username,
    avatar,
    caption,
    postId,
    postImages,
    isUnavailable,
    isLoading,
  } = message;

  const { isSelectMessages, setSelectedMessage } = useChatSlice();
  const [showNotch, setShowNotch] = useState(false);
  const [hoverd, setHoverd] = useState(false);
  const [options, setOptions] = useState(false);

  const handleSelectMessage = () => {
    setSelectedMessage(_id);
  };

  const className = clsx(
    "w-full transition-colors duration-500 flex mb-1",
    isSelectMessages && "hover:bg-zinc-900 hover:bg-opacity-30",
    isMessageSelected && "bg-zinc-900 bg-opacity-30"
  );

  useEffect(() => {
    if (!isNextMessageUsMine || isLastMessagae) {
      setShowNotch(true);
    }
  }, []);

  if (messageType === "IMAGE") {
    return (
      <ImageMessage
        message={message}
        className={className}
        isSelectMessages={isSelectMessages}
        isMessageSelected={isMessageSelected}
        handleSelectMessage={handleSelectMessage}
        currentUserMessage={currentUserMessage}
        createdAt={createdAt}
        seen={seen}
        allSeen={allSeen}
        showNotch={showNotch}
        isLoading={isLoading}
        options={options}
        setOptions={setOptions}
      />
    );
  }
  if (messageType === "POST_MESSAGE") {
    return (
      <PostMessage
        postImages={postImages}
        className={className}
        isSelectMessages={isSelectMessages}
        isMessageSelected={isMessageSelected}
        handleSelectMessage={handleSelectMessage}
        currentUserMessage={currentUserMessage}
        createdAt={createdAt}
        username={username}
        avatar={avatar}
        caption={caption}
        seen={seen}
        allSeen={allSeen}
        postId={postId}
        isUnavailable={isUnavailable}
        showNotch={showNotch}
      />
    );
  }
  if (["AUDIO", "VOICE_MESSAGE"].includes(messageType)) {
    return (
      <AudioMessage
        className={className}
        isSelectMessages={isSelectMessages}
        isMessageSelected={isMessageSelected}
        handleSelectMessage={handleSelectMessage}
        currentUserMessage={currentUserMessage}
        createdAt={createdAt}
        seen={seen}
        allSeen={allSeen}
        showNotch={showNotch}
        message={message}
        isLoading={isLoading}
        options={options}
        setOptions={setOptions}
      />
    );
  }
  if (messageType === "VIDEO") {
    return (
      <Suspense fallback={<div>"loading"</div>}>
        <VideoMessage
          message={message}
          className={className}
          isSelectMessages={isSelectMessages}
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
          currentUserMessage={currentUserMessage}
          createdAt={createdAt}
          seen={seen}
          allSeen={allSeen}
          showNotch={showNotch}
          options={options}
          setOptions={setOptions}
        />
      </Suspense>
    );
  }

  return (
    <TextMessage
      message={message}
      isSelectMessages={isSelectMessages}
      className={className}
      isMessageSelected={isMessageSelected}
      handleSelectMessage={handleSelectMessage}
      currentUserMessage={currentUserMessage}
      allSeen={allSeen}
      showNotch={showNotch}
      hoverd={hoverd}
      setHoverd={setHoverd}
      options={options}
      setOptions={setOptions}
    />
  );
};

export default memo(Message);

const TextMessage = ({
  isSelectMessages,
  isMessageSelected,
  handleSelectMessage,
  currentUserMessage,
  allSeen,
  className,
  showNotch,
  options,
  setOptions,
  message,
}: any) => {
  const { text, createdAt, seen, isLoading } = message;
  const [showMore, setShowMore] = useState(false);
  const messageLength = text?.length;
  const longMessage = messageLength > 200 && messageLength - 200 > 250;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className={cn("relative group overflow-hidden", className)}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}

      <div
        className={cn("z-10 mx-4  flex duration-700 text-gray-50 ", {
          "self-end ml-auto": currentUserMessage,
        })}
      >
        <div
          className={cn("flex flex-row", {
            "flex-row-reverse": !currentUserMessage,
          })}
        >
          <div className="flex  items-center transition-all duration-300 p-2 relative">
            <div className="dropdown dropdown-end ml-auto">
              <button
                ref={buttonRef}
                tabIndex={0}
                role="button"
                disabled={options}
                className={cn(
                  "group-hover:translate-x-0 group-hover:opacity-100 -translate-x-12 opacity-0 transition-transform  duration-700 ",
                  { "translate-x-12": currentUserMessage }
                )}
                onClick={() => setOptions(!options)}
              >
                <Smile />
              </button>
              <AnimatePresence>
                {options && (
                  <MessageMenu
                    buttonRef={buttonRef}
                    options={options}
                    setOptions={setOptions}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className={cn(
              "max-w-md w-fit p-2 flex duration-700 bg-black flex-col text-gray-50 shadow-2xl relative transition-all rounded-xl",
              {
                "bg-zinc-800": currentUserMessage,
              }
            )}
          >
            <div className="overflow-hidden break-words text-sm">
              {showMore
                ? text
                : text?.slice(0, 300) + (longMessage ? "..." : "")}
            </div>

            <div className="flex text-xss w-full justify-end items-center  float-right flex-col text-right text-gray-300">
              {longMessage && (
                <button
                  onClick={toggleShowMore}
                  className="text-sm font-semibold p-1 text-blue-500 rounded-2xl self-start"
                >
                  {showMore ? "Read Less" : "Read More"}
                </button>
              )}
              <span className="flex z-[1] items-center gap-3 self-end">
                {getReadableTime(createdAt)}

                {currentUserMessage && (
                  <>
                    {isLoading && (
                      <div>
                        <Loader className="animate-spin" size={16} />
                      </div>
                    )}
                    {seen || allSeen ? (
                      <DoubleCheckIcon className="text-blue-500" />
                    ) : (
                      <Check />
                    )}
                  </>
                )}
              </span>
            </div>
            {showNotch && <Notch currentUserMessage={currentUserMessage} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageMessage = ({
  message,
  isSelectMessages,
  isMessageSelected,
  handleSelectMessage,
  currentUserMessage,
  allSeen,
  className,
  showNotch,
  options,
  setOptions,
  isLoading = false,
}: any) => {
  const [previewImage, setPreviewImage] = useState();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cn("relative group overflow-hidden", className)}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}
      <div
        className={cn("z-10 mx-4 flex duration-700 text-gray-50 ", {
          "self-end ml-auto": currentUserMessage,
        })}
      >
        <div
          className={cn("flex flex-row", {
            "flex-row-reverse": !currentUserMessage,
          })}
        >
          <div className="flex  items-center transition-all duration-300 p-2 relative">
            <div className="dropdown dropdown-end ml-auto">
              <button
                ref={buttonRef}
                tabIndex={0}
                role="button"
                disabled={options}
                className={cn(
                  "group-hover:translate-x-0 group-hover:opacity-100 -translate-x-12 opacity-0 transition-transform  duration-700 ",
                  { "translate-x-12": currentUserMessage }
                )}
                onClick={() => setOptions(!options)}
              >
                <Smile />
              </button>
              <AnimatePresence>
                {options && (
                  <MessageMenu
                    buttonRef={buttonRef}
                    options={options}
                    setOptions={setOptions}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
          <div
            className={cn(
              "max-w-md w-fit p-2 flex duration-700 bg-black flex-col text-gray-50 shadow-2xl relative transition-all rounded-xl",
              {
                "bg-zinc-800": currentUserMessage,
              }
            )}
          >
            <div className="overflow-hidden z-[1] w-72 min-h-48">
              <motion.img
                layoutId={message.attachments[0]}
                className="rounded-xl "
                alt={message.attachments[0]}
                src={tranformUrl(message.attachments[0], 500)!}
                onClick={() => setPreviewImage(message.attachments[0])}
              />
            </div>

            <div className="absolute bottom-3 right-3 bg-black rounded-md p-1 flex text-xss justify-end items-center w-fit float-right flex-col text-right text-gray-300">
              <span className="flex z-[1] items-center gap-3 text-white mix-blend-exclusion">
                {getReadableTime(message.createdAt)}
                {currentUserMessage && (
                  <>
                    {isLoading && (
                      <div>
                        <Loader className="animate-spin text-white" size={16} />
                      </div>
                    )}
                    {message.seen || allSeen ? (
                      <DoubleCheckIcon className="text-blue-500" />
                    ) : (
                      <Check />
                    )}
                  </>
                )}
              </span>
            </div>

            {showNotch && <Notch currentUserMessage={currentUserMessage} />}
            <AnimatePresence>
              {previewImage && (
                <ImagePreview
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoMessage = ({
  isSelectMessages,
  className,
  isMessageSelected,
  handleSelectMessage,
  currentUserMessage,
  options,
  setOptions,
  message,
  allSeen,

  showNotch,
  isLoading = false,
}: any) => {
  const videoRef = useRef<any>();
  const [previewImage, setPreviewImage] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playPause = () => {
    const video = videoRef.current;
    console.dir(video);
    if (video?.paused) {
      setIsPlaying(true);
      video.play();
    } else {
      video?.pause();
      setIsPlaying(false);
    }
  };
  return (
    <div className={cn("relative group overflow-hidden", className)}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}
      <div
        className={cn("z-10 mx-4 flex duration-700 text-gray-50 ", {
          "self-end ml-auto": currentUserMessage,
        })}
      >
        <div
          className={cn("flex flex-row", {
            "flex-row-reverse": !currentUserMessage,
          })}
        >
          <div className="flex  items-center transition-all duration-300 p-2 relative">
            <div className="dropdown dropdown-end ml-auto">
              <button
                ref={buttonRef}
                tabIndex={0}
                role="button"
                disabled={options}
                className={cn(
                  "group-hover:translate-x-0 group-hover:opacity-100 -translate-x-12 opacity-0 transition-transform  duration-700 ",
                  { "translate-x-12": currentUserMessage }
                )}
                onClick={() => setOptions(!options)}
              >
                <Smile />
              </button>
              <AnimatePresence>
                {options && (
                  <MessageMenu
                    buttonRef={buttonRef}
                    options={options}
                    setOptions={setOptions}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
          <div
            className={cn(
              "max-w-md w-fit p-2 flex duration-700 bg-black flex-col text-gray-50 shadow-2xl relative transition-all rounded-xl",
              {
                "bg-zinc-800": currentUserMessage,
              }
            )}
          >
            <div className="overflow-hidden break-words w-72 min-h-48">
              <button
                onClick={playPause}
                className=" text-white font-bold py-2 px-4 rounded absolute top-4 left-4 z-50"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <video
                id="video1"
                width="420"
                ref={videoRef}
                className="rounded-xl"
                onClick={() => setPreviewImage(message.attachments[0])}
              >
                <source src={message.attachments[0]} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </div>

            <div className="absolute bottom-3 right-3 bg-black rounded-md p-1 flex text-xss justify-end items-center w-fit float-right flex-col text-right text-gray-300">
              <span className="flex z-[1] items-center gap-3 text-white mix-blend-exclusion">
                {getReadableTime(message.createdAt)}
                {currentUserMessage && (
                  <>
                    {isLoading && (
                      <div>
                        <Loader className="animate-spin text-white" size={16} />
                      </div>
                    )}
                    {message.seen || allSeen ? (
                      <DoubleCheckIcon className="text-blue-500" />
                    ) : (
                      <Check />
                    )}
                  </>
                )}
              </span>
            </div>

            {showNotch && <Notch currentUserMessage={currentUserMessage} />}
            <AnimatePresence>
              {previewImage && (
                <ImagePreview
                  setPreviewImage={setPreviewImage}
                  previewImage={previewImage}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioMessage = memo(
  ({
    isSelectMessages,
    isMessageSelected,
    handleSelectMessage,
    currentUserMessage,
    className,
    options,
    setOptions,
    message,
    allSeen,
    showNotch,
    isLoading = false,
  }: any) => {
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div className={cn("relative group overflow-hidden", className)}>
        {isSelectMessages && (
          <CheckBox
            isMessageSelected={isMessageSelected}
            handleSelectMessage={handleSelectMessage}
          />
        )}
        <div
          className={cn("z-10 mx-4 flex duration-700 text-gray-50 ", {
            "self-end ml-auto": currentUserMessage,
          })}
        >
          <div
            className={cn("flex flex-row", {
              "flex-row-reverse": !currentUserMessage,
            })}
          >
            <div className="flex  items-center transition-all duration-300 p-2 relative">
              <div className="dropdown dropdown-end ml-auto">
                <button
                  ref={buttonRef}
                  tabIndex={0}
                  role="button"
                  disabled={options}
                  className={cn(
                    "group-hover:translate-x-0 group-hover:opacity-100 -translate-x-12 opacity-0 transition-transform  duration-700 ",
                    { "translate-x-12": currentUserMessage }
                  )}
                  onClick={() => setOptions(!options)}
                >
                  <Smile />
                </button>
                <AnimatePresence>
                  {options && (
                    <MessageMenu
                      buttonRef={buttonRef}
                      options={options}
                      setOptions={setOptions}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div
              className={cn(
                "max-w-md w-fit p-2 flex duration-700 bg-black flex-col text-gray-50 shadow-2xl relative transition-all rounded-xl",
                {
                  "bg-zinc-800": currentUserMessage,
                }
              )}
            >
              <div className="overflow-hidden break-words h-24">
                <AudioPlayer
                  src={message.attachments[0]}
                  getDurationAndCurrentTime={(
                    duration: number,
                    currentTime: number
                  ) => {
                    setDuration(duration);
                    setCurrentTime(currentTime);
                  }}
                />
              </div>

              <div className="absolute bottom-3 right-3 bg-black rounded-md p-1 flex text-xss justify-end items-center w-fit float-right flex-col text-right text-gray-300">
                <span className="flex z-[1] items-center gap-3 text-white mix-blend-exclusion">
                  <div className="text-xss">
                    <span>{currentTime}</span> / <span>{duration}</span>
                  </div>
                  {getReadableTime(message.createdAt)}
                  {currentUserMessage && (
                    <>
                      {isLoading && (
                        <div>
                          <Loader
                            className="animate-spin text-white"
                            size={16}
                          />
                        </div>
                      )}
                      {message.seen || allSeen ? (
                        <DoubleCheckIcon className="text-blue-500" />
                      ) : (
                        <Check />
                      )}
                    </>
                  )}
                </span>
              </div>

              {showNotch && <Notch currentUserMessage={currentUserMessage} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const PostMessage = ({
  isSelectMessages,
  isMessageSelected,
  handleSelectMessage,
  currentUserMessage,
  createdAt,
  seen,
  allSeen,
  postImages,
  className,
  username,
  avatar,
  caption,
  postId,
  isUnavailable,
  showNotch,
}: any) => {
  if (isUnavailable) {
    return (
      <div className={className}>
        <div>Post unavailable</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}
      <div
        className={`
      max-w-md w-fit p-2 mx-3 z-10 duration-700 transition-all rounded-xl ${
        currentUserMessage ? "self-end bg-zinc-800  ml-auto" : "    bg-black "
      } text-gray-50 shadow-2xl relative
    `}
      >
        <div className="py-2 flex gap-3 items-center">
          <Avatar src={avatar.url} className={"size-10 rounded-full"} />
          <UsernameLink username={username}>{username}</UsernameLink>
        </div>
        <div className="">
          <Link to={`/p/${postId}`}>
            <img
              className="rounded-xl w-52"
              alt={'postImage'}
              src={tranformUrl(postImages?.[0], 300)!}
            />
          </Link>
        </div>
        {caption && (
          <div className="py-2">
            <span>{caption}</span>
          </div>
        )}

        <div className="p-1  flex text-xss justify-end items-center w-fit float-right flex-col text-right text-gray-300">
          <span className="flex z-[1] items-center gap-3 text-white">
            {getReadableTime(createdAt)}
            {currentUserMessage &&
              (seen || allSeen ? (
                <DoubleCheckIcon className="text-blue-500" />
              ) : (
                <Check />
              ))}
          </span>
        </div>
        {showNotch && <Notch currentUserMessage={currentUserMessage} />}
      </div>
    </div>
  );
};

const AudioPlayer = memo(({ src, getDurationAndCurrentTime }: any) => {
  const { containerRef, isPlaying, currentTime, onPlayPause, duration } =
    useWaveProgress(src);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const formatedTime = formatTime(currentTime);
    const formatedDuration = formatTime(duration);
    getDurationAndCurrentTime(formatedDuration, formatedTime);
  }, [duration, currentTime, getDurationAndCurrentTime]);

  return (
    <div className="p-2 md:w-64 w-44">
      <div className="flex gap-4 items-center">
        <button
          onClick={onPlayPause}
          className=" text-white font-bold  rounded"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className=" flex flex-col relative w-96">
          <div ref={containerRef} id="waveform" />
        </div>

        <div className="p-2 bg-yellow-500 rounded-full ">
          <HeadSet className="text-base" />
        </div>
      </div>
    </div>
  );
});
export { AudioPlayer };

function Notch({ currentUserMessage }: any) {
  return (
    <div
      className={`absolute bottom-0 z-[-1] ${
        currentUserMessage ? "-right-2" : "-left-2"
      }`}
    >
      <BubbleNotch
        className={`${currentUserMessage ? "fill-zinc-800 " : "fill-black"}`}
        style={{
          transform: !currentUserMessage ? "rotateY(180deg)" : "rotate(360deg)",
        }}
      />
    </div>
  );
}

function CheckBox({ isMessageSelected, handleSelectMessage }: any) {
  return (
    <div className="flex items-center justify-center p-2">
      <input
        type="checkbox"
        className="size-4 dark:bg-black"
        checked={isMessageSelected}
        onChange={handleSelectMessage}
      />
    </div>
  );
}

function ImagePreview({ setPreviewImage, previewImage }: any) {
  return (
    <Modal
      onClose={() => setPreviewImage(undefined)}
      animate={true}
      overlayClasses={"flex items-center justify-center fixed"}
      showCloseButton={false}
      shouldCloseOutsideClick={true}
    >
      <div
        className=" flex items-center justify-center   w-screen"
        onClick={() => setPreviewImage(undefined)}
      >
        <div
          className="flex items-center justify-center w-[80%] h-[80%]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            src={previewImage}
            alt={"IMAGE PREVIEW"}
            className="object-contain" //   loaderClassName="w-screen animate-pulse h-dvh bg-zinc-950"
          />
        </div>
      </div>
    </Modal>
  );
}

function MessageMenu({ buttonRef, options, setOptions }: any) {
  return (
    <Menu
      triggerRef={buttonRef}
      width={20}
      open={options}
      onClose={() => {
        setOptions(false);
      }}
    >
      <ul
        tabIndex={0}
        className="dropdown-content z-[100] mt-2 w-44 menu p-2 shadow bg-zinc-900 rounded-box "
      >
        <li className="text-sm flex flex-row flex-nowrap items-center justify-evenly ">
          <span
            className="p-2"
            onClick={() => {
              setOptions(false);
              console.log("first");
            }}
          >
            🙂
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false);
              console.log("first");
            }}
          >
            😊
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false);
              console.log("first");
            }}
          >
            😇
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false);
              console.log("first");
            }}
          >
            😘
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false);
              console.log("first");
            }}
          >
            👍
          </span>
        </li>
        <li className="text-sm ">
          <span>Profile</span>
        </li>
        <li
          className="text-sm "
          onClick={() => {
            // setIsSelectMessages(true);
          }}
        >
          <span>Select Messages</span>
        </li>
        <li className="text-sm ">
          <span>Clear Chat</span>
        </li>
        <li className="text-sm ">
          <span>Delete Chat</span>
        </li>
      </ul>
    </Menu>
  );
}
