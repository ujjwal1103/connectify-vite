import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import ImageComponent from '../Image/ImageComponent'
import { IIamge } from '@/lib/types'

export const ImageSlider = ({ images, width, aspect, resizeMode }: any) => {
  return (
    <Carousel
      defaultChecked={true}
      className="relative block bg-background h-full"
      style={{ width }}

    >
      <CarouselContent className="w-full h-full">
        {images.map((image: IIamge, index: number) => (
          <CarouselItem
            nonce=""
            key={index}
            style={{ width, aspectRatio: aspect && '1', objectFit:resizeMode }}
          >
            {image.type === 'IMAGE' ? (
              <ImageComponent
                src={image.url}
                width={width}
                className="h-full w-full object-contain"
                resizeMode={resizeMode}
              />
            ) : (
              <video
                controls
                width={width}
                className="h-full w-full object-cover"
              >
                <source src={image.url} />
              </video>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="right-1 size-3 border-none bg-transparent shadow-none hover:bg-transparent md:right-3 md:size-5" />
      <CarouselPrevious className="left-1 size-3 border-none bg-transparent shadow-none hover:bg-transparent md:left-3 md:size-5" />
    </Carousel>
  )
}
