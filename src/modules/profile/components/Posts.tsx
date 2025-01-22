
import { ProfilePost } from '@/components/posts/ProfilePost'

import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EmptyPost } from './EmptyPost'
import SuggetionsSlider from '@/components/shared/suggetionsSliders/SuggetionsSlider'
import { Loader } from 'lucide-react'
import { LoadingPosts } from './LoadingPosts'
import PostSliderModal from '@/components/shared/imageSwiper'
import Modal from '@/components/shared/modal/Modal'
import { IPost } from '@/lib/types'
import { useLocation } from 'react-router-dom'
import usePostStore from '@/stores/posts'
import { AnimatePresence } from 'framer-motion'

interface PostsProps {
  isSelfPosts?: boolean
  userId?: string
}

const Posts = ({ isSelfPosts = true, userId }: PostsProps) => {
  const {
    fetchSelfPosts,
    fetchUserPosts,
    posts,
    loadingPost,
    page,
    setPage,
    hasNext,
    reset,
  } = usePostStore()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openSlider, setOpenSlider] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (isSelfPosts) {
      fetchSelfPosts()
    } else {
      if(!userId) return;
      fetchUserPosts(userId)
    }
  }, [fetchSelfPosts, fetchUserPosts, page, isSelfPosts, userId])

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
     <AnimatePresence>
      {openSlider && (
        <Modal onClose={handleClose} showCloseButton={false} shouldCloseOutsideClick={false}>
          <PostSliderModal posts={posts} index={selectedIndex} />
        </Modal>
      )}
      </AnimatePresence>
    </div>
  )
}

export default Posts

export const NoPosts: React.FC = () => (
  <div className="w-full py-10">
    <EmptyPost message="" />
    <SuggetionsSlider />
  </div>
)

const LoaderComponent: React.FC = () => (
  <div className="flex w-full items-center justify-center py-3" role="status">
    <Loader className="animate-spin" />
  </div>
)
