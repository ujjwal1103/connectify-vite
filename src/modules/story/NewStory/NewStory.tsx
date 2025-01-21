import { useEffect, useState } from 'react'
import StoryCanvas from './StoryCanvas'
import { getMostUsedColorFromFile } from './mostUsedColor'
import Modal from '@/components/shared/modal/Modal'

const ASPECT_RATIO = 9 / 16

export const NewStory = () => {
  const [image, setImage] = useState({})
  const [color, setColor] = useState('white')
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const handleResize = () => {
    const height = window.innerHeight
    const width = height * ASPECT_RATIO
    setCanvasDimensions({
      width,
      height,
    })
  }

  useEffect(() => {
    handleResize() // Set initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const addImageElement = (img: HTMLImageElement) => {
    const newId = `image1`

    const canvasAspectRatio = canvasDimensions.width / canvasDimensions.height
    const imageAspectRatio = img.width / img.height
    let width, height

    if (imageAspectRatio > canvasAspectRatio) {
      // Image is wider relative to its height
      width = canvasDimensions.width
      height = width / imageAspectRatio
    } else {
      // Image is taller relative to its width
      height = canvasDimensions.height
      width = height * imageAspectRatio
    }

    const newImage = {
      x: (canvasDimensions.width - width) / 2,
      y: (canvasDimensions.height - height) / 2,
      width: width,
      height: height,
      image: img,
      id: newId,
      type: 'image',
      isBgImage: true,
    }

    setImage(newImage)
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0]
    if (file) {
      const c = (await getMostUsedColorFromFile(file)) as string
      setColor(c)

      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.src = reader.result as string
        img.onload = () => {
          addImageElement(img)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-background">
      {Object.keys(image).length === 0 && (
        <>
          <label
            className="rounded-md bg-secondary p-2 px-4 hover:bg-secondary/90"
            htmlFor="story"
          >
            New Story
          </label>
          <input
            type="file"
            value=""
            id="story"
            hidden
            onChange={handleImageUpload}
            className="border border-black bg-black"
          />
        </>
      )}

      {Object.keys(image).length > 0 && (
        <Modal showCloseButton={false}>
          <StoryCanvas
            initalShape={image}
            color={color}
            canvasDimensions={canvasDimensions}
            onBack={() => {
              setImage({})
              setColor('white')
            }}
          />
        </Modal>
      )}
    </div>
  )
}
