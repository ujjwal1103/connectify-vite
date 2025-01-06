import { useState, useEffect, ChangeEvent } from 'react'
import { Stage, Layer, Rect } from 'react-konva'

import { Rectangle } from './Reactangle'
import { TextElement } from './RText'
import { ImageElement } from './ImageElement'
import Konva from 'konva'
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ImagePlus,
  Loader,
  Send,
  Trash2Icon,
  Type,
} from 'lucide-react'
import { getCurrentUserId } from '@/lib/localStorage'
import { createStory } from '@/api'
import { blobToFile } from '@/lib/utils'

const StoryCanvas = ({ initalShape, color, canvasDimensions, onBack }: any) => {
  const [shapes, setShapes] = useState([initalShape])
  const [selectedId, selectShape] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [editableText, setEditableText] = useState('')
  const [currentTextId, setCurrentTextId] = useState('')
  const [stageRef, setStageRef] = useState<Konva.Stage | null>(null) // Ref for the Stage

  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectShape(null)
    }
  }

  const handleDoubleClickText = (id: string, text: string) => {
    setCurrentTextId(id)
    setEditableText(text)
    setModalIsOpen(true)
  }

  const handleModalSubmit = () => {
    setShapes(
      shapes.map((shape) =>
        shape.id === currentTextId ? { ...shape, text: editableText } : shape
      )
    )
    setModalIsOpen(false)
  }

  const addTextElement = () => {
    const newId = `text${shapes.length + 1}`
    const newText = {
      x: (canvasDimensions.width - 24 * 8) / 2,
      y: (canvasDimensions.height - 24) / 2,
      text: 'New Text',
      fontSize: 24,
      fill: 'white',
      id: newId,
      type: 'text',
    }
    setShapes([...shapes, newText])
    selectShape(newId)
  }

  const addImageElement = (img: HTMLImageElement, isBgImage = false) => {
    const newId = `image${shapes.length + 1}`

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
      isBgImage,
    }

    setShapes([...shapes, newImage])
    selectShape(newId) // Select the new image element
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    if (file) {
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

  const handleDownload = () => {
    selectShape(null)
    if (stageRef) {
      const dataURL = stageRef.toDataURL()
      const link = document.createElement('a')
      link.href = dataURL
      link.download = 'canvas-image.png'
      link.click()
    }
  }
  const shareStory = async () => {
    setUploading(true)
    selectShape(null)
    if (stageRef) {
      const dataURL = (await stageRef.toBlob()) as Blob
      const fileName = `${getCurrentUserId()}.png`
      const file = blobToFile(dataURL, fileName, 'image/png')
      const formData = new FormData()
      formData.append('story', file)
      const res = (await createStory(formData)) as any
      if (res.isSuccess) {
        onBack()
      }
    }
    setUploading(false)
  }

  const bringToFront = (id: string) => {
    const img = shapes.find((sp) => sp.id === id)
    if (stageRef && !img.isBgImage) {
      //   const layer = stageRef.findOne("Layer");
      const shape = stageRef.findOne(`#${id}`)
      if (shape) {
        shape.moveToTop()
        // layer!.batchDraw();
      }
    }
  }

  useEffect(() => {
    if (selectedId) {
      bringToFront(selectedId)
    }
  }, [selectedId])

  return (
    <div className="relative flex bg-red-400">
      <div className="absolute z-100 flex h-16 w-full flex-col p-2">
        <div className="flex justify-between gap-2">
          {!isDone && (
            <>
              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={addTextElement}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
              >
                <Type />
              </button>

              <label
                htmlFor="plusImage"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
              >
                <ImagePlus />
              </label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="plusImage"
                onChange={handleImageUpload}
                style={{ margin: '10px' }}
              />
              {selectedId && (
                <button
                  onClick={() => {
                    if (shapes.length > 1) {
                      setShapes((sp) => sp.filter((s) => s.id !== selectedId))
                      selectShape(null)
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
                >
                  <Trash2Icon />
                </button>
              )}

              <button
                onClick={() => {
                  selectShape(null)
                  setIsDone(true)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
              >
                <ArrowRight />
              </button>
            </>
          )}
          {isDone && (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
              onClick={() => {
                setIsDone(false)
              }}
            >
              <ArrowLeft />
            </button>
          )}
          {!selectedId && isDone && (
            <div className="flex gap-2">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
                onClick={handleDownload}
              >
                <Download />
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-900"
                onClick={shareStory}
                disabled={uploading}
              >
                {uploading ? <Loader className="animate-spin" /> : <Send />}
              </button>
            </div>
          )}
        </div>
      </div>

      <Stage
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        ref={(node) => setStageRef(node)}
        listening={!isDone}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            fill={color}
            id="bg"
            onClick={() => selectShape(null)}
          />
          {shapes.map((shape) => {
            if (shape.type === 'rectangle') {
              return (
                <Rectangle
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs: any) => {
                    const updatedShapes = shapes.map((s) =>
                      s.id === shape.id ? newAttrs : s
                    )
                    setShapes(updatedShapes)
                  }}
                />
              )
            } else if (shape.type === 'text') {
              return (
                <TextElement
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onDoubleClick={() =>
                    handleDoubleClickText(shape.id, shape.text)
                  }
                  onChange={(newAttrs: any) => {
                    const updatedShapes = shapes.map((s) =>
                      s.id === shape.id ? newAttrs : s
                    )
                    setShapes(updatedShapes)
                  }}
                />
              )
            } else if (shape.type === 'image') {
              return (
                <ImageElement
                  key={shape.id}
                  shapeProps={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => selectShape(shape.id)}
                  onChange={(newAttrs: any) => {
                    const updatedShapes = shapes.map((s) =>
                      s.id === shape.id ? newAttrs : s
                    )
                    setShapes(updatedShapes)
                  }}
                />
              )
            }
            return null
          })}
        </Layer>
      </Stage>

      {/* Modal for editing text */}
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 text-black">
          <div className="flex flex-col gap-3 rounded-md bg-white p-4 shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-black">Edit Text</h2>
            <input
              type="text"
              autoFocus
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="rounded bg-zinc-200 p-2"
            />
            <div className="flex justify-between">
              <button
                className="h-full bg-green-600 p-1 text-white"
                onClick={handleModalSubmit}
              >
                done
              </button>
              <button
                className="h-full p-1 text-white"
                onClick={() => setModalIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryCanvas
