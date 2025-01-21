import { useClickOutside } from '@react-hookz/web'
import { motion } from 'framer-motion'
import { Headphones, ImagesIcon, LucideIcon, Video } from 'lucide-react'
import { RefObject, useRef } from 'react'
import { IconType } from 'react-icons/lib'

interface AttachmentOptionType {
  id: string
  accept: string
  type: 'IMAGE' | 'VIDEO' | 'AUDIO'
  icon: IconType | LucideIcon
}

const attachmentOptions: AttachmentOptionType[] = [
  {
    accept: 'image/*, webp',
    id: 'imageFile',
    type: 'IMAGE',
    icon: ImagesIcon,
  },
  {
    accept: 'video/*',
    id: 'videoFile',
    type: 'VIDEO',
    icon: Video,
  },
  {
    accept: 'audio/*',
    id: 'audioFile',
    type: 'AUDIO',
    icon: Headphones,
  },
]

interface MessageAttachmentInputProps {
  handleSendAttachement: (e: any, type: string) => void
  onCloseSpeedDial: (e: any) => void
}

const MessageAttachmentInput = ({
  handleSendAttachement,
  onCloseSpeedDial,
}: MessageAttachmentInputProps) => {
  const speedDialRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  useClickOutside(speedDialRef, onCloseSpeedDial)
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      layoutId="test1"
      ref={speedDialRef}
      layout
      className="absolute bottom-16 left-4 z-[999] flex origin-bottom-left items-center gap-2 overflow-hidden rounded-md bg-secondary shadow-xl"
    >
      <div className="flex gap-3 p-3">
        {attachmentOptions.map(({ id, type, accept, icon: Icon }) => {
          return (
            <motion.label
              layout
              htmlFor={id}
              className="flex h-10 w-10 hover:bg-black/80 cursor-pointer items-center justify-center rounded-md bg-black ring-2 ring-zinc-700"
            >
              <Icon className="size-5 " />
              <input
                type="file"
                id={id}
                hidden
                multiple
                onChange={(e) => handleSendAttachement(e, type)}
                accept={accept}
              />
            </motion.label>
          )
        })}
      </div>
    </motion.div>
  )
}

export default MessageAttachmentInput
