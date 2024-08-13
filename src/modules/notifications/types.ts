import { IPost, IUser } from '@/lib/types'

export interface GetNotificationRoot {
  data: GroupNotification[]
  isSuccess: boolean
  idsOnly: string[]
}

export interface GetFollowRequetsRoot {
  isSuccess: boolean
  followRequest: IFollowRequest[]
}

export interface GroupNotification {
  _id: string
  notifications: INotification[]
}

export interface IFollowRequest {
  _id: string
  requestedTo: string
  requestedBy: IUser
  requestStatus: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface INotification {
  _id: string
  type: string
  createdAt: string
  user: IUser
  postId?: IPost
  requestId?: string
  text: string
}

export enum NotificationType {
  FOLLOW_REQUEST_ACCEPTED = 'FOLLOW_REQUEST_ACCEPTED',
}
