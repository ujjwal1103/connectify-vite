import { uploadPosts } from '@/api'
import Avatar from '@/components/shared/Avatar'
import { ImageSlider } from '@/components/shared/ImageSlider/ImageSlider'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useAuth } from '@/context/AuthContext'
import { IUser } from '@/lib/types'
import { usePostSlice } from '@/redux/services/postSlice'
import EmojiPicker from '@emoji-mart/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@radix-ui/react-dropdown-menu'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader, SmileIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CaptionComponent = ({
  setStep,
  cropedImagesUrls,
  aspectRatio,
  onClose,
}: any) => {
  const [caption, setCaption] = useState<string>('')
  const [isLoading, setIsLoading] = useState<any>(false)
  const { addPost } = usePostSlice()
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
      const data = (await uploadPosts(formData)) as any

      if (data?.isSuccess) {
        addPost(data.post)
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="lg:aspect-video relative flex h-dvh w-screen flex-col bg-black md:h-full md:w-192"
    >
      <div className="flex justify-between bg-secondary p-2">
        <button
          className="middle none center rounded-md font-sans text-sm font-bold uppercase text-white transition-all focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none md:px-4 md:py-2"
          data-ripple-light="true"
          onClick={() => {
            setStep('Crop')
          }}
          disabled={!cropedImagesUrls.length}
        >
          <ArrowLeft />
        </button>
        {isLoading ? (
          <span
            className="middle none center rounded-lg px-4 py-2 font-sans text-sm font-bold uppercase text-white transition-all focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
          >
            <Loader className="animate-spin" />
          </span>
        ) : (
          <button
            className="middle none center rounded-lg px-4 py-2 font-sans text-sm font-bold uppercase text-white transition-all focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            onClick={handlePost}
            disabled={!cropedImagesUrls.length}
          >
            Post
          </button>
        )}
      </div>
      <div className="relative flex flex-col md:flex-1 lg:flex-row">
        <div className="flex flex-1">
          <ImageSlider
            images={cropedImagesUrls.map((c: any) => ({
              url: c.croppedUrl,
              type: c.type,
            }))}
            height="100%"
          />
        </div>
        <div className="grid flex-1 grid-rows-[auto_1fr_auto] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar src={user?.avatar?.url} className="size-8 border-none" />
            <span className="text-sm">{user?.username}</span>
          </div>
          <div className="h-full w-full p-3 scrollbar-thin md:h-64">
            <RichTextEditor
              value={caption}
              onChange={setCaption}
              className="h-full w-full overflow-hidden focus-visible:outline-none"
            />
          </div>

          <div className="fixed bottom-0 flex w-full items-center justify-between gap-3 px-4 py-3 md:static">
            <motion.div drag>
              <DropdownMenu>
                <DropdownMenuTrigger className="pr-2">
                  <span>
                    <SmileIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="rounded-md border-none"
                  align="end"
                >
                  <EmojiPicker
                    onEmojiSelect={(event: any) => {
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
            </motion.div>
            <span className="text-sm">{caption.length}/2,200</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CaptionComponent
