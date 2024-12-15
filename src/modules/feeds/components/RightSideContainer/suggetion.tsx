import { useState } from "react";
import Avatar from "@/components/shared/Avatar";
import FollowButton from "@/components/shared/FollowButton";
import UsernameLink from "@/components/shared/UsernameLink";

const Suggetion = ({ user }: any) => {
  const { _id: userId, avatar, username, name, isPrivate } = user;
  const [follow, setFollow] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleFollow = ({
    isFollow,
    isRequested,
  }: {
    isFollow: boolean;
    isRequested: boolean;
  }) => {
    setFollow(isFollow);
    setIsRequested(isRequested);
  };

  return (
    <div className="py-1">
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
            <span className="text-sm font-medium text-primary">{name}</span>
            <span className="text-xs text-secondary-foreground/50 font-medium ">
              {username}
            </span>
          </div>
        </UsernameLink>

        <FollowButton
          size={"sm"}
          userId={userId}
          isFollow={follow}
          callBack={handleFollow}
          showRemoveFollowerBtn={false}
          isRequested={isRequested}
          isPrivate={isPrivate}
        />
      </div>
    </div>
  );
};

export default Suggetion;
