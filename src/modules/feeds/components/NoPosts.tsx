import { useModalStateSlice } from '@/redux/services/modalStateSlice'

const NoPosts = () => {
  const { setModalState, setPostion } = useModalStateSlice()

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-background p-2 md:h-44">
      <span>Start Following Peoples to see there posts</span>
      <button
        id='create'
        className="rounded bg-blue-600 p-2 hover:bg-blue-700"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()

          const top = rect.top + rect.height + 10
          const left = rect.left - (rect.width - rect.width/2)

          setPostion({
            top,
            left,
            bottom: 'auto',
            right: 'auto',
          })

          setModalState('openPostModal')
        }}
      >
        Create New Post
      </button>
    </div>
  )
}

export default NoPosts
