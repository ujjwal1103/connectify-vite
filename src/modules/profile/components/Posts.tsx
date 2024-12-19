import { getSelfPosts, getUserPosts } from '@/api'
import { ProfilePost } from '@/components/posts/ProfilePost'
import { usePostSlice } from '@/redux/services/postSlice'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EmptyPost } from './EmptyPost'
import SuggetionsSlider from '@/components/shared/suggetionsSliders/SuggetionsSlider'
import { Loader } from 'lucide-react'
import { LoadingPosts } from './LoadingPosts'
import PostSliderModal from '@/components/shared/imageSwiper'
import Modal from '@/components/shared/modal/Modal'
import { IPost } from '@/lib/types'
import { useLocation } from 'react-router-dom'

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

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openSlider, setOpenSlider] = useState(false)
  const location = useLocation()

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

  const handleOpenSlider = (index: number) => {
    setOpenSlider(true)
    setSelectedIndex(index)
    window.history.replaceState(null, '', `p/${posts[selectedIndex]._id}`)
  }

  const handleClose = () => {
    setOpenSlider(false)
    setSelectedIndex(0)
    window.history.replaceState(null, '', location.pathname)
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
          {posts?.map((feed: IPost, index: number) => (
            <ProfilePost
              index={index}
              onClickPost={handleOpenSlider}
              key={feed._id}
              post={feed}
              isSelfPosts={isSelfPosts}
            />
          ))}
        </div>
      </InfiniteScroll>

      {openSlider && (
        <Modal onClose={handleClose} showCloseButton={false}>
          <PostSliderModal posts={posts} index={selectedIndex} />
        </Modal>
      )}
    </div>
  )
}

export default Posts

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
