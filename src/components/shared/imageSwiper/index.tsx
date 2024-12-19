import { IPost } from '@/lib/types'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Button } from '@/components/ui/button'
import {
    ChevronLeftCircle, ChevronRightCircle,
    MoreHorizontal,
    Send,
    SmileIcon,
    XIcon
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ImageSlider } from '../ImageSlider/ImageSlider'
import { cn, formatDate } from '@/lib/utils'
import Avatar from '../Avatar'
import FollowButton from '../FollowButton'
import { LikeButton } from '../LikeButton'
import { BookmarkButton } from '../BookmarkButton'
import Caption from '@/modules/feeds/components/post/Caption'
import CommetsForPost from '@/modules/feeds/components/post/CommentsSingle'

interface Props {
  posts: IPost[]
  index: number
  onClose?: () => void
}

const PostSliderModal: React.FC<Props> = ({ posts, index, onClose }: Props) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute right-3 top-3 z-100">
        <Button size="icon" onClick={onClose}>
          <XIcon size={44} />
        </Button>
      </div>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        initialSlide={index}
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true, bulletClass: 'bg-green-400' }}
        navigation={true}
        onSlideChange={(swiper) => {
          const index = swiper.activeIndex
          window.history.replaceState(null, '', `/p/${posts[index]._id}`)
        }}
        className="relative h-dvh w-full md:h-[90%]"
      >
        {posts.map((post) => (
          <SwiperSlide className="h-full">
            <Post post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const Post = ({ post }: { post: IPost }) => {
  const [showScrollBar, setShowScrollBar] = useState(false)
  const { isActive } = useSwiperSlide()
  const commentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (commentRef.current) {
      setShowScrollBar(
        commentRef.current.clientHeight !== commentRef.current.scrollHeight
      )
    }
  }, [])

  return (
    <div className="m-auto flex h-full justify-center rounded-md bg-background md:w-[80%]">
      <div className="flex h-full items-center md:w-144 lg:w-[611px]">
        {/* <Swiper slidesPerView={1}
         className="relative h-full w-[611px]">
          {post.images.map((image) => (
            <SwiperSlide className="h-full">
              <img src={image.url} className="h-full object-contain" />
            </SwiperSlide>
          ))}
        </Swiper> */}
        <ImageSlider images={post.images} width="100%" />
      </div>
      <div className="hidden h-full max-w-144 flex-1 flex-col md:flex">
        <div className="flex w-full items-center gap-2 border-b border-border p-3">
          <Avatar src={post?.user?.avatar?.url} className="size-8" />

          <div className="flex flex-col justify-center leading-3">
            <span className="ml-2 text-base">{post?.user?.name}</span>
            {/* <span className="ml-2 text-white/50">{post?.user?.username}</span> */}
          </div>

          <div className="ml-2">
            <FollowButton
              isFollow={true}
              isPrivate={true}
              isRequested={false}
              userId={post.user._id}
              showRemoveFollowerBtn={false}
            />
          </div>

          <div className="ml-auto">
            <Button variant={'ghost'} size={'icon'}>
              <MoreHorizontal />
            </Button>
          </div>
        </div>
        <div
          ref={commentRef}
          className={cn(
            'flex-1 overflow-y-scroll w-500',
            !showScrollBar && 'scrollbar-none'
          )}
        >
          <span className=''>
            <Caption user={post.user} caption={post.caption} showUser={true} />
          </span>
          {isActive && (
            <CommetsForPost post={post} postId={post._id} setPost={() => {}} />
          )}
        </div>
        <div className="w-full border-t border-border">
          <div className="flex gap-3 p-3">
            <LikeButton
              isLiked={post.isLiked}
              postUserId={post.user._id}
              size={24}
              id={post._id}
            />

            {/* <CommentIcon
              className="size-6 cursor-pointer hover:text-muted-foreground"
              // onClick={() => setShowComments(true)}
            /> */}

            <Send
              //   onClick={() => setSendPost(true)}
              className="cursor-pointer hover:text-muted-foreground"
            />
            <div className="ml-auto">
              <BookmarkButton
                postId={post?._id}
                isBookmarked={post.isBookmarked}
                onBookmarkClick={(isBookmarked) => {
                  // onBookmark?.(isBookmarked)
                  // addAndRemoveBookmark(isBookmarked, post?._id)
                }}
              />
            </div>
          </div>
          <div className="flex flex-col px-3 pb-2 text-base font-semibold text-white">
            <span>{post.like} Likes</span>
            <span>{formatDate('12-12-2024')}</span>
          </div>
          <div className="relative flex items-center border-t border-border p-2">
            <span className="flex h-full items-center px-2">
              <SmileIcon />
            </span>
            <textarea
              placeholder="Add a comment..."
              className="h-10 w-full resize-none bg-transparent p-2 scrollbar-none focus-visible:outline-none"
            />
            <button className="flex h-full items-center px-2 text-base font-semibold text-sky-700">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostSliderModal

export function SlideNextButton() {
  const swiper = useSwiper()
  return (
    <div className="absolute inset-0 z-100 flex h-full w-full justify-between">
      <div className="flex h-full items-center p-3">
        <Button
          disabled={false}
          size={'icon'}
          onClick={() => swiper.slidePrev()}
        >
          <ChevronLeftCircle />
        </Button>
      </div>
      <div className="flex h-full items-center p-3">
        <Button
          disabled={!swiper.allowSlideNext}
          size={'icon'}
          className=""
          onClick={() => swiper.slideNext()}
        >
          <ChevronRightCircle />
        </Button>
      </div>
    </div>
  )
}
