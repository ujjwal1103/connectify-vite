import Modal from '@/components/shared/modal/Modal'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useState } from 'react'

function ImagePreview({ onClose, previewImage }: any) {
  const [scale, setScale] = useState(1) // State to track zoom level

  const handleZoom = (direction: 'in' | 'out') => {
    setScale((prevScale) => {
      const zoomStep = 0.1 // Zoom step
      if (direction === 'in') return Math.min(prevScale + zoomStep, 5) // Cap maximum zoom
      if (direction === 'out') return Math.max(prevScale - zoomStep, 1) // Cap minimum zoom
      return prevScale
    })
  }

  useEffect(() => {
    const preventPinchZoom = (e: TouchEvent) => {
      console.log(e)
      if (e.touches.length > 1) {
        // Multiple touch points detected (pinch gesture)
        e.preventDefault()
      }
    }

    const preventDefaultZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    const preventDefualt = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        // Handle zoom on keyboard shortcuts
        if (e.key === '+' || e.key === '=') {
          handleZoom('in') // Zoom in
        } else if (e.key === '-') {
          handleZoom('out') // Zoom out
        }
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', preventPinchZoom, { passive: false })
    document.addEventListener('wheel', preventDefaultZoom, { passive: false })
    document.addEventListener('keydown', preventDefualt, { passive: false })

    return () => {
      document.removeEventListener('touchmove', preventPinchZoom)
      document.removeEventListener('wheel', preventDefaultZoom)
      document.removeEventListener('keydown', preventDefualt)
    }
  }, [])

  return (
    <Modal
      onClose={onClose}
      animate={false}
      overlayClasses={
        'flex items-center justify-center fixed pointer-event-none'
      }
      showCloseButton={false}
      shouldCloseOutsideClick={false}
    >
      <div
        className="flex h-auto w-screen items-center justify-center"
        onClick={onClose}
      >
        <div
          className="flex w-full flex-col md:h-dvh"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 w-full bg-black/60 z-10 p-2">
            <div className="flex space-x-4 justify-end">
              <Button
                size={'icon'}
                variant={'ghost'}
                className="roundedtext-white"
                onClick={() => handleZoom('in')}
              >
                <ZoomIn size={20} />
              </Button>
              <Button
                size={'icon'}
                variant={'ghost'}
                className="roundedtext-white"
                onClick={() => handleZoom('out')}
              >
                <ZoomOut size={20}/>
              </Button>
              <Button
                size={'icon'}
                variant={'ghost'}
                className="roundedtext-white"
                onClick={onClose}
              >
                <X size={20}/>
              </Button>
            </div>
          </div>
          <div className='bg-red-400 flex items-center justify-center h-dvh'>
          <motion.img
            src={previewImage}
            alt={'IMAGE PREVIEW'}
            className="max-w-screen h-[90%] object-contain transition-transform duration-300 ease-linear"
            style={{ transform: `scale(${scale})` }}
            transition={{ duration: 0.2 }}
          />
          </div>
      
        </div>
      </div>
    </Modal>
  )
}

export default ImagePreview
