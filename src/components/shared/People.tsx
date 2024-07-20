import UsernameLink from "@/components/shared/UsernameLink";
import Avatar from "./Avatar";
import { memo } from "react";
import FollowButton from "./FollowButton";

const People = memo(({ people }: any) => {
  const { avatar, username, name } = people;
  return (
    <li className="flex py-2 hover:bg-secondary gap-3 w-full items-center px-4">
      <Avatar
        name={people.name}
        src={avatar?.url}
        className={"w-8 h-8 bg-gray-600 rounded-full"}
      />
      <div className="flex flex-1 flex-col leading-5">
        <span className="text-sm">{name}</span>
        <UsernameLink username={username} className="text-gray-400 text-sm">
          <span>{username}</span>
        </UsernameLink>
      </div>
      <div className="ml-auto  self-center">
        <FollowButton
          userId={people._id}
          isFollow={people?.isFollow}
          showRemoveFollowerBtn={false}
          isRequested={people.isRequested}
          isPrivate={people.isPrivate}
        />
      </div>
    </li>
  );
});

export default People;
