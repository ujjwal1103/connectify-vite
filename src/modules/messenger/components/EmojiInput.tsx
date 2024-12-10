import EmojiPicker from '@emoji-mart/react'
import { useClickOutside } from '@react-hookz/web'
import { motion } from 'framer-motion'
import { RefObject, useRef } from 'react'

interface EmojiInputProps {
  onCloseEmoji: (e: any) => void        
  onEmojiSelect: (emoji: any) => void        
}

const EmojiInput = ({ onCloseEmoji,onEmojiSelect }: EmojiInputProps) => {
  const emojiRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  useClickOutside(emojiRef, onCloseEmoji)
  return (
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
            onEmojiSelect={onEmojiSelect}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EmojiInput
