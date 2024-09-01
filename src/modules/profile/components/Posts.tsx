import { getSelfPosts, getUserPosts } from '@/api'
import { ProfilePost } from '@/components/posts/ProfilePost'
import { usePostSlice } from '@/redux/services/postSlice'
import { useCallback, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EmptyPost } from './EmptyPost'
import SuggetionsSlider from '@/components/shared/suggetionsSliders/SuggetionsSlider'
import { Loader } from 'lucide-react'

interface PostsProps {
  isSelfPosts?: boolean
  userId?: string
}

const fetchPosts = async (page: number) => {
  const res = (await getSelfPosts(page)) as any
  return {
    data: res.posts,
    pagination: res.pagination,
  }
}
const fetchOtherPosts = (page: number, userId: string) =>
  getUserPosts(page, userId).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }))

const Posts = ({ isSelfPosts = true, userId }: PostsProps) => {
  const { page, setPage, setPosts, posts, hasNext, loadingPost, reset } =
    usePostSlice()

  const fetchItems = useCallback(async () => {
    try {
      const res = isSelfPosts
        ? await fetchPosts(page)
        : await fetchOtherPosts(page, userId || '')

      setPosts(res)
    } catch (error) {
      alert('Something went wrong')
    }
  }, [page, userId, isSelfPosts, setPosts])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset, userId])

  const handleLoadMore = () => {
    setPage(page + 1)
  }

  if (loadingPost) {
    return <LoadingPosts />
  }

  if (!loadingPost && !posts.length) {
    return <NoPosts />
  }

  return (
    <div className="overflow-hidden">
      <InfiniteScroll
        className="flex flex-col"
        dataLength={posts?.length}
        next={handleLoadMore}
        hasMore={hasNext}
        loader={<LoaderComponent />}
        scrollableTarget={'scrollableDiv'}
      >
        <div className="grid grid-cols-3 place-content-center gap-[1px]">
          {posts?.map((feed: any) => (
            <ProfilePost key={feed._id} post={feed} isSelfPosts={isSelfPosts} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default Posts

const LoadingPosts: React.FC = () => (
  <div className="flex h-full w-full flex-wrap place-content-center">
    <div className="grid w-full grid-cols-3 place-content-center gap-[1px] overflow-hidden pt-10">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="aspect-1 w-full border border-background bg-secondary"
        ></div>
      ))}
    </div>
  </div>
)

const NoPosts: React.FC = () => (
  <div className="py-10">
    <EmptyPost message="" />
    <div className="mx-auto max-w-[1000px] md:max-w-[750px] lg:max-w-[834px] xl:max-w-[1000px]">
      <SuggetionsSlider />
    </div>
  </div>
)

const LoaderComponent: React.FC = () => (
  <div className="flex w-full items-center justify-center py-3" role="status">
    <Loader className="animate-spin" />
  </div>
)
