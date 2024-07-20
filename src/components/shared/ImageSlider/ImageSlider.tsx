import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageComponent from "../Image/ImageComponent";

export const ImageSlider = ({ images, width, aspect }: any) => {
  return (
    <Carousel
      defaultChecked={true}
      className=" w-full relative block  "
      style={{ width }}
    >
      <CarouselContent className="w-full ">
        {images.map((image: any, index: number) => (
          <CarouselItem
            nonce=""
            key={index}
            style={{ width, aspectRatio: aspect && "1" }}
          >
            {image.type === "IMAGE" ? (
              <ImageComponent
                src={image.url}
                width={width}
                className="w-full h-full object-cover "
              />
            ) : (
              <video
                controls
                width={width}
                className="w-full h-full object-cover   "
              >
                <source src={image.url} />
              </video>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="md:right-3 right-1 bg-transparent shadow-none border-none md:size-5 size-3 hover:bg-transparent" />
      <CarouselPrevious className="md:left-3 left-1 bg-transparent shadow-none border-none md:size-5 size-3 hover:bg-transparent" />
    </Carousel>
  );
};
