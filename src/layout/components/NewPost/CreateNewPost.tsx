import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ImageCropper from '@/components/crop/ImageCropper'
import CaptionComponent from './CaptionComponent'
import ImagePicker from './ImagePicker'

type Step = 'Crop' | 'Caption' | 'Pick'

function extractCroppedImageUrls(data: any) {
  const croppedImageUrls = []
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key].originalImageUrl) {
      const croppedImageUrl = {
        url: data[key].originalImageUrl,
        croppedUrl: data[key]?.croppedImageUrl,
        name: data[key].originalImage.name,
        file: data[key].croppedImage,
        type: data[key].type,
      }
      croppedImageUrls.push(croppedImageUrl)
    }
  }
  return croppedImageUrls
}

const CreatePost = ({ onClose }: any) => {
  const [cropedImagesUrls, setCropedImagesUrls] = useState<any>([])
  const [selectedImage, setSelectedImage] = useState<any>({})
  const [step, setStep] = useState<Step>('Pick')
  const [imageData, setImageData] = useState<any>({})
  const [aspectRatio, setAspectRatio] = useState<any>(1 / 1)

  useEffect(() => {
    setCropedImagesUrls(extractCroppedImageUrls(imageData))
  }, [imageData])

  const handleImagePick = async ({ name, image }: any) => {
    setSelectedImage(image)
    setImageData((prev: any) => ({ ...prev, [name]: image }))
    setStep('Crop')
  }

  const deleteAndSet = (name: string) => {
    const data = { ...imageData }
    const filenames = Object.keys(data) || []
    if (filenames.length <= 1) {
      reset()
      return
    }

    const currentIndex = filenames.indexOf(name)
    let nextIndex

    if (currentIndex === filenames.length - 1) {
      nextIndex = currentIndex - 1
    } else {
      nextIndex = currentIndex
    }

    delete data[name]
    setImageData(data)
    const image = data[filenames[nextIndex]]
    image && setSelectedImage(image)
  }

  const reset = () => {
    setCropedImagesUrls([])
    setSelectedImage({})
    setImageData({})
    setStep('Pick')
  }

  const onImageCrop = (file: File, imageUrl: string, allowNext: boolean) => {
    const setImage = () => {
      const image = imageData[file.name]
      if (image) {
        image.croppedImage = file
        image.croppedImageUrl = imageUrl
        setImageData((prev: any) => ({ ...prev, [file.name]: image }))
      }
    }
    if (allowNext) {
      setImage()
    } else {
      setImage()
      setCropedImagesUrls((prev: any) =>
        prev.filter((img: any) => img.name !== file.name)
      )
      setStep('Caption')
    }
  }

  const handleClearImage = (name: string) => {
    deleteAndSet(name)
    setCropedImagesUrls((prev: any) =>
      prev.filter((img: any) => img.name !== name)
    )
  }

  const handleSelectImage = (name: any) => {
    const image = imageData[name]
    setSelectedImage(image)
  }

  return (
    <motion.div
      transition={{ duration: 1 }}
      className="flex items-center justify-center"
    >
      {step === 'Pick' && (
        <ImagePicker onImageSelect={handleImagePick} onClose={onClose} />
      )}

      {step === 'Crop' && (
        <ImageCropper
          croppedImagesUrls={cropedImagesUrls}
          setCroppedImagesUrls={setCropedImagesUrls}
          image={selectedImage}
          onCrop={onImageCrop}
          onImagePick={handleImagePick}
          clearImage={handleClearImage}
          selectImage={handleSelectImage}
          onResetAndClose={reset}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
        />
       
      )}

      {step === 'Caption' && (
        <CaptionComponent
          setStep={setStep}
          cropedImagesUrls={cropedImagesUrls}
          aspectRatio={aspectRatio}
          onClose={onClose}
        />
      )}
    </motion.div>
  )
}

export default CreatePost
