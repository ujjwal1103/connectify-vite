import { create } from 'zustand'

type NewMessageStore = {
  scrollToBottom: boolean
  setScrollToBottom: (state: boolean) => void
}

const useNewMessages = create<NewMessageStore>((set) => ({
  scrollToBottom: false, 
  setScrollToBottom: (scrollToBottom) => set({ scrollToBottom }), 
}))

export default useNewMessages
