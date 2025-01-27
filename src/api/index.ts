import { IChat, IMessage, IPost, IUser, Pagination } from '@/lib/types'
import { makeRequest } from '../config/api.config'
import {
  GetFollowRequetsRoot,
  GetNotificationRoot,
} from '@/modules/notifications/types'
import { toast } from 'react-toastify'

const asyncWrap = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went Wrong')
      throw error
    }
  }) as T
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  isSuccess: boolean
  user: IUser
}

const loginWithEmailAndPassword = async (data: {
  username: string
  password: string
}): Promise<LoginResponse> => {
  return await makeRequest.post('/login', data)
}

const registerWithEmailAndPassword = async (data: any) => {
  return await makeRequest.post('/register', data)
}

const registerWithGoogle = async (data: any): Promise<LoginResponse> => {
  return await makeRequest.post('/register?provider=GOOGLE', data)
}

interface GETCURRENTUSER {
  isSuccess: boolean
  user: IUser
}

const getCurrentUser = asyncWrap(async (): Promise<GETCURRENTUSER> => {
  return await makeRequest.get('/user')
})

const getUserByUsername = async (username: string) => {
  return await makeRequest.get(`/user/${username}`)
}

const getUsersSuggetions = async (page = 1, limit?: number): Promise<any> => {
  return await makeRequest.get(`/users?page=${page}&limit=${limit}`)
}

const updateUserAvatar = async (formData: FormData): Promise<any> => {
  return await makeRequest.patchForm('/avatar', formData)
}

const removeUserAvatar = async (): Promise<any> => {
  return await makeRequest.delete('/avatar')
}

const followUsers = async (userId: string): Promise<any> => {
  return await makeRequest.post(`/follow/${userId}`)
}
const unFollowUsers = async (userId: string): Promise<any> => {
  return await makeRequest.delete(`/unfollow/${userId}`)
}

const sentFriendRequest = async (userId: string): Promise<any> => {
  return await makeRequest.post(`/followRequest/${userId}`)
}

const cancelFollowRequest = async (userId: string): Promise<any> => {
  return await makeRequest.delete(`/cancelFollow/${userId}`)
}

export interface ConverstionsReponse {
  isSuccess: boolean
  chats: IChat[]
  pagination: Pagination
}
export interface ConverstionReponse {
  isSuccess: boolean
  chat: IChat
  pagination: Pagination
}

// chat apis
const getConversations = async (
  page: number,
  searchTerm?: string
): Promise<ConverstionsReponse> => {
  let url = `/chats?page=${page}&limit=20`
  if (searchTerm) {
    url = url + `&search=${searchTerm}`
  }
  return await makeRequest.get(url)
}

const getChatByChatId = async (chatId?: string): Promise<ConverstionReponse> => {
  let url = `/chat/${chatId}`
  return await makeRequest.get(url)
}

const deleteConversation = async (chatId: string) => {
  return await makeRequest.delete(`/chat/${chatId}`)
}

//message apis
const getAllMessages = async (chatId: string, page: number): Promise<any> => {
  return await makeRequest.get(`/messages/${chatId}?page=${page}&limit=25`)
}

export const clearAllMessages = async (chatId: string): Promise<any> => {
  return await makeRequest.delete(`/messages/${chatId}`)
}

export const seenMessages = async (data: {
  messageId: string
  chatId: string
  members: string[]
}) => {
  return await makeRequest.put(`/message/seen/${data.messageId}`, data)
}
export const editMessage = async (data: {
  messageId: string
  chatId: string
  text: string
  members: string[]
}) => {
  return await makeRequest.put(`/message/${data.messageId}`, data)
}

const sendMessage = async (
  chatId: string,
  message: {
    text: string
    messageType: string
    to: string
  }
): Promise<{
  isSuccess: boolean
  chat: string
  message: IMessage
}> => {
  return await makeRequest.post(`/message/${chatId}`, message)
}
const sendAttachmentMessage = async (
  chatId: string,
  formData: FormData
): Promise<{
  isSuccess: boolean
  chat: string
  message: IMessage
}> => {
  console.log(formData)
  return await makeRequest.post(`/message/attachments/${chatId}`, formData, {
    headers: {
      Accept: 'multipart/form-data',
    },
  })
}

const markMessageAsSeen = async (messageId: string) => {
  return await makeRequest.put(`/message/seen/${messageId}`)
}

const deleteMessages = async (chatId: string) => {
  return await makeRequest.delete(`/messages/${chatId}`)
}

const deleteMessagesByIds = async (selectedMessages: string[]): Promise<any> =>
  makeRequest.delete('/messages', {
    data: selectedMessages,
  })

// comments apis

const getCommentsByPostId = async (postId: string, pcId?: string) => {
  if (!postId) return
  let url = `/comments/${postId}`
  if (pcId) {
    url = url + `?parrentCommentId=${pcId}`
  }
  return await makeRequest(url)
}

// post apis

const getPostById = async (
  postId: string
): Promise<{ isSuccess: boolean; post: IPost }> => {
  return await makeRequest.get(`post/${postId}`)
}

const getAllPost = async (page: number): Promise<any> => {
  return await makeRequest.get(`posts?page=${page}`)
}

const getSelfPosts = async (page: number): Promise<any> => {
  return await makeRequest.get(`posts/user?page=${page}&limit=12`)
}

const getSelfReels = async (page: number) => {
  return await makeRequest.get(`posts/reels/user?page=${page}&limit=12`)
}

const getUserPosts = async (page: number, username?: string): Promise<any> => {
  return await makeRequest.get(`posts/${username}?page=${page}&limit=12`)
}

const uploadPosts = async (
  formData: FormData
): Promise<{ isSuccess: boolean; post: IPost }> => {
  return await makeRequest.postForm('/post', formData)
}

const searchUser = async (searchQuery: string): Promise<any> => {
  return await makeRequest<any>(`/users/search?query=${searchQuery}`)
}

const likePost = async (
  id?: string,
  postUserId?: string,
  commentId?: string
) => {
  let data = {} as any

  if (id) {
    data.postId = id
  }
  if (postUserId) {
    data.postUserId = postUserId
  }
  if (commentId) {
    data.commentId = commentId
  }
  return makeRequest.post('/like', data)
}
const createBookmark = async (postId: string) => {
  return makeRequest.post('/bookmark', {
    postId,
  })
}

const deleteBookmark = async (postId: string) => {
  return await makeRequest.delete(`/bookmark?postId=${postId}`)
}

const unLikePost = async (id?: string, commentId?: string) => {
  const params = new URLSearchParams()

  if (id) params.append('postId', id)
  if (commentId) params.append('commentId', commentId)

  const url = `/unLike?${params.toString()}`

  return await makeRequest.delete(url)
}

const deleteThisPost = async (postId: string) => {
  return await makeRequest.delete(`post/${postId}`)
}

// get notifications
const getAllNotification = asyncWrap(async (): Promise<GetNotificationRoot> => {
  return await makeRequest.get('notifications')
})

// get all follow request
const getAllFollowRequest = asyncWrap(
  async (): Promise<GetFollowRequetsRoot> => {
    return await makeRequest('/followRequests')
  }
)

const getBookmarks = async (page: number): Promise<any> => {
  return await makeRequest.get(`bookmarks?page=${page}`)
}
const updatePost = async (caption: string, postId: string): Promise<any> => {
  return await makeRequest.patch(`post/${postId}`, { caption, postId })
}

const getFollowers = async (
  page: number,
  userId: string,
  query?: string
): Promise<any> => {
  let url = `/followers/${userId}?page=${page}`
  if (query && query.length > 3) {
    url = url + `&username=${query}`
  }

  return await makeRequest.get(url)
}
const getFollowing = asyncWrap(
  async (page: number, userId: string, query = ''): Promise<any> => {
    let url = `/following/${userId}?page=${page}`
    if (query?.length >= 3) {
      url = url + `&username=${query}`
    }
    return await makeRequest.get(url)
  }
)

const updateUserDetails = async (data: {
  name?: string
  bio?: string
  gender?: string
}) => {
  return await makeRequest.put('/user/edit', data)
}
const deleteNotificationById = async (id: string) => {
  return await makeRequest.delete(`/notification/${id}`)
}

const createNewChat = async (userId: string) => {
  return await makeRequest.post('/chat', { to: userId })
}

const createGroup = asyncWrap(async (formData: FormData) => {
  return await makeRequest.post('/chat/group', formData)
})

const updateGroup = asyncWrap(
  async (
    chatId: string,
    formData: FormData
  ): Promise<{ isSuccess: boolean; chat: IChat }> => {
    return await makeRequest.patchForm(`/chat/${chatId}/group`, formData)
  }
)
const makePrivate = asyncWrap(async (checked: boolean) => {
  return await makeRequest.put(`/user/privateAccount?isPrivate=${!checked}`)
})

export interface SentRequest {
  _id: string
  requestedTo: string
  username: string
  name: string
}

export interface ApiResponse {
  isSuccess: boolean
  sentRequests: SentRequest[]
}

const getSentRequest = asyncWrap(async (): Promise<ApiResponse> => {
  return await makeRequest.get('/sent-requests')
})
const getRequest = asyncWrap(async (userId: string): Promise<ApiResponse> => {
  return await makeRequest.get(`/request/${userId}`)
})

const deleteMessageById = async (id: string) => {
  return await makeRequest.delete(`/message/${id}`)
}

const reactCurrentMessage = async (id: string, reaction: string) => {
  return await makeRequest.put(`/message/react/${id}?react=${reaction}`)
}

const createStory = async (formData: any) => {
  return await makeRequest.postForm('/story', formData)
}
const getAllStories = async () => {
  return await makeRequest.get('/stories')
}

const addGroupMembers = async ({
  chatId,
  newMembers,
}: {
  chatId: string
  newMembers: string[]
}) => {
  return await makeRequest.patch(`/chat/${chatId}/newMembers`, { newMembers })
}

const removeGroupMember = async ({
  chatId,
  memberId,
}: {
  chatId: string
  memberId: string
}) => {
  return await makeRequest.patch(`/chat/${chatId}/removeMember`, { memberId })
}

export {
  addGroupMembers,
  removeGroupMember,
  createStory,
  getAllStories,
  deleteMessageById,
  reactCurrentMessage,
  getRequest,
  getSentRequest,
  makePrivate,
  createGroup,
  updateGroup,
  createNewChat,
  deleteNotificationById,
  updateUserDetails,
  getFollowers,
  getFollowing,
  cancelFollowRequest,
  createBookmark,
  deleteBookmark,
  deleteConversation,
  deleteMessages,
  deleteMessagesByIds,
  deleteThisPost,
  followUsers,
  getAllFollowRequest,
  getAllMessages,
  getAllNotification,
  getAllPost,
  getBookmarks,
  getChatByChatId,
  getCommentsByPostId,
  getConversations,
  getCurrentUser,
  getPostById,
  getSelfPosts,
  getUserByUsername,
  getUserPosts,
  getUsersSuggetions,
  likePost,
  loginWithEmailAndPassword,
  markMessageAsSeen,
  registerWithEmailAndPassword,
  removeUserAvatar,
  searchUser,
  sendAttachmentMessage,
  sendMessage,
  sentFriendRequest,
  unFollowUsers,
  unLikePost,
  updatePost,
  updateUserAvatar,
  uploadPosts,
  getSelfReels,
  registerWithGoogle,
}
