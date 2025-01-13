import { useModalStateSlice } from '@/redux/services/modalStateSlice'

const NoPosts = () => {
  const { setModalState } = useModalStateSlice()

  return (
    <div className="flex md:h-44 w-full flex-col items-center justify-center gap-3 bg-background p-2 h-dvh">
      <span>Start Following Peoples to see there posts</span>
      <button
        className="rounded bg-blue-600 p-2 hover:bg-blue-700"
        onClick={() => setModalState('openPostModal')}
      >
        Create New Post
      </button>
    </div>
  )
}

export default NoPosts
