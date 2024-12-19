import { create } from 'zustand'

type PostStore = {
  initialImage: string | null
  setInitialImage: (image: string | null) => void
}

const usePostStore = create<PostStore>((set) => ({
  initialImage: null, // Default value is null
  setInitialImage: (image: string | null) => set({ initialImage: image }), // Set the initial image
}))

export default usePostStore
