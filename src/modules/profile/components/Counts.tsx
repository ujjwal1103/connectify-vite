import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Tabs from "./Tabs";
import { useLocation } from "react-router-dom";

const Counts = ({ posts, followers, following, userId }: any) => {
  const location = useLocation();
  const [followersOrFollowing, setFollowersOrFollowing] = useState<
    "following" | "followers" | null
  >(null);

  useEffect(() => {
    setFollowersOrFollowing(null);
  }, [location.pathname]);

  return (
    <div className="flex md:gap-10 gap-4">
      <div className="md:only:space-x-2 md:text-sm text-sm flex flex-col items-center">
        <span>{posts}</span>
        <span>Posts</span>
      </div>
      <button
        onClick={() => {
          setFollowersOrFollowing("followers");
        }}
        className="md:space-x-2 cursor-pointer  md:text-sm text-sm flex flex-col items-center"
      >
        <span>{followers}</span>
        <span>Followers</span>
      </button>
      <button
        onClick={() => {
          setFollowersOrFollowing("following");
        }}
        className="md:space-x-2 cursor-pointer  md:text-sm text-sm flex flex-col items-center"
      >
        <span>{following}</span>
        <span>Following</span>
      </button>
      {followersOrFollowing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed mx-auto z-50  bg-zinc-900 w-screen h-dvh inset-0 bg-opacity-60 backdrop-blur"
        >
          <button
            className="absolute hidden md:block right-5 top-5"
            onClick={() => {
              setFollowersOrFollowing(null);
            }}
          >
            <XIcon size={30} />
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mx-auto md:w-1/3 "
          >
            <Tabs
              tabId={"bubble"}
              activeTab={followersOrFollowing}
              userId={userId}
              onClose={() => {
                setFollowersOrFollowing(null);
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Counts;
