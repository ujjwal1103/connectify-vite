import Konva from 'konva'
import React from 'react'
import { Text, Transformer } from 'react-konva'

export const TextElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onDoubleClick,
}: {
  shapeProps: Konva.TextConfig,
  isSelected: boolean,
  onSelect: () => void,
  onChange: (newAttrs: Konva.TextConfig) => void,
  onDoubleClick: () => void,
}) => {
  const textRef = React.useRef<Konva.Text>(null)
  const trRef = React.useRef<Konva.Transformer>(null)

  React.useEffect(() => {
    if (isSelected) {
      if (textRef.current) {
        trRef.current?.nodes([textRef.current])
      }
      if (trRef.current?.getLayer()) {
        trRef.current.getLayer()!.batchDraw()
      }
    }
  }, [isSelected])

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDoubleClick} // Handle double-click
        ref={textRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={() => {
          const node = textRef.current
          const scaleX = node!.scaleX()
          const scaleY = node!.scaleY()
          node!.scaleX(1)
          node!.scaleY(1)
          onChange({
            ...shapeProps,
            x: node!.x(),
            y: node!.y(),
            fontSize: Math.max(5, node!.fontSize() * Math.max(scaleX, scaleY)),
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          centeredScaling={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </React.Fragment>
  )
}
