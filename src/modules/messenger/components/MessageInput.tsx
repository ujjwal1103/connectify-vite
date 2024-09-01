import { ImageFill, MusicLibrary, Send, VideoLibrary } from '@/components/icons'
import { RefObject, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useClickOutside } from '@react-hookz/web'
import { IoClose } from 'react-icons/io5'

import { BiMicrophone } from 'react-icons/bi'

import { FaTrash } from 'react-icons/fa'
import Input from '@/components/shared/Input'
import { useParams } from 'react-router-dom'
import { useChatSlice } from '@/redux/services/chatSlice'
import AudioRecorder from './AudioRecorder'
import { deleteMessagesByIds } from '@/api'
import useSendMessage from './useSendMessage'
import { cn, readFileAsDataURL } from '@/lib/utils'
import { PlusIcon, Smile } from 'lucide-react'
import EmojiPicker from '@emoji-mart/react'

function blobToFile(blob: Blob, filename: string): File {
  const file = new File([blob], filename, {
    type: blob.type,
    lastModified: new Date().getTime(),
  })

  return file
}

export const Loader = () => {
  return (
    <div className="flex-center">
      <motion.div
        className="h-4 w-24 rounded-full bg-zinc-800"
        animate={{ width: '100%' }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      ></motion.div>
    </div>
  )
}

const MessageInput = () => {
  const [messageText, setMessageText] = useState('')
  const { chatId } = useParams<{ chatId: string }>()
  const [openDial, setOpenDial] = useState(false)
  const [emoji, setEmoji] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const speedDialRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const emojiRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const speedDialButtonRef: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null)
  const emojiButtonRef: RefObject<HTMLButtonElement> =
    useRef<HTMLButtonElement>(null)
  const { send, sendAttachment } = useSendMessage()
  const {
    isSelectMessages,
    selectedMessages,
    setIsSelectMessages,
    deleteAllMessagesByIds,
    selectedChat,
  } = useChatSlice()

  //   const { socket } = useSocket();
  const handleTextChange = (e: any) => {
    setMessageText(e.target.value)
  }

  const handleSend = async () => {
    if (!messageText) return

    const newMessage = {
      text: messageText,
      messageType: 'TEXT_MESSAGE',
      to: selectedChat?.friend?._id!,
    }
    setMessageText('')
    await send(newMessage, chatId!)
  }

  const handleSendAttachement = async (e: any, messageType: string) => {
    setOpenDial(false)
    const files = e.target.files
    const formData = new FormData()
    const dataUrl: string[] = []

    for (let i = 0; i < files.length; i++) {
      formData.append('messageAttachement', files[i])
    }
    formData.append('messageType', messageType)
    formData.append('to', selectedChat?.friend?._id!)

    for (let i = 0; i < files.length; i++) {
      const dataURL: string = (await readFileAsDataURL(files[i])) as any
      dataUrl.push(dataURL)
    }

    await sendAttachment(formData, chatId!, dataUrl)
  }

  const onCloseSpeedDial = (e: any) => {
    if (
      speedDialButtonRef.current &&
      speedDialButtonRef.current.contains(e.target)
    ) {
      return
    }
    setOpenDial(false)
  }
  const onCloseEmoji = (e: any) => {
    if (emojiButtonRef.current && emojiButtonRef.current.contains(e.target)) {
      return
    }
    setEmoji(false)
  }

  useClickOutside(speedDialRef, onCloseSpeedDial)
  useClickOutside(emojiRef, onCloseEmoji)

  const handleClose = () => {
    setIsSelectMessages(false)
  }

  const handleDeleteMessages = async () => {
    const res = await deleteMessagesByIds(selectedMessages)
    if (res.isSuccess) {
      deleteAllMessagesByIds(selectedMessages)
    }
  }

  if (isRecording) {
    return (
      <div className="flex-[0.05] bg-secondary">
        <AudioRecorder
          handleClose={() => setIsRecording(false)}
          handleSendRecording={(recording: any) => {
            const file = blobToFile(recording, `${Date.now() + 'webm'}`)
            handleSendAttachement(
              { target: { files: [file] } },
              'VOICE_MESSAGE'
            )
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative flex-[0.05]">
      <AnimatePresence mode="sync">
        {isSelectMessages ? (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            className="bg-secondary"
          >
            <div className="flex items-center gap-3 px-4 py-2">
              <button onClick={handleClose}>
                <IoClose size={24} />
              </button>
              <span>{selectedMessages.length} selected</span>

              <button
                onClick={handleDeleteMessages}
                disabled={!selectedMessages.length}
                className="ml-auto text-gray-400 hover:text-white disabled:text-gray-400"
              >
                <FaTrash size={24} className="" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div className="flex items-center gap-3 bg-secondary p-2">
            <Input
              className="w-full rounded-md border-none bg-background px-12 pl-20 text-gray-200 focus:outline-none"
              value={messageText}
              onChange={handleTextChange}
              placeholder="Type..."
              onKeyDown={(e: any) => {
                if (e.key === 'Enter' && messageText && e.target.value) {
                  handleSend()
                }
              }}
              prefix={
                <div className="flex items-center gap-2">
                  <motion.button
                    ref={emojiButtonRef}
                    className={cn(
                      'flex cursor-pointer items-center justify-center transition-transform ease-linear',
                      {
                        'text-blue-700': emoji,
                      }
                    )}
                    onClick={() => setEmoji((prev) => !prev)}
                  >
                    <Smile className="fill-black" />
                  </motion.button>
                  <motion.button
                    ref={speedDialButtonRef}
                    className={cn(
                      'flex cursor-pointer items-center justify-center transition-transform ease-linear',
                      {
                        'rotate-45 text-blue-700': openDial,
                      }
                    )}
                    onClick={() => setOpenDial((prev) => !prev)}
                  >
                    <PlusIcon className="fill-black dark:fill-white" />
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
              type={''}
              error={undefined}
              autoFocus={false}
              sufixClassname={''}
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
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  ref={emojiRef}
                  className="absolute bottom-16 left-4 z-[999] flex origin-bottom-left items-center overflow-hidden rounded-md shadow-xl"
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
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  layoutId="test1"
                  ref={speedDialRef}
                  layout
                  className="absolute bottom-16 left-4 z-[999] flex origin-bottom-left items-center gap-2 overflow-hidden rounded-md bg-secondary shadow-xl"
                >
                  <div className="flex gap-3 p-3">
                    <motion.label
                      layout
                      htmlFor="imageFile"
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-black ring-2 ring-zinc-700"
                    >
                      <ImageFill className="size-5 fill-black dark:fill-white" />
                      <input
                        type="file"
                        id="imageFile"
                        hidden
                        multiple
                        onChange={(e) => handleSendAttachement(e, 'IMAGE')}
                        accept="image/*, webp"
                      />
                    </motion.label>
                    <motion.label
                      layout
                      htmlFor="audioFile"
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-black ring-2 ring-zinc-700"
                    >
                      <MusicLibrary className="size-5 fill-black dark:fill-white" />
                      <input
                        type="file"
                        id="audioFile"
                        hidden
                        multiple
                        onChange={(e) => handleSendAttachement(e, 'AUDIO')}
                        accept="audio/*"
                      />
                    </motion.label>
                    <motion.label
                      layout
                      htmlFor="videoFile"
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-black ring-2 ring-zinc-700"
                    >
                      <VideoLibrary className="size-5 fill-black dark:fill-white" />
                      <input
                        type="file"
                        id="videoFile"
                        hidden
                        multiple
                        onChange={(e) => handleSendAttachement(e, 'VIDEO')}
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
  )
}

export default MessageInput
