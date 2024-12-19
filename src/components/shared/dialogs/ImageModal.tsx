import { useState } from 'react'

import Modal from '../modal/Modal'
import { Button } from '@/components/ui/button'
import { CircleFadingPlus, Download, PlusSquare, Save, SendIcon, Share } from 'lucide-react'

const ImageModal = ({ openImage, setOpenImage }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false) // Track if the main image has loaded

  const handleImageLoad = () => {
    console.log('Main image loaded')
    setImageLoaded(true) // Set to true when the main image is loaded
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Share Image',
        text: 'Check out this image!',
        url: openImage.src.original,
      }).catch((error) => console.log('Error sharing:', error))
    } else {
      console.log('Sharing not supported in this browser')
    }
  }

  const handleAddToCollection = () => {
    console.log('Image added to collection');
    // You can implement a function to add to a collection
  }

  // Handle sending the image (could be an API or email send)
  const handleSend = () => {
    console.log('Send Image');
    // Add the sending functionality (email, message, etc.)
  }

  // Handle creating a new project or action with the image
  const handleCreateProject = () => {
    console.log('Create new project with the image');
    // Implement project creation functionality
  }

  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = openImage.src.original;
    link.target = '_blank'; // Open the image in a new tab
    link.download = 'image.jpg'; // You can change this name dynamically
  
    // Append the link to the body and trigger a click event
    document.body.appendChild(link);
    link.click();
  
    // Clean up by removing the link from the document
    document.body.removeChild(link);
  }


  return (
    <Modal animate={false} onClose={() => setOpenImage(null)}>
      <div className="group relative md:h-144 h-dvh w-screen md:w-auto overflow-clip rounded-md bg-black transition-all duration-300 hover:scale-110 hover:shadow-[0_0_0_5px_black]">
        {/* Placeholder Image */}
        {/* Main Image */}
        <img
          src={openImage.src.original} // The main image path
          className={`z-20 h-full w-full rounded-md object-contain md:object-cover transition-opacity duration-200`}
          onLoad={handleImageLoad} // Trigger onLoad event when the main image finishes loading
          alt="Main Image"
          loading="lazy"
        />

        {/* Bottom action buttons */}
        <div className="absolute bottom-0 flex w-full md:translate-y-40 justify-start gap-4 bg-black bg-opacity-20 p-2 backdrop-blur-md transition-transform duration-200 group-hover:translate-y-0">
          <Button onClick={handleShare} size={'icon'}>
            <Share className="size-4 md:size-6" />
          </Button>
          <Button size={'icon'}>
            <CircleFadingPlus className="size-4 md:size-6" />
          </Button>
          <Button size={'icon'}>
            <SendIcon className="size-4 md:size-6" />
          </Button>
          <Button size={'icon'}>
            <PlusSquare className="size-4 md:size-6" />
          </Button>
          <Button onClick={handleDownload} size={'icon'} className='ml-auto'>
            <Download className="size-4 md:size-6" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ImageModal
