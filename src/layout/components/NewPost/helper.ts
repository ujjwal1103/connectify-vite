import { readFileAsDataURL } from '@/lib/utils'
import { ChangeEvent } from 'react'

type NewImage = {
  originalImage: File
  originalImageUrl: string
  croppedImage: File
  croppedImageUrl: string
  type: 'IMAGE' | 'VIDEO'
}

export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  // Fetch the URL
  const response = await fetch(url)
  
  // Check if the response is successful
  if (!response.ok) {
    throw new Error('Failed to fetch the image from the URL')
  }

  // Convert the response to a Blob
  const blob = await response.blob()

  // Convert the Blob to a File
  const file = new File([blob], filename, { type: mimeType })

  return file
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

export const convertToImageData = async (file: File) => {
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
