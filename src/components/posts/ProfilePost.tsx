import { deleteThisPost } from '@/api'
import { IPost, IUser } from '@/lib/types'
import { usePostSlice } from '@/redux/services/postSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader, MaximizeIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ImageSlider } from '../shared/ImageSlider/ImageSlider'
import ConfirmModal from '../shared/modal/ConfirmModal'
import EditPostModal from '../shared/modal/EditPostModal'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { useFeedSlice } from '@/redux/services/feedSlice'
import DropDownMenuItem from '../shared/dialogs/DropDownMenu/DropDownMenuItem'
import Modal from '../shared/modal/Modal'

interface ProfilePostProps {
  post: IPost
  isSelfPosts?: boolean
  onClickPost?: (index: number) => void
  index: number
}

export const ProfilePost = ({
  post,
  isSelfPosts = false,
  onClickPost,
  index,
}: ProfilePostProps) => {
  console.log({post})
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
      await deleteThisPost(currentPost?._id)
      toast.success('Post Deleted Successfully')
      deletePost(currentPost?._id)
      deleteFeed(currentPost?._id)
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
    <motion.div className="group relative flex aspect-1 items-center bg-black">
      <div className="w-full aspect-1">
        <ImageSlider images={currentPost?.images} aspect={true} />
      </div>

      <div
        onClick={() => {
          onClickPost?.(index)
        }}
        className="absolute top-0 flex h-full w-full items-center justify-center group-hover:bg-black/50"
      >
        <PostMenu
          setModalOpen={setModalOpen}
          setEditPost={setEditPost}
          isSelfPosts={isSelfPosts}
          deletingPost={deletingPost}
          postId={post._id}
        />
      </div>
      <AnimatePresence>
      {editPost && (
        <Modal showCloseButton={false} onClose={() => setEditPost(false)}>
        <EditPostModal
          
          isOpen={editPost}
         
          post={currentPost}
        />
        </Modal>
      )}
      </AnimatePresence>

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
  postId,
}: PostMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const menuHeight = menuRef.current?.offsetHeight
      let top = buttonRect.bottom + window.scrollY
      let left = buttonRect.left + -(menuRef.current?.clientWidth! - 115)!

      if (window.innerHeight - buttonRect.bottom < menuHeight!) {
        top = buttonRect.top + window.scrollY - menuHeight! - 8
      }
      setMenuPosition({ top, left })
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

  const handleMenuToggle = (e: any) => {
    e.stopPropagation()
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
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    setModalOpen(true)
  }

  const handleEditPost = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditPost(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      <div
        ref={buttonRef}
        onClick={(e) => e.stopPropagation()}
        className="relative right-0 top-0 hidden p-2 transition-all duration-300 md:group-hover:flex"
      >
        <MoreHorizontal
          className="size-3 cursor-pointer rounded-md hover:bg-black/50 md:size-6"
          onClick={handleMenuToggle}
          size={30}
        />
      </div>
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              onClick={(e) => e.stopPropagation()}
              ref={menuRef}
              className="absolute z-50 rounded bg-background-secondary p-2 shadow-xl md:w-44"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
            >
              <div className="space-y-1 text-sm md:text-sm">
                <DropDownMenuItem
                  label="View"
                  icon={MaximizeIcon}
                  onClick={() => navigate(`/p/${postId}`)}
               
                />
                {isSelfPosts && (
                  <>
                    <DropDownMenuItem
                      label="Edit"
                      icon={Pencil}
                      onClick={handleEditPost}
                   
                    />
                    <DropDownMenuItem
                      label="Delete"
                      icon={Trash2}
                      onClick={handleOpen}
                      // disabled={deletingPost}
                      className='text-red-600'
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
