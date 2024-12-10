import { ZoomIn } from "lucide-react";
import { useState } from "react";
interface ZoomSliderProps {
  zoom: number;
  setZoom: (zoom: number) => void;
}

const ZoomSlider = ({ zoom, setZoom }: ZoomSliderProps) => {
  const [openZoom, setOpenZoom] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpenZoom(!openZoom)}
        className="size-10 rounded-full m-2 bg-black bg-opacity-65 flex items-center justify-center"
      >
        <ZoomIn size={24} />
      </button>

      {openZoom && (
        <div className="absolute bottom-12 bg-zinc-900 bg-opacity-55  rounded-md shadow-md p-2 flex gap-3">
          <input
            type="range"
            name="zoom"
            id=""
            min={0}
            max={0.5}
            step={0.05}
            className=" bg-zinc-950 h-1 p-0 "
            value={zoom}
            onChange={(e: any) => setZoom(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default ZoomSlider;
