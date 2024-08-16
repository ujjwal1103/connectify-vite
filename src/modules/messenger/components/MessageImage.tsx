import { tranformUrl } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ImagePreview from './ImagePreview'
import Wrapper from '@/components/Wrapper'

interface Props {
  src: string
}

const MessageImage = ({ src }: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const onClose = () => setPreviewImage(null)
  return (
    <div className="z-[1] max-h-[340px] w-72 max-w-[236px] overflow-hidden rounded-xl ">
      <div className="rounded-xl">
        <motion.img
          layoutId={src}
          height={500}
          className="object-contain"
          alt={src}
          src={tranformUrl(src, 500)!}
          onClick={() => setPreviewImage(src)}
        />
      </div>

      <Wrapper shouldRender={previewImage}>
        <ImagePreview onClose={onClose} previewImage={previewImage} />
      </Wrapper>
    </div>
  )
}

export default MessageImage
