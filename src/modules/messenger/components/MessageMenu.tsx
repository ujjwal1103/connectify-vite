import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  memo,
} from 'react'
import { createPortal } from 'react-dom'

import {
  Info,
  PencilIcon,
  Reply,
  Smile,
  Trash2,
} from 'lucide-react'
import { reactCurrentMessage } from '@/api'
import { IMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import { AnimatePresence, motion } from 'framer-motion'
import DropDownMenuItem from '@/components/shared/dialogs/DropDownMenu/DropDownMenuItem'

interface MessageMenuOptions {
  currentUserMessage: boolean
  messageId: string
  message: IMessage
  onDelete: ()=>void
}

const reactionEmoji = ['👍', '🙂', '😊', '😇', '😘']

const MessageMenu = ({
  currentUserMessage,
  messageId,
  message,
  onDelete
}: MessageMenuOptions) => {
  const [moreOptions, setMoreOptions] = useState(false)
  const [menuPosition, setMenuPosition] = useState<any>({
    top: 0,
    left: 0,
    origin: 'top left',
  })
  const {
    reactMessage,
    setCurrentMessageReply,
    setEditMessage,
  } = useChatSlice()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClickOutside = (event: globalThis.MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMoreOptions(false)
    }
  }

  const handleScroll = () => {
    setMoreOptions(false)
  }

  const handleMoreOptions = () => {
    setMoreOptions(true)
  }

  const handleDelete = async () => {
    onDelete()
    setMoreOptions(false)
  }

  const handleReaction = async (emoji: string) => {
    reactMessage({ emoji, messageId })
    await reactCurrentMessage(messageId, emoji)
    setMoreOptions(false)
  }

  const handleReply = () => {
    setCurrentMessageReply({
      messageId,
      sender: currentUserMessage ? 'You' : message.sender.username,
      message: message,
    })
    setMoreOptions(false)
  }

  useLayoutEffect(() => {
    if (moreOptions && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()

      const menuHeight = 160
      const menuWidth = 208
      let top = buttonRect.bottom + window.scrollY
      let left = currentUserMessage
        ? buttonRect.right - menuWidth
        : buttonRect.left

      let origin = currentUserMessage ? 'top right' : 'top left'

      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 8
        origin = currentUserMessage ? 'top right' : 'top right'
      }

      if (left < 0) {
        left = 8
        origin = currentUserMessage ? 'top left' : 'top left'
      }

      if (window.innerHeight - buttonRect.bottom < menuHeight) {
        top = buttonRect.top + window.scrollY - menuHeight
        origin = currentUserMessage ? 'bottom right' : 'bottom left'
      }

      setMenuPosition({ top, left, origin })
    }
  }, [moreOptions, currentUserMessage])

  useEffect(() => {
    if (moreOptions) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('scroll', handleScroll, true)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [moreOptions])

  const onClickEditMessage = () => {
    setEditMessage(message)
  }

  return (
    <div className="ml-auto">
      <button
        ref={buttonRef}
        tabIndex={0}
        role="button"
        disabled={moreOptions}
        className={cn(
          '-translate-x-12 opacity-0 transition-transform duration-700 group-hover:translate-x-0 group-hover:opacity-100',
          { 'translate-x-12': currentUserMessage }
        )}
        onClick={handleMoreOptions}
      >
        <Smile />
      </button>

      {createPortal(
        <AnimatePresence mode="sync">
          {moreOptions && (
            <motion.div
              ref={menuRef}
              className="fixed z-100 bg-[#1b1b1b] border border-[#1f1f1f]"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.3 }}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                transformOrigin: menuPosition.origin,
              }}
            >
              <ul tabIndex={0} className="p-1.5">
                <li className="flex flex-row flex-nowrap items-center justify-evenly text-sm">
                  {reactionEmoji.map((emoji) => (
                    <EmojiButton
                      key={emoji}
                      emoji={emoji}
                      onClick={handleReaction}
                    />
                  ))}
                </li>
             {message.isCurrentUserMessage &&   <DropDownMenuItem
                  label={'Message Info'}
                  onClick={() => {}}
                  icon={Info}
                />}
                {message.messageType === 'TEXT_MESSAGE' && message.isCurrentUserMessage && (
                  <DropDownMenuItem
                    label={'Edit'}
                    onClick={onClickEditMessage}
                    icon={PencilIcon}
                  />
                )}
                <DropDownMenuItem
                  label={'Reply'}
                  onClick={handleReply}
                  icon={Reply}
                />
                <DropDownMenuItem
                  label={'Delete'}
                  onClick={handleDelete}
                  icon={Trash2}
                />
              </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default memo(MessageMenu)

export const EmojiButton = ({
  onClick,
  emoji,
}: {
  onClick: (emoji: string) => void
  emoji: string
}) => {
  return (
    <button
      className="rounded px-2 py-2 text-sm hover:bg-background/50"
      onClick={() => onClick(emoji)}
    >
      {emoji}
    </button>
  )
}

