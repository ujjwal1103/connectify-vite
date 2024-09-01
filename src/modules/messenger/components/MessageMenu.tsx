import { deleteMessageById, reactCurrentMessage } from '@/api'
import { cn } from '@/lib/utils'
import { useChatSlice } from '@/redux/services/chatSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { Smile } from 'lucide-react'
import { useState, useRef, useLayoutEffect, useEffect, memo } from 'react'
import { createPortal } from 'react-dom'

interface MessageMenuOptions {
  currentUserMessage: boolean
  messageId: string
  showNotch: boolean
}

const reactionEmoji = ['👍', '🙂', '😊', '😇', '😘']

const MessageMenu = ({
  currentUserMessage,
  showNotch,
  messageId,
}: MessageMenuOptions) => {
  const [moreOptions, setMoreOptions] = useState(false)
  const [menuPosition, setMenuPosition] = useState<any>({
    top: 0,
    left: 0,
    bottom: 'auto',
    right: 'auto',
    origin: 'top left',
  })
  const { reactMessage } = useChatSlice()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
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
    const res = await deleteMessageById(messageId)
    console.log(res)
  }

  const handleReaction = async (emoji: string) => {
    reactMessage({ emoji, messageId })
    const res = await reactCurrentMessage(messageId, emoji)
    setMoreOptions(false)
  }

  useLayoutEffect(() => {
    if (moreOptions && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()

      const menuHeight = 160
      const isSmall = window.innerWidth <= 768
      let top = buttonRect.bottom + window.scrollY + 8
      let left = isSmall
        ? 'auto'
        : currentUserMessage
          ? buttonRect.left + 24 - 216
          : buttonRect.left + 24
      let bottom = 'auto'
      let right = isSmall ? 10 : 'auto'
      let origin = isSmall || currentUserMessage ? 'top right' : 'top left'

      if (window.innerHeight - buttonRect.bottom < menuHeight) {
        top = buttonRect.top + window.scrollY - menuHeight - 8
        origin = isSmall || currentUserMessage ? 'bottom right' : 'bottom left'
      }

      if (top < 0) {
        top = 8
        bottom = 'auto'
      }
      setMenuPosition({ top, left, bottom, right, origin })
    }
  }, [moreOptions])

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

  return (
    <div
      className={cn('ml-auto', {
        'mt-10': !currentUserMessage && showNotch,
      })}
    >
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
              className="absolute z-50 rounded bg-background shadow-xl"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.3 }}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                bottom: menuPosition.bottom,
                right: menuPosition.right,
                transformOrigin: menuPosition.origin,
              }}
            >
              <ul tabIndex={0} className="menu z-[100] mt-2 w-52 p-2">
                <li className="flex flex-row flex-nowrap items-center justify-evenly text-sm">
                  {reactionEmoji.map((emoji) => (
                    <EmojiButton emoji={emoji} onClick={handleReaction} />
                  ))}
                </li>
                <li className="text-sm">
                  <span>Message Info</span>
                </li>
                <li className="text-sm">
                  <span>Reply</span>
                </li>
                <li className="text-sm" onClick={handleDelete}>
                  <span>Delete</span>
                </li>
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
    <span className="p-2" onClick={() => onClick(emoji)}>
      {emoji}
    </span>
  )
}
