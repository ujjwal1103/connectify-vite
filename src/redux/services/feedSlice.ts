import { IPost } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'

interface FeedSlice {
  feed: IPost | null
  feeds: IPost[]
  isLoading: boolean
  error: any
  page: number
  hasNextPage: boolean
}

const initialState: FeedSlice = {
  feed: null,
  feeds: [],
  isLoading: true,
  error: null,
  page: 1,
  hasNextPage: true,
}

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeeds: (state, action) => {
      state.isLoading = false
      const newPosts = action.payload.data.filter(
        (post: IPost) => !state.feeds.some((feed) => feed._id === post._id)
      )
      state.feeds = [...state.feeds, ...newPosts]
      state.hasNextPage = action.payload.pagination.hasNext
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    setFeed: (state, action) => {
      state.feed = action.payload
    },
    addAndRemoveBookmark: (state, action) => {
      const { isBookmarked, postId } = action.payload
      const postIndex = state.feeds.findIndex((post) => post._id === postId)
      state.feeds[postIndex].isBookmarked = isBookmarked
    },
    likeUnlikePost: (state, action) => {
      const { isLiked, postId } = action.payload
      const postIndex = state.feeds.findIndex((post) => post._id === postId)
      state.feeds[postIndex].isLiked = isLiked
      const like = state.feeds[postIndex].like
      if (postIndex !== -1) {
        state.feeds[postIndex].like = isLiked ? like + 1 : like - 1
      }
    },
    addNewFeed: (state, action) => {
      state.feeds = [action.payload, ...state.feeds]
    },
    deleteFeed: (state, action) => {
      state.feeds = state.feeds.filter((feed) => feed._id !== action.payload)
    },
    reset: () => initialState,
  },
})

export const { setFeeds, setError, reset, setFeed } = feedSlice.actions

export const useFeedSlice = () => {
  const dispatch = useDispatch()
  const feed = useSelector((state: RootState) => state.feed)
  const actions = feedSlice.actions

  const setFeeds = useCallback(
    (data: IPost[]) => {
      dispatch(actions.setFeeds(data))
    },
    [dispatch]
  )

  const setPage = useCallback(
    (page: number) => {
      dispatch(actions.setPage(page))
    },
    [dispatch]
  )

  const setError = useCallback(
    (error: any) => {
      dispatch(actions.setError(error))
    },
    [dispatch]
  )

  const addAndRemoveBookmark = useCallback(
    (isBookmarked: boolean, postId: string) => {
      dispatch(actions.addAndRemoveBookmark({ isBookmarked, postId }))
    },
    [dispatch]
  )

  const likeUnlikePost = useCallback(
    (isLiked: boolean, postId: string) => {
      dispatch(actions.likeUnlikePost({ isLiked, postId }))
    },
    [dispatch]
  )
  const addNewFeed = useCallback(
    (post: IPost) => {
      dispatch(actions.addNewFeed(post))
    },
    [dispatch]
  )
  const deleteFeed = useCallback(
    (postId: string) => {
      dispatch(actions.deleteFeed(postId))
    },
    [dispatch]
  )

  return {
    ...feed,
    setFeeds,
    setPage,
    setError,
    addAndRemoveBookmark,
    likeUnlikePost,
    addNewFeed,
    deleteFeed
  }
}

export default feedSlice
