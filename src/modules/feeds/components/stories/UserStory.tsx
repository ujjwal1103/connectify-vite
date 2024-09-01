import { memo } from 'react'
import MyStories from 'react-insta-stories'

const UserStory = ({ stories = [], onClose }: any) => {
  return (
    <MyStories
      stories={stories}
      defaultInterval={1500}
      onAllStoriesEnd={() => {
        onClose()
      }}
    />
  )
}

export default memo(UserStory)
