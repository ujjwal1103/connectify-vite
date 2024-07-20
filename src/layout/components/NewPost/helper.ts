import { readFileAsDataURL } from "@/lib/utils";
import { ChangeEvent } from "react";

export const pickImage = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files![0];
  const dataURL = await readFileAsDataURL(file);

  const isImageFile = file?.type.includes("image");
  const isVideoFile = file?.type.includes("video");

  if (!isImageFile && !isVideoFile) {
    return;
  }

  const newImageData = {
    originalImage: file,
    originalImageUrl: dataURL,
    croppedImage: file,
    croppedImageUrl: "",
    type: isImageFile ? "IMAGE" : "VIDEO",
  };

  return { name: file.name, image: newImageData };
};
