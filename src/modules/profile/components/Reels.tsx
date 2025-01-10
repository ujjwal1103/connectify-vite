import { getSelfReels } from '@/api'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IPost } from '@/lib/types'
import { HeartIcon, MessageCircle } from 'lucide-react'
import Modal from '@/components/shared/modal/Modal'
import PostSliderModal from '@/components/shared/imageSwiper'
import { useLocation } from 'react-router-dom'


const fetchReels = async (page: number) => {
  const res = (await getSelfReels(page)) as any
  return {
    data: res.posts,
    pagination: res.pagination,
  }
}

const Reels = () => {
  const [reels, setReels] = useState<IPost[]>([])
  const [page, setPage] = useState(1)
  const [loadingPost, setLoadingPost] = useState(false)
  const [hasNext, setHasNext] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openSlider, setOpenSlider] = useState(false)
  const location = useLocation()

  const fetchItems = useCallback(async () => {
    try {
      setLoadingPost(true)
      const res = await fetchReels(page)
      setHasNext(true)
      setReels(res.data)
    } catch (error) {
      alert('Something went wrong')
    } finally {
      setLoadingPost(false)
    }
  }, [page])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleOpenSlider = (index: number) => {
    setOpenSlider(true)
    setSelectedIndex(index)
    window.history.replaceState(null, '', `p/${reels[selectedIndex]._id}`)
  }

  const handleClose = () => {
    setOpenSlider(false)
    setSelectedIndex(0)
    window.history.replaceState(null, '', location.pathname)
  }

  return (
    <div className="overflow-hidden ">
      <InfiniteScroll
        dataLength={reels?.length}
        hasMore={hasNext}
        loader={<div />}
        scrollableTarget={'scrollableDiv'}
        next={function () {
          setPage(prev=>prev+1)
        }}
        
      >
        <div className="grid grid-cols-3 gap-[1px] md:grid-cols-4 md:px-20">
          {reels?.map((reel: IPost, index: number) => (
            <div className="group relative bg-red-400">
              <video
                src={reel.images[0].url}
                className="h-full w-full object-cover"
              />

              <div
                onClick={() => handleOpenSlider(index)}
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-background/50 p-2 opacity-0 group-hover:opacity-100"
              >
                <div className="flex gap-3">
                  <HeartIcon className="size-6 cursor-pointer fill-white shadow-md" />
                  <MessageCircle className="size-6 cursor-pointer fill-white shadow-md" />
                </div>
              </div>
            </div>
          ))}
          {loadingPost && <></>}
        </div>
      </InfiniteScroll>

      {openSlider && (
        <Modal
          onClose={handleClose}
          showCloseButton={false}
          shouldCloseOutsideClick={false}
        >
          <PostSliderModal posts={reels} index={selectedIndex} />
        </Modal>
      )}
    </div>
  )
}

export default Reels
