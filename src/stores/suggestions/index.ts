import { create } from 'zustand'
import { IUser } from '@/lib/types'

// Define the state and actions interface
interface SuggestionState {
  suggestedUsers: IUser[]
  loading: boolean
  setSuggestions: (suggestions: IUser[]) => void
  removeSuggestion: (id: string) => void
  reset: () => void
}

// Create the store
const useSuggestionStore = create<SuggestionState>((set) => ({
  suggestedUsers: [],
  loading: true,
  setSuggestions: (suggestions) =>
    set({ suggestedUsers: suggestions, loading: false }),
  removeSuggestion: (id) =>
    set((state) => ({
      suggestedUsers: state.suggestedUsers.filter((user) => user._id !== id),
    })),
  reset: () =>
    set({
      suggestedUsers: [],
      loading: true,
    }),
}))

export default useSuggestionStore
