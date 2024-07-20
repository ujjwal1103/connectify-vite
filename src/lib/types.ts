export interface IIamge {
  publicId: string;
  _id: string;
  url: string;
}

export type Gender = "male" | "female" | undefined;

export interface IUser {
  _id: string;
  username: string;
  name: string;
  avatar?: { url: string; publicId: string };
  bio?: string;
  gender?: Gender;
  isFollow?: boolean;
  isPrivate: boolean;
  isRequested?: boolean;
  posts: number;
  followers: number;
  following: number;
}

export interface IPost {
  _id: string;
  images: IIamge[];
  caption: string;
  isLiked: boolean;
  isBookmarked: boolean;
  like: number;
  user: IUser;
  location?: string;
}

export interface IChat {
  _id: string;
  friend: IUser;
  lastMessage: IMessage;
  selectedChat: boolean;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: IIamge;
  members?: IUser[];
}

export interface IMessage {
  _id: string;
  text: string;
  messageType: string;
  attachments: any[];
  to: string;
  from: string;
  chat: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  error?: boolean;
  isLoading?: boolean;
  tempId?: string;
}

export interface MessagesRootObject {
  isSuccess: boolean;
  messages: IMessage[];
  pagination: Pagination;
}

export interface Pagination {
  itemCount: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  pageCounter: number;
  hasPrev: boolean;
  hasNext: boolean;
  prev?: any;
  next?: any;
}
