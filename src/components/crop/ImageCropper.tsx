import { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  CoreSettings,
  CropperState,
  FixedCropperRef,
} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import { blobToFile } from '@/lib/utils'
import {
  getAbsoluteZoom,
  getZoomFactor,
} from 'advanced-cropper/extensions/absolute-zoom'
import { pickImage } from '@/layout/components/NewPost/helper'
import VideoCropper from './VideoCropper'
import ZoomSlider from './ZoomSlider'
import AspectRations from './AspectRations'
import AddMoreImages from './AddMoreImages'
import CropHeaderButtons from './CropHeaderButtons'
import Cropper from './Cropper'
import Avatar from '../shared/Avatar'
import { getCurrentUser } from '@/lib/localStorage'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  LocateIcon,
  MapIcon,
  MapPin,
  Smile,
} from 'lucide-react'
import { faker } from '@faker-js/faker'
const emptyFn = () => {}

interface ImageCropperProps {
  image: any
  onCrop: (file: File, url: string, allNextImageCrop: boolean) => void
  onImagePick: (data: any) => void
  clearImage: (name: string) => void
  croppedImagesUrls: string[]
  setCroppedImagesUrls: (urls: string[]) => void
  onResetAndClose: () => void
  selectImage: (name: string) => void
  aspectRatio: number
  setAspectRatio: (ratio: number) => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCrop = emptyFn,
  onImagePick = emptyFn,
  clearImage = emptyFn,
  croppedImagesUrls = [],
  setCroppedImagesUrls,
  onResetAndClose,
  selectImage,
  aspectRatio,
  setAspectRatio,
}) => {
  const cropperRef = useRef<FixedCropperRef | null>(null)

  const cropper = cropperRef.current
  const state = cropper?.getState() as CropperState
  const settings = cropper?.getSettings() as CoreSettings
  const absoluteZoom = getAbsoluteZoom(state, settings)
  const [zoom, setZoom] = useState(absoluteZoom)
  const [caption, setCaption] = useState(false)
  const [croppedUrls, setCroppedUrls] = useState<string[]>([])

  useEffect(() => {
    if (cropper) {
      const z = getZoomFactor(state, settings, zoom)
      cropper.zoomImage(z)
    }
  }, [zoom, cropper, state, settings])

  const onCropImage = async (allNextImageCrop = false) => {
    if (cropperRef.current) {
      !allNextImageCrop && setCaption(true)
      const url = cropperRef?.current?.getCanvas()!.toDataURL()
      setCroppedUrls((prev) => [...prev, url])
      cropperRef.current.getCanvas()!.toBlob((blob: Blob | null) => {
      const file = blobToFile(blob!, image.originalImage.name, blob!.type)
      onCrop(file, url, allNextImageCrop)
      }, 'image/jpeg')
    }
    if (image.type === 'VIDEO') {
      onCrop(image.originalImage, image.originalImageUrl, allNextImageCrop)
    }
  }

  const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    await onCropImage(true)
    const data = await pickImage(e)
    onImagePick(data)
  }

  return (
    <motion.div className="relative flex w-full flex-col items-center justify-center bg-background">
      <CropHeaderButtons
        onResetAndClose={() => {
          setCaption(false)
        }}
        onCropImage={onCropImage}
      />
      <div className="relative h-full w-full overflow-hidden rounded-lg rounded-t-none md:h-500">
        {image.type === 'IMAGE' ? (
          <>
            <AnimatePresence>
              {caption ? (
                <CaptionComponent croppedUrls={croppedUrls} />
              ) : (
                <Cropper
                  ref={cropperRef}
                  aspectRatio={aspectRatio}
                  src={image.originalImageUrl}
                />
              )}
            </AnimatePresence>
          </>
        ) : (
          <VideoCropper
            src={image.originalImageUrl}
            aspectRatio={aspectRatio}
          />
        )}
        {!caption && (
          <div className="absolute bottom-0 left-0 flex w-full text-white">
            <AspectRations
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
            />
            <ZoomSlider zoom={zoom} setZoom={setZoom} />
            <AddMoreImages
              croppedImageUrls={croppedImagesUrls}
              setCroppedImagesUrls={setCroppedImagesUrls}
              clearImage={clearImage}
              selectImage={selectImage}
              handleImagePick={handleImagePick}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ImageCropper

interface CaptionComponentProps {
  croppedUrls: string[]
}

const CaptionComponent = ({ croppedUrls }: CaptionComponentProps) => {
  const [captionText, setCaptionText] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [location, setLocation] = useState<string>('')

  const user = getCurrentUser()
  const captionInputRef = useRef<HTMLTextAreaElement>(null)

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setCaptionText(value)

    // Detect '@' and extract search query
    const lastWordMatchWithat = value.match(/@(\w*)$/)
    const lastWordMatchWithHash = value.match(/#(\w*)$/)
    if (lastWordMatchWithat || lastWordMatchWithHash) {
      setIsDropdownOpen(true)
    } else {
      setIsDropdownOpen(false)
      captionInputRef.current?.focus()
    }
  }

  const handleSelect = (username: string) => {
    // Append selected username to caption
    const newText = captionText.replace(/@(\w*)$/, `@${username} `)
    setCaptionText(newText)
    setIsDropdownOpen(false)
    captionInputRef.current?.focus()
  }
  const handleSelectLocation = (loc: string) => {
    setLocation(loc)
  }

  return (
    <div className="flex h-500">
      {croppedUrls.length > 0 && <ImageCanvas urls={croppedUrls} />}
      <motion.div
        layout
        initial={{ width: 0 }}
        animate={{ width: 300 }}
        className="relative h-full w-80 flex-col hidden md:flex"
      >
        <div className="flex items-center gap-3 p-4">
          <Avatar src={user?.avatar?.url} className="size-7 border-none" />
          <span className="text-sm">{user?.username}</span>
        </div>
        <div className="px-4">
          <textarea
            ref={captionInputRef}
            name="caption"
            id="caption"
            value={captionText}
            onChange={handleCaptionChange}
            maxLength={2000}
            placeholder="write a caption..."
            className="h-40 w-full resize-none bg-background scrollbar-thin focus-visible:outline-none"
          />
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="p-2">
            <Smile />
          </div>
          <div className="p-2">{captionText.length}/2000</div>
        </div>
        <div className="flex items-center justify-between px-2">
          <input
            placeholder="Add Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-background p-2 focus-visible:outline-none"
            onFocus={() => {
              setShowLocation(true)
            }}
            onBlur={() => {
              setShowLocation(false)
            }}
          />
          <div className="p-2">
            <MapPin />
          </div>
        </div>
        {showLocation && (
          <div className="w-full overflow-auto rounded shadow-md">
            {Array(20)
              .fill({})
              .map(() => {
                const name = faker.location.street()
                return (
                  <div
                    onClick={() => handleSelectLocation(name)}
                    className="flex cursor-pointer items-center gap-2 border-b-[0.3px] border-border p-2 last:border-none hover:bg-secondary"
                  >
                    {name}
                  </div>
                )
              })}
          </div>
        )}
        {isDropdownOpen && (
          <div className="w-full overflow-auto rounded shadow-md">
            {Array(20)
              .fill({})
              .map(() => {
                const name = faker.internet.userName()
                return (
                  <div
                    onClick={() => handleSelect(name)}
                    className="flex cursor-pointer items-center gap-2 border-b-[0.3px] border-border p-2 hover:bg-secondary"
                  >
                    <span>
                      <Avatar
                        src={faker.image.urlLoremFlickr()}
                        className="size-7"
                      />
                    </span>
                    {name}
                  </div>
                )
              })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

const ImageCanvas = ({ urls }: { urls: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = new Image()

    // Set the image source
    img.src = urls[selectedIndex] // Replace with the actual path to your image

    // Draw the image on the canvas when it's loaded
    img.onload = () => {
      canvas.width = img.width // Set canvas width equal to image width
      canvas.height = img.height // Set canvas height equal to image height
      ctx!.drawImage(img, 0, 0) // Draw the image at position (0, 0)
    }
  }, [urls, selectedIndex])

  const handlePrev = () => {
    setSelectedIndex((prev) => prev - 1)
  }
  const handleNext = () => {
    setSelectedIndex((prev) => prev + 1)
  }

  return (
    <div className="relative h-500 w-500">
      <canvas ref={canvasRef} className="h-500 w-500" />

      <button
        className="absolute left-0 top-0 flex h-full items-center justify-center"
        onClick={handlePrev}
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute right-0 top-0 flex h-full items-center justify-center"
        onClick={handleNext}
      >
        <ChevronRight />
      </button>
    </div>
  )
}
