import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ImageCropper from "@/components/shared/ImageCropper";
import CaptionComponent from "./CaptionComponent";
import ImagePicker from "./ImagePicker";

type Step = "Crop" | "Caption" | null;

function extractCroppedImageUrls(data: any) {
  const croppedImageUrls = [];
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key].originalImageUrl) {
      const croppedImageUrl = {
        url: data[key].originalImageUrl,
        croppedUrl: data[key]?.croppedImageUrl,
        name: data[key].originalImage.name,
        file: data[key].croppedImage,
        type: data[key].type,
      };
      croppedImageUrls.push(croppedImageUrl);
    }
  }
  return croppedImageUrls;
}

const CreatePost = ({ onClose }: any) => {
  const [cropedImagesUrls, setCropedImagesUrls] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<any>({});
  const [step, setStep] = useState<Step>(null);
  const [imageData, setImageData] = useState<any>({});
  const [aspectRatio, setAspectRation] = useState<any>(1 / 1);

  useEffect(() => {
    setCropedImagesUrls(extractCroppedImageUrls(imageData));
  }, [imageData]);

  const handleImagePick = async ({ name, image }: any) => {
    setSelectedImage(image);
    setImageData((prev: any) => ({ ...prev, [name]: image }));
    setStep("Crop");
  };

  const deleteAndSet = (name: string) => {
    const data = { ...imageData };
    const filenames = Object.keys(data) || [];
    if (filenames.length <= 1) {
      reset();
      return;
    }

    const currentIndex = filenames.indexOf(name);
    let nextIndex;

    if (currentIndex === filenames.length - 1) {
      nextIndex = currentIndex - 1;
    } else {
      nextIndex = currentIndex;
    }

    delete data[name];
    setImageData(data);
    const image = data[filenames[nextIndex]];
    image && setSelectedImage(image);
  };

  const reset = () => {
    setCropedImagesUrls([]);
    setSelectedImage({});
    setImageData({});
    setStep(null);
  };

  const onImageCrop = (file: File, imageUrl: string, allowNext: boolean) => {
    const setImage = () => {
      const image = imageData[file.name];
      if (image) {
        image.croppedImage = file;
        image.croppedImageUrl = imageUrl;
        setImageData((prev: any) => ({ ...prev, [file.name]: image }));
      }
    };
    if (allowNext) {
      setImage();
    } else {
      setImage();
      setCropedImagesUrls((prev: any) =>
        prev.filter((img: any) => img.name !== file.name)
      );
      setStep("Caption");
    }
  };

  const handleClearImage = (name: any) => {
    deleteAndSet(name);
    setCropedImagesUrls((prev: any) =>
      prev.filter((img: any) => img.name !== name)
    );
  };

  const handleSelectImage = (name: any) => {
    const image = imageData[name];
    setSelectedImage(image);
  };

  return (
    <motion.div
      transition={{ duration: 1 }}
      className="w-auto flex justify-center items-center  bg-zinc-950 rounded-md"
    >
      {!step && <ImagePicker onImageSelect={handleImagePick} />}

      {step === "Crop" && (
        <ImageCropper
          cropedImagesUrls={cropedImagesUrls}
          setCropedImagesUrls={setCropedImagesUrls}
          imageData={imageData}
          image={selectedImage}
          onCrop={onImageCrop}
          onImagePick={handleImagePick}
          clearImage={handleClearImage}
          selectImage={handleSelectImage}
          onResetAndClose={reset}
          aspectRatio={aspectRatio}
          setAspectRation={setAspectRation}
        />
      )}

      {step === "Caption" && (
        <CaptionComponent
          setStep={setStep}
          cropedImagesUrls={cropedImagesUrls}
          aspectRatio={aspectRatio}
          onClose={onClose}
        />
      )}
    </motion.div>
  );
};

export default CreatePost;
