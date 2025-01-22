import { IPost } from '@/lib/types'
import { create } from 'zustand'

interface FeedState {
  feed: IPost | null
  feeds: IPost[]
  isLoading: boolean
  error: any
  page: number
  hasNextPage: boolean

  // Actions
  setFeeds: (data: { data: IPost[]; pagination: { hasNext: boolean } }) => void
  setPage: (page: number) => void
  setError: (error: any) => void
  setFeed: (feed: IPost) => void
  addAndRemoveBookmark: (isBookmarked: boolean, postId: string) => void
  likeUnlikePost: (isLiked: boolean, postId: string) => void
  addNewFeed: (post: IPost) => void
  deleteFeed: (postId: string) => void
  reset: () => void
}

const initialState = {
  feed: null,
  feeds: [],
  isLoading: true,
  error: null,
  page: 1,
  hasNextPage: true,
}

const useFeedStore = create<FeedState>((set) => ({
  // Initial State
  ...initialState,
  // Actions
  setFeeds: ({ data, pagination }) => {
    set((state) => {
      const existingIds = new Set(state.feeds.map((feed) => feed._id))
      const newPosts = data.filter((post) => !existingIds.has(post._id))
      return {
        feeds: [...state.feeds, ...newPosts],
        isLoading: false,
        hasNextPage: pagination.hasNext,
      }
    })
  },

  setPage: (page) => set(() => ({ page })),

  setError: (error) => set(() => ({ isLoading: false, error })),

  setFeed: (feed) => set(() => ({ feed })),

  addAndRemoveBookmark: (isBookmarked, postId) => {
    set((state) => {
      const updatedFeeds = state.feeds.map((post) =>
        post._id === postId ? { ...post, isBookmarked } : post
      )
      return { feeds: updatedFeeds }
    })
  },

  likeUnlikePost: (isLiked, postId) => {
    set((state) => {
      const updatedFeeds = state.feeds.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked,
              like: isLiked ? post.like + 1 : post.like - 1,
            }
          : post
      )
      return { feeds: updatedFeeds }
    })
  },

  addNewFeed: (post) => {
    set((state) => ({ feeds: [post, ...state.feeds] }))
  },

  deleteFeed: (postId) => {
    set((state) => ({
      feeds: state.feeds.filter((feed) => feed._id !== postId),
    }))
  },

  reset: () => set(() => initialState), // Add a reset function
}))

export default useFeedStore
