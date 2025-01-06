import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import FocusTrap from './FocusTrap'
import { useClickOutside } from '@react-hookz/web'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ModalProps = {
  onClose?: (e: any) => void
  shouldCloseOutsideClick?: boolean
  showCloseButton?: boolean
  animate?: boolean
  overlayClasses?: string
  children: React.ReactElement
}
const Modal = ({
  onClose,
  children,
  shouldCloseOutsideClick = true,
  showCloseButton = true,
  animate = true,
  overlayClasses,
}: ModalProps) => {
  const elRef = useRef<any>(null)
  const modalRef = useRef<any>(null)

  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    const modalRoot = document.body
    modalRoot.appendChild(elRef.current)
    document.body.classList.add('overflow-hidden')

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.(event)
      }
    }

    modalRef.current?.focus()

    document.body.addEventListener('keydown', handleKeyDown)

    return () => {
      modalRoot.removeChild(elRef.current!)
      document.body.classList.remove('overflow-hidden')
      modalRef.current?.blur()
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleChildClick = (e: any) => {
    e.stopPropagation()
  }

  useClickOutside(modalRef, (e) => {
    if (shouldCloseOutsideClick) {
      onClose?.(e)
    }
  })

  const childrenWithProps = React.cloneElement(children, {
    onClose,
  })

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed left-0 top-0 z-[999] h-screen w-screen bg-black bg-opacity-50',
        overlayClasses
      )}
      data-modal="true"
    >
      <FocusTrap>
        <div className="flex h-dvh w-screen items-center justify-center">
          {animate ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'tween' }}
              onClick={handleChildClick}
              tabIndex={-1}
              ref={modalRef}
              className="focus-visible:outline-0"
            >
              {childrenWithProps}
            </motion.div>
          ) : (
            <div tabIndex={-1} onClick={handleChildClick} ref={modalRef}>
              {childrenWithProps}
            </div>
          )}

          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-md border p-1 text-sm text-white transition-colors duration-300 ease-linear hover:bg-white hover:text-black lg:right-10 lg:top-10 lg:p-2 lg:text-base"
            >
              Close
            </button>
          )}
        </div>
      </FocusTrap>
    </motion.div>,
    elRef.current
  )
}

export default Modal
