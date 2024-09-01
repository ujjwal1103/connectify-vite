import { motion } from 'framer-motion';
import { memo, useCallback, useMemo, useState } from 'react';
import ImagePreview from './ImagePreview';
import Wrapper from '@/components/Wrapper';
import { useImageSize } from 'react-image-size';

interface Props {
  src: string;
}

const MessageImage = ({ src }: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dim] = useImageSize(src);

  const onClose = useCallback(() => setPreviewImage(null), []);

  const height = useMemo<number | null>(() => {
    const urlHeight = new URL(src).searchParams.get('height');
    return urlHeight ? parseInt(urlHeight, 10) : dim?.height || null;
  }, [src, dim]);

  const width = useMemo<number | null>(() => {
    const urlWidth = new URL(src).searchParams.get('width');
    return urlWidth ? parseInt(urlWidth, 10) : dim?.width || null;
  }, [src, dim]);

  const myHeight = useMemo(() => (width && height) ? (288 * height) / width : 230, [width, height]);


  return (
    <div className="z-[1] w-72 min-w-72 overflow-hidden rounded-xl">
      <div className="rounded-xl" style={{ height: myHeight }}>
        <motion.img
          loading="lazy"
          layoutId={src}
          className="h-full w-full object-contain"
          alt={src}
          src={src}
          onClick={() => setPreviewImage(src)}
        />
      </div>

      <Wrapper shouldRender={!!previewImage}>
        <ImagePreview onClose={onClose} previewImage={previewImage} />
      </Wrapper>
    </div>
  );
};

export default memo(MessageImage);

