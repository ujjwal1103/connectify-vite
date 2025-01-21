// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Mic } from 'lucide-react'
import { useState } from 'react'

// const variants = {
//   initial: {
//     x: '100%', // Start off-screen to the right
//   },
//   animate: {
//     x: 0, // Slide into view
//     transition: { duration: 0.5, ease: 'easeInOut' },
//   },
//   exit: {
//     x: '100%', // Slide out to the left
//     transition: { duration: 0.5, ease: 'easeInOut' },
//   },
// }

type TypeProps = 'Input' | 'Recording' | 'Menu'
const Reels = () => {
  // const [show, setShow] = useState(false)
  const [type, setType] = useState<TypeProps>('Input')

  const handleClick = (type: TypeProps) => {
    setType(type)
  }


  const variants = {
    show: {
      opacity: 1,
      
    },
    hide: {
      opacity: 0,
     
    },
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      {/* <div className="flex h-full w-full items-center justify-center bg-green-950">
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
      </div> */}
      {/* <ImageGallary/> */}
      <div className="flex h-96 w-128 flex-col bg-secondary overflow-hidden">
        <div className="flex flex-1 items-center justify-center gap-2">
          <Button
            size="lg"
            disabled={type === 'Input'}
            className="h-8 px-3 py-2"
            onClick={() => handleClick('Input')}
          >
            Input
          </Button>
          <Button
            size="lg"
            disabled={type === 'Recording'}
            className="h-8 px-3 py-2"
            onClick={() => handleClick('Recording')}
          >
            Recording
          </Button>
          <Button
            size="lg"
            disabled={type === 'Menu'}
            className="h-8 px-3 py-2"
            onClick={() => handleClick('Menu')}
          >
            Menu
          </Button>
        </div>
        <AnimatePresence initial={false} mode="popLayout">
          {type === 'Input' && (
            <motion.div
              key="Input"
              variants={variants}
              initial="hide"
              animate="show"
              exit="hide"
              transition={{duration: 0.2}}
              className="flex h-10 w-full items-center bg-background px-3"
            >
              <input
                type="text"
                className="w-full rounded-md border-2 border-transparent p-1 px-3 focus:outline-none focus-visible:border-blue-800"
                placeholder="Write message..."
              />
            </motion.div>
          )}
          {type === 'Recording' && (
            <motion.div
              key="Recording"
              variants={variants}
              initial="hide"
              animate="show"
              exit="hide"
              transition={{duration: 0.2}}
              className="flex h-10 w-full items-center gap-2 bg-background px-3"
            >
              <Button size="icon" variant="ghost" className="h-8 p-px">
                <Mic size="20" />
              </Button>
              <span>Start Recording</span>
            </motion.div>
          )}
          {type === 'Menu' && (
            <motion.div
              key="Menu"
              variants={variants}
              initial="hide"
              animate="show"
              exit="hide"
              transition={{duration: 0.2}}
              className="flex h-10 w-full items-center gap-2 bg-background px-3"
            >
              <Button size="icon" variant="ghost" className="h-8 p-px">
                <Menu size="20" />
              </Button>
              Menu
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Reels
