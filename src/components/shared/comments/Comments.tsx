import { getCommentsByPostId } from "@/api";
import { IComment } from "@/interface/interfaces";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import Avatar from "../Avatar";
import UsernameLink from "../UsernameLink";
import moment from "moment";
import { LikeButton } from "../LikeButton";

const Comments = ({
  setReply,
  comments,
  isLoading,
}: {
  postId: string;
  setReply: React.Dispatch<React.SetStateAction<any[]>>;
  comments: IComment[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className={`px-2 `}>
      <CommentList comments={comments} setReply={setReply} root={true} />
    </div>
  );
};

export default Comments;

export const CommentText = ({
  comment,
  mentions,
}: {
  comment: string;
  mentions: any;
}) => {
  const highlightMentions = () => {
    if (!mentions || mentions.length === 0) {
      return comment;
    }

    // Split the comment text into words
    const words = comment?.split(" ");

    // Map over the words and apply red color to mentioned words
    const highlightedText = words.map((word: string, index: number) =>
      mentions.includes(word) ? (
        <>
          <UsernameLink key={index} username={word} className="text-blue-500">
            <span>{word}</span>
          </UsernameLink>
        </>
      ) : (
        word + " "
      )
    );

    return <>{highlightedText}</>;
  };

  return <span>{highlightMentions()}</span>;
};

export const Comment = ({
  comment,
  setReply,
  root = false,
}: {
  comment: IComment;
  setReply: any;
  root: boolean;
}) => {
  const [currentComment, setCurrentComment] = useState(comment);
  const [showHiddenReply, setShowHiddenReply] = useState(false);

  const handleGetComments = async () => {
    try {
      const res = (await getCommentsByPostId(
        currentComment?.post?._id,
        currentComment?._id
      )) as any;
      setCurrentComment((prev) => ({ ...prev, childComments: res?.comments }));
      setShowHiddenReply(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      key={currentComment._id}
      className={`mb-2 first:mt-2 ${
        !root && "border-l"
      } border-zinc-700 pl-2 dark:text-gray-50 `}
    >
      <div className="flex gap-4 items-start">
        <div className=" ">
          <Avatar
            src={currentComment?.user?.avatar?.url}
            className="size-8 object-cover  rounded-full"
          />
        </div>

        <div className="flex-1 text-sm">
          <UsernameLink
            username={currentComment?.user?.username}
            className="font-semibold"
          >
            <span>{currentComment?.user?.username}</span>
          </UsernameLink>
          <span className="pl-2">
            <CommentText
              comment={currentComment?.comment}
              mentions={currentComment?.mentions}
            />
          </span>
          <div className="flex gap-5 text-gray-500">
            <span>{moment(currentComment.updatedAt).fromNow(true)}</span>
            <span>{currentComment?.like} likes</span>
            <button
              onClick={() => {
                setReply({
                  isReply: true,
                  commentId: currentComment._id,
                  repliedTo: currentComment.user.username,
                });
              }}
            >
              reply
            </button>
          </div>
        </div>
        <LikeButton
          size={15}
          isLiked={currentComment?.isLiked}
          postUserId={currentComment?.post?.user?._id}
          commentId={currentComment?._id}
          id={""}
          onLikeClick={function (): {} {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      <div className="">
        {currentComment?.childComments?.length > 0 && (
          <>
            {showHiddenReply && (
              <CommentList
                comments={currentComment?.childComments}
                setReply={setReply}
                root={false}
              />
            )}
            {!showHiddenReply ? (
              <button className="text-sm ml-12" onClick={() => handleGetComments()}>
                show {currentComment?.childComments?.length} replies
              </button>
            ) : (
              <button
                className="text-sm ml-12"
                onClick={() => setShowHiddenReply(false)}
              >
                Hide {currentComment?.childComments?.length} replies
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CommentList = ({ comments, setReply, root }: any) => {
  return (
    <div className={`${!root && "border-l border-zinc-800"}`}>
      {comments?.map((comment: IComment) => {
        return (
          <Comment
            comment={comment}
            setReply={setReply}
            key={comment._id}
            root={root}
          />


        );
      })}
    </div>
  );
};


