import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

const variants = {
  initial: {
    x: '100%', // Start off-screen to the right
  },
  animate: {
    x: 0, // Slide into view
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  exit: {
    x: '100%', // Slide out to the left
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}
const Reels = () => {
  const [show, setShow] = useState(false)
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex h-full w-full items-center justify-center bg-green-950">
        <Button onClick={() => setShow(true)}>Click</Button>
        <AnimatePresence>
          {show && (
            <motion.div
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute flex h-full w-full items-center justify-center bg-emerald-700"
            >
              <Button onClick={() => setShow(false)}>Click</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Reels
