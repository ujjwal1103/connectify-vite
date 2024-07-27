import React from 'react'

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

interface StoryProps {
  stories: FileWithPreview[]
}

const Story: React.FC<StoryProps> = ({ stories }) => {
  return (
    <div className="story-container">
      {stories.map((story, index) => (
        <div key={index} className="story" style={{ position: 'relative' }}>
          {story.file.type.startsWith('image') ? (
            <img src={story.preview} alt="story" />
          ) : (
            <video controls>
              <source src={story.preview} type={story.file.type} />
            </video>
          )}
          {story.elements &&
            story.elements.map((element, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: element.x,
                  top: element.y,
                  pointerEvents: 'none',
                }}
              >
                {element.content}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default Story
