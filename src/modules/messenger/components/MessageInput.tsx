import { AnimatePresence, motion } from 'framer-motion'
import { RefObject, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { PlusIcon, Send, Smile } from 'lucide-react'
import { BiMicrophone } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { FaTrash } from 'react-icons/fa'

import MessageAttachmentInput from './MessageAttachmentInput'
import Input from '@/components/shared/Input'
import AudioRecorder from './AudioRecorder'
import EmojiInput from './EmojiInput'

import { cn, readFileAsDataURL } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import useSendMessage from './useSendMessage'
import { deleteMessagesByIds } from '@/api'
import MessageReply from './MessageReply'

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
    currentMessageReply,
  } = useChatSlice()

  const handleTextChange = (e: any) => {
    setMessageText(e.target.value)
  }

  const handleSend = async () => {
    if (!messageText) return

    const newMessage = {
      text: messageText,
      messageType: 'TEXT_MESSAGE',
      to: selectedChat?.friend?._id!,
      reply: currentMessageReply?.message,
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

    await sendAttachment(
      formData,
      chatId!,
      dataUrl,
      currentMessageReply?.message
    )
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

  const handleClose = () => {
    setIsSelectMessages(false)
  }

  const handleDeleteMessages = async () => {
    const res = await deleteMessagesByIds(selectedMessages)
    if (res.isSuccess) {
      deleteAllMessagesByIds(selectedMessages)
    }
  }

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && messageText && e.target.value) {
      handleSend()
    }
  }
  const onEmojiSelect = (e: any) => {
    setMessageText((prev) => prev + e.native)
  }

  const inputPrefix = () => (
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
        <Smile className="fill-white" />
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
        <PlusIcon className="fill-white text-white" />
      </motion.button>
    </div>
  )

  const inputSufix = () => (
    <button
      disabled={!messageText}
      onClick={handleSend}
      className="cursor-pointer px-1 disabled:pointer-events-none disabled:opacity-80"
    >
      <Send size={20} className="" />
    </button>
  )

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
          <>
            <motion.div className="flex flex-col gap-2 bg-secondary p-2">
              <MessageReply />
              <div className="flex items-center gap-3">
                <Input
                  className="w-full rounded-md border-none bg-background px-12 pl-20 text-gray-200 placeholder:text-gray-300 focus:outline-none"
                  value={messageText}
                  onChange={handleTextChange}
                  placeholder="Type..."
                  onKeyDown={onKeyDown}
                  prefix={inputPrefix()}
                  sufix={inputSufix()}
                  autoFocus={true}
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
                    <EmojiInput
                      onCloseEmoji={onCloseEmoji}
                      onEmojiSelect={onEmojiSelect}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {openDial && (
                    <MessageAttachmentInput
                      handleSendAttachement={handleSendAttachement}
                      onCloseSpeedDial={onCloseSpeedDial}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MessageInput
