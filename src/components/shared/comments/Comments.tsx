import { IComment } from '@/interface/interfaces'
import { Loader } from 'lucide-react'
import React from 'react'

import { CommentList } from './CommentList'
import { ReplyType } from '@/hooks/useComments'


const Comments = ({
  setReply,
  comments,
  isLoading,
  onLikeDislike,
}: {
  postId: string
  setReply: React.Dispatch<React.SetStateAction<ReplyType>>
  comments: IComment[]
  isLoading: boolean
  onLikeDislike: (commentId: string, isLiked: boolean) => void
}) => {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  return (
    <div className={`px-2`}>
      <CommentList comments={comments} setReply={setReply} root={true} onLikeDislike={onLikeDislike}/>
    </div>
  )
}

export default Comments
