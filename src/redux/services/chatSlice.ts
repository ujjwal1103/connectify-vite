import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { IChat, IMember, IMessage, IUser } from '@/lib/types'

interface IReply {
  messageId: string
  sender: string
  message: IMessage
}

interface IChatSlice {
  chats: IChat[]
  selectedChat: IChat | null
  error: any
  isLoading: boolean
  messages: IMessage[]
  messageChatId: string
  selectedMessages: string[]
  isSelectMessages: boolean
  isLoadingMessages: boolean
  messagePage: number
  hasNextMessage: boolean
  selectChats: boolean
  selectedChats: string[]
  currentMessageReply?: IReply | null
  editMessage: IMessage | null
  showChatInfo: InfoType
  isAddingContent: boolean
}

type InfoType = 'Search' | 'Message Info' | 'Chat Info' | null

const initialState: IChatSlice = {
  chats: [],
  selectedChat: null,
  error: null,
  isLoading: true,
  messages: [],
  messageChatId: '',
  selectedMessages: [],
  isSelectMessages: false,
  isLoadingMessages: false,
  messagePage: 1,
  hasNextMessage: true,
  selectChats: false,
  selectedChats: [],
  currentMessageReply: null,
  editMessage: null,
  showChatInfo: null,
  isAddingContent: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload
      state.error = ''
      state.isLoading = false
    },
    setSelectedChat: (state, action) => {
      state.messages = []
      state.selectedChat = action.payload
      let chatIndex = state.chats.findIndex((c) => c._id === action.payload._id)
      if (chatIndex === -1) return
      let chat = state.chats[chatIndex]
      chat.unseenMessagesCount = 0
    },
    setSelectChats: (state, action) => {
      state.selectChats = action.payload
    },
    setSelectedChats: (state, action) => {
      if (state.selectedChats.find((c) => c === action.payload)) {
        state.selectedChats = state.selectedChats.filter(
          (c) => c != action.payload
        )
      } else {
        state.selectedChats.push(action.payload)
      }
    },
    setChatToFirst: (state, action) => {
      let chatIndex = state.chats.findIndex(
        (c) => c._id === action.payload.message.chat
      )

      if (chatIndex === -1) return

      let chat = state.chats[chatIndex]
      let message = action.payload.message as IMessage

      chat.lastMessage = message

      if (action.payload.shouldSetUnseenMessageCount) {
        chat.unseenMessagesCount = (chat.unseenMessagesCount || 0) + 1
      }

      state.chats.splice(chatIndex, 1)
      state.chats.unshift(chat)
    },
    resetSelectedChats: (state) => {
      state.selectedChats = []
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    setIsLoadingMessage: (state, action) => {
      state.isLoadingMessages = action.payload
    },
    setHasNextMessage: (state, action) => {
      state.hasNextMessage = action.payload
    },
    setMessagePage: (state, action) => {
      state.messagePage = action.payload
    },
    addChat: (state, action) => {
      const chatIndex = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      )
      if (chatIndex === -1) {
        state.chats = [action.payload, ...state.chats]
      }
      state.selectedChat = action.payload
    },
    addMessage: (state, action) => {
      const message = action.payload
      if (!message._id) {
        const tempMessage: any = {
          ...message,
          isLoading: true,
        }
        state.messages.push(tempMessage)
      } else {
        const index = state.messages.findIndex(
          (m) => m.tempId === message.tempId
        )
        if (index !== -1) {
          state.messages[index] = message
        }
      }
    },
    addMessageFromSocket: (state, action) => {
      const message = action.payload
      if (message._id) {
        state.messages.push(message)
      }
    },
    setMessageChatId: (state, action) => {
      state.messageChatId = action.payload
    },
    setSelectedMessage: (state, action) => {
      if (state.selectedMessages.some((m) => m === action.payload)) {
        state.selectedMessages = state.selectedMessages.filter(
          (id) => id !== action.payload
        )
      } else {
        state.selectedMessages.push(action.payload)
      }
    },
    resetSelectedMessages: (state) => {
      state.selectedMessages = []
    },
    setIsSelectMessages: (state, action) => {
      state.isSelectMessages = action.payload
      if (!action.payload) state.selectedMessages = []
    },
    removeChat: (state, action) => {
      state.chats = state.chats.filter((chat) => chat._id !== action.payload)
    },
    deleteMessagesByIds: (state, action) => {
      const deletedMessageIds = action.payload
      state.messages = state.messages.filter(
        (message) => !deletedMessageIds.includes(message._id)
      )
      state.selectedMessages = []
      state.isSelectMessages = false
    },
    updateGroupInfo: (state, action) => {
      const { chatId, groupName, groupAvatar } = action.payload
      const chatIndex = state.chats.findIndex((c) => c._id === chatId)
      if (chatIndex !== -1) {
        if (groupAvatar) {
          state.chats[chatIndex].groupAvatar = groupAvatar
          state.selectedChat!.groupAvatar = groupAvatar
        }
        if (groupName) {
          state.chats[chatIndex].groupName = groupName
          state.selectedChat!.groupName = groupName
        }
      }
    },
    reorderChat: (state, action) => {
      const chatId = action.payload
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId)
      if (chatIndex > 0) {
        const [chat] = state.chats.splice(chatIndex, 1)
        state.chats.unshift(chat)
      }
    },
    reactMessage: (state, action) => {
      const message = state.messages.findIndex(
        (msg) => msg._id === action.payload.messageId
      )
      state.messages[message] = {
        ...state.messages[message],
        reaction: action.payload.emoji,
      }
    },
    seenMessage: (state, action) => {
      const message = state.messages.findIndex(
        (msg) => msg._id === action.payload
      )
      state.messages[message] = {
        ...state.messages[message],
        seen: true,
      }
    },
    markAllMessagesAsSeen: (state) => {
      state.messages = state.messages.map((message) => ({
        ...message,
        seen: true,
      }))
    },
    setCurrentMessageReply: (state, action) => {
      if (action.payload) {
        state.currentMessageReply = {
          messageId: action.payload.messageId,
          sender: action.payload.sender,
          message: action.payload.message,
        }
      } else {
        state.currentMessageReply = null
      }
    },
    setEditMessage: (state, action) => {
      state.editMessage = action.payload
    },
    editMessageById: (state, action) => {
      const message = state.messages.findIndex(
        (message) => message._id === action.payload.messageId
      )
      state.messages[message].text = action.payload.text
      state.messages[message].isEdited = true
    },

    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload
      )
    },
    toggleChatInfo: (state, action) => {
      state.showChatInfo = typeof state.showChatInfo ? null : action.payload
    },
    closeShowChat: (state) => {
      state.showChatInfo = null
    },
    addNewMembers: (state, action) => {
      const newMembers = action.payload
      const members = newMembers.map((m: IUser) => ({ ...m, role: 'member' }))
      if (state.selectedChat) {
        state.selectedChat = {
          ...state.selectedChat,
          members: [...(state.selectedChat.members || []), ...members],
        }
      }
    },
    removeMembers: (state, action: PayloadAction<IUser[]>) => {
      const membersToRemove = action.payload // Array of members to remove
      if (state.selectedChat) {
        state.selectedChat = {
          ...state.selectedChat,
          members:
            state.selectedChat.members?.filter(
              (member) =>
                !membersToRemove.some((m: IUser) => m._id === member._id)
            ) || [],
        }
      }
    },
    removeMember: (state, action) => {
      const memberToRemove = action.payload
      console.log({ memberToRemove })
      if (state.selectedChat) {
        state.selectedChat = {
          ...state.selectedChat,
          members:
            state.selectedChat.members?.filter(
              (member) => member._id !== memberToRemove._id
            ) || [],
        }
      }
    },
    setIsAddingContent: (state, action) => {
      state.isAddingContent = action.payload
    },
    reset: () => initialState,
  },
})

const actions = chatSlice.actions

export const {
  setChatToFirst,
  setIsAddingContent,
  removeMembers,
  removeMember,
  addNewMembers,
  editMessageById,
  setEditMessage,
  markAllMessagesAsSeen,
  seenMessage,
  removeMessage,
  setCurrentMessageReply,
  setChats,
  reactMessage,
  setSelectedChat,
  removeChat,
  updateGroupInfo,
  setIsSelectMessages,
  resetSelectedMessages,
  setSelectedMessage,
  setMessages,
  setIsLoadingMessage,
  setHasNextMessage,
  setMessagePage,
  addMessage,
  setSelectChats,
  setSelectedChats,
  resetSelectedChats,
  addMessageFromSocket,
  closeShowChat,
  addChat,
  deleteMessagesByIds,
  reorderChat,
  reset,
  setMessageChatId,
  toggleChatInfo,
} = actions

const useChatSlice = () => {
  const dispatch = useDispatch()

  const chat = useSelector((state: RootState) => state.chat, shallowEqual)
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat,
    shallowEqual
  )
  const actions = chatSlice.actions

  const setChats = useCallback(
    (chats: any) => {
      dispatch(actions.setChats(chats))
    },
    [dispatch]
  )

  const setMessages = useCallback(
    (messages: any) => {
      dispatch(actions.setMessages(messages))
    },
    [dispatch]
  )

  const setChat = useCallback(
    (chat: any) => {
      dispatch(actions.addChat(chat))
    },
    [dispatch]
  )

  const setSelectedChat = useCallback((chat: any) => {
    dispatch(actions.setSelectedChat(chat))
  }, [])

  const removeChat = useCallback(
    (chat: any) => {
      dispatch(actions.removeChat(chat))
    },
    [dispatch]
  )

  const setIsSelectMessages = useCallback((isSelectedMessage: any) => {
    dispatch(actions.setIsSelectMessages(isSelectedMessage))
  }, [])

  const setSelectedMessage = useCallback((messageId: string) => {
    dispatch(actions.setSelectedMessage(messageId))
  }, [])

  const resetSelectedMessages = useCallback(() => {
    dispatch(actions.resetSelectedMessages())
  }, [dispatch])

  const setIsLoadingMessage = useCallback((loading: boolean) => {
    dispatch(actions.setIsLoadingMessage(loading))
  }, [])

  const setHasNextMessage = useCallback(
    (hasNext: boolean) => {
      dispatch(actions.setHasNextMessage(hasNext))
    },
    [dispatch]
  )

  const setSelectChats = useCallback(
    (select: boolean) => {
      dispatch(actions.setSelectChats(select))
    },
    [dispatch]
  )

  const setSelectedChats = useCallback(
    (chatId: string) => {
      dispatch(actions.setSelectedChats(chatId))
    },
    [dispatch]
  )

  const resetSelectedChats = useCallback(() => {
    dispatch(actions.resetSelectedChats())
  }, [dispatch])

  const setMessagePage = useCallback(
    (page: number) => {
      dispatch(actions.setMessagePage(page))
    },
    [dispatch]
  )

  const deleteAllMessagesByIds = useCallback(
    (messageIds: string[]) => {
      dispatch(actions.deleteMessagesByIds(messageIds))
    },
    [dispatch]
  )

  const addMessage = useCallback(
    (message: any) => {
      dispatch(actions.addMessage(message))
    },
    [dispatch]
  )
  const addMessageFromSocket = useCallback(
    (message: any) => {
      dispatch(actions.addMessageFromSocket(message))
    },
    [dispatch]
  )

  const updateGroupInfo = useCallback((payload: any) => {
    dispatch(actions.updateGroupInfo(payload))
  }, [])

  const reactMessage = useCallback((payload: any) => {
    dispatch(actions.reactMessage(payload))
  }, [])
  const seenMessage = useCallback((id: string) => {
    dispatch(actions.seenMessage(id))
  }, [])
  const markAllMessagesAsSeen = useCallback(() => {
    dispatch(actions.markAllMessagesAsSeen())
  }, [])
  const setCurrentMessageReply = useCallback((payload: IReply | null) => {
    dispatch(actions.setCurrentMessageReply(payload))
  }, [])
  const removeMessage = useCallback((id: string) => {
    dispatch(actions.removeMessage(id))
  }, [])
  const setChatToFirst = useCallback(
    (payload: { message: IMessage; shouldSetUnseenMessageCount: boolean }) => {
      dispatch(actions.setChatToFirst(payload))
    },
    []
  )
  const setEditMessage = useCallback((payload: IMessage | null) => {
    dispatch(actions.setEditMessage(payload))
  }, [])

  const editMessageById = useCallback(
    (payload: { text: string; messageId: string }) => {
      dispatch(actions.editMessageById(payload))
    },
    []
  )
  const toggleShowChat = useCallback((type: InfoType) => {
    dispatch(actions.toggleChatInfo(type))
  }, [])
  const closeShowChat = useCallback(() => {
    dispatch(actions.closeShowChat())
  }, [])
  const addNewMembers = useCallback((members: IMember[]) => {
    dispatch(actions.addNewMembers(members))
  }, [])
  const removeMembers = useCallback((members: IUser[]) => {
    dispatch(actions.removeMembers(members))
  }, [])
  const removeMember = useCallback((member: IMember) => {
    dispatch(actions.removeMember(member))
  }, [])
  const setIsAddingContent = useCallback((isAdding: boolean) => {
    dispatch(actions.setIsAddingContent(isAdding))
  }, [])

  return {
    ...chat,
    selectedChat,
    setChatToFirst,
    setIsAddingContent,
    removeMembers,
    removeMember,
    addNewMembers,
    editMessageById,
    setEditMessage,
    markAllMessagesAsSeen,
    seenMessage,
    removeMessage,
    setCurrentMessageReply,
    setChats,
    reactMessage,
    setSelectedChat,
    removeChat,
    updateGroupInfo,
    setChat,
    setIsSelectMessages,
    resetSelectedMessages,
    setSelectedMessage,
    setMessages,
    setIsLoadingMessage,
    setHasNextMessage,
    setMessagePage,
    deleteAllMessagesByIds,
    addMessage,
    setSelectChats,
    setSelectedChats,
    resetSelectedChats,
    addMessageFromSocket,
    toggleShowChat,
    closeShowChat,
  }
}

export { useChatSlice }

export const useMessage = () => {
  const dispatch = useDispatch()

  const setIsSelectMessages = (isSelected: boolean) => {
    dispatch(actions.setIsSelectMessages(isSelected))
  }

  const setMessagePage = useCallback(
    (page: number) => {
      dispatch(actions.setMessagePage(page))
    },
    [dispatch]
  )

  const setMessages = useCallback(
    (messages: any) => {
      dispatch(actions.setMessages(messages))
    },
    [dispatch]
  )

  return {
    setIsSelectMessages,
    setMessagePage,
    setMessages,
  }
}

export const useChat = () => {
  const dispatch = useDispatch()
  const chats = useSelector(
    (state: RootState) => state.chat.chats,
    shallowEqual
  )

  const selectChats = useSelector(
    (state: RootState) => state.chat.selectChats,
    shallowEqual
  )
  const selectedChats = useSelector(
    (state: RootState) => state.chat.selectedChats,
    shallowEqual
  )

  const toggleShowChat = useCallback((type: InfoType) => {
    dispatch(actions.toggleChatInfo(type))
  }, [])

  const setChats = useCallback((chats: IChat[]) => {
    dispatch(actions.setChats(chats))
  }, [])

  const setSelectChats = useCallback((isSelected: boolean) => {
    dispatch(actions.setSelectChats(isSelected))
  }, [])

  const resetSelectedChats = useCallback(() => {
    dispatch(actions.resetSelectedChats())
  }, [])

  const setChat = (chat: IChat) => {
    dispatch(actions.addChat(chat))
  }

  const setSelectedChats = useCallback((chatId: string) => {
    dispatch(actions.setSelectedChats(chatId))
  }, [])

  const setSelectedChat = useCallback((chat: any) => {
    dispatch(actions.setSelectedChat(chat))
  }, [])

  const removeChat = useCallback((chat: any) => {
    dispatch(actions.removeChat(chat))
  }, [])

  const setChatToFirst = useCallback(
    (payload: { message: IMessage; shouldSetUnseenMessageCount: boolean }) => {
      dispatch(actions.setChatToFirst(payload))
    },
    []
  )

  return {
    chats,
    selectChats,
    selectedChats,
    toggleShowChat,
    setChats,
    setSelectChats,
    resetSelectedChats,
    setChat,
    setSelectedChats,
    setSelectedChat,
    removeChat,
    setChatToFirst,
  }
}

export default chatSlice.reducer
