import { getBookmarks } from '@/api'
import { ProfilePost } from '@/components/posts/ProfilePost'
import { useSavedPostSlice } from '@/redux/services/savedPostSlice'
import { useCallback, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EmptyPost } from './EmptyPost'
import SuggetionsSlider from '@/components/shared/suggetionsSliders/SuggetionsSlider'
import { Loader } from 'lucide-react'
import { LoadingPosts } from './LoadingPosts'

const fetchPosts = (page: number) =>
  getBookmarks(page).then((res: any) => ({
    data: res.bookmarks,
    pagination: res.pagination,
  }))

const SavedPost = () => {
  const { page, setPage, setSavedPosts, savedPost, hasNext, loadingPost } =
    useSavedPostSlice()

  const fetchItems = useCallback(async () => {
    try {
      const res = (await fetchPosts(page)) as any
      console.log(res)
      setSavedPosts(res)
    } catch (error) {}
  }, [page])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleLoadMore = () => {
    if (hasNext) {
      setPage(page + 1)
    }
  }

  if (loadingPost) {
    return <LoadingPosts />
  }

  if (!loadingPost && !savedPost.length) {
    return (
      <div className="py-10">
        <EmptyPost message="No Saved Post" />
        <div className="mx-auto max-w-[1000px]">
          <SuggetionsSlider />
        </div>
      </div>
    )
  }

  console.log({savedPost})
  return (
    <div className="h-full">
      <InfiniteScroll
        className="flex flex-col"
        dataLength={savedPost?.length}
        next={handleLoadMore}
        hasMore={hasNext}
        loader={[12].map(() => (
          <div
            className="flex w-full items-center justify-center py-3"
            role="status"
          >
            <Loader className="animate-spin" />
          </div>
        ))}
        scrollableTarget={'scrollableDiv'}
      >
        <div className="grid grid-cols-3 place-content-center gap-px">
          {savedPost?.map((post : any) => (
            <ProfilePost key={post?._id} post={post} index={0} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default SavedPost
