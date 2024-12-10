import Avatar from '@/components/shared/Avatar'
import { useCallback, useEffect, useRef, useState } from 'react'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import {
  ChevronLeftCircleIcon,
  ChevronRightCircle,
  X,
} from 'lucide-react'
import { getAllStories } from '@/api'

import Modal from '@/components/shared/modal/Modal'
import UserStory from './UserStory'
import { AnimatePresence } from 'framer-motion'
import ConnectifyLogoText from '@/components/icons/ConnectifyLogoText'

const storyImages: any[] = []

const Stories = () => {
  const [stories, setStories] = useState<any[]>(storyImages)
  const [openStoryView, setOpenStoryView] = useState(false)
  const scrollContainerRef = useRef<any>(null)
  const [openStories, setOpenStories] = useState([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

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

  return (
    <div className="relative z-0 flex min-h-16 w-full items-center overflow-hidden md:max-w-[625px]">
      <div
        className="flex max-h-20 overflow-x-scroll scrollbar-none"
        ref={scrollContainerRef}
      >
        {stories.map((story, index) => (
          <div
            key={index + Date.now()}
            onClick={() => {
              if (!story.stories.length) return
              setCurrentIndex(index)
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
          <ChevronLeftCircleIcon size={24} />
        </button>
        <button
          onClick={scrollRight}
          className="absoulute right-0 mr-2 rounded-full bg-transparent p-1 text-sm text-white disabled:opacity-50"
        >
          <ChevronRightCircle size={24} />
        </button>
      </div>
      <AnimatePresence>
        {openStoryView && (
          <Modal
            onClose={() => {
              setOpenStoryView(false)
            }}
            showCloseButton={false}
          >
            <div className="relative flex h-dvh w-screen items-center justify-center bg-black">
              <div className="absolute left-3 top-3">
                <ConnectifyLogoText w="200" h="44" />
              </div>
              <div className="absolute right-10 top-10">
                <button
                  onClick={() => {
                    setOpenStoryView(false)
                  }}
                >
                  <X size={44} />
                </button>
              </div>
              <div className="flex w-96 items-center justify-center">
                {openStories.length && (
                  <UserStory
                    stories={openStories}
                    onClose={() => {
                      setOpenStoryView(false)
                    }}
                    setNextStory={() => {
                      const user = stories[currentIndex! + 1]?.user
                      const allStories = stories[
                        currentIndex! + 1
                      ]?.stories.map((st: any) => {
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
                      if (!allStories) {
                        setOpenStoryView(false)
                        return
                      }
                      setCurrentIndex((prev) => prev + 1)
                      setOpenStories(allStories)
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

