import { useRef, useState } from "react";
import { EmojiSmile } from "@/components/icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { makeRequest } from "@/config/api.config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MentionInput from "@/components/shared/MentionInput";
import { cn } from "@/lib/utils";

interface CommentInputProps {
  postId: string;
  onComment: (comment: any, reply: boolean) => void;
  setReply: (comment: any) => void;
  reply: {
    commentId: string | null;
    repliedTo: string | null;
    isReply: boolean;
  };
}

const CommentInput = ({
  postId,
  onComment,
  setReply,
  reply,
}: CommentInputProps) => {
  const [commentText, setCommentText] = useState<string>();
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [mentionedUsers, setMentionedUsers] = useState([]);

  const inputRef = useRef<any>();

  const sendComment = async () => {
    try {
      const data = (await makeRequest.post(`/comment`, {
        post: postId,
        comment: commentText,
        mentions: mentionedUsers,
        parrentComment: reply.commentId,
      })) as any;
      if (data.isSuccess) {
        setCommentText("");
        setMentionedUsers([]);
        setCursorPosition(0);
        onComment && onComment(data.comment, true);
        setReply({
          isReply: false,
          commentId: null,
          repliedTo: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputClick = (event: any) => {
    setCursorPosition(event.target.selectionStart);
  };

  const handleInputBlur = () => {
    setCursorPosition(inputRef?.current?.selectionStart ?? 0);
  };

  const onEmojiClick = (event: any) => {
    console.log(event);
    const emoji = event.native;
    const newInputValue =
      commentText &&
      commentText.substring(0, cursorPosition) +
        emoji +
        commentText.substring(cursorPosition);

    setCommentText(newInputValue || emoji);

    const newCursorPosition = cursorPosition + emoji.length;

    inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    inputRef.current.focus();
  };
  return (
    <div className="flex justify-between relative  items-center flex-col">
      {reply.commentId && (
        <span className=" w-full dark:bg-zinc-800 bg-gray-200 px-2 flex justify-between rounded-t-md text-sm">
          <span>replied to {reply.repliedTo}</span>
          <button
            onClick={() =>
              setReply({
                isReply: false,
                commentId: null,
              })
            }
          >
            clear
          </button>
        </span>
      )}
      <div
        className={cn(
          "flex items-center justify-between dark:bg-zinc-800 bg-gray-200 w-full gap-3  rounded-md",
          { "rounded-t-none": reply.isReply }
        )}
      >
        <MentionInput
          ref={inputRef}
          text={commentText}
          setText={setCommentText}
          placeholder={"Add a comment..."}
          setCursorPosition={setCursorPosition}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          mentionedUsers={mentionedUsers}
          setMentionedUsers={setMentionedUsers}
        />
        {commentText && (
          <button className="text-blue-400 text-sm" onClick={sendComment}>
            Post
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="pr-2">
            <EmojiSmile />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none rounded-md" align="start">
            <Picker
              data={data}
              onEmojiSelect={onEmojiClick}
              searchPosition="none"
              previewPosition="none"
              navPosition="bottom"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CommentInput;
