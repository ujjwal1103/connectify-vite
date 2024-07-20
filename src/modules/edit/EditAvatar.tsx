import { removeUserAvatar, updateUserAvatar } from "@/api";
import Avatar from "@/components/shared/Avatar";
import MenuItemModal from "@/components/shared/modal/MenuItemModal";
import Modal from "@/components/shared/modal/Modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { updateDataInLocalStorage } from "@/lib/localStorage";
import { readFileAsDataURL } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const EditAvatar = () => {
  const { user, updateUser } = useAuth();
  const [avatar, setAvatar] = useState<any>(user?.avatar?.url);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  function pickFiles(callBack: (file: File) => void) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*"; // You can specify the file types here, e.g., 'image/*' for images only

    input.addEventListener("change", (event: any) => {
      const files = event.target.files!;
      callBack(files[0]);
    });

    input.click();
  }

  const updateAvatar = async () => {
    try {
      pickFiles(async (file: File) => {
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file!);
        const dataUrl = await readFileAsDataURL(file!);
        setAvatar(dataUrl);
        setShowProfileOptions(false);
        setUploadingAvatar(true);
        const result = await updateUserAvatar(formData);
        setAvatar(result.avatar.url);
        updateUser({ ...user!, avatar: result.avatar });
        updateDataInLocalStorage({ avatar: result.avatar });
        setUploadingAvatar(false);
      });
    } catch (error) {
      toast.error("Error Updating Avatar", { position: "bottom-right" });
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    setShowProfileOptions(false);
    await removeUserAvatar();
    updateDataInLocalStorage({ avatar: null });
    updateUser({ ...user!, avatar: undefined });
    setAvatar(null);
    setUploadingAvatar(false);
  };
  const handleAvatar = () => {
    if (avatar) {
      setShowProfileOptions(true);
    } else {
      updateAvatar();
    }
  };

  const menuOptions = [
    {
      label: "Upload Photo",
      onClick: updateAvatar,
    },
    {
      label: "Remove Current Photo",
      onClick: handleRemoveAvatar,
      destructive: true,
    },
  ];

  return (
    <div className="w-full my-2">
      <div className="bg-secondary md:p-4 p-2 rounded-xl flex md:flex-row justify-between  gap-3 md:gap-0 items-center">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Avatar
              src={avatar}
              className="size-14 bg-rose-950 cursor-pointer object-cover"
              onClick={handleAvatar}
            />
            {uploadingAvatar && (
              <div className="size-14 absolute rounded-full top-0 flex items-center justify-center bg-black/40">
                <Loader className="animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-base font-semibold">{user?.username}</span>
            <span className="text-sm text-zinc-400">{user?.name}</span>
          </div>
        </div>
        <div className="md:ml-auto hidden md:block">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-500 md:h-9 h-5 md:px-4 px-2 md:text-sm text-sm"
            onClick={handleAvatar}
          >
            Change Photo
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showProfileOptions && (
          <Modal
            onClose={() => setShowProfileOptions(false)}
            showCloseButton={false}
          >
            <MenuItemModal menuOptions={menuOptions} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditAvatar;
