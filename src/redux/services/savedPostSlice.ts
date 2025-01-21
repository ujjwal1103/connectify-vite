import { createSlice } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { IBookmark } from '@/interface/interfaces'

interface SavedPostSlice {
  loadingPost: boolean
  error: string | null
  hasNext: boolean
  page: number
  savedPost: IBookmark[]
}

const initialState: SavedPostSlice = {
  loadingPost: true,
  error: null,
  hasNext: false,
  page: 1,
  savedPost: [],
}

const savedPostSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    setSavedPosts: (state, action) => {
      try {
        const { data, pagination } = action.payload
        state.loadingPost = false
        state.error = null
        state.hasNext = pagination?.hasNext

        const uniqueNewPosts = data.filter(
          (newPost: IBookmark) =>
            !state.savedPost.some(
              (existingPost) => existingPost._id === newPost._id
            )
        )
        console.log({ data, uniqueNewPosts })

        if (!uniqueNewPosts.length) return
        const currentPage = state.page
        if (currentPage === 1) {
          state.savedPost = data
          return
        }
        state.savedPost = [...state.savedPost, ...data]
      } catch (error) {
        console.log(error)
      }
    },
    setError: (state, action) => {
      state.loadingPost = false
      state.error = action.payload
    },

    setLoading: (state, action) => {
      state.loadingPost = action.payload
    },
    deletePost: (state, action) => {
      const postId = action.payload
      state.savedPost = state.savedPost.filter((post) => post._id !== postId)
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setHasNext: (state, action) => {
      state.hasNext = action.payload
    },
    reset: () => {
      return initialState
    },
  },
})

export const { setError, deletePost, setPage, setLoading, reset, setHasNext } =
  savedPostSlice.actions

export default savedPostSlice

export const useSavedPostSlice = () => {
  const postState = useSelector((state: RootState) => state.bookmark)
  const dispatch = useDispatch()
  const actions = savedPostSlice.actions

  const setSavedPosts = useCallback(
    (data: any) => {
      dispatch(actions.setSavedPosts(data))
    },
    [dispatch]
  )
  const setPage = useCallback(
    (page: number) => {
      dispatch(actions.setPage(page))
    },
    [dispatch]
  )

  const reset = useCallback(() => {
    dispatch(actions.reset())
  }, [dispatch])

  return {
    ...postState,
    setPage,
    setSavedPosts,
    reset,
  }
}
