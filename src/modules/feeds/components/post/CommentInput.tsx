import { useCallback, useEffect, useRef, useState } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { makeRequest } from '@/config/api.config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import MentionInput from '@/components/shared/MentionInput'
import { cn } from '@/lib/utils'
import { SmileIcon, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { commentExpand } from '@/components/Events/CommentExpand'
import { ReplyType } from '@/hooks/useComments'

interface CommentInputProps {
  postId: string
  onComment: (comment: any, reply: boolean) => void
  setReply: React.Dispatch<React.SetStateAction<ReplyType>>
  reply: {
    commentId: string | null
    repliedTo: string | null
    isReply: boolean
  }
}

const CommentInput = ({
  postId,
  onComment,
  setReply,
  reply,
}: CommentInputProps) => {
  const [commentText, setCommentText] = useState<string>()
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [mentionedUsers, setMentionedUsers] = useState([])

  const inputRef = useRef<any>()

  useEffect(() => {
    inputRef.current.focus()
  }, [reply.commentId])

  const sendComment = async () => {
    try {
      const data = (await makeRequest.post(`/comment`, {
        post: postId,
        comment: commentText,
        mentions: mentionedUsers,
        parrentComment: reply.commentId,
      })) as any

      if (data.isSuccess) {
        toast.success('New Comment Added', { position: 'bottom-right' })
        setCommentText('')
        setMentionedUsers([])
        setCursorPosition(0)
        onComment && onComment(data.comment, !!data.comment.parrentComment)
        setReply({
          isReply: false,
          commentId: null,
          repliedTo: null,
        })
        commentExpand.dispatchEvent(new CustomEvent('expand', { detail: reply.commentId }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputClick = (event: any) => {
    setCursorPosition(event.target.selectionStart)
  }

  const handleInputBlur = () => {
    setCursorPosition(inputRef?.current?.selectionStart ?? 0)
  }

  const onEmojiClick = useCallback(
    (event: any) => {
      const emoji = event.native
      const newInputValue =
        commentText &&
        commentText.substring(0, cursorPosition) +
          emoji +
          commentText.substring(cursorPosition)

      setCommentText(newInputValue || emoji)

      const newCursorPosition = cursorPosition + emoji.length

      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      inputRef.current.focus()
    },
    [commentText]
  )

  return (
    <div className="relative z-10 flex flex-col items-center justify-between">
      {reply.commentId && (
        <span className="absolute bottom-9 flex w-full justify-between bg-secondary px-2 py-1 text-sm">
          <span>replied to {reply.repliedTo}</span>
          <button
            onClick={() =>
              setReply({
                isReply: false,
                commentId: null,
                repliedTo: null,
              })
            }
          >
            <X size={16} />
          </button>
        </span>
      )}
      <div
        className={cn(
          'flex w-full items-center justify-between gap-3 bg-secondary'
        )}
      >
        <MentionInput
          ref={inputRef}
          text={commentText}
          setText={setCommentText}
          placeholder={'Add a comment...'}
          setCursorPosition={setCursorPosition}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          mentionedUsers={mentionedUsers}
          setMentionedUsers={setMentionedUsers}
        />
        {commentText && (
          <button className="text-sm text-blue-400" onClick={sendComment}>
            Post
          </button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger className="pr-2">
            <SmileIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="z-[1000] rounded-md border-none"
            align="start"
          >
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
  )
}

export default CommentInput
