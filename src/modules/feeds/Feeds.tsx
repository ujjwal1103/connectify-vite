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
import { ChevronUpIcon, Loader } from 'lucide-react'
import Wrapper from '@/components/Wrapper'
import NoPosts from './components/NoPosts'
import UploadingPost from './components/UploadingPost'
import usePostStore from '@/stores/posts'
// import StoryComponent from './StoryComponent'
// import Stories from './components/stories/Stories'

const fetchPosts = (page: number) =>
  getAllPost(page).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }))

const Feeds = () => {
  const { feeds, hasNextPage, setPage, page, isLoading } =
    useFetchFeeds<IPost>(fetchPosts)
  const setHide: any = useOutletContext()
  const { uploadingPost } = usePostStore()

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
    <>
      <main
        ref={containerRef}
        className="relative flex h-dvh overflow-y-auto bg-secondary scrollbar-thin"
        id="scrollableDiv"
      >
        <div className="m-auto h-full w-full flex-[0.7] p-0 pt-14 md:p-4">
          <section className="flex flex-col">
            <InfiniteScroll
              dataLength={feeds?.length}
              next={handleLoadMore}
              hasMore={hasNextPage}
              loader={<LoadingFeed />}
              scrollableTarget={'scrollableDiv'}
              className="m-auto w-screen max-w-lg md:w-full"
            >
              {/* <StoryComponent /> */}
              {isLoading && <div>Loading</div>}
              {feeds.length === 0 && !isLoading && <NoPosts />}
              {uploadingPost.isUploading && (
                <UploadingPost uploadingPost={uploadingPost} />
              )}
              {feeds?.map((feed: any) => <Post key={feed._id} post={feed} />)}
            </InfiniteScroll>
          </section>
        </div>
        <RightSideContainer />
      </main>
      <Wrapper shouldRender={showScrollToTop}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute bottom-10 right-10"
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
    </>
  )
}

export default Feeds
