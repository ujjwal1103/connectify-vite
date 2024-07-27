import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import StickerSelector from './StickerSelector'
import TextEditor from './TextEditor'
import CanvasEditor from './CanvasEditor'

interface Element {
  type: string
  content: string
  x: number
  y: number
}

interface UploaderProps {
  onUpload: (files: File[], elements: Element[]) => void
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([])
  const [elements, setElements] = useState<Element[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
      'video/*': ['.mp4', '.mvp'],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      const preview = URL.createObjectURL(file)
      setFiles([file])
      setSelectedFile(preview)
    },
  })

  const addSticker = (sticker: string) => {
    setElements([
      ...elements,
      { type: 'sticker', content: sticker, x: 50, y: 50 },
    ])
  }

  const addText = (text: string) => {
    setElements([...elements, { type: 'text', content: text, x: 50, y: 50 }])
  }

  const handleUpload = () => {
    onUpload(files, elements)
  }

  return (
    <div className="uploader">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop some files here, or click to select files</p>
      </div>
      {selectedFile && (
        <CanvasEditor
          imageSrc={selectedFile}
          elements={elements}
          setElements={setElements}
        />
      )}
      <StickerSelector onSelect={addSticker} />
      <TextEditor onAddText={addText} />
      <button onClick={handleUpload}>Upload Story</button>
    </div>
  )
}

export default Uploader
