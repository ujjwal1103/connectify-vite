import { useEffect, useState } from 'react'
import { makeRequest } from '@/config/api.config'
import People from '@/components/shared/People'
import { ChevronLeft, X } from 'lucide-react'

const Likes = ({ like, postId, onClose }: any) => {
  const [likes, setLikes] = useState<any[]>([])

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (like > 0) {
          const res = (await makeRequest(`/likes/${postId}`)) as any
          setLikes(res.likes)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchLikes()
  }, [like, postId])

  return (
    <div className="relative h-dvh md:h-auto max-h-dvh w-screen bg-background md:w-128">
      <div className="flex w-full items-center justify-between border-b-[0.5px] border-border p-3 text-xl text-foreground">
        <div className='flex items-center gap-3'>
          <button onClick={onClose} className='md:hidden'>
            <ChevronLeft />
          </button>
          <span>Likes</span>
        </div>
        <button onClick={onClose} className='md:block hidden'>
          <X />
        </button>
      </div>
      <div className="h-full">
        <ul className="flex md:max-h-128 md:h-128 max-h-full flex-col overflow-y-auto scrollbar-thin">
          {likes?.map((lk) => {
            return <People key={lk._id} people={lk} />
          })}
        </ul>
      </div>
    </div>
  )
}

export default Likes
