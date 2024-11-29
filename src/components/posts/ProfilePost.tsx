import { deleteThisPost } from '@/api'
import { IPost, IUser } from '@/lib/types'
import { usePostSlice } from '@/redux/services/postSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader, MoreHorizontal } from 'lucide-react'
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ImageSlider } from '../shared/ImageSlider/ImageSlider'
import ConfirmModal from '../shared/modal/ConfirmModal'
import EditPostModal from '../shared/modal/EditPostModal'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { useFeedSlice } from '@/redux/services/feedSlice'

interface ProfilePostProps {
  post: IPost
  isSelfPosts?: boolean
}

export const ProfilePost = ({
  post,
  isSelfPosts = false,
}: ProfilePostProps) => {
  const [currentPost, setCurrentPost] = useState(post)
  const [editPost, setEditPost] = useState(false)
  const [deletingPost, setDeletingPost] = useState(false)
  const { deletePost } = usePostSlice()
  const { deleteFeed } = useFeedSlice()
  
  const { updateUser, user } = useAuth()
  useEffect(() => {
    setCurrentPost(post)
  }, [post])

  const [isModalOpen, setModalOpen] = useState(false)

  const handleClose = () => setModalOpen(false)
  const handleConfirm = () => {
    handleDeletePost()
  }

  const handleDeletePost = async () => {
    try {
      setDeletingPost(true)
      await deleteThisPost(currentPost._id)
      toast.success('Post Deleted Successfully')
      deletePost(currentPost._id)
      deleteFeed(currentPost._id)
      const u = { ...user, posts: user!.posts - 1 }
      updateUser(u as IUser)
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete post')
    } finally {
      setDeletingPost(false)
      handleClose()
    }
  }

  return (
    <motion.div className="bg-black-600 relative flex items-center">
      <ImageSlider images={currentPost?.images} aspect={true} />

      <PostMenu
        setModalOpen={setModalOpen}
        setEditPost={setEditPost}
        isSelfPosts={isSelfPosts}
        deletingPost={deletingPost}
        postId={post._id}
      />

      {editPost && (
        <EditPostModal
          isOpen={editPost}
          onClose={() => setEditPost(false)}
          post={currentPost}
        />
      )}

      <AnimatePresence>
        {isModalOpen && (
          <ConfirmModal>
            <div className="rounded-md bg-background p-4 text-primary shadow-xl md:rounded-lg md:p-6">
              <div className="mb-4 text-lg font-bold">Delete this post</div>
              <p className="mb-4">Are you sure you want to delete?</p>
              <div className="mt-4 flex flex-col-reverse justify-end gap-2 md:flex-row">
                <button
                  onClick={handleClose}
                  disabled={deletingPost}
                  className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
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
          </ConfirmModal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface PostMenuProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>
  setEditPost: Dispatch<SetStateAction<boolean>>
  isSelfPosts: boolean
  deletingPost: boolean
  postId: string
}

const PostMenu = ({
  setModalOpen,
  setEditPost,
  isSelfPosts,
  deletingPost,
  postId,
}: PostMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    bottom: 'auto',
    right: 'auto',
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const menuHeight = menuRef.current?.offsetHeight
      const menuWidth = menuRef.current?.offsetWidth
      let top = buttonRect.bottom + window.scrollY + 8
      let left = buttonRect.left + window.scrollX
      let bottom = 'auto'
      let right = 'auto'

      if (window.innerHeight - buttonRect.bottom < menuHeight!) {
        top = buttonRect.top + window.scrollY - menuHeight! - 8
      }

      if (window.innerWidth - buttonRect.right < menuWidth!) {
        left = buttonRect.right + window.scrollX - menuWidth! - 8
      }

      if (top < 0) {
        top = 8
        bottom = 'auto'
      }

      if (left < 0) {
        left = 8
        right = 'auto'
      }

      setMenuPosition({ top, left, bottom, right })
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('scroll', handleScroll, true)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [isMenuOpen])

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleScroll = () => {
    setIsMenuOpen(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false)
    }
  }
  const handleOpen = () => {
    setIsMenuOpen(false)
    setModalOpen(true)
  }

  const handleEditPost = () => {
    setEditPost(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      <div ref={buttonRef} className="absolute right-2 top-2 hidden md:block">
        <MoreHorizontal
          className="size-3 cursor-pointer md:size-6"
          onClick={handleMenuToggle}
          size={30}
        />
      </div>
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="absolute z-50 rounded bg-zinc-900 p-2 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                bottom: menuPosition.bottom,
                right: menuPosition.right,
              }}
            >
              <ul className="text-sm md:w-44 md:text-sm">
                <li className="cursor-pointer rounded-md p-2 hover:bg-zinc-800">
                  <Link to={`/p/${postId}`}>View Post</Link>
                </li>
                {isSelfPosts && (
                  <>
                    <li className="cursor-pointer rounded-md p-2 hover:bg-zinc-800">
                      <button type="button" onClick={handleEditPost}>
                        Edit Post
                      </button>
                    </li>
                    <li className="cursor-pointer rounded-md p-2 text-red-600 hover:bg-zinc-800">
                      <button
                        type="button"
                        onClick={handleOpen}
                        disabled={deletingPost}
                        className="flex w-full items-center justify-between"
                      >
                        Delete Post
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
