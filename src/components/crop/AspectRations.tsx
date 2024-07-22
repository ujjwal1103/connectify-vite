import { useState } from "react";
import { FiSquare } from "react-icons/fi";
import { IoCropOutline } from "react-icons/io5";
import { TbRectangle } from "react-icons/tb";

interface AspectRatioOption {
  ratio: number;
  label: string;
  Icon: React.ElementType;
}

const aspectRatioOptions: AspectRatioOption[] = [
  { ratio: 1 / 1, label: "1/1", Icon: FiSquare },
  { ratio: 4 / 3, label: "4/3", Icon: TbRectangle },
  // { ratio: 16 / 9, label: "16/9", Icon: RectangleHorizontal },
  // { ratio: 9 / 16, label: "9/16", Icon: RectangleVertical },
];

const AspectRations = ({
  aspectRatio,
  setAspectRatio,
}: {
  aspectRatio: number;
  setAspectRatio: (aspectRatio: number) => void;
}) => {
  const [openCropOptions, setOpenCropOptions] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpenCropOptions(!openCropOptions)}
        className="size-10 rounded-full m-2 bg-black bg-opacity-65 flex items-center justify-center"
      >
        <IoCropOutline size={24} />
      </button>
      {openCropOptions && (
        <div className="absolute text-white bottom-12 ml-2 mb-2 flex flex-col justify-center bg-black bg-opacity-80 w-24 rounded-lg">
          {aspectRatioOptions.map(({ ratio, label, Icon }) => (
            <button
              key={label}
              disabled={aspectRatio === ratio}
              onClick={() => setAspectRatio(ratio)}
              className="p-2 flex items-center gap-2 disabled:opacity-45"
            >
              <Icon size={24} /> <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AspectRations;
