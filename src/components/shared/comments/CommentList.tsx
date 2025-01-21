import { IComment } from '@/interface/interfaces'
import { Comment } from './Comment'
import { ReplyType } from '@/hooks/useComments'

type CommentListProps = {
  comments: IComment[]
  setReply: React.Dispatch<React.SetStateAction<ReplyType>>
  root: boolean
  onLikeDislike: (commentId: string, isLiked: boolean) => void
}

export const CommentList = ({
  comments,
  setReply,
  root,
  onLikeDislike,
}: CommentListProps) => {
  return (
    <div className={`${!root && 'border-l border-zinc-800'}`}>
      {comments?.map((comment: IComment) => {
        return (
          <Comment
            comment={comment}
            setReply={setReply}
            key={comment._id}
            root={root}
            onLikeDislike={onLikeDislike}
          />
        )
      })}
    </div>
  )
}
