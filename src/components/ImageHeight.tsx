import { useState, useEffect } from 'react'

const src =
  'https://res.cloudinary.com/dtzyaxndt/image/upload/dpr_auto/w_500/v1723541354/663c5a5ed4d2496be9c558b8/messagesAttachments/image_mjzte1.jpg'

const ImageHeight = () => {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setHeight(img.height)
    }
    img.onerror = () => {
      console.error('Failed to load image')
    }
    img.src = src

    // Clean up function (optional, but good practice)
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return (
    <div>
      {height !== null ? <p>Height: {height}px</p> : <p>Loading height...</p>}
    </div>
  )
}

export default ImageHeight
