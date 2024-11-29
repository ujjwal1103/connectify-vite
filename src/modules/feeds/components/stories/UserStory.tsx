import { memo } from 'react'
import MyStories from 'react-insta-stories'

const UserStory = ({ stories = [], setNextStory }: any) => {
  console.log(stories)

  try {
    return (
      <MyStories
        stories={stories}
        defaultInterval={1500}
        onStoryEnd={(index: number) => {
          if (index === stories.length - 1) {
            setNextStory(index)
          }
        }}
      />
    )
  } catch (error) {
    console.log(error)
    return null
  }
}

export default memo(UserStory)
