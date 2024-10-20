import Modal from '@/components/shared/modal/Modal'
import { motion } from 'framer-motion'

function ImagePreview({ onClose, previewImage }: any) {
  return (
    <Modal
      onClose={onClose}
      animate={true}
      overlayClasses={'flex items-center justify-center fixed'}
      showCloseButton={false}
    >
      <div
        className="flex w-screen h-auto items-center justify-center"
        onClick={onClose}
      >
        <div
          className="flex md:h-dvh items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            src={previewImage}
            alt={'IMAGE PREVIEW'}
            className="max-w-screen h-[90%] object-contain"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ImagePreview
