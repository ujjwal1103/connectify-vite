import { getAllPost } from '@/api'
import Post from './components/post/Post'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useFetchFeeds } from '@/hooks/useFetch'
import RightSideContainer from './components/RightSideContainer/RightSideContainer'
import { IPost } from '@/lib/types'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import LoadingFeed from './components/LoadingFeed'
import { ChevronUpIcon } from 'lucide-react'
import Wrapper from '@/components/Wrapper'
import NoPosts from './components/NoPosts'

const fetchPosts = (page: number) =>
  getAllPost(page).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }))

const Feeds = () => {
  const { feeds, hasNextPage, setPage, page, isLoading } =
    useFetchFeeds<IPost>(fetchPosts)
  const setHide: any = useOutletContext()

  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage(page + 1)
    }
  }

  const { scrollY } = useScroll({
    container: containerRef,
  })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious()
    if (latest > 500) {
      setShowScrollToTop(true)
    } else {
      setShowScrollToTop(false)
    }
    if (latest > previous! && latest > 150) {
      setHide(true)
    } else {
      setHide(false)
    }
  })

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main
      ref={containerRef}
      className="h-dvh w-full overflow-x-hidden overflow-y-scroll scrollbar-thin sm:my-0 md:flex md:justify-center md:p-2 lg:justify-start lg:scrollbar"
      id="scrollableDiv"
    >
      <section className="mt-10 flex flex-1 flex-col gap-2 py-1 md:mt-0 md:flex-[0.8] md:gap-3 md:p-3 lg:flex-[0.6]">
        {/* <Stories /> */}

        <div className="flex flex-col w-full">
          <div className="flex flex-col">
            <InfiniteScroll
              className="flex flex-col"
              dataLength={feeds?.length}
              next={handleLoadMore}
              hasMore={hasNextPage}
              loader={<LoadingFeed />}
              scrollableTarget={'scrollableDiv'}
            >
              {isLoading && <div>Loading</div>}
              {feeds.length === 0 && !isLoading && <NoPosts />}
              {feeds?.map((feed: any) => <Post key={feed._id} post={feed} />)}
            </InfiniteScroll>
          </div>
        </div>
      </section>
      <section className="hidden flex-[0.4] lg:block sticky top-0">
        <RightSideContainer />
      </section>

      <Wrapper shouldRender={showScrollToTop}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-10 right-10 z-100"
        >
          <button
            type="button"
            className="h-10 rounded-full bg-blue-600 p-2 shadow-2xl active:bg-blue-800"
            onClick={scrollToTop}
          >
            <ChevronUpIcon />
          </button>
        </motion.div>
      </Wrapper>
    </main>
  )
}

export default Feeds
