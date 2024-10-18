import { cn, getReadableTime } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import { Loader, Check, CheckCheck } from 'lucide-react'
import { memo, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'

import ImagePreview from './ImagePreview'

import Notch from './Notch'
import { IMessage } from '@/lib/types'

interface VideoMessageProps {
  currentUserMessage: boolean
  message: IMessage
  showNotch: boolean
  allSeen: boolean
}

const VideoMessage = ({
  currentUserMessage,
  message,
  allSeen,
  showNotch,
}: VideoMessageProps) => {
  const videoRef = useRef<any>()
  const [previewImage, setPreviewImage] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
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

  console.log(message.attachments[0].url)

  return (
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
              {message.isLoading && (
                <div>
                  <Loader className="animate-spin text-white" size={16} />
                </div>
              )}
              {message.seen || allSeen ? (
                <CheckCheck className="text-blue-500" />
              ) : (
                <Check />
              )}
            </>
          )}
        </span>
      </div>

      {showNotch && <Notch currentUserMessage={currentUserMessage} />}
      <div
        className={cn('absolute -bottom-3 z-20 text-lg', {
          '-left-2': currentUserMessage,
          '-right-2': !currentUserMessage,
        })}
      >
        {message?.reaction}
      </div>
      <AnimatePresence>
        {previewImage && (
          <ImagePreview
            setPreviewImage={setPreviewImage}
            previewImage={previewImage}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
export default memo(VideoMessage)
