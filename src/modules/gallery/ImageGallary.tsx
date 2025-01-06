import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import {
  ChevronDown,
  CircleFadingPlus,
  PlusSquare,
  SearchIcon,
  Send,
  Share,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import ImageModal from '@/components/shared/dialogs/ImageModal'
import usePostStore from '@/zustand/newPostStore.tsx'
import { useModalStateSlice } from '@/redux/services/modalStateSlice'
import { uploadPosts } from '@/api'

const ImageGallary = () => {
  const [page, setPage] = useState(1)
  const [images, setImages] = useState<any>([])
  const [videos, setVideos] = useState<any>([])
  const [searchQuery, setSearchQuery] = useState('nature')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [openImage, setOpenImage] = useState<any>(null)
  const { setModalState } = useModalStateSlice()
  const { setInitialImage } = usePostStore()
  const [mode, setMode] = useState<'image' | 'video'>('video')

  const fetchImages = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `https://api.pexels.com/v1/search?query=${debouncedSearch ?? 'sport'}&per_page=20&page=${page}&orientation=portrait`,
          {
            headers: {
              Authorization: import.meta.env.VITE_DEV_PIXEL_API_KEY,
            },
          }
        )
        if (page === 1) {
          setImages(res.data.photos)
        } else {
          setImages((prev: any) => [...prev, ...res.data.photos])
        }
      } catch (error) {
        console.log(error)
      }
    },
    [page, debouncedSearch]
  )
  const fetchVideos = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `https://api.pexels.com/videos/search?query=${debouncedSearch}&per_page=20&page=${page}&orientation=portrait`,
          {
            headers: {
              Authorization: import.meta.env.VITE_DEV_PIXEL_API_KEY,
            },
          }
        )
        if (page === 1) {
          setVideos(res.data.videos)
        } else {
          setVideos((prev: any) => [...prev, ...res.data.videos])
        }
      } catch (error) {
        console.log(error)
      }
    },
    [page, debouncedSearch, mode]
  )

  useEffect(() => {
    if (mode === 'video') {
      fetchVideos(page)
    } else {
      fetchImages(page)
    }
  }, [fetchImages])

  const fetchAgain = () => {
    if (debouncedSearch.length >= 3) {
      fetchImages(1)
    }
  }

  const loadNext = () => {
    setPage((prev) => prev + 1)
  }

  const handleNewPost = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    image: string
  ) => {
    e.stopPropagation()
    setInitialImage(image)
    setModalState('openPostModal')
  }

  return (
    <div className="relative flex h-screen flex-col">
      <div className="flex items-center gap-10">
        <h1 className="p-5 text-3xl font-bold">Image and Video Gallary</h1>
        <button
          className="rounded-md border border-background/50 p-2 px-3 transition-all duration-200 hover:bg-background hover:text-white"
          onClick={() => setMode(mode === 'image' ? 'video' : 'image')}
        >
          {mode === 'image' ? 'Image' : 'Video'}
        </button>
        <label
          htmlFor="reelupload"
          className="cursor-pointer rounded-md border border-background/50 p-2 px-3 transition-all duration-200 hover:bg-background hover:text-white"
        >
          Uploade New Reel
          <input
            type="file"
            hidden
            name="reel"
            id="reelupload"
            accept="video/*"
            onChange={async (e) => {
              const files = e.target.files
              if (files) {
                const formData = new FormData()
                for (let i = 0; i < files.length; i++) {
                  formData.append('postImage', files[i])
                }
                formData.append('caption', '')
                formData.append('aspectRatio', (9 / 16).toString())
                formData.append('postType', 'REEL')
                const data = (await uploadPosts(formData)) as any

                console.log(data)
              }
            }}
          />
        </label>
      </div>
      <div className="z-10 flex items-center gap-2 p-3">
        <input
          className="w-96 rounded-sm border border-border bg-background p-2 text-sm placeholder:text-[#a8a8a8] focus:outline-none"
          placeholder="Search"
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          value={searchQuery}
        />
        <span
          className="flex cursor-pointer items-center justify-center rounded-sm bg-background"
          onClick={fetchAgain}
        >
          <SearchIcon className="size-9 p-2" />
        </span>
      </div>
      <div className="grid h-screen grid-cols-2 gap-5 overflow-y-scroll p-5 scrollbar-thin md:grid-cols-4 md:gap-10 md:p-10">
        {mode === 'image' &&
          images.map((image: any) => {
            return (
              <div
                onClick={() => {
                  setOpenImage(image)
                }}
                className="group relative overflow-clip rounded-md bg-black transition-all duration-300 hover:scale-110 hover:shadow-[0_0_0_5px_black]"
              >
                <img
                  src={image.src.medium}
                  className="h-full w-full rounded-md object-cover transition-all duration-200 group-hover:h-[85%]"
                  loading="lazy"
                />
                <div className="absolute bottom-0 flex w-full translate-y-40 justify-between gap-1 bg-black bg-opacity-20 p-2 backdrop-blur-md transition-transform duration-200 group-hover:translate-y-0">
                  <Button size={'icon'}>
                    <Share className="size-4 md:size-6" />
                  </Button>
                  <Button size={'icon'}>
                    <CircleFadingPlus className="size-4 md:size-6" />
                  </Button>
                  <Button size={'icon'}>
                    <Send className="size-4 md:size-6" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      handleNewPost(e, image.src.original)
                    }}
                    size={'icon'}
                  >
                    <PlusSquare className="size-4 md:size-6" />
                  </Button>
                </div>
              </div>
            )
          })}
        {videos.map((video: any) => {
          return (
            <div className="group relative overflow-clip rounded-md bg-black transition-all duration-300 hover:scale-110 hover:shadow-[0_0_0_5px_black]">
              <video
                controls
                src={video.video_files[0].link}
                className="h-full w-full rounded-md object-cover transition-all duration-200 group-hover:h-[85%]"
              />
              <div className="absolute bottom-0 flex w-full translate-y-40 justify-between gap-1 bg-black bg-opacity-20 p-2 backdrop-blur-md transition-transform duration-200 group-hover:translate-y-0">
                <Button size={'icon'}>
                  <Share className="size-4 md:size-6" />
                </Button>
                <Button size={'icon'}>
                  <CircleFadingPlus className="size-4 md:size-6" />
                </Button>
                <Button size={'icon'}>
                  <Send className="size-4 md:size-6" />
                </Button>
                <Button
                  onClick={(e) => {
                    handleNewPost(e, video.video_files[0].link)
                  }}
                  size={'icon'}
                >
                  <PlusSquare className="size-4 md:size-6" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="absolute bottom-10 right-10 m-2 flex items-center justify-end rounded-full md:m-4">
        <Button
          onClick={loadNext}
          variant={'outline'}
          size={'icon'}
          className="h-full w-full rounded-full p-3 md:w-auto"
        >
          <ChevronDown />
        </Button>
      </div>

      {openImage && (
        <ImageModal openImage={openImage} setOpenImage={setOpenImage} />
      )}
    </div>
  )
}

export default ImageGallary
