import { IChat } from '@/lib/types'
import { create } from 'zustand'

type ChatStore = {
  chats: IChat[]
  isLoading: boolean
  hasNext: boolean
  page: number
  allowSelection: boolean
  selectedChats: string[]
  setChats: (data: { chats: IChat[]; hasNext: boolean }) => void
  setPage: (page: number) => void
  setAllowSelection: (allowSelection: boolean) => void
  selectChat: (id: string) => void
  removeSelection: (id: string) => void
  resetSelectedChats: () => void
}

const initailState = {
  chats: [],
  isLoading: false,
  hasNext: true,
  page: 1,
  allowSelection: false,
  selectedChats: [],
}

export const useChatStore = create<ChatStore>((set) => ({
  ...initailState,

  setChats: ({ chats, hasNext }) => {
    set((state) => {
      const existingIds = new Set(state.chats.map((feed) => feed._id))
      const newPosts = chats.filter((chat) => !existingIds.has(chat._id))
      return {
        chats: [...state.chats, ...newPosts],
        isLoading: false,
        hasNext: hasNext,
      }
    })
  },

  setPage: (page: number) => {
    set({ page })
  },

  setAllowSelection: (allowSelection: boolean) => {
    set({ allowSelection })
  },

  selectChat: (id: string) => {
    set((state) => ({ selectedChats: [...state.selectedChats, id] }))
  },
  removeSelection: (id: string) => {
    console.log(id)
    set((state) => ({
      selectedChats: state.selectedChats.filter((chatId) => chatId !== id),
    }))
  },
  resetSelectedChats: () => set({ selectedChats: [] }),
}))
