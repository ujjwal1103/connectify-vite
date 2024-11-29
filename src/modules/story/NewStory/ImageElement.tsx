import React, { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";

export const ImageElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: any) => {
  const imageRef = useRef();
  const trRef = useRef<any>();

  useEffect(() => {
    if (isSelected) {
      // Attach transformer manually
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Image
        image={shapeProps.image}
        ref={imageRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          // Transformer is changing scale of the node and not its width or height
          // To match the data better, we will reset scale on transform end
          const node = imageRef.current as any;
          const scaleX = node!.scaleX();
          const scaleY = node!.scaleY();

          // Reset scale
          node!.scaleX(1);
          node!.scaleY(1);
          onChange({
            ...shapeProps,
            x: node!.x(),
            y: node!.y(),
            width: Math.max(5, node!.width() * scaleX),
            height: Math.max(5, node!.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          centeredScaling={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
