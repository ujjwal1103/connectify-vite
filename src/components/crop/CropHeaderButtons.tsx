import { Loader } from 'lucide-react'

const CropHeaderButtons = ({
  onResetAndClose,
  onCropImage,
  isCaptionOpen,
  isLoadingPost
}: {
  onResetAndClose: () => void
  onCropImage: (val: boolean) => void
  isCaptionOpen: boolean
  isLoadingPost: boolean
}) => {
  return (
    <div className="w-full">
      <div className="flex w-full justify-between rounded-lg rounded-b-none bg-[#000000] p-2">
        <button onClick={onResetAndClose} className="text-white">
          Back
        </button>
        {isLoadingPost && <Loader />}
        <button onClick={() => onCropImage(false)} className="text-white">
          {isCaptionOpen ? 'Post' : 'Next'}
          
        </button>
      </div>
    </div>
  )
}

export default CropHeaderButtons
