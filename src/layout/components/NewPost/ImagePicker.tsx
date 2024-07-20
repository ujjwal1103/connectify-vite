import { motion } from "framer-motion";
import imageIcon from "../../../../public/assets/Icons/gallery.png";
import { pickImage } from "./helper";
import { ChangeEvent } from "react";

const ImagePicker = ({ onImageSelect }: any) => {
  
  const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    const data = await pickImage(e);
    onImageSelect(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="text-white justify-center min-w-[24rem]  min-h-[24rem] max-h-[24rem] h-[24rem] items-center flex flex-col gap-4 relative"
    >
      <div className="absolute right-3 top-3"></div>
      <div>
        <img src={imageIcon} alt="" className="w-24 h-24" />
      </div>
      <label
        htmlFor="imagePicker"
        className="cursor-pointer bg-zinc-900 p-2 rounded-md"
      >
        Select Photos
      </label>
      <input
        type="file"
        name="imagePicker"
        id="imagePicker"
        hidden
        accept="image/*, video/*"
        onChange={handleImagePick}
      />
    </motion.div>
  );
};

export default ImagePicker;
