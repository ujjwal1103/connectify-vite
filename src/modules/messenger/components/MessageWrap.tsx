import { cn } from '@/lib/utils'
import { memo, useCallback, useEffect, useState } from 'react'
import CheckBox from './CheckBox'
import Avatar from '@/components/shared/Avatar'
import { IMessage, IUser } from '@/lib/types'
import UsernameLink from '@/components/shared/UsernameLink'
import MessageMenu from './MessageMenu'
import { useChatSlice } from '@/redux/services/chatSlice'
import Modal from '@/components/shared/modal/Modal'
import EditMessage from './EditMessage'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { deleteMessageById } from '@/api'

interface MessageWrapProps {
  children: React.ReactNode
  isSelectMessages: boolean
  isMessageSelected: boolean
  handleSelectMessage: () => void
  className?: string
  currentUserMessage: boolean
  sender: IUser
  messageId: string
  showProfile: boolean
  message: IMessage
}

const MessageWrap = ({
  children,
  isSelectMessages,
  isMessageSelected,
  handleSelectMessage,
  className,
  currentUserMessage,
  sender,
  messageId,
  showProfile,
  message,
}: MessageWrapProps) => {
  const { setEditMessage, editMessage, removeMessage } = useChatSlice()
  const [scope, animate] = useAnimate()
  const [animationCompleted, setAnimationCompleted] = useState(0)

  const onDelete = useCallback(async () => {
    await animate(
      scope.current,
      {
        height: 0,
        scale: 0,
      },
      {
        duration: 0.3,
        onComplete: ()=>{
          setAnimationCompleted(animationCompleted+1)
        }
      }
    )
  }, [message._id])

  useEffect(() => {
    if (animationCompleted === 1) {
      try {
        removeMessage(messageId);
        deleteMessageById(message._id);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  }, [animationCompleted, messageId, removeMessage]);
  

  return (
    <motion.div
      id={message._id || message.tempId}
      ref={scope}
      className={cn(
        'relative origin-[left] flex-col',
        className,
        message.isCurrentUserMessage && 'origin-right'
      )}
    >
      {!currentUserMessage && showProfile && (
        <div className="ml-3 flex gap-3">
          <UsernameLink username={sender?.username} className="flex gap-3">
            <div className="size-5">
              <Avatar src={sender?.avatar?.url} className="size-5" />
            </div>
            <span className="text-xs">{sender?.username}</span>
          </UsernameLink>
        </div>
      )}
      <div className="flex" onClick={handleSelectMessage}>
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
            'z-5 start chat mx-4 flex -translate-x-8 p-0 text-gray-50 transition-transform duration-150',
            {
              'end ml-auto translate-x-0 self-end': currentUserMessage,
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
  MessageWrap,
  (prev, next) =>
    prev.message._id === next.message._id 
);