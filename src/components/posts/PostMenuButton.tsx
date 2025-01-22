import { AnimatePresence } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import PostOptions from '../PostOptions'
import { IPost } from '@/lib/types'
import { Button } from '../ui/button'

interface Props {
  post: IPost
}

const PostMenuButton = ({ post }: Props) => {
  const [menu, setMenu] = useState(false)
  return (
    <div>
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={() => setMenu(true)}
        className="ml-auto"
      >
        <MoreHorizontal className="cursor-pointer" />
      </Button>

      <AnimatePresence>
        {menu && (
          <PostOptions
            handleDelete={() => {}}
            post={post}
            open={menu}
            onClose={() => setMenu(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PostMenuButton
