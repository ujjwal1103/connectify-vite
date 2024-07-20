import { useDispatch } from "react-redux";
import { reset as resetFeed } from "../redux/services/feedSlice";
import { reset as resetChat } from "../redux/services/chatSlice";
import { reset as resetNotification } from "../redux/services/notificationSlice";
import { reset as resetPosts } from "../redux/services/postSlice";
import { reset as resetProfile } from "../redux/services/profileSlice";
import { reset as resetStory } from "../redux/services/storySlice";
import suggetionSlice from "../redux/services/suggetionSlice";

const useResetStore = () => {
  const dispatch = useDispatch();
  const resetSuggetion = suggetionSlice.actions.reset;

  const reset = (): void => {
    dispatch(resetFeed());
    dispatch(resetChat());
    dispatch(resetNotification());
    dispatch(resetPosts());
    dispatch(resetProfile());
    dispatch(resetStory());
    dispatch(resetSuggetion());
  };

  return reset;
};

export default useResetStore;
