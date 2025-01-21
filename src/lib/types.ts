export interface IIamge {
  type?: string
  publicId: string
  _id: string
  url: string
}

export type Gender = 'male' | 'female' | undefined

export interface IUser {
  _id: string
  username: string
  name: string
  avatar?: { url: string; publicId: string }
  bio?: string
  gender?: Gender
  isFollow?: boolean
  isPrivate: boolean
  isRequested?: boolean
  posts: number
  followers: number
  following: number
}

export interface IPost {
  postType: 'REEL' | 'POST'
  _id: string
  images: IIamge[]
  caption: string
  isLiked: boolean
  isBookmarked: boolean
  like: number
  user: IUser
  location?: string
}

export type IMember = IUser & { role: 'member' | 'admin' }

export interface IChat {
  _id: string
  friend: IUser
  lastMessage: IMessage
  selectedChat: boolean
  isGroup?: boolean
  groupName?: string
  groupAvatar?: IIamge
  members?: IMember[]
  userDetails?: IUser[]
  createdBy?: string
  unseenMessagesCount?: number
  membersInfo?: IUser[]
}

export type MessageType =
  | 'TEXT_MESSAGE'
  | 'IMAGE'
  | 'VIDEO'
  | 'AUDIO'
  | 'SYSTEM'
  | 'VOICE_MESSAGE'
  | 'POST_MESSAGE'
export type SystemMessageType =
  | 'GROUP_CREATED'
  | 'MEMBER_REMOVED'
  | 'MEMBER_EXIT'
  | 'MEMBERS_ADDED'
  | 'AVATAR_REMOVED'
  | 'AVATAR_CHANGED'
  | 'GENERAL_MESSAGE'
  | 'GROUP_NAME_CHANGED'
export interface IMessage {
  _id: string
  text: string
  messageType: MessageType
  attachments: any[]
  to: string
  from: string
  chat: string
  seen: boolean
  createdAt: string
  updatedAt: string
  error?: boolean
  isLoading?: boolean
  tempId?: string
  post?: IPost
  images?: IIamge[]
  isUnavailable?: boolean
  sender: IUser
  reaction?: string
  isCurrentUserMessage?: boolean
  isEdited?: boolean
  systemMessageType: SystemMessageType | null
  reply?: IMessage
}

export interface MessagesRootObject {
  isSuccess: boolean
  messages: IMessage[]
  pagination: Pagination
}

export interface Pagination {
  itemCount: number
  perPage: number
  currentPage: number
  totalPages: number
  pageCounter: number
  hasPrev: boolean
  hasNext: boolean
  prev?: any
  next?: any
}

export type Status = 'idel' | 'loading' | 'success' | 'error'
