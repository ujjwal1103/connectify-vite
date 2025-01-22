import { IPost } from '@/lib/types'
import { AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { useState } from 'react'
import Modal from '../shared/modal/Modal'
import SendPost from '@/modules/feeds/components/post/SendPost'

interface Props {
  post: IPost
}

const ShareButton = ({ post }: Props) => {
  const [sendPost, setSendPost] = useState(false)
  return (
    <>
      <Send
        onClick={() => setSendPost(true)}
        className="cursor-pointer hover:text-muted-foreground"
      />

      <AnimatePresence>
        {sendPost && (
          <Modal
            shouldCloseOutsideClick={false}
            onClose={() => setSendPost(false)}
            showCloseButton={false}
            // animate={false}
          >
            <SendPost post={post} onClose={() => setSendPost(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}

export default ShareButton
