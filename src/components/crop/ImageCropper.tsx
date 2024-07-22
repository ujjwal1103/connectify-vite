import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  CoreSettings,
  CropperState,
  FixedCropperRef,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { blobToFile } from "@/lib/utils";
import {
  getAbsoluteZoom,
  getZoomFactor,
} from "advanced-cropper/extensions/absolute-zoom";
import { pickImage } from "@/layout/components/NewPost/helper";
import VideoCropper from "./VideoCropper";
import ZoomSlider from "./ZoomSlider";
import AspectRations from "./AspectRations";
import AddMoreImages from "./AddMoreImages";
import CropHeaderButtons from "./CropHeaderButtons";
import Cropper from "./Cropper";

const emptyFn = () => {};

interface ImageCropperProps {
  image: any;
  onCrop: (file: File, url: string, allNextImageCrop: boolean) => void;
  onImagePick: (data: any) => void;
  clearImage: (name: string) => void;
  croppedImagesUrls: string[];
  setCroppedImagesUrls: (urls: string[]) => void;
  onResetAndClose: () => void;
  selectImage: (name: string) => void;
  aspectRatio: number;
  setAspectRatio: (ratio: number) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCrop = emptyFn,
  onImagePick = emptyFn,
  clearImage = emptyFn,
  croppedImagesUrls = [],
  setCroppedImagesUrls,
  onResetAndClose,
  selectImage,
  aspectRatio,
  setAspectRatio,
}) => {
  const cropperRef = useRef<FixedCropperRef | null>(null);

  const cropper = cropperRef.current;
  const state = cropper?.getState() as CropperState;
  const settings = cropper?.getSettings() as CoreSettings;
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
      const url = await cropperRef?.current?.getCanvas()!.toDataURL();
      await cropperRef.current.getCanvas()!.toBlob((blob: Blob | null) => {
        const file = blobToFile(blob!, image.originalImage.name, blob!.type);
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
    <div className="relative flex justify-center items-center flex-col md:w-full w-screen">
      <CropHeaderButtons
        onResetAndClose={onResetAndClose}
        onCropImage={onCropImage}
      />
      <div className="w-full md:h-500 aspect-square overflow-hidden  rounded-lg rounded-t-none relative  ">
        {image.type === "IMAGE" ? (
          <Cropper
            ref={cropperRef}
            aspectRatio={aspectRatio}
            src={image.originalImageUrl}
          />
        ) : (
          <VideoCropper
            src={image.originalImageUrl}
            aspectRatio={aspectRatio}
          />
        )}
        <div className="absolute bottom-0 left-0  w-full flex  text-white">
          <AspectRations
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
          />
          <ZoomSlider zoom={zoom} setZoom={setZoom} />
          <AddMoreImages
            croppedImageUrls={croppedImagesUrls}
            setCroppedImagesUrls={setCroppedImagesUrls}
            clearImage={clearImage}
            selectImage={selectImage}
            handleImagePick={handleImagePick}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
