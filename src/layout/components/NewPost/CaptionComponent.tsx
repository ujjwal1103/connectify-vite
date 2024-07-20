import { uploadPosts } from "@/api";
import Avatar from "@/components/shared/Avatar";
import { ImageSlider } from "@/components/shared/ImageSlider/ImageSlider";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { getCurrentUser } from "@/lib/localStorage";
import EmojiPicker from "@emoji-mart/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { ArrowLeft, Loader, SmileIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const CaptionComponent = ({
  setStep,
  cropedImagesUrls,
  aspectRatio,
  onClose,
}: any) => {
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<any>(false);
  const user = getCurrentUser();

  const handlePost = async () => {
    if (!cropedImagesUrls.length) {
      alert("Please select an image");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      for (let i = 0; i < cropedImagesUrls.length; i++) {
        formData.append("postImage", cropedImagesUrls[i].file);
      }
      formData.append("caption", caption || "");
      formData.append("aspectRatio", aspectRatio);

      const data = (await uploadPosts(formData)) as any;

      if (data?.isSuccess) {
        toast("Image Uploade SuccessFully");
        onClose();
      }
    } catch (error) {
      console.log("ERROR UPLOADING POST", error);
      toast.error("Error Uploading Post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="flex relative w-128 md:w-192 lg:aspect-video  flex-col h-full "
    >
      <div className="p-2 flex justify-between bg-secondary gap-5 ">
        <button
          className="middle  none center rounded-md  py-2 px-4 font-sans text-sm font-bold uppercase text-white   transition-all   focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          data-ripple-light="true"
          onClick={() => {
            setStep("Crop");
          }}
          disabled={!cropedImagesUrls.length}
        >
          <ArrowLeft />
        </button>
        {isLoading ? (
          <span
            className="middle none center rounded-lg  py-2 px-4 font-sans text-sm font-bold uppercase text-white   transition-all   focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
          >
            <Loader className="animate-spin" />
          </span>
        ) : (
          <button
            className="middle none center rounded-lg  py-2 px-4 font-sans text-sm font-bold uppercase text-white   transition-all   focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            onClick={handlePost}
            disabled={!cropedImagesUrls.length}
          >
            Post
          </button>
        )}
      </div>
      <div className="flex relative flex-col h-full max-h-full lg:flex-row">
        <div className="flex flex-1 justify-center items-center h-full gap-5">
          <ImageSlider
            images={cropedImagesUrls.map((c: any) => ({
              url: c.croppedUrl,
              type: c.type,
            }))}
            height="100%"
          />
        </div>
        <div className="flex-1 h-full flex flex-col justify-between">
          <div className="py-3 px-4 flex items-center gap-3">
            <Avatar src={user?.avatar?.url} className="border-none size-8" />
            <span className="text-sm">{user?.username}</span>
          </div>
          <RichTextEditor
            value={caption}
            onChange={setCaption}
            className="overflow-y-scroll w-full flex-1 h-64 lg:h-full scrollbar-none p-3  focus-visible:outline-none"
          />
          <div className="py-3 px-4 flex items-center justify-between gap-3">
            <motion.div drag>
              <DropdownMenu>
                <DropdownMenuTrigger className="pr-2">
                  <span>
                    <SmileIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="border-none rounded-md"
                  align="end"
                >
                  <EmojiPicker
                    onEmojiSelect={(event: any) => {
                      const emoji = event.native;
                      console.log(caption + emoji);
                      setCaption((prev = "") => prev + emoji);
                    }}
                    searchPosition="none"
                    previewPosition="none"
                    navPosition="bottom"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
            <span className="text-sm">{caption.length}/2,200</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaptionComponent;
