

const Reels = () => {
  // const [currentStoryIndex, setCurrentStoryIndex] = useState({
  //   userIndex: 0,
  //   storyIndex: 0,
  // })
  // const [timer, setTimer] = useState(30) // initial timer for each story
  // const [isTimerActive, setIsTimerActive] = useState(true) // to track if the timer is active

  // const users = [
  //   {
  //     _id: '66cdaa9862f93e9892a29238',
  //     user: {
  //       _id: '663e258f698a22532ae6aa4c',
  //       username: 'deepika_padukone',
  //       avatar: {
  //         url: 'http://res.cloudinary.com/dtzyaxndt/image/upload/v1723615080/663e258f698a22532ae6aa4c/profilePictures/446198949_1954752134978800_6522533721911033648_n_p0murd.jpg',
  //       },
  //     },
  //     stories: [
  //       {
  //         _id: '6714f2ddbb27762384996b7e',
  //         content: {
  //           url: 'https://res.cloudinary.com/dtzyaxndt/image/upload/v1729426158/663e258f698a22532ae6aa4c/stories/663e258f698a22532ae6aa4c_fmw3ex.png',
  //         },
  //         timer: 10,
  //       },
  //     ],
  //   },
  //   {
  //     _id: '6714f480bb27762384996ba5',
  //     user: {
  //       _id: '663c5a5fd4d2496be9c558c5',
  //       username: 'shubman_gill',
  //       avatar: {
  //         url: 'http://res.cloudinary.com/dtzyaxndt/image/upload/v1723979476/663c5a5fd4d2496be9c558c5/profilePictures/352812.10_rfrkdh.webp',
  //       },
  //     },
  //     stories: [
  //       {
  //         _id: '6714f480bb27762384996ba1',
  //         content: {
  //           url: 'https://res.cloudinary.com/dtzyaxndt/image/upload/v1729426577/663c5a5fd4d2496be9c558c5/stories/663c5a5fd4d2496be9c558c5_bgu5sl.png',
  //         },
  //         timer: 10,
  //       },
  //       {
  //         _id: '67150139bb27762384996bc0',
  //         content: {
  //           url: 'https://res.cloudinary.com/dtzyaxndt/image/upload/v1729429834/663c5a5fd4d2496be9c558c5/stories/663c5a5fd4d2496be9c558c5_lzgsxx.png',
  //         },
  //         timer: 10,
  //       },
  //     ],
  //   },
  // ]

  // useEffect(() => {
  //   let interval

  //   if (isTimerActive) {
  //     const currentStoryTimer =
  //       users[currentStoryIndex.userIndex]?.stories[
  //         currentStoryIndex.storyIndex
  //       ]?.timer || 10 // default to 10 seconds

  //     setTimer(currentStoryTimer)

  //     interval = setInterval(() => {
  //       setTimer((prevTimer) => {
  //         if (prevTimer <= 1) {
  //           handleRightClick()
  //           return currentStoryTimer
  //         }
  //         return prevTimer - 1
  //       })
  //     }, 1000)
  //   }

  //   return () => clearInterval(interval) // Clear the interval on unmount
  // }, [currentStoryIndex, isTimerActive])

  // const handleUserClick = (index) => {
  //   setCurrentStoryIndex({
  //     userIndex: index,
  //     storyIndex: 0, // Reset to first story when user is clicked
  //   })
  //   setIsTimerActive(true) // Restart the timer when a new user is selected
  // }

  // const handleLeftClick = () => {
  //   if (currentStoryIndex.storyIndex === 0) {
  //     if (currentStoryIndex.userIndex > 0) {
  //       setCurrentStoryIndex((prev) => ({
  //         userIndex: prev.userIndex - 1,
  //         storyIndex: users[prev.userIndex - 1]?.stories.length - 1,
  //       }))
  //     }
  //   } else {
  //     setCurrentStoryIndex((prev) => ({
  //       ...prev,
  //       storyIndex: prev.storyIndex - 1,
  //     }))
  //   }
  //   setIsTimerActive(true) // Restart the timer when clicking left
  // }

  // const handleRightClick = () => {
  //   const currentUserStories = users[currentStoryIndex.userIndex]?.stories || []

  //   if (currentStoryIndex.storyIndex === currentUserStories.length - 1) {
  //     if (currentStoryIndex.userIndex < users.length - 1) {
  //       setCurrentStoryIndex((prev) => ({
  //         userIndex: prev.userIndex + 1,
  //         storyIndex: 0,
  //       }))
  //     } else {
  //       // End of all stories
  //       setIsTimerActive(false) // Stop the timer when the last story is reached
  //     }
  //   } else {
  //     setCurrentStoryIndex((prev) => ({
  //       ...prev,
  //       storyIndex: prev.storyIndex + 1,
  //     }))
  //   }
  // }

  // const calculateProgressWidth = (storyTimer, timer) => {
  //   return `${((storyTimer - timer) / storyTimer) * 100}%`
  // }

  return (
    <div className="flex h-dvh flex-col items-center justify-center overflow-scroll">
      {/* <div className="flex gap-3">
        {users.map((user, index) => (
          <div key={user._id} onClick={() => handleUserClick(index)}>
            <Avatar src={user.user.avatar.url} className="h-14 w-14" />
          </div>
        ))}
      </div>

      <div className="relative h-96 w-52">
        <img
          src={
            users[currentStoryIndex.userIndex]?.stories[
              currentStoryIndex.storyIndex
            ]?.content.url
          }
          className="h-96 w-52"
          alt="story"
        />

        <div className="w-full bg-red-900">
          {/* Instagram-like Progress Loaders */}
          {/* <div className="mb-2 flex space-x-1 p-2">
            {users[currentStoryIndex.userIndex]?.stories.map((story, index) => (
             <div className='w-full bg-gray-800'>
               <div
                key={story._id}
                className="relative h-1 w-full bg-gray-300"
                style={{
                  transition: 'width 1s linear',
                  width:
                    index === currentStoryIndex.storyIndex
                      ? calculateProgressWidth(story.timer, timer)
                      : '100%',
                  background:
                    index === currentStoryIndex.storyIndex
                      ? `linear-gradient(to right, #fff ${calculateProgressWidth(
                          story.timer,
                          timer
                        )}, transparent ${calculateProgressWidth(
                          story.timer,
                          timer
                        )})`
                      : '#fff',
                }}
              />
             </div>
            ))}
          </div>

          {/* Left and Right click areas */}
          {/* <div className="absolute top-0 flex h-full w-full">
            <div
              className="h-full w-1/2 bg-transparent"
              onClick={handleLeftClick}
            ></div>
            <div
              className="h-full w-1/2 bg-transparent"
              onClick={handleRightClick}
            ></div>
          </div> */}

          {/* Timer Display */}
          {/* {isTimerActive && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center text-white">
              <p>{timer}s</p>
            </div>
          )} */}
        {/* </div> 
      // </div> 

      // {!isTimerActive && (
      //   <div className="mt-4 text-center text-white">
      //     <p>All stories have been viewed!</p>
      //   </div>
      // )} */}
    </div>
  )
}

export default Reels
