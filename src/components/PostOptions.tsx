import { IPost } from '@/lib/types'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Link,
  Pencil,
  Share2,
  Star,
  Trash2,
  User,
  UserMinus,
  UserPlus,
  X,
} from 'lucide-react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

interface Props {
  open: boolean
  onClose: () => void
  post: IPost
}

const PostOptions = ({ onClose, post }: Props) => {
  const navigate = useNavigate()
  const variants = {
    close: {
      opacity: 0,
      y: 400,
    },
    open: {
      opacity: 1,
      y: 0,
    },
  }

  const isFollowing = post?.user?.isFollow;

  return createPortal(<div className="fixed inset-0 z-10 flex h-screen w-screen justify-center">
           <motion.div onClick={onClose} initial={{opacity:0}} exit={{opacity:0}} animate={{opacity:0.8}} className='w-screen md:hidden h-screen bg-black'></motion.div>
            <motion.div
              className="absolute bottom-0"
              variants={variants}
              initial="close"
              animate="open"
              exit="close"
              layout
              transition={{ type: 'spring', duration: 0.3, staggerChildren:0.5 }}
            >
              <div className="md:mb-10 md:w-80 w-screen rounded-md bg-zinc-900">
                <div
                  onDrag={onClose}
                  className="flex cursor-grab justify-center p-2"
                >
                  <div className="h-1 w-10 rounded-full bg-zinc-300" />
                </div>
                <div className="space-y-0.5 pb-2">
                  {/* <SheetOption icon={Flag} text="Report" color="text-red-500" /> */}
                  <SheetOption
                    icon={isFollowing ?UserMinus: UserPlus}
                    text={isFollowing?"Unfollow":"Follow"}
                    color={isFollowing?"text-red-500":"text-white"}
                  />
                  <SheetOption icon={Star} text="Add to favorites" />
                  <SheetOption icon={ExternalLink} text="Go to post" onClick={()=>navigate(`/p/${post._id}`)} />
                  <SheetOption icon={Share2} text="Share to..." />
                  <SheetOption icon={Link} text="Copy link" />
                  <SheetOption icon={User} text="About this account" />
                  <SheetOption icon={Pencil} text="Edit" />
                  <SheetOption
                    icon={Trash2}
                    text="Delete"
                    color="text-red-500"
                  />
                  <SheetOption icon={X} text="Cancel" onClick={onClose} />
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
  )
}

interface SheetOptionProps {
  icon: React.ElementType
  text: string
  color?: string
  onClick?: () => void
}

function SheetOption({
  icon: Icon,
  text,
  color = 'text-white',
  onClick,
}: SheetOptionProps) {
  return (
    <button
      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-sm ${color} hover:bg-zinc-800`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      {text}
    </button>
  )
}

export default PostOptions