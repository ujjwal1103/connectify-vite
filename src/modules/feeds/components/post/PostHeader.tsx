import { ThreeDots } from "@/components/icons";
import UsernameLink from "@/components/shared/UsernameLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "react-router-dom";
import Avatar from "@/components/shared/Avatar";
import { IPost } from "@/lib/types";

type PostHeaderProps = {
  post: IPost;
};

const PostHeader = ({ post }: PostHeaderProps) => {
  return (
    <div className="w-full p-2 flex gap-6 items-center text-secondary-foregroun justify-between">
      <div className="flex gap-3 items-center flex-1">
        <Avatar
          src={post?.user?.avatar?.url}
          className="rounded-full size-8 md:size-10"
          name={post?.user?.name}
        />
        <div className="flex flex-col ">
          <UsernameLink username={post?.user?.username} onClick={() => {}}>
            <span className="text-sm">{post?.user?.username}</span>
          </UsernameLink>
          <span>{post?.location}</span>
        </div>
      </div>
      <div className="relative text-secondary-foreground">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ThreeDots className=" cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-background-secondary border-none rounded-md"
            align="end"
          >
            <DropdownMenuLabel>
              <Link to={`p/${post._id}`} className="hover:text-primary">
                Open Post
              </Link>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostHeader;
