import { AnimatePresence } from 'framer-motion'
import { Ellipsis, Loader } from 'lucide-react'
import { memo, useState } from 'react'
import { usePostSlice } from '@/redux/services/postSlice'
import { deleteThisPost } from '@/api'
import { toast } from 'react-toastify'
import { useFeedSlice } from '@/redux/services/feedSlice'
import Modal from '@/components/shared/modal/Modal'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import PostOptions from '@/components/PostOptions'
import { IPost, IUser } from '@/lib/types'

interface PostHeaderMenuProps {
  userId: string
  postId: string
  post: IPost
}

const PostHeaderMenu = ({ postId, post }: PostHeaderMenuProps) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [deletingPost, setDeletingPost] = useState(false)
  const { deletePost } = usePostSlice()
  const { updateUser, user } = useAuth()
  const { deleteFeed } = useFeedSlice()

  const handleClose = () => setModalOpen(false)
  const handleConfirm = () => {
    handleDeletePost()
  }

  const handleDeletePost = async () => {
    try {
      setDeletingPost(true)
      await deleteThisPost(postId)
      toast.success('Post Deleted Successfully', { position: 'bottom-right' })
      deletePost(postId)
      deleteFeed(postId)
      const u = { ...user, posts: user!.posts - 1 }
      updateUser(u as IUser)
    } catch (error) {
      toast.error('Failed to delete post')
    } finally {
      setDeletingPost(false)
      handleClose()
    }
  }
  return (
    <div className="text-secondary-foreground">
      <button
        onClick={() => setMenu(!menu)}
        className={cn(
          'box-content flex h-6 w-6 items-center justify-center rounded-md p-1 transition-colors duration-300 hover:bg-secondary',
          menu && 'bg-secondary'
        )}
      >
        <Ellipsis className="cursor-pointer" size={24} />
      </button>
      <AnimatePresence>
        {menu && (
          <PostOptions
            post={post}
            open={menu}
            onClose={() => setMenu(false)}
            handleDelete={() => {
              setMenu(false)
              setModalOpen(true)
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={handleClose}
            showCloseButton={false}
            shouldCloseOutsideClick={false}
            animate={false}
          >
            <div className="rounded-md bg-background p-4 text-primary shadow-xl md:rounded-lg md:p-6">
              <div className="mb-4 text-lg font-bold">Delete this post</div>
              <p className="mb-4">Are you sure you want to delete?</p>
              <div className="mt-4 flex flex-col-reverse justify-end gap-2 md:flex-row">
                <button
                  onClick={handleClose}
                  disabled={deletingPost}
                  className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600 disabled:pointer-events-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={deletingPost}
                  className="relative flex items-center justify-center gap-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:pointer-events-none disabled:bg-red-400"
                >
                  <span className={cn('visible', { invisible: deletingPost })}>
                    Delete
                  </span>
                  <span
                    className={cn('absolute', { invisible: !deletingPost })}
                  >
                    <Loader className="animate-spin" />
                  </span>
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(PostHeaderMenu)
