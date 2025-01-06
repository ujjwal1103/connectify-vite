/* eslint-disable import/no-unresolved */
import { uploadPosts } from '@/api'
import Avatar from '@/components/shared/Avatar'
import { ImageSlider } from '@/components/shared/ImageSlider/ImageSlider'
import ProgressLoading from '@/components/shared/Loading/ProgressLoading'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useAuth } from '@/context/AuthContext'
import { IPost, IUser } from '@/lib/types'
import { useFeedSlice } from '@/redux/services/feedSlice'
import { usePostSlice } from '@/redux/services/postSlice'
import EmojiPicker from '@emoji-mart/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@radix-ui/react-dropdown-menu'
import { motion } from 'framer-motion'
import { ArrowLeft, SmileIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CaptionComponent = ({
  setStep,
  cropedImagesUrls,
  aspectRatio,
  onClose,
}: { 
  setStep: (step: string) => void; 
  cropedImagesUrls: { file: File; croppedUrl: string; type: string }[]; 
  aspectRatio: string; 
  onClose: () => void; 
}) => {
  const [caption, setCaption] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { addPost } = usePostSlice()
  const { addNewFeed } = useFeedSlice()
  const { updateUser, user } = useAuth()

  const handlePost = async () => {
    if (!cropedImagesUrls.length) {
      alert('Please select an image')
      return
    }
    try {
      setIsLoading(true)
      const formData = new FormData()
      for (let i = 0; i < cropedImagesUrls.length; i++) {
        formData.append('postImage', cropedImagesUrls[i].file)
      }
      formData.append('caption', caption || '')
      formData.append('aspectRatio', aspectRatio)
      const response = await uploadPosts(formData);
      const data = response.data as { isSuccess: boolean; post: IPost };

      if (data?.isSuccess) {
        addPost(data.post)
        addNewFeed(data.post)
        const posts = user?.posts || 0
        const newUser = { ...user, posts: posts + 1 } as IUser
        updateUser(newUser)
        toast('Image Uploade SuccessFully')
        onClose()
      }
    } catch (error) {
      console.log('ERROR UPLOADING POST', error)
      toast.error('Error Uploading Post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div className="flex h-dvh max-h-dvh w-screen flex-col bg-background md:m-auto md:w-2/3 lg:h-1/2 lg:w-4/5">
      {isLoading && <ProgressLoading />}
      <div className="flex w-full justify-between bg-background p-2">
        <button
          className="middle none center rounded-md font-sans text-sm font-bold uppercase text-white transition-all focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none md:px-4 md:py-2"
          data-ripple-light="true"
          onClick={() => {
            setStep('Crop')
          }}
          disabled={!cropedImagesUrls.length || isLoading}
        >
          <ArrowLeft />
        </button>

        <button
          className="middle none center rounded-lg px-4 py-2 font-sans text-sm font-bold uppercase text-white transition-all focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          data-ripple-light="true"
          onClick={handlePost}
          disabled={!cropedImagesUrls.length || isLoading}
        >
          Post
        </button>
      </div>
      <div className="flex h-full flex-1 flex-col-reverse lg:flex-row-reverse">
        <div className="flex h-full flex-1 flex-col lg:h-auto">
          <div className="flex items-center gap-3 p-3">
            <Avatar src={user?.avatar?.url} className="size-8 border-none" />
            <span className="text-sm">{user?.username}</span>
          </div>
          <div className="h-full max-h-fit w-full flex-1  p-3">
            <RichTextEditor
              value={caption}
              onChange={setCaption}
              className="h-full max-h-[115px] w-full flex-1 overflow-y-scroll scrollbar-none outline-none lg:max-h-full"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <div className='z-10'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <SmileIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="rounded-md border-none"
                  align="end"
                  alignOffset={200}
                >
                  <EmojiPicker
                    onEmojiSelect={(event: { native: string }) => {
                      const emoji = event.native
                      console.log(caption + emoji)
                      setCaption((prev = '') => prev + emoji)
                    }}
                    searchPosition="none"
                    previewPosition="none"
                    navPosition="bottom"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className="text-sm">{caption.length}/2,200</span>
          </div>
        </div>
        <div className="flex items-center justify-center lg:flex-1">
          <ImageSlider
            images={cropedImagesUrls.map((c: { file: File; croppedUrl: string; type: string }) => ({
              url: c.croppedUrl,
              type: c.type,
            }))}
            height="100%"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default CaptionComponent
