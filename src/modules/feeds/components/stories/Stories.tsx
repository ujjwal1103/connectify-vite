import Avatar from '@/components/shared/Avatar'
import { useCallback, useEffect, useRef, useState } from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { Plus } from 'lucide-react'
import { IoChevronBackCircle, IoChevronForwardCircle } from 'react-icons/io5'
import { getAllStories } from '@/api'

import Modal from '@/components/shared/modal/Modal'
import UserStory from './UserStory'
import { AnimatePresence } from 'framer-motion'

const storyImages: any[] = []

const Stories = () => {
  const [stories, setStories] = useState<any[]>(storyImages)
  const [openStoryView, setOpenStoryView] = useState(false)
  const scrollContainerRef = useRef<any>(null)
  const [openStories, setOpenStories] = useState([])

  const getStories = useCallback(async () => {
    const res = (await getAllStories()) as any
    setStories(res.stories)
  }, [])

  useEffect(() => {
    getStories()
  }, [])

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
            key={index + Date.now()}
            onClick={() => {
              if (!story.stories.length) return
              const user = story.user
              const allStories = story.stories.map((st: any) => {
                return {
                  url: st?.content?.url,
                  duration: 5500,
                  header: {
                    heading: user?.username,
                    subheading: 'Posted 30m ago',
                    profileImage: user?.avatar?.url,
                  },
                }
              })
              setOpenStories(allStories)
              setOpenStoryView(true)
            }}
            className="mr-2 flex basis-4 items-center justify-center first:ml-2"
          >
            <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-pink-500">
              <div className="flex items-center justify-center rounded-full p-[2px]">
                <Avatar
                  className="h-12 w-12 rounded-full object-cover"
                  src={story.user?.avatar?.url}
                />
              </div>
            </div>
        </div>
        ))}
      </div>

      <div className="absolute top-6 mt-2 hidden w-full -translate-y-1/2 justify-between">
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
      <AnimatePresence>
        {openStoryView && (
          <Modal
            onClose={() => {
              setOpenStoryView(false)
            }}
          >
            <div className="flex w-screen items-center justify-center">
              <div className="w-96">
                {openStories.length && (
                  <UserStory
                    stories={openStories}
                    onClose={() => {
                      setOpenStoryView(false)
                    }}
                  />
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Stories
