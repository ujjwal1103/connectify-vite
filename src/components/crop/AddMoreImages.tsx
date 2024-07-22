import { ImagePlus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { ReactSortable } from "react-sortablejs";

const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  ghostClass: "ghost",
  group: "shared",
  forceFallback: true,
};

const AddMoreImages = ({
  croppedImageUrls,
  setCroppedImagesUrls,
  clearImage,
  selectImage,
  handleImagePick,
}: {
  croppedImageUrls: any[];
  setCroppedImagesUrls: (url: string[]) => void;
  clearImage: (name: string) => void;
  selectImage: (name: string) => void;
  handleImagePick: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [openImages, setOpenImages] = useState(false);
  return (
    <div className="ml-auto">
      <button
        onClick={() => setOpenImages(!openImages)}
        className="size-10 rounded-full m-2 bg-black bg-opacity-65 flex items-center justify-center"
      >
        <HiOutlineSquare2Stack size={24} />
      </button>
      {openImages && (
        <div className="flex gap-4 p-4  bg-zinc-950 absolute bg-opacity-85 rounded-md right-0 bottom-12 mr-2 mb-2">
          <ReactSortable
            list={croppedImageUrls}
            setList={setCroppedImagesUrls}
            {...sortableOptions}
            className="flex gap-3 "
          >
            {croppedImageUrls?.map((img: any) => (
              <div className="relative">
                <button
                  className="absolute text-white font-semibold bg-red-500 p-1 -top-2 -right-2  rounded-md "
                  onClick={() => {
                    clearImage(img.name);
                  }}
                >
                  <IoClose size={16} />
                </button>
                {img.type === "VIDEO" ? (
                  <video
                    className="w-16 rounded-md h-16 object-cover"
                    onClick={() => selectImage(img.name)}
                  >
                    <source src={img.url} />
                  </video>
                ) : (
                  <img
                    src={img.url}
                    className="w-16 rounded-md h-16 object-cover"
                    alt={img.name}
                    onClick={() => selectImage(img.name)}
                  />
                )}
              </div>
            ))}
          </ReactSortable>
          <div className="size-10 m-2 border border-dashed bg-black rounded-md flex items-center justify-center">
            <input
              type="file"
              name="imagePicker"
              id="imagePicker"
              hidden
              accept="image/*"
              onChange={handleImagePick}
            />
            <label
              className="w-12 h-12 cursor-pointer flex justify-center items-center text-white"
              htmlFor="imagePicker"
            >
              <ImagePlus size={24} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMoreImages;
