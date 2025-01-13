import { useState } from 'react'
import { format } from 'date-fns'
import { ImageSlider } from '../ImageSlider/ImageSlider'
import { updatePost } from '@/api'
import { usePostSlice } from '@/redux/services/postSlice'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'

const EditPostModal = ({ onClose, post }: any) => {
  const [caption, setCaption] = useState(post?.caption)
  const [updating, setUpdating] = useState(false)
  const { updatePost: updateCurrenPost } = usePostSlice()

  const handleEditCaption = async () => {
    try {
      setUpdating(true)
      const res = await updatePost(caption, post._id)
      if (res.isSuccess) {
        const updatedPost = {
          ...post,
          updatedAt: res.post.updatedAt,
          caption: res.post.caption,
          hastags: res.post.hastags,
        }
        console.log(updatedPost)
        updateCurrenPost(updatedPost)
        toast.success('Post Updated Successfully')
      }
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setUpdating(false)
    }
  }
  return (
    <div>
      <div className="flex items-center justify-center overflow-hidden text-center sm:block sm:p-0 md:max-h-dvh md:px-4 md:pb-20 md:pt-4">
        <div className="inline-block h-dvh w-screen transform overflow-y-scroll rounded-lg bg-zinc-900 px-4 pb-4 pt-0 text-left align-bottom text-white shadow-xl transition-all sm:my-8 sm:p-6 sm:align-middle md:h-auto md:max-h-[600px] md:w-[700px] md:overflow-hidden md:pt-5">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="py-2 text-lg font-medium leading-6">Edit Post</h3>
              <div className="flex flex-col gap-2 md:flex-row md:gap-5">
                <div>
                  <div className="aspect-square w-full overflow-clip rounded-md md:w-72">
                    <ImageSlider
                      images={post.images}
                      aspect={true}
                      readOnly={true}
                    />
                  </div>
                  <p className="mt-2 hidden text-sm text-gray-400 md:block">
                    {format(new Date(), 'MMM dd, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="">
                    <textarea
                      onChange={(e) => setCaption(e.target.value)}
                      rows={5}
                      value={caption}
                      className="block h-72 w-full resize-none rounded-md bg-zinc-800 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter new caption"
                      required
                    />
                  </div>
                  <div className="mt-2 flex gap-3 sm:mt-4 sm:flex-row-reverse md:mt-5">
                    <Button
                      variant={'secondary'}
                      disabled={updating}
                      onClick={handleEditCaption}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:text-sm md:mt-0"
                    >
                      Save
                    </Button>
                    <Button
                      disabled={updating}
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPostModal
