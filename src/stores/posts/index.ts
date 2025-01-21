import { devtools } from 'zustand/middleware'
import { PostState, PostActions } from './types'
import { deduplicatePosts } from './helper'
import { create } from 'zustand'
import { getSelfPosts, getUserPosts } from '@/api'

const usePostStore = create<PostState & PostActions>()(
  devtools((set, get) => ({
    // Initial State
    post: {},
    posts: [],
    loadingPost: true,
    error: null,
    hasNext: false,
    page: 1,
    uploadingPost: { isUploading: false, post: null },
    // Actions
    fetchSelfPosts: async () => {
      const { page } = get()
      try {
        if (page === 1) {
          set({ loadingPost: true, error: null })
        }
        const res = await getSelfPosts(page)
        const { posts: newPosts, pagination } = res
        set((state) => ({
          posts: page === 1 ? newPosts : [...state.posts, ...newPosts],
          loadingPost: false,
          hasNext: pagination.hasNext,
        }))
      } catch (error: any) {
        set({
          error: error.message || 'Failed to fetch posts',
          loadingPost: false,
        })
      }
    },
    fetchUserPosts: async (userId: string) => {
      const { page } = get()
      try {
        set({ loadingPost: true, error: null })
        const res = await getUserPosts(page, userId)
        const { posts: newPosts, pagination } = res
        set((state) => ({
          posts: page === 1 ? newPosts : [...state.posts, ...newPosts],
          loadingPost: false,
          hasNext: pagination.hasNext,
        }))
      } catch (error: any) {
        set({
          error: error.message || 'Failed to fetch posts',
          loadingPost: false,
        })
      }
    },

    setPosts: ({ data, pagination }) => {
      set((state) => {
        const uniqueNewPosts = deduplicatePosts(data, state.posts)
        const posts =
          state.page === 1
            ? uniqueNewPosts
            : [...state.posts, ...uniqueNewPosts]
        return {
          posts,
          loadingPost: false,
          error: null,
          hasNext: pagination.hasNext,
        }
      })
    },
    addPost: (post) => {
      set((state) => {
        console.log(post)
        return {
          posts: [post, ...state.posts],
          loadingPost: false,
        }
      })
    },
    setError: (error) => set({ error, loadingPost: false }),
    setPost: (post) => set({ post }),
    setLoading: (loading) => set({ loadingPost: loading }),
    deletePost: (postId) => {
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }))
    },
    setPage: (page) => set({ page }),
    setHasNext: (hasNext) => set({ hasNext }),
    updateLike: (postId, like) => {
      set((state) => {
        const posts = state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: like,
                like: like ? post.like + 1 : post.like - 1,
              }
            : post
        )
        return { posts }
      })
    },
    updatePost: (updatedPost) => {
      set((state) => {
        const posts = state.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
        return { posts }
      })
    },
    setUploadingPost: (data) => set({ uploadingPost: data }),
    reset: () =>
      set({
        post: {},
        posts: [],
        loadingPost: true,
        error: null,
        hasNext: false,
        page: 1,
        uploadingPost: { isUploading: false, image: null },
        savedPost: [],
      }),
  }))
)

export default usePostStore
