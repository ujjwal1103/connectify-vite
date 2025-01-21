import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { useCallback } from 'react'

interface PositionTypes {
  left: number | string
  right: number | string
  top: number | string
  bottom: number | string
}

interface ModalStateSlice {
  searchSheet: boolean
  moreOptions: boolean
  notiSheet: boolean
  openPostModal: boolean
  mobileDrawer: boolean
  newStory: boolean
  newPost: boolean
  postMenuPosition: PositionTypes
}

const initialState: ModalStateSlice = {
  searchSheet: false,
  moreOptions: false,
  notiSheet: false,
  openPostModal: false,
  mobileDrawer: false,
  newStory: false,
  newPost: false,
  postMenuPosition: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}

const modalStateSlice = createSlice({
  name: 'modalStates',
  initialState,
  reducers: {
    setModalState: (state: any, action: PayloadAction<string>) => {
      const name = action.payload
      state[name] = !state[name]
    },
    setPosition: (state, action) => {
      state.postMenuPosition = action.payload
    },
    resetModalState: () => {
      return initialState
    },
  },
})

export type ModalStateNames =
  | 'searchSheet'
  | 'moreOptions'
  | 'notiSheet'
  | 'openPostModal'
  | 'mobileDrawer'
  | 'newStory'
  | 'newPost'

export const useModalStateSlice = () => {
  const state = useSelector((state: RootState) => state.modalStates)
  const dispatch = useDispatch()
  const actions = modalStateSlice.actions

  const setModalState = useCallback((name: ModalStateNames) => {
    dispatch(actions.setModalState(name))
  }, [])
  const resetModalState = useCallback(() => {
    dispatch(actions.resetModalState())
  }, [])

  const setPostion = useCallback((position: PositionTypes) => {
    dispatch(actions.setPosition(position))
  }, [])

  return { ...state, setModalState, resetModalState, setPostion }
}

export default modalStateSlice
