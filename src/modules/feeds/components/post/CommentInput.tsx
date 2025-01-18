import { useCallback, useEffect, useRef, useState } from 'react'
import { makeRequest } from '@/config/api.config'

import MentionInput from '@/components/shared/MentionInput'
import { cn } from '@/lib/utils'
import { Send, X } from 'lucide-react'
import { commentExpand } from '@/components/Events/CommentExpand'
import { ReplyType } from '@/hooks/useComments'
import EmojiPicker from '@/components/shared/modal/EmojiPicker'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
        commentExpand.dispatchEvent(
          new CustomEvent('expand', { detail: reply.commentId })
        )
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
    <div className="relative z-10 flex w-full flex-col items-center justify-between">
      {reply.commentId && (
        <span className="absolute bottom-9 mb-2 flex w-full justify-between rounded-md bg-secondary px-2 py-1 text-sm">
          <span>
            <span className="text-foreground-secondary">Replying to</span>{' '}
            <span className="text-blue-500">{reply.repliedTo}</span>
          </span>
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
          'flex w-full items-center justify-between gap-3 rounded-md bg-secondary'
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

        <div className="flex items-center gap-2 px-2">
          <EmojiPicker onEmojiClick={onEmojiClick} />
            {commentText && (
              <Button
                variant="ghost"
                size={'sm'}
                className="size-6 text-sm text-blue-400 hover:bg-background"
                onClick={sendComment}
              >
                <Send size={16} />
              </Button>
            )}
        </div>
      </div>
    </div>
  )
}

export default CommentInput
