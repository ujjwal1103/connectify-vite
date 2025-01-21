import { cn } from '@/lib/utils'
import { memo, useCallback } from 'react'
import CheckBox from './CheckBox'
import Avatar from '@/components/shared/Avatar'
import { IMessage, IUser } from '@/lib/types'
import UsernameLink from '@/components/shared/UsernameLink'
import MessageMenu from './MessageMenu'
import { useChatSlice } from '@/redux/services/chatSlice'
import Modal from '@/components/shared/modal/Modal'
import EditMessage from './EditMessage'
import { AnimatePresence, motion } from 'framer-motion'
import { deleteMessageById } from '@/api'
import clsx from 'clsx'

interface MessageWrapProps {
  children: React.ReactNode
  sender: IUser
  messageId: string
  showProfile: boolean
  message: IMessage
}

const MessageWrap = ({
  children,
  sender,
  messageId,
  showProfile,
  message,
}: MessageWrapProps) => {

  const {
    setEditMessage,
    editMessage,
    removeMessage,
    isSelectMessages,
    setSelectedMessage,
    selectedMessages,
    selectedChat
  } = useChatSlice()

  const isMessageSelected = selectedMessages.some(s=>s === message._id)

  const onDelete = useCallback(async () => {
    removeMessage(messageId)
    deleteMessageById(message._id)
  }, [message._id])

  const currentUserMessage = Boolean(message.isCurrentUserMessage)

  const handleSelectMessage = () => {
    if (isSelectMessages) {
      setSelectedMessage(message._id)
    }
  }

  const className = clsx(
    'w-full transition-colors duration-300 flex mb-1',
    isSelectMessages && 'hover:bg-zinc-950',
    isMessageSelected && 'bg-zinc-950 bg-opacity-60'
  )

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        height: 0,
        y: -10,
        transition: { duration: 0.4 },
      }}
      transition={{ duration: 0.4 }}
      className={cn(
        'relative origin-[left] flex-col',
        className,
        message.isCurrentUserMessage && 'origin-right'
      )}
    >
      {!message.isCurrentUserMessage && showProfile && selectedChat?.isGroup && (
        <div className="ml-3 flex gap-3">
          <UsernameLink username={sender?.username} className="flex gap-3">
            <div className="size-5">
              <Avatar src={sender?.avatar?.url} className="size-5" />
            </div>
            <span className="text-xs">{sender?.username}</span>
          </UsernameLink>
        </div>
      )}
      <div className="flex">
        <div
          className={cn(
            'flex -translate-x-8 items-center transition-transform duration-150',
            {
              'translate-x-0': isSelectMessages,
            }
          )}
        >
          <CheckBox
            isMessageSelected={isMessageSelected}
            handleSelectMessage={handleSelectMessage}
          />
        </div>
        <div
          className={cn(
            'z-5 mx-4 flex -translate-x-8 p-0 text-gray-50 transition-transform duration-150',
            {
              'ml-auto translate-x-0 self-end': currentUserMessage,
              'translate-x-0': isSelectMessages,
            }
          )}
        >
          <div
            className={cn('group flex flex-row', {
              'flex-row-reverse': !currentUserMessage,
            })}
          >
            <div className="relative flex items-center p-2 transition-all duration-300">
              <MessageMenu
                currentUserMessage={currentUserMessage}
                messageId={messageId}
                message={message}
                onDelete={onDelete}
              />
            </div>
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {editMessage && (
          <Modal
            onClose={() => {
              setEditMessage(null)
            }}
            showCloseButton={false}
            shouldCloseOutsideClick={false}
          >
            <EditMessage message={editMessage} />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default memo(
  MessageWrap
)
