import { motion } from 'framer-motion'
import {
  memo,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import ImagePreview from './ImagePreview'
import Wrapper from '@/components/Wrapper'
import { useImageSize } from 'react-image-size'

interface Props {
  src: string // Can be base64 or actual image URL
}

const MessageImage = ({ src }: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [dim] = useImageSize(src)
  const imageRef = useRef<HTMLImageElement>(null)

  const onClose = useCallback(() => setPreviewImage(null), [])

  const height = useMemo<number | null>(() => {
    const urlHeight = new URL(src).searchParams.get('height')
    return urlHeight ? parseInt(urlHeight, 10) : dim?.height || null
  }, [src, dim])

  const width = useMemo<number | null>(() => {
    const urlWidth = new URL(src).searchParams.get('width')
    return urlWidth ? parseInt(urlWidth, 10) : dim?.width || null
  }, [src, dim])

  const myHeight = useMemo(
    () => (width && height ? (288 * height) / width : 230),
    [width, height]
  )



  return (
    <div className="z-[1]">
      <div
        className="max-h-[256px] min-w-[174px] overflow-hidden"
        style={{ height: myHeight }}
      >
        <Suspense fallback={<div>loading</div>}>
          <motion.img
            ref={imageRef}
            loading="lazy"
            layoutId={src}
            className="h-full w-full rounded-xl object-cover"
            alt={src}
            onLoad={(e) => {
              console.log(e)
            }}
            src={src} // Use imageSrc, which will be base64 initially and then updated to network URL
            onClick={() => setPreviewImage(src)}
          />
        </Suspense>
      </div>

      <Wrapper shouldRender={!!previewImage}>
        <ImagePreview onClose={onClose} previewImage={previewImage} />
      </Wrapper>
    </div>
  )
}

export default memo(MessageImage)
