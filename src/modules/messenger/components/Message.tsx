import { memo, useState, useEffect, useRef, Suspense } from 'react'

import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { Link } from 'react-router-dom'
import { useChatSlice } from '@/redux/services/chatSlice'
import { FaPause, FaPlay } from 'react-icons/fa'
import { DoubleCheckIcon, HeadSet } from '@/components/icons'
import Avatar from '@/components/shared/Avatar'
import UsernameLink from '@/components/shared/UsernameLink'
import { cn, getReadableTime, tranformUrl } from '@/lib/utils'
import { Check, Loader, Smile } from 'lucide-react'
import { useWaveProgress } from '@/hooks/useWaveProgress'
import Notch from './Notch'
import CheckBox from './CheckBox'
import MessageMenu from './MessageMenu'
import TextMessage from './TextMessage'
import ImageMessage from './ImageMessage'
import ImagePreview from './ImagePreview'

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
  } = message

  const { isSelectMessages, setSelectedMessage } = useChatSlice()
  const [showNotch, setShowNotch] = useState(false)
  const [hoverd, setHoverd] = useState(false)
  const [options, setOptions] = useState(false)

  const handleSelectMessage = () => {
    setSelectedMessage(_id)
  }

  const className = clsx(
    'w-full transition-colors duration-500 flex mb-1',
    isSelectMessages && 'hover:bg-zinc-900 hover:bg-opacity-30',
    isMessageSelected && 'bg-zinc-900 bg-opacity-30'
  )

  useEffect(() => {
    if (!isNextMessageUsMine || isLastMessagae) {
      setShowNotch(true)
    }
  }, [])

  if (messageType === 'IMAGE') {
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
    )
  }
  if (messageType === 'POST_MESSAGE') {
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
    )
  }
  if (['AUDIO', 'VOICE_MESSAGE'].includes(messageType)) {
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
    )
  }
  if (messageType === 'VIDEO') {
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
    )
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
  )
}

export default memo(Message)

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
  const videoRef = useRef<any>()
  const [previewImage, setPreviewImage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const playPause = () => {
    const video = videoRef.current
    console.dir(video)
    if (video?.paused) {
      setIsPlaying(true)
      video.play()
    } else {
      video?.pause()
      setIsPlaying(false)
    }
  }
  return (
    <div className={cn('group relative overflow-hidden', className)}>
      {isSelectMessages && (
        <CheckBox
          isMessageSelected={isMessageSelected}
          handleSelectMessage={handleSelectMessage}
        />
      )}
      <div
        className={cn('z-10 mx-4 flex text-gray-50 duration-700', {
          'ml-auto self-end': currentUserMessage,
        })}
      >
        <div
          className={cn('flex flex-row', {
            'flex-row-reverse': !currentUserMessage,
          })}
        >
          <div className="relative flex items-center p-2 transition-all duration-300">
            <div className="dropdown dropdown-end ml-auto">
              <button
                ref={buttonRef}
                tabIndex={0}
                role="button"
                disabled={options}
                className={cn(
                  '-translate-x-12 opacity-0 transition-transform duration-700 group-hover:translate-x-0 group-hover:opacity-100',
                  { 'translate-x-12': currentUserMessage }
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
              'relative flex w-fit max-w-md flex-col rounded-xl bg-black p-2 text-gray-50 shadow-2xl transition-all duration-700',
              {
                'bg-zinc-800': currentUserMessage,
              }
            )}
          >
            <div className="min-h-48 w-72 overflow-hidden break-words">
              <button
                onClick={playPause}
                className="absolute left-4 top-4 z-50 rounded px-4 py-2 font-bold text-white"
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

            <div className="absolute bottom-3 right-3 float-right flex w-fit flex-col items-center justify-end rounded-md bg-black p-1 text-right text-xss text-gray-300">
              <span className="z-[1] flex items-center gap-3 text-white mix-blend-exclusion">
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
  )
}

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
    const [duration, setDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const buttonRef = useRef<HTMLButtonElement>(null)

    return (
      <div className={cn('group relative overflow-hidden', className)}>
        {isSelectMessages && (
          <CheckBox
            isMessageSelected={isMessageSelected}
            handleSelectMessage={handleSelectMessage}
          />
        )}
        <div
          className={cn('z-10 mx-4 flex text-gray-50 duration-700', {
            'ml-auto self-end': currentUserMessage,
          })}
        >
          <div
            className={cn('flex flex-row', {
              'flex-row-reverse': !currentUserMessage,
            })}
          >
            <div className="relative flex items-center p-2 transition-all duration-300">
              <div className="dropdown dropdown-end ml-auto">
                <button
                  ref={buttonRef}
                  tabIndex={0}
                  role="button"
                  disabled={options}
                  className={cn(
                    '-translate-x-12 opacity-0 transition-transform duration-700 group-hover:translate-x-0 group-hover:opacity-100',
                    { 'translate-x-12': currentUserMessage }
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
                'relative flex w-fit max-w-md flex-col rounded-xl bg-black p-2 text-gray-50 shadow-2xl transition-all duration-700',
                {
                  'bg-zinc-800': currentUserMessage,
                }
              )}
            >
              <div className="h-24 overflow-hidden break-words">
                <AudioPlayer
                  src={message.attachments[0]}
                  getDurationAndCurrentTime={(
                    duration: number,
                    currentTime: number
                  ) => {
                    setDuration(duration)
                    setCurrentTime(currentTime)
                  }}
                />
              </div>

              <div className="absolute bottom-3 right-3 float-right flex w-fit flex-col items-center justify-end rounded-md bg-black p-1 text-right text-xss text-gray-300">
                <span className="z-[1] flex items-center gap-3 text-white mix-blend-exclusion">
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
    )
  }
)

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
    )
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
        className={`z-10 mx-3 w-fit max-w-md rounded-xl p-2 transition-all duration-700 ${
          currentUserMessage ? 'ml-auto self-end bg-zinc-800' : 'bg-black'
        } relative text-gray-50 shadow-2xl`}
      >
        <div className="flex items-center gap-3 py-2">
          <Avatar src={avatar.url} className={'size-10 rounded-full'} />
          <UsernameLink username={username}>{username}</UsernameLink>
        </div>
        <div className="">
          <Link to={`/p/${postId}`}>
            <img
              className="w-52 rounded-xl"
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

        <div className="float-right flex w-fit flex-col items-center justify-end p-1 text-right text-xss text-gray-300">
          <span className="z-[1] flex items-center gap-3 text-white">
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
  )
}

const AudioPlayer = memo(({ src, getDurationAndCurrentTime }: any) => {
  const { containerRef, isPlaying, currentTime, onPlayPause, duration } =
    useWaveProgress(src)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const formatedTime = formatTime(currentTime)
    const formatedDuration = formatTime(duration)
    getDurationAndCurrentTime(formatedDuration, formatedTime)
  }, [duration, currentTime, getDurationAndCurrentTime])

  return (
    <div className="w-44 p-2 md:w-64">
      <div className="flex items-center gap-4">
        <button onClick={onPlayPause} className="rounded font-bold text-white">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div className="relative flex w-96 flex-col">
          <div ref={containerRef} id="waveform" />
        </div>

        <div className="rounded-full bg-yellow-500 p-2">
          <HeadSet className="text-base" />
        </div>
      </div>
    </div>
  )
})
export { AudioPlayer }
