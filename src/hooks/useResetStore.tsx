import { useDispatch } from 'react-redux'
import { reset as resetChat } from '../redux/services/chatSlice'
import { reset as resetNotification } from '../redux/services/notificationSlice'
import { reset as resetPosts } from '../redux/services/postSlice'
import { reset as resetProfile } from '../redux/services/profileSlice'
import { reset as resetStory } from '../redux/services/storySlice'
import useSuggestionStore from '@/stores/suggestions'
import useFeedStore from '@/stores/Feeds'

const useResetStore = () => {
  const dispatch = useDispatch()
  const { reset: resetSuggestions } = useSuggestionStore()
  const { reset: resetFeedStore } = useFeedStore()

  const reset = (): void => {
    resetFeedStore()
    dispatch(resetChat())
    dispatch(resetNotification())
    dispatch(resetPosts())
    dispatch(resetProfile())
    dispatch(resetStory())
    resetSuggestions()
  }

  return reset
}

export default useResetStore
