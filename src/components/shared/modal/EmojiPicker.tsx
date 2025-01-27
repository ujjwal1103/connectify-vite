import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SmileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import { useClickOutside } from '@react-hookz/web'
import { motion, AnimatePresence } from 'framer-motion'
import { animations, scaleVariants } from '@/lib/framerVariants'

const EmojiPicker = ({ onEmojiClick }: { onEmojiClick: (e: any) => void }) => {
  const [showPicker, setShowPicker] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useClickOutside(containerRef, (e) => {
    console.log(e)
    setShowPicker(false)
  })
  return (
    <div className="relative">
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={() => setShowPicker(!showPicker)}
        className="flex size-6 items-center justify-center rounded-md hover:bg-background"
      >
        <SmileIcon size={16} />
      </Button>
      <AnimatePresence>
        {showPicker && (
          <motion.div
            variants={scaleVariants}
            {...animations}
            ref={containerRef}
            className="absolute bottom-8 right-0 origin-bottom-right bg-background"
          >
            <div className="z-[9999999] rounded-md border-none bg-transparent">
              <Picker
                data={data}
                onEmojiSelect={onEmojiClick}
                searchPosition="none"
                previewPosition="none"
                navPosition="bottom"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmojiPicker
