import { Link } from "react-router-dom";

import { useState } from "react";
import Avatar from "@/components/shared/Avatar";
import FollowButton from "@/components/shared/FollowButton";
import UsernameLink from "@/components/shared/UsernameLink";
// import { followUser } from "../../profile/services/postServices";

const Suggetion = ({ user }: any) => {
  const { _id: userId, avatar, username, name, isPrivate } = user;
  const [follow, setFollow] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between rounded-lg">
        <UsernameLink
          username={username}
          className="flex items-center space-x-2"
        >
          <Avatar
            src={avatar?.url}
            name={name}
            className="inline-block bg-background size-8 rounded-full hover:scale-90 duration-500 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary">
              {name}
            </span>
            <span className="text-sm font-medium text-foreground-secondary ">
              {username}
            </span>
          </div>
        </UsernameLink>

        <FollowButton
          size={"sm"}
          userId={userId}
          isFollow={follow}
          callBack={({ isFollow, isRequested }) => {
            console.log(isFollow, isRequested);
          }}
          showRemoveFollowerBtn={false}
          isRequested={isRequested}
          isPrivate={isPrivate}
        />
      </div>
    </div>
  );
};

export default Suggetion;
