import { motion } from 'framer-motion'
import imageIcon from '../../../assets/Icons/gallery.png'
import { pickImage } from './helper'
import { ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  loading?: boolean
}

const ImagePicker = ({ onImageSelect, onClose, loading }: ImagePickerProps) => {
  const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    const data = await pickImage(e)
    onImageSelect(data)
  }



  return (
    <motion.div
      className={cn(
        'relative flex w-screen aspect-1 md:w-500 md:h-500 flex-col items-center justify-center gap-4 bg-background text-white'
      )}
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
      {loading && <div className="absolute inset-0 bg-black/50"></div>}
    </motion.div>
  )
}

export default ImagePicker
