import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoClose, IoCropOutline } from "react-icons/io5";
import {
  FixedCropper,
  ImageRestriction,
  Priority,
  RectangleStencil,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { TbRectangle } from "react-icons/tb";
import { FiSquare } from "react-icons/fi";
import { blobToFile } from "@/lib/utils";
import { ImagePlus, ZoomIn } from "../icons";
import { HiOutlineSquare2Stack } from "react-icons/hi2";
import { ReactSortable } from "react-sortablejs";
import {
  getAbsoluteZoom,
  getZoomFactor,
} from "advanced-cropper/extensions/absolute-zoom";
import { pickImage } from "@/layout/components/NewPost/helper";

const emptyFn = () => {};

const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  ghostClass: "ghost",
  group: "shared",
  forceFallback: true,
};

const ImageCropper = ({
  image,
  onCrop = emptyFn,
  onImagePick = emptyFn,
  clearImage = emptyFn,
  cropedImagesUrls = [],
  setCropedImagesUrls,
  onResetAndClose,
  selectImage,
  aspectRatio,
  setAspectRation,
}: any) => {
  const cropperRef = useRef<any>(null);
  const [openCropOptions, setOpenCropOptions] = useState(false);
  const [openImages, setOpenImages] = useState(false);
  const [openZoom, setOpenZoom] = useState(false);
  const cropper = cropperRef.current;
  const state = cropper?.getState();
  const settings = cropper?.getSettings();
  const absoluteZoom = getAbsoluteZoom(state, settings);
  const [zoom, setZoom] = useState(absoluteZoom);

  useEffect(() => {
    if (cropper) {
      const z = getZoomFactor(state, settings, zoom);
      cropper.zoomImage(z);
    }
  }, [zoom, cropper]);

  const onCropImage = async (allNextImageCrop = false) => {
    if (cropperRef.current) {
      const url = await cropperRef?.current?.getCanvas().toDataURL();
      await cropperRef.current.getCanvas().toBlob((blob: Blob) => {
        const file = blobToFile(blob, image.originalImage.name, blob.type);
        onCrop(file, url, allNextImageCrop);
      }, "image/jpeg");
    }
    if (image.type === "VIDEO") {
      onCrop(image.originalImage, image.originalImageUrl, allNextImageCrop);
    }
  };

  const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    await onCropImage(true);
    const data = await pickImage(e);
    console.log(data);
    onImagePick(data);
  };

  return (
    <div className="bg-zinc-900 relative flex justify-center items-center flex-col ">
      <div className="w-full h-500 rounded-lg rounded-t-none relative  bg-[#000000]">
        <div className="bg-[#000000] absolute z-10   w-full left-0 flex justify-between p-2 rounded-lg rounded-b-none">
          <button onClick={onResetAndClose} className=" text-white ">
            Back
          </button>

          <button onClick={() => onCropImage(false)} className=" text-white ">
            Next
          </button>
        </div>
        {image.type === "IMAGE" ? (
          <FixedCropper
            ref={cropperRef}
            backgroundWrapperClassName=" w-full h-500"
            priority={Priority.visibleArea}
            stencilProps={{
              aspectRatio: aspectRatio,
              handlers: false,
              lines: false,
              movable: false,
              resizable: false,
              className: "overlay transition-all ease-in-out",
            }}
            stencilSize={{
              width: 500,
              height: 500,
            }}
            src={image.originalImageUrl}
            className={"croppe w-500 h-500 cursor-move rounded-b-lg"}
            stencilComponent={RectangleStencil}
            imageRestriction={ImageRestriction.fillArea}
          />
        ) : (
          <div
            className={
              "w-500 h-500 object-cover aspect-video flex items-center justify-center "
            }
          >
            <video
              className={"w-500 h-500 object-cover aspect-video "}
              style={{ height: aspectRatio == 1 / 1 ? "500px" : "333px" }}
            >
              <source src={image.originalImageUrl} />
            </video>
          </div>
        )}
        <div className="absolute bottom-0 left-0   w-full flex  text-white">
          <button
            onClick={() => setOpenCropOptions(!openCropOptions)}
            className="size-10 rounded-full m-2 bg-black bg-opacity-65 flex items-center justify-center"
          >
            <IoCropOutline size={24} />
          </button>
          <button
            onClick={() => setOpenZoom(!openZoom)}
            className="size-10 rounded-full m-2 bg-black bg-opacity-65 flex items-center justify-center"
          >
            <ZoomIn size={24} />
          </button>
          <button
            onClick={() => setOpenImages(!openImages)}
            className="size-10 rounded-full m-2 ml-auto bg-black bg-opacity-65 flex items-center justify-center"
          >
            <HiOutlineSquare2Stack size={24} />
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

          {openImages && (
            <div className="flex gap-4 p-4  bg-zinc-950 absolute bg-opacity-85 rounded-md right-0 bottom-12 mr-2 mb-2">
              <ReactSortable
                list={cropedImagesUrls}
                setList={setCropedImagesUrls}
                {...sortableOptions}
                className="flex gap-3 "
              >
                {cropedImagesUrls?.map((img: any) => (
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

          {openCropOptions && (
            <div className="absolute text-white bottom-12 ml-2 mb-2 flex flex-col justify-center bg-black bg-opacity-80 w-20 rounded-lg">
              <button
                disabled={aspectRatio === 1 / 1}
                onClick={() => setAspectRation(1 / 1)}
                className="p-2 flex items-center gap-2 disabled:opacity-45"
              >
                <FiSquare size={24} /> <span>1/1</span>
              </button>
              <button
                disabled={aspectRatio === 4 / 3}
                onClick={() => setAspectRation(4 / 3)}
                className="p-2 flex items-center gap-2 disabled:opacity-45"
              >
                <TbRectangle size={24} /> <span>4/3</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
