import { getPostById } from '@/api'
import Avatar from '@/components/shared/Avatar'
import { ImageSlider } from '@/components/shared/ImageSlider/ImageSlider'
import { IPost } from '@/lib/types'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PostActions from '../feeds/components/post/PostActions'
import Caption from '../feeds/components/post/Caption'
import CommentComponent from '../feeds/components/post/CommentComponent'
import PostNotFound from '@/components/shared/Error/PostError'
import PostHeaderMenu from '@/components/shared/modal/PostHeaderMenu'

const superLikes = [
  {
    src: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
  },
  {
    src: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

const Post = () => {
  const { postId } = useParams()

  const [loadingPost, setLoadingPost] = useState(true)
  const [post, setPost] = useState<IPost | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostById(postId!)
        if (res.isSuccess) {
          setPost(res?.post)
        }
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoadingPost(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loadingPost && !error) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <PostNotFound />
      </div>
    )
  }

  return (
    <div className="z-10 flex h-dvh bg-background flex-1 flex-col md:flex-row">
      <div className="w-screen md:w-144">
        <div className="md:pl-5 md:pt-5">
          <div className="flex items-center gap-3 p-2 md:hidden md:p-0">
            <Avatar src={post?.user?.avatar?.url} className="h-12 w-12" />
            <div className="font-sm flex flex-col">
              <span className="font-semibold">{post?.user?.username}</span>
              <span>{post?.user?.name}</span>
            </div>

            <PostHeaderMenu post={post!} postId={post!._id} />
          </div>
          <ImageSlider images={post?.images} aspect={true} readOnly={true} />
        </div>
        <div className="h-full flex-1 py-3 md:px-4">
          <div className="mb-3 block md:hidden">
            <PostActions
              post={post!}
              onLike={(liked: boolean) => {
                setPost((prev: IPost | null) => {
                  const p = { ...prev, isLiked: liked } as IPost
                  return p
                })
              }}
              onBookmark={(bookmark: boolean) => {
                setPost((prev: IPost | null) => {
                  return {
                    ...prev,
                    isBookmarked: bookmark,
                  } as IPost
                })
              }}
            />
          </div>
          <div className="flex gap-2 px-2 md:p-0">
            <div className="flex -space-x-1">
              {superLikes.map((like) => (
                <img
                  key={like.src}
                  alt="Like Avatar"
                  src={like.src}
                  className="inline-block size-5 rounded-full ring-1 ring-background"
                />
              ))}
            </div>
            <div>Liked by grace and others</div>
          </div>
          <div className="flex px-2 md:hidden md:p-0">
            {post?.caption && (
              <Caption
                caption={post?.caption}
                user={post?.user}
                showUser={false}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex h-dvh w-screen flex-1 flex-col md:w-96">
        <div className="flex h-dvh flex-1 flex-col justify-between">
          <div className="hidden flex-col justify-center gap-3 px-5 py-3 md:flex">
            <div className="flex items-center gap-3">
              <Avatar src={post?.user?.avatar?.url} className="h-12 w-12" />
              <div className="font-sm flex flex-col">
                <span className="font-semibold">{post?.user?.username}</span>
                <span>{post?.user?.name}</span>
              </div>
          
              <PostHeaderMenu post={post!} postId={post!._id} />
            </div>

            {post?.caption && (
              <Caption
                caption={post?.caption}
                user={post?.user}
                showUser={false}
              />
            )}
          </div>
          <CommentComponent post={post!} postId={postId!} setPost={setPost} />
        </div>
      </div>
    </div>
  )
}

export default Post
