import { ImageSlider } from '@/components/shared/ImageSlider/ImageSlider'
import { IIamge } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useEffect, useRef, useState } from 'react'

type PostContentProps = {
  images: IIamge[]
}

const PostContent = ({ images }: PostContentProps) => {
  const ref = useRef<any>()

  const [liked, setLiked] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleDoubleClick = () => {
    console.log({ liked })
    setLiked(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => setLiked(false), 500)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return (
    <div ref={ref} className="overflow-hidden h-full">
      <div
        className="relative block w-full overflow-hidden h-full"
        style={{ display: 'block' }}
      >
        <div className="block h-full w-full" onDoubleClick={handleDoubleClick}>
          <ImageSlider images={images} />
          <AnimatePresence>
            {liked && (
              <motion.div
                key="like"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="rgba(231, 76, 60, 0.8)"
                  width="100px"
                  height="100px"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default memo(PostContent)
