import { IComment } from '@/interface/interfaces'
import { Comment } from './Comment'

export const CommentList = ({
  comments,
  setReply,
  root,
  onLikeDislike,
}: any) => {
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
