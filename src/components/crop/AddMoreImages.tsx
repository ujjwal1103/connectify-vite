import { ImagePlus, Layers2, XIcon } from 'lucide-react'
import { ReactSortable } from 'react-sortablejs'
import { ChangeEvent, useState } from 'react'

const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  ghostClass: 'ghost',
  group: 'shared',
  forceFallback: true,
}

const AddMoreImages = ({
  croppedImageUrls,
  setCroppedImagesUrls,
  clearImage,
  selectImage,
  handleImagePick,
}: {
  croppedImageUrls: any[]
  setCroppedImagesUrls: (url: string[]) => void
  clearImage: (name: string) => void
  selectImage: (name: string) => void
  handleImagePick: (e: ChangeEvent<HTMLInputElement>) => void
}) => {
  const [openImages, setOpenImages] = useState(false)
  return (
    <div className="ml-auto">
      <button
        onClick={() => setOpenImages(!openImages)}
        className="m-2 flex size-10 items-center justify-center rounded-full bg-black bg-opacity-65"
      >
        <Layers2 size={24} />
      </button>
      {openImages && (
        <div className="absolute bottom-12 right-0 mb-2 mr-2 flex gap-4 rounded-md bg-zinc-950 bg-opacity-85 p-4">
          <ReactSortable
            list={croppedImageUrls}
            setList={setCroppedImagesUrls}
            {...sortableOptions}
            className="flex gap-3"
          >
            {croppedImageUrls?.map((img: any) => (
              <div className="relative">
                <button
                  className="absolute -right-2 -top-2 rounded-md bg-red-500 p-1 font-semibold text-white"
                  onClick={() => {
                    clearImage(img.name)
                  }}
                >
                  <XIcon size={16} />
                </button>
                {img.type === 'VIDEO' ? (
                  <video
                    className="h-16 w-16 rounded-md object-cover"
                    onClick={() => selectImage(img.name)}
                  >
                    <source src={img.url} />
                  </video>
                ) : (
                  <img
                    src={img.url}
                    className="h-16 w-16 rounded-md object-cover"
                    alt={img.name}
                    onClick={() => selectImage(img.name)}
                  />
                )}
              </div>
            ))}
          </ReactSortable>
          <div className="m-2 flex size-10 items-center justify-center rounded-md border border-dashed bg-black">
            <input
              type="file"
              name="imagePicker"
              id="imagePicker"
              hidden
              accept="image/*"
              onChange={handleImagePick}
            />
            <label
              className="flex h-12 w-12 cursor-pointer items-center justify-center text-white"
              htmlFor="imagePicker"
            >
              <ImagePlus size={24} />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddMoreImages
