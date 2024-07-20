import { deleteThisPost } from "@/api";
import { IUser } from "@/lib/types";
import { usePostSlice } from "@/redux/services/postSlice";
import { useProfileSlice } from "@/redux/services/profileSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, MoreHorizontal } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ImageSlider } from "../shared/ImageSlider/ImageSlider";
import ConfirmModal from "../shared/modal/ConfirmModal";
import EditPostModal from "../shared/modal/EditPostModal";

export const ProfilePost = ({ post, isSelfPosts = false }: any) => {
  const [currentPost, setCurrentPost] = useState(post);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const { deletePost } = usePostSlice();
  const { setUser, user } = useProfileSlice();
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    bottom: "auto",
    right: "auto",
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  const handleScroll = () => {
    setIsMenuOpen(false);
  };
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => {
    setIsMenuOpen(false);
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);
  const handleConfirm = () => {
    handleDeletePost();
  };
  useLayoutEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight; 
      const menuWidth = menuRef.current?.offsetWidth;
      let top = buttonRect.bottom + window.scrollY + 8;
      let left = buttonRect.left + window.scrollX;
      let bottom = "auto";
      let right = "auto";

      if (window.innerHeight - buttonRect.bottom < menuHeight!) {
        top = buttonRect.top + window.scrollY - menuHeight! - 8;
      }

      if (window.innerWidth - buttonRect.right < menuWidth!) {
        left = buttonRect.right + window.scrollX - menuWidth! - 8;
      }

      if (top < 0) {
        top = 8;
        bottom = "auto";
      }

      if (left < 0) {
        left = 8;
        right = "auto";
      }

      setMenuPosition({ top, left, bottom, right });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isMenuOpen]);

  const handleEditPost = () => {
    setEditPost(true);
    setIsMenuOpen(false);
  };

  const handleDeletePost = async () => {
    try {
      setDeletingPost(true);
      await deleteThisPost(currentPost._id);
      toast.success("Post Deleted Successfully");
      deletePost(currentPost._id);
      const u = { ...user, posts: user!.posts - 1 };
      setUser(u as IUser);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post");
    } finally {
      setDeletingPost(false);
      handleClose();
    }
  };

  return (
    <motion.div className="relative bg-black-600 flex items-center">
      <ImageSlider images={currentPost?.images} aspect={true} />
      <div ref={buttonRef} className="absolute top-2 right-2">
        <MoreHorizontal
          className="cursor-pointer md:size-6 size-3"
          onClick={handleMenuToggle}
          size={30}
        />
      </div>
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="absolute bg-zinc-900 shadow-xl rounded p-2 z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                bottom: menuPosition.bottom,
                right: menuPosition.right,
              }}
            >
              <ul className="md:w-44 md:text-sm text-sm">
                <li className="p-2 cursor-pointer hover:bg-zinc-800 rounded-md">
                  <Link to={`/p/${post._id}`}>View Post</Link>
                </li>
                {isSelfPosts && (
                  <>
                    <li className="p-2 cursor-pointer hover:bg-zinc-800 rounded-md">
                      <button type="button" onClick={handleEditPost}>
                        Edit Post
                      </button>
                    </li>
                    <li className="p-2 cursor-pointer hover:bg-zinc-800 rounded-md text-red-600">
                      <button
                        type="button"
                        onClick={handleOpen}
                        disabled={deletingPost}
                        className="flex items-center justify-between w-full"
                      >
                        Delete Post
                        {deletingPost && (
                          <span>
                            <Loader className="animate-spin" />
                          </span>
                        )}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {editPost && (
        <EditPostModal
          isOpen={editPost}
          onClose={() => setEditPost(false)}
          post={currentPost}
        />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <ConfirmModal
            onClose={handleClose}
            onConfirm={handleConfirm}
            title="Confirm Action"
            message="Are you sure you want to proceed?"
          >
            <div className="text-primary p-4 md:p-6 shadow-xl rounded-md bg-background md:rounded-lg">
              <div className="text-lg font-bold mb-4">Delete this post</div>
              <p className="mb-4">Are you sure you want to delete?</p>
              <div className="justify-end mt-4 flex flex-col-reverse md:flex-row gap-2">
                <button
                  onClick={handleClose}
                  disabled={deletingPost}
                  className="px-4 py-2 bg-gray-700  rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={deletingPost}
                  className="px-4 py-2 bg-red-500  disabled:bg-red-400 disabled:pointer-events-none text-white gap-4 rounded hover:bg-red-600 flex items-center justify-center"
                >
                  Delete
                  {deletingPost && (
                    <span>
                      <Loader className="animate-spin" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </ConfirmModal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
