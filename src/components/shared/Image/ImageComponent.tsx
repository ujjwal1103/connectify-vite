import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { memo, useState } from 'react'

const ImageComponent = ({
  src,
  alt,
  loader,
  fallback,
  width,
  className = '',
  ...props
}: any) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  return (
    <>
      {loading && (
        <div className="flex h-96 w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      )}
      {!error ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{width: width}}
          className={cn(className, { hidden: loading })}
          {...props}
        />
      ) : (
        <div className="fallback flex h-96 w-full items-center justify-center">
          <div>Failed to load image.</div>
        </div>
      )}
    </>
  )
}

export default memo(ImageComponent)
