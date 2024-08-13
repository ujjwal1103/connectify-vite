import Stories from './components/stories/Stories'
import { getAllPost } from '@/api'
import Post from './components/post/Post'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useFetchFeeds } from '@/hooks/useFetch'
import RightSideContainer from './components/RightSideContainer/RightSideContainer'
import { IPost } from '@/lib/types'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import LoadingFeed from './components/LoadingFeed'

const fetchPosts = (page: number) =>
  getAllPost(page).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }))

const Feeds = () => {
  const { feeds, hasNextPage, setPage, page } = useFetchFeeds<IPost>(fetchPosts)
  const setHide: any = useOutletContext()

  const containerRef = useRef<HTMLDivElement>(null)

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
    if (latest > previous! && latest > 150) {
      setHide(true)
    } else {
      setHide(false)
    }
  })

  return (
    <main
      ref={containerRef}
      className="h-full w-full overflow-x-hidden overflow-y-scroll scrollbar-thin sm:my-0 md:flex md:justify-center md:p-2 lg:justify-start lg:scrollbar"
      id="scrollableDiv"
    >
      <section className="mt-10 flex flex-1 flex-col gap-2 py-1 md:mt-0 md:flex-[0.8] md:gap-3 md:p-3 lg:flex-[0.6]">
        {/* <Stories /> */}

        <div className="flex w-full flex-col">
          <div className="flex flex-col">
            <InfiniteScroll
              className="flex flex-col"
              dataLength={feeds?.length}
              next={handleLoadMore}
              hasMore={hasNextPage}
              loader={<LoadingFeed />}
              scrollableTarget={'scrollableDiv'}
            >
              {feeds?.map((feed: any) => <Post post={feed} />)}
            </InfiniteScroll>
          </div>
        </div>
      </section>
      <section className="hidden flex-[0.4] lg:block">
        <RightSideContainer />
      </section>
    </main>
  )
}

export default Feeds
