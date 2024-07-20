import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ImageSlider } from "../ImageSlider/ImageSlider";
import { updatePost } from "@/api";
import { usePostSlice } from "@/redux/services/postSlice";
import { toast } from "react-toastify";

const EditPostModal = ({ isOpen, onClose, post }: any) => {
  const [caption, setCaption] = useState(post?.caption);
  const [updating, setUpdating] = useState(false);
  const [isInValid, setIsInValid] = useState(false);
  const { updatePost: updateCurrenPost } = usePostSlice();

  const handleEditCaption = async () => {
    try {
      setUpdating(true);
      const res = await updatePost(caption, post._id);
      if (res.isSuccess) {
        const updatedPost = {
          ...post,
          updatedAt: res.post.updatedAt,
          caption: res.post.caption,
          hastags: res.post.hastags,
        };
        console.log(updatedPost);
        updateCurrenPost(updatedPost);
        toast.success("Post Updated Successfully");
      }
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };
  return (
    <motion.div
      className={`fixed z-50 inset-0 overflow-hidden ${isOpen ? "" : "hidden"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center w-full justify-center md:max-h-dvh min-h-dvh overflow-hidden md:px-4 md:pt-4 md:pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block md:max-h-[600px] md:w-[800px] h-dvh w-screen md:h-auto align-bottom bg-zinc-900 text-white rounded-lg px-4 md:pt-5 pt-0  pb-4 text-left md:overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 overflow-y-scroll">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg leading-6 font-medium py-2">Edit Post</h3>
              <div className=" flex gap-2 md:gap-5 md:flex-row flex-col">
                <div>
                  <div className="md:w-72 w-full aspect-square rounded-md overflow-clip">
                    <ImageSlider
                      images={post.images}
                      aspect={true}
                      readOnly={true}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2 hidden md:block">
                    {format(new Date(), "MMM dd, yyyy h:mm a")}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="">
                    <textarea
                      onChange={(e) => setCaption(e.target.value)}
                      rows={5}
                      value={caption}
                      className="block w-full h-72 resize-none px-3 py-2 placeholder-gray-400 bg-zinc-800 rounded-md text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter new caption"
                      required
                    />
                  </div>
                  <div className="md:mt-5 mt-2 flex sm:mt-4 sm:flex-row-reverse gap-3">
                    <button
                      disabled={updating || isInValid}
                      onClick={handleEditCaption}
                      className="mt-3 md:mt-0 inline-flex justify-center w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm
                      disabled:opacity-50 disabled:pointer-events-none
                    "
                    >
                      Save
                    </button>
                    <button
                      disabled={updating || isInValid}
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full sm:mt-0 sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditPostModal;
