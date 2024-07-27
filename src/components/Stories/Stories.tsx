import React, { useState } from 'react'
import Uploader from './Uploader'
import Story from './Story'

interface Element {
  type: string
  content: string
  x: number
  y: number
}

interface FileWithPreview {
  file: File
  preview: string
  elements: Element[]
}

const Stories: React.FC = () => {
  const [stories, setStories] = useState<FileWithPreview[]>([])

  const handleUpload = (files: File[], elements: Element[]) => {
    setStories([
      ...stories,
      ...files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        elements,
      })),
    ])
  }

  return (
    <div className="">
      <Uploader onUpload={handleUpload} />
      <Story stories={stories} />
    </div>
  )
}

export default Stories
