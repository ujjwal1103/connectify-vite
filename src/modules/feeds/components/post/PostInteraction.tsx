import { useState } from 'react'

import Caption from './Caption'
import Modal from '@/components/shared/modal/Modal'
import Likes from './Likes'
import { AnimatePresence } from 'framer-motion'

const PostInteraction = ({ post: { _id, user, like, caption } }: any) => {
  const [openLikes, setOpenLikes] = useState(false)

  return (
    <div className="flex flex-col justify-center overflow-hidden p-2 py-2">
      <button className="text-left text-sm" onClick={() => setOpenLikes(true)}>
        {like === 0 ? '' : `${like} ${like === 1 ? 'like' : 'likes'}`}
      </button>
      {caption && <Caption caption={caption} user={user} showUser={true} />}

      <AnimatePresence>
        {openLikes && (
          <Modal
            onClose={() => {
              setOpenLikes(false)
            }}
            showCloseButton={false}
          >
            <Likes like={like} postId={_id} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PostInteraction
