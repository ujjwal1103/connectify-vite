import React from 'react'

type Story = {
  id: number
  title: string
}

type UserStories = {
  userName: string
  stories: Story[]
}

const StoryRing: React.FC<{ user: UserStories }> = ({ user }) => {
  const storyCount = 2 // Always 12 segments
  const radius = 48 // Radius of the circle
  const circumference = 2 * Math.PI * radius // Circumference of the circle

  console.log(circumference / storyCount)

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      {/* SVG Ring */}
      <svg className="absolute" width="100" height="100" viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="red" // Gray background
          strokeWidth="4"
          strokeDashoffset={circumference}
          strokeDasharray={`${circumference / storyCount} 10`}
        />
      </svg>

      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-200">
        <span className="text-sm font-medium text-gray-700">
          {user.userName}
        </span>
      </div>
    </div>
  )
}

export default StoryRing
