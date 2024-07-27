import Avatar from '@/components/shared/Avatar'
import { useRef, useState } from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { Plus } from 'lucide-react'
import { IoChevronBackCircle, IoChevronForwardCircle } from 'react-icons/io5'

const storyImages: any[] = []

const Stories = () => {
  const [stories, _] = useState<any[]>(storyImages)
  const scrollContainerRef = useRef<any>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef?.current?.scrollBy({
        left: -625 - 10,
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 625 + 10,
        behavior: 'smooth',
      })
    }
  }

  const handleAddStory = () => {}
  return (
    <div className="relative z-0 flex min-h-16 w-full items-center overflow-hidden md:max-w-[625px]">
      <div
        className="flex max-h-20 overflow-x-scroll scrollbar-none"
        ref={scrollContainerRef}
      >
        <div className="mr-2 flex basis-4 items-center justify-center first:ml-2">
          <div className="flex items-center justify-center rounded-full bg-secondary">
            <div className="flex items-center justify-center rounded-full p-[2px]">
              <button
                className="flex h-12 w-12 items-center justify-center rounded-full object-cover"
                onClick={handleAddStory}
              >
                <Plus />
              </button>
            </div>
          </div>
        </div>
        {stories.map((story, index) => (
          <div
            key={index}
            className="mr-2 flex basis-4 items-center justify-center first:ml-2"
          >
            <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500">
              <div className="flex items-center justify-center rounded-full p-[2px]">
                <Avatar
                  className="h-12 w-12 rounded-full object-cover"
                  src={story.user_profile_picture}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute top-6 mt-2 flex w-full -translate-y-1/2 justify-between">
        <button
          onClick={scrollLeft}
          className="absoulute right-0 ml-2 rounded-full bg-transparent p-1 text-sm disabled:opacity-50"
        >
          <IoChevronBackCircle size={24} />
        </button>
        <button
          onClick={scrollRight}
          className="absoulute right-0 mr-2 rounded-full bg-transparent p-1 text-sm text-white disabled:opacity-50"
        >
          <IoChevronForwardCircle size={24} />
        </button>
      </div>
    </div>
  )
}

export default Stories
