import { CommentIcon, Send } from "@/components/icons";

import { useCallback, useEffect, useState } from "react";

import { LikeButton } from "@/components/shared/LikeButton";
import { IPost, IUser } from "@/lib/types";
import { BookmarkButton } from "@/components/shared/BookmarkButton";
import { useFeedSlice } from "@/redux/services/feedSlice";
import { makeRequest } from "@/config/api.config";
import { useDebounce } from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "@/components/shared/Avatar";
import Modal from "@/components/shared/modal/Modal";
import { Circle, CircleCheck, X } from "lucide-react";

type PostActionsProps = {
  post: IPost;
  showCurrentPost?: VoidFunction;
  size?: number;
  showCommentButton?: boolean;
  onLike?: (isLike: boolean) => void;
  onBookmark?: (isBookmarked: boolean) => void;
};

const PostActions = ({
  post,
  showCurrentPost,
  size = 24,
  showCommentButton = true,
  onLike,
  onBookmark,
}: PostActionsProps) => {
  const [sendPost, setSendPost] = useState(false);
  const { addAndRemoveBookmark, likeUnlikePost } = useFeedSlice();

  const handleLikeClicked = async (isLike: boolean, error: boolean) => {
    if (error) return;
    onLike && onLike(isLike);
    likeUnlikePost(isLike, post._id);
  };

  return (
    <div className="flex justify-between text-primary items-center pt-2 px-2">
      <div className="flex items-center gap-2 md:gap-3 text-xl">
        <LikeButton
          isLiked={post?.isLiked}
          size={size}
          id={post?._id}
          onLikeClick={handleLikeClicked}
          postUserId={post?.user?._id}
        />
        {showCommentButton && (
          <CommentIcon
            className="hover:text-muted-foreground cursor-pointer size-5"
            onClick={showCurrentPost}
          />
        )}
        <Send
          onClick={() => setSendPost(true)}
          className="hover:text-muted-foreground cursor-pointer"
        />
      </div>
      <BookmarkButton
        postId={post?._id}
        isBookmarked={post.isBookmarked}
        onBookmarkClick={(isBookmarked) => {
          onBookmark?.(isBookmarked);
          addAndRemoveBookmark(isBookmarked, post?._id);
        }}
      />
      <AnimatePresence>
        {sendPost && (
          <Modal
            shouldCloseOutsideClick={false}
            onClose={() => setSendPost(false)}
            showCloseButton={false}
          >
            <SendPost post={post} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostActions;

export const SendPost = ({ onClose }: any) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const debounceSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(async () => {
    let url = "/users/send";
    if (debounceSearch) {
      url = url + `?search=${debounceSearch}`;
    }
    try {
      const res = await makeRequest(url);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [debounceSearch]);

  // const handleSendPost = useCallback(async (userId: string) => {
  //   makeRequest.post("/message/u/send", {
  //     userId,
  //     post: post?._id,
  //     messageType: "POST_MESSAGE",
  //   });
  //   onClose();
  // }, []);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      selectedUser.length
    ) {
      setSelectedUser((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const toggleUserSelection = (user: IUser) => {
    if (selectedUser.includes(user.username)) {
      setSelectedUser((prev) => prev.filter((u) => u !== user.username));
    } else {
      setSelectedUser((prev) => [...prev, user.username]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className=" w-[500px] relative text-foreground bg-background overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <h1>Share</h1>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <hr className="border-secondary" />
      <motion.div className="p-2 px-3 flex items-center ">
        <span>To:</span>

        <motion.div className="bg-secondary p-2 rounded ml-2 w-full flex flex-wrap gap-1">
          <AnimatePresence>
            {selectedUser.map((user) => (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background p-1 px-2 rounded-sm flex items-center gap-2"
                >
                  {user}
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedUser((prev) =>
                        prev.filter((selectedUser) => selectedUser !== user)
                      )
                    }
                  >
                    <X size={12} />
                  </span>
                </motion.span>
              </AnimatePresence>
            ))}
          </AnimatePresence>

          <input
            type="text"
            className="bg-transparent focus-visible:outline-none pl-2"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="search"
          />
        </motion.div>
      </motion.div>

      <hr className="border-secondary" />
      <div className="py-2  scrollbar-none overflow-y-scroll h-[350px]">
        <h1 className="pb-2 px-3">Suggested</h1>
        <ul className="">
          {users?.map((user) => {
            const isSelected = selectedUser.includes(user.username);
            return (
              <motion.li
                key={user?._id}
                initial={{ opacity: 0, y: "-20%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                exit={{
                  opacity: 0,
                  y: "-20%",
                  animationDirection: "forward",
                  transition: { duration: 0.3, delay: 0 },
                }}
                className="py-2 flex gap-3 px-3 items-center cursor-pointer hover:bg-secondary"
                onClick={() => toggleUserSelection(user)}
              >
                <Avatar
                  src={user.avatar?.url}
                  className={"size-10 rounded-full"}
                />
                <span>{user.username}</span>
                <motion.span className="ml-auto flex" layout>
                  {isSelected ? (
                    <CircleCheck className="bg-green-600 rounded-full" />
                  ) : (
                    <Circle />
                  )}
                </motion.span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <div className="w-full pb-3 px-2 bg-transparent">
        <button
          disabled={!selectedUser.length}
          className="w-full bg-blue-600 disabled:opacity-55 py-2 rounded text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
};
