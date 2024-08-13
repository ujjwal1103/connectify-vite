import { createSlice } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { IChat, IMessage } from '@/lib/types'

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
}

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
          console.log('found')
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
    setGroupName: (state, action) => {
      const { chatId, newGroupName } = action.payload
      const chatIndex = state.chats.findIndex((c) => c._id === chatId)
      if (chatIndex !== -1) {
        state.chats[chatIndex].groupName = newGroupName
        state.selectedChat!.groupName = newGroupName
      }
    },
    reorderChat: (state, action) => {
      const chatId = action.payload
      // Find the index of the chat with the specified chatId
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId)
      if (chatIndex > 0) {
        // Remove the chat from its current position
        const [chat] = state.chats.splice(chatIndex, 1)
        // Add the chat to the beginning of the array
        state.chats.unshift(chat)
      }
      // If chatIndex is 0 or chatId not found, do nothing
    },

    reset: () => initialState,
  },
})

export const {
  setChats,
  setSelectedChat,
  setMessages,
  addChat,
  setMessageChatId,
  reset,
  setSelectedMessage,
  setIsSelectMessages,
  resetSelectedMessages,
  removeChat,
  reorderChat,
} = chatSlice.actions

const useChatSlice = () => {
  const dispatch = useDispatch()

  const chat = useSelector((state: RootState) => state.chat)
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

  const setSelectedChat = useCallback(
    (chat: any) => {
      dispatch(actions.setSelectedChat(chat))
    },
    [dispatch]
  )

  const removeChat = useCallback(
    (chat: any) => {
      dispatch(actions.removeChat(chat))
    },
    [dispatch]
  )

  const setIsSelectMessages = useCallback(
    (isSelectedMessage: any) => {
      dispatch(actions.setIsSelectMessages(isSelectedMessage))
    },
    [dispatch]
  )

  const setSelectedMessage = useCallback((messageId: string) => {
    dispatch(actions.setSelectedMessage(messageId))
  }, [])

  const resetSelectedMessages = useCallback(() => {
    dispatch(actions.resetSelectedMessages())
  }, [dispatch])

  const setIsLoadingMessage = useCallback(
    (loading: boolean) => {
      dispatch(actions.setIsLoadingMessage(loading))
    },
    [dispatch]
  )

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

  const setGroupName = useCallback((payload: any) => {
    dispatch(actions.setGroupName(payload))
  }, [])

  return {
    ...chat,
    setChats,
    setSelectedChat,
    removeChat,
    setGroupName,
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
  }
}

export { useChatSlice }

export default chatSlice.reducer
