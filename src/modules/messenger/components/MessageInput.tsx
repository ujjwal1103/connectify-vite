import { AnimatePresence, motion } from 'framer-motion'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { PlusIcon, Send, Smile, Trash2 } from 'lucide-react'
import { BiMicrophone } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'

import MessageAttachmentInput from './MessageAttachmentInput'
import AudioRecorder from './AudioRecorder'
import EmojiInput from './EmojiInput'

import { cn, readFileAsDataURL } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import useSendMessage from './useSendMessage'
import { deleteMessagesByIds } from '@/api'
import MessageReply from './MessageReply'
import { useSocket } from '@/context/SocketContext'
import { getCurrentUserId } from '@/lib/localStorage'

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

type TypeProps = 'Input' | 'Recording' | 'Menu'

const variants = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
}

const MessageInput = () => {
  const [messageText, setMessageText] = useState('')
  const { chatId } = useParams<{ chatId: string }>()
  const [openDial, setOpenDial] = useState(false)
  const [emoji, setEmoji] = useState(false)
  const [typing, setTyping] = useState(true)

  const [type, setType] = useState<TypeProps>('Input')

  const handleClick = (type: TypeProps) => {
    setType(type)
  }

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const { socket } = useSocket()

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
    setCurrentMessageReply
  } = useChatSlice()

  useEffect(() => {
    if (isSelectMessages) {
      handleClick('Menu')
    }
  }, [isSelectMessages])

  const handleTextChange = (e: any) => {
    setMessageText(e.target.value)

    const members = selectedChat?.members
      ?.filter((member) => member._id !== getCurrentUserId())
      .map((u) => u._id)

    if (socket && !typing) {
      setTyping(true)
      socket!.emit('TYPING', {
        chatId: selectedChat?._id,
        members: members,
        isTyping: true,
      })
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false)
      socket!.emit('TYPING', {
        chatId: selectedChat?._id,
        members: members,
        isTyping: false,
      })
    }, 2000)
  }

  const handleSend = async () => {
    if (!messageText) return

    const newMessage = {
      text: messageText,
      messageType: 'TEXT_MESSAGE',
      to: selectedChat?.friend?._id!,
      reply: currentMessageReply?.message,
    }
    setCurrentMessageReply(null)
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
    handleClick('Input')
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
    setMessageText((prev: string) => prev + e.native)
  }

  return (
    <div className="relative bg-secondary">
      <AnimatePresence mode="popLayout" initial={false}>
        {type === 'Menu' && (
          <motion.div
            key="Menu"
            variants={variants}
            initial="hide"
            animate="show"
            exit="hide"
            className="flex items-center"
          >
            <div className="flex h-[53px] w-full items-center gap-3 px-4 py-2">
              <button onClick={handleClose}>
                <IoClose size={24} />
              </button>
              <span>{selectedMessages.length} selected</span>

              <button
                onClick={handleDeleteMessages}
                disabled={!selectedMessages.length}
                className="ml-auto text-gray-400 hover:text-white disabled:text-gray-400"
              >
                <Trash2 size={20} className="" />
              </button>
            </div>
          </motion.div>
        )}
        {type === 'Input' && (
          <motion.div
            key="Input"
            variants={variants}
            initial="hide"
            animate="show"
            exit="hide"
          >
            <div className="flex flex-col gap-2 p-2">
              <MessageReply />
              <div className="flex items-center gap-3">
                <div className="flex w-full items-center gap-3">
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
                      <Smile />
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
                  <div className="flex-1">
                    <input
                      className="w-full rounded-md border-2 border-transparent bg-background p-1 px-3 focus:outline-none focus-visible:border-blue-800"
                      value={messageText}
                      onChange={handleTextChange}
                      placeholder="Type..."
                      onKeyDown={onKeyDown}
                      autoFocus={true}
                    />
                  </div>

                  {messageText && (
                    <button
                      disabled={!messageText}
                      onClick={handleSend}
                      className="cursor-pointer px-1 disabled:pointer-events-none disabled:opacity-80"
                    >
                      <Send size={20} className="" />
                    </button>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    className=""
                    onClick={() => handleClick('Recording')}
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
            </div>
          </motion.div>
        )}
        {type === 'Recording' && (
          <motion.div
            key="Recording"
            variants={variants}
            initial="hide"
            animate="show"
            exit="hide"
            className="flex h-[53px] flex-[0.05] items-center justify-end bg-secondary p-2"
          >
            <AudioRecorder
              handleClose={() => handleClick('Input')}
              handleSendRecording={(recording: Blob) => {
                const file = blobToFile(recording, `${Date.now() + 'webm'}`)
                handleSendAttachement(
                  { target: { files: [file] } },
                  'VOICE_MESSAGE'
                )
                handleClick('Input')
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MessageInput
