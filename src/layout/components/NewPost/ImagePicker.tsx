import { motion } from 'framer-motion'
import imageIcon from '../../../../public/assets/Icons/gallery.png'
import { pickImage } from './helper'
import { ChangeEvent } from 'react'
import { X } from 'lucide-react'

type NewImage = {
  originalImage: File
  originalImageUrl: string
  croppedImage: File
  croppedImageUrl: string
  type: 'IMAGE' | 'VIDEO'
}

type ImagePickerProps = {
  onImageSelect: (data: { name: string; image: NewImage } | undefined) => void
  onClose: () => void
}

const opacityTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 2 },
}

const ImagePicker = ({ onImageSelect, onClose }: ImagePickerProps) => {
  const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    const data = await pickImage(e)
    onImageSelect(data)
  }

  return (
    <motion.div
      className="relative flex h-96 bg-zinc-950 max-h-96 min-h-96 min-w-96 flex-col items-center justify-center gap-4 text-white"
    >
      <button className="absolute right-3 top-3" onClick={onClose}>
        <X />
      </button>
      <div>
        <img src={imageIcon} alt="" className="h-24 w-24" />
      </div>
      <label
        htmlFor="imagePicker"
        className="cursor-pointer rounded-md bg-zinc-900 p-2"
      >
        Select Photos
      </label>
      <input
        type="file"
        name="imagePicker"
        id="imagePicker"
        hidden
        accept="image/*, video/*"
        onChange={handleImagePick}
      />
    </motion.div>
  )
}

export default ImagePicker
