import { readFileAsDataURL } from '@/lib/utils'
import { ChangeEvent } from 'react'

type NewImage = {
  originalImage: File
  originalImageUrl: string
  croppedImage: File
  croppedImageUrl: string
  type: 'IMAGE' | 'VIDEO'
}

export const pickImage = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files![0]
  const dataURL = (await readFileAsDataURL(file)) as string

  const isImageFile = file?.type.includes('image')
  const isVideoFile = file?.type.includes('video')

  if (!isImageFile && !isVideoFile) return

  const newImageData: NewImage = {
    originalImage: file,
    originalImageUrl: dataURL,
    croppedImage: file,
    croppedImageUrl: '',
    type: isImageFile ? 'IMAGE' : 'VIDEO',
  }

  return { name: file.name, image: newImageData }
}
