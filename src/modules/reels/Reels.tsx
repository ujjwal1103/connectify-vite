import { childVariants, containerVariants } from '@/lib/framerVariants'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const Reels = () => {
  const [show, setShow] = useState(false)
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center">
      <button onClick={() => setShow(!show)}>Show</button>
      <AnimatePresence>
        {show && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={childVariants}>Child 1</motion.div>
            <motion.div variants={childVariants}>Child 2</motion.div>
            <motion.div variants={childVariants}>Child 3</motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Reels
