import { IPost, IUser } from '@/lib/types'

export interface IBookmark {
  _id: string
  bookmarkedBy: string
  postId: string
  createdAt: string
  updatedAt: string
  __v: number
  post: IPost
}

export interface IComment {
  _id: string
  from: string
  post: { _id: string; userId: string }
  comment: string
  parrentComment: any
  mentions: any[]
  createdAt: string
  updatedAt: string
  __v: number
  user: IUser
  childComments: any[]
  like: number
  isLiked: boolean
}
