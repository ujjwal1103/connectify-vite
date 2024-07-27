import React, { useRef, useEffect, useState } from 'react';

interface Element {
  type: string;
  content: string;
  x: number;
  y: number;
}

interface CanvasEditorProps {
  imageSrc: string;
  elements: Element[];
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ imageSrc, elements, setElements }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext('2d')!;
    const img = new Image();

    img.src = imageSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.drawImage(img, 0, 0, canvas!.width, canvas!.height);
      elements.forEach(drawElement);
    };
  }, [imageSrc, elements]);

  const drawElement = (element: Element) => {
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.font = '24px Arial';
    ctx.fillText(element.content, element.x, element.y);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentElement({ x, y, content: '', type: '' });
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentElement) {
      setElements([...elements, currentElement]);
      setIsDrawing(false);
      setCurrentElement(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = { ...currentElement, x, y };
    setCurrentElement(newElement);

    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      elements.forEach(drawElement);
      drawElement(newElement);
    };
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
};

export default CanvasEditor;
