import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { useCallback } from 'react'

interface ModalStateSlice {
  searchSheet: boolean
  moreOptions: boolean
  notiSheet: boolean
  openPostModal: boolean
  mobileDrawer: boolean
  newStory: boolean
}

const initialState: ModalStateSlice = {
  searchSheet: false,
  moreOptions: false,
  notiSheet: false,
  openPostModal: false,
  mobileDrawer: false,
  newStory: false
}

const modalStateSlice = createSlice({
  name: 'modalStates',
  initialState,
  reducers: {
    setModalState: (state: any, action: PayloadAction<string>) => {
      const name = action.payload
      state[name] = !state[name]
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

  return { ...state, setModalState, resetModalState }
}

export default modalStateSlice
