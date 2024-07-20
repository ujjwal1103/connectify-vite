import {
  Carousel,
  CarouselContent,
  CarouselItem,
  //   CarouselNext,
  //   CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import React from "react";

export const PageSlider = ({ items = [1, 2], setCurrent }: any) => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("scroll", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel className=" bg-red-400 relative block w-96 h-96" setApi={setApi}>
      <CarouselContent
        className="w-ful bg-green-200 h-96"
        onSelect={(i) => {
          console.log(i);
        }}
      >
        {items.map((item: any) => (
          <CarouselItem key={item} className="w-full h-full">
            Test {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselNext className="md:right-3 right-1 bg-transparent shadow-none border-none md:size-5 size-3 hover:bg-transparent" />
      <CarouselPrevious className="md:left-3 left-1 bg-transparent shadow-none border-none md:size-5 size-3 hover:bg-transparent" /> */}
    </Carousel>
  );
};
