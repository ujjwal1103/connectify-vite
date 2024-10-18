import UsernameLink from '@/components/shared/UsernameLink'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Link } from 'react-router-dom'
import Avatar from '@/components/shared/Avatar'
import { IUser } from '@/lib/types'
import { getCurrentUserId } from '@/lib/localStorage'
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

type PostHeaderProps = {
  postId: string
  userId: string
  userAvatar?: string
  name: string
  username: string
  location?: string
}

const PostHeader = ({
  postId,
  userId,
  userAvatar,
  name,
  username,
  location,
}: PostHeaderProps) => {
  return (
    <div className="text-secondary-foregroun flex w-full items-center justify-between gap-6 p-2">
      <div className="flex flex-1 items-center gap-3">
        <Avatar
          src={userAvatar}
          className="size-8 rounded-full md:size-10"
          name={name}
        />
        <div className="flex flex-col">
          <UsernameLink username={username} onClick={() => {}}>
            <span className="text-sm">{username}</span>
          </UsernameLink>
          <span>{location}</span>
        </div>
      </div>
      <PostHeaderMenu postId={postId} userId={userId} />
    </div>
  )
}

export default memo(PostHeader)

interface PostHeaderMenuProps {
  userId: string
  postId: string
}

const PostHeaderMenu = ({ postId, userId }: PostHeaderMenuProps) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const selfPost = userId === getCurrentUserId()
  const [deletingPost, setDeletingPost] = useState(false)
  const { deletePost } = usePostSlice()
  const { updateUser, user } = useAuth()
  const { deleteFeed } = useFeedSlice()

  const handleClose = () => setModalOpen(false)
  const handleConfirm = () => {
    handleDeletePost()
  }

  const handleOpen = () => {
    setMenu(false)
    setModalOpen(true)
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
      <DropdownMenu open={menu} onOpenChange={() => setMenu(!menu)}>
        <DropdownMenuTrigger>
          <Ellipsis className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-md border-none bg-background-secondary"
          align="end"
        >
          <DropdownMenuItem asChild>
            <Link to={`p/${postId}`} className="hover:text-primary">
              Open Post
            </Link>
          </DropdownMenuItem>
          {selfPost && (
            <DropdownMenuItem asChild>
              <button onClick={handleOpen} className="text-destructive">
                Delete
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={handleClose}
            showCloseButton={false}
            shouldCloseOutsideClick={false}
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
