import UsernameLink from "@/components/shared/UsernameLink";
import { IUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

const getCaption = (caption: string) => {
  const jsx = caption?.split(" ").map((word, index) => {
    if (word.startsWith("#") || word.startsWith("@")) {
      return (
        <Link
          to={`/${word.replace("#", "")}`}
          key={index}
          className="text-blue-700"
        >
          {word}{" "}
        </Link>
      );
    } else {
      return <span key={index}>{word} </span>;
    }
  });

  return <>{jsx}</>;
};

const options = {
  replace({ type, data }: any) {
    if (type === "text") {
      return getCaption(data);
    }
  },
};

const Caption = ({
  caption,
  user,
  showUser = true,
}: {
  caption: string;
  user?: IUser;
  showUser: boolean;
}) => {
  const [showMore, setShowMore] = useState(false);
  const shouldShowMoreButton = caption && caption.length > 100;
  return (
    <>
      <div
        className={cn(
          "break-words text-ellipsis  w-full text-sm overflow-hidden",
          {
            "max-h-24": !!caption,
            "max-h-fit": showMore,
          }
        )}
      >
        {showUser && (
          <UsernameLink username={user!.username}>
            <span>{user!.username}</span>
          </UsernameLink>
        )}
        {parse(caption, options)}
      </div>
      {!showMore && caption && shouldShowMoreButton && (
        <button
          onClick={() => setShowMore(true)}
          className="self-start text-sm text-blue-600"
        >
          more
        </button>
      )}
    </>
  );
};

export default Caption;
