import React from "react";
import { Text, Transformer } from "react-konva";

export const TextElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onDoubleClick,
}: any) => {
  const textRef = React.useRef();
  const trRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isSelected) {
      // Attach transformer manually
      trRef.current?.nodes([textRef.current]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

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
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current as any;
          const scaleX = node!.scaleX();
          const scaleY = node!.scaleY();

          node!.scaleX(1);
          node!.scaleY(1);
          onChange({
            ...shapeProps,
            x: node!.x(),
            y: node!.y(),
            fontSize: Math.max(5, node!.fontSize() * Math.max(scaleX, scaleY)),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          centeredScaling={true}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
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
