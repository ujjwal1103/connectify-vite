import { useState } from "react";

import { Button } from "../ui/button";
import { isCurrentUser } from "@/lib/localStorage";
import {
  cancelFollowRequest,
  followUsers,
  sentFriendRequest,
  unFollowUsers,
} from "@/api";

type FollowButtonProps = {
  userId: string;
  callBack?: (data: any) => any;
  isFollow: boolean;
  showRemoveFollowerBtn: boolean;
  isRequested: boolean;
  isPrivate: boolean;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
};

const FollowButton = ({
  userId,
  callBack = () => {},
  isFollow,
  showRemoveFollowerBtn,
  isRequested,
  isPrivate,
  size = "sm",
}: FollowButtonProps) => {
  const [follow, setFollow] = useState(isFollow);
  const [isRequestSent, setIsRequestSent] = useState(isRequested);

  const handleFollowRequest = async () => {
    if (isPrivate) {
      setIsRequestSent(true);
      await sentFriendRequest(userId);
    } else {
      const data = await followUsers(userId);
      if (data.follow) {
        setFollow(data.follow);
        callBack(data);
      }
    }
  };
  const handleCancelFollowRequest = async () => {
    if (isPrivate) {
      setIsRequestSent(false);
      await cancelFollowRequest(userId);
    }
  };

  const handleUnfollow = async () => {
    if (!follow) return;
    const data = await unFollowUsers(userId);
    if (data.unfollow) {
      setFollow(false);
      callBack(data);
    }
  };

  if (isCurrentUser(userId)) {
    return <span></span>;
  }

  if (showRemoveFollowerBtn) {
    return (
      <Button
        className="text-sm bg-gradient-to-l from-blue-900 h-6 md:h-8 to-violet-900 text-sky-100 px-2 py-0.5"
        onClick={handleUnfollow}
        size={size}
      >
        Remove
      </Button>
    );
  }
  if (isRequestSent) {
    return (
      <Button
        className="  bg-zinc-900 hover:bg-zinc-800 h-6 md:h-8  text-sky-100 px-2 py-0.5"
        onClick={handleCancelFollowRequest}
        size={size}
      >
        Requested
      </Button>
    );
  }

  if (follow) {
    return (
      <Button
        className="text-sm bg-gradient-to-l h-6 md:h-8 from-blue-900 to-violet-900 px-2  text-sky-100"
        onClick={handleUnfollow}
        size={size}
      >
        Following
      </Button>
    );
  }

  return (
    <Button
      className="  bg-blue-600  h-6 md:h-8 hover:bg-blue-800 text-sky-100 px-2 py-0.5 "
      onClick={handleFollowRequest}
      size={size}
    >
      Follow
    </Button>
  );
};

export default FollowButton;
