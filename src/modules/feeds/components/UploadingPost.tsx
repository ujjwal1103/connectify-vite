import { UploadPost } from '@/stores/posts/types'
import { Loader } from 'lucide-react'

const UploadingPost = ({ uploadingPost }: { uploadingPost: UploadPost }) => {
  return (
    <div className="mb-2 flex items-center gap-3 rounded bg-background p-2">
      <div>
        <img
          className="size-10 rounded bg-secondary"
          src={uploadingPost.image!}
          alt="Post Image"
        />
      </div>
      <div className="flex items-center gap-3">
        <span>Uploading Post... </span>{' '}
      </div>
      <span className="ml-auto px-3">
        <Loader size={16} className="animate-spin" />
      </span>
    </div>
  )
}

export default UploadingPost
