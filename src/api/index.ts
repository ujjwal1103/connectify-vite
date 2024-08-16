import { IMessage, IUser } from '@/lib/types'
import { makeRequest } from '../config/api.config'
import {
  GetFollowRequetsRoot,
  GetNotificationRoot,
} from '@/modules/notifications/types'

const asyncWrap = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('Error:', error)
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

interface RootObject {
  isSuccess: boolean
  chats: any[]
}

// chat apis
const getConversations = async (searchTerm?: string): Promise<RootObject> => {
  let url = '/chats'
  if (searchTerm) {
    url = url + `?search=${searchTerm}`
  }
  return await makeRequest.get(url)
}

const getChatByChatId = async (chatId?: string): Promise<RootObject> => {
  let url = `/chat/${chatId}`
  return await makeRequest.get(url)
}

const deleteConversation = async (chatId: string) => {
  return await makeRequest.delete(`/chat/${chatId}`)
}

//message apis
const getAllMessages = async (chatId: string, page: number): Promise<any> => {
  return await makeRequest.get(`/messages/${chatId}?page=${page}&limit=15`)
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
  let url = `/comments/${postId}`
  if (pcId) {
    url = url + `?parrentCommentId=${pcId}`
  }
  return await makeRequest(url)
}

// post apis

const getPostById = async (postId: string) => {
  return await makeRequest.get(`post/${postId}`)
}

const getAllPost = async (page: number): Promise<any> => {
  return await makeRequest.get(`posts?page=${page}`)
}

const getSelfPosts = async (page: number) => {
  return await makeRequest.get(`posts/user?page=${page}&limit=12`)
}

const getUserPosts = async (page: number, username?: string) => {
  return await makeRequest.get(`posts/${username}?page=${page}&limit=12`)
}

const uploadPosts = async (data: any) => {
  return await makeRequest.postForm('/post', data)
}

const searchUser = async (searchQuery: string): Promise<any> => {
  return await makeRequest<any>(`/users/search?query=${searchQuery}`)
}

const likePost = async (id: string, postUserId: string, commentId?: string) => {
  return makeRequest.post('/like', {
    postId: id,
    postUserId,
    commentId,
  })
}
const createBookmark = async (postId: string) => {
  return makeRequest.post('/bookmark', {
    postId,
  })
}

const deleteBookmark = async (postId: string) => {
  return await makeRequest.delete(`/bookmark?postId=${postId}`)
}

const unLikePost = async (id: string, commentId?: string) => {
  return await makeRequest.delete(`/unLike?postId=${id}&commentId=${commentId}`)
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

const getFollowers = async (page: number, userId: string, query?: string): Promise<any> => {
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

const updateGroupName = asyncWrap(async (chatId: string, name: string) => {
  return await makeRequest.patch(`/chat/${chatId}/groupname`, { name })
})
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

export {
  getRequest,
  getSentRequest,
  makePrivate,
  createGroup,
  updateGroupName,
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
}
