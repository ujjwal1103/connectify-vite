import { useEffect, useState } from "react";
import StoryCanvas from "./StoryCanvas";
import { getMostUsedColorFromFile } from "./mostUsedColor";

const ASPECT_RATIO = 9 / 16;

export const NewStory = () => {
  const [image, setImage] = useState({});
  const [color, setColor] = useState("white");
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    const height = window.innerHeight;
    const width = height * ASPECT_RATIO;
    setCanvasDimensions({
      width,
      height,
    });
  };

  useEffect(() => {
    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addImageElement = (img: HTMLImageElement) => {  
    const newId = `image1`;

    const canvasAspectRatio = canvasDimensions.width / canvasDimensions.height;
    const imageAspectRatio = img.width / img.height;
    let width, height;

    if (imageAspectRatio > canvasAspectRatio) {
      // Image is wider relative to its height
      width = canvasDimensions.width;
      height = width / imageAspectRatio;
    } else {
      // Image is taller relative to its width
      height = canvasDimensions.height;
      width = height * imageAspectRatio;
    }

    const newImage = {
      x: (canvasDimensions.width - width) / 2,
      y: (canvasDimensions.height - height) / 2,
      width: width,
      height: height,
      image: img,
      id: newId,
      type: "image",
      isBgImage: true,
    };

    setImage(newImage);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];
    if (file) {
      const c = (await getMostUsedColorFromFile(file)) as string;
      setColor(c);

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          addImageElement(img);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background h-dvh ">
      {Object.keys(image).length === 0 && (
        <>
          <label className="bg-zinc-950 px-4 p-2 rounded-md hover:bg-zinc-950/90" htmlFor="story">New Story</label>
          <input
            type="file"
            value=""
            id="story"
            hidden
            onChange={handleImageUpload}
            className="bg-black border border-black"
          />
        </>
      )}

      {Object.keys(image).length > 0 && (
        <StoryCanvas
          initalShape={image}
          color={color}
          canvasDimensions={canvasDimensions}
          onBack={()=>{
            setImage({})
            setColor('white')
          }}
        />
      )}
    </div>
  );
};
