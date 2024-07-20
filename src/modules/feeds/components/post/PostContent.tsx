import { ImageSlider } from "@/components/shared/ImageSlider/ImageSlider";
import { IIamge } from "@/lib/types";
import { useRef } from "react";

type PostContentProps = {
  contentUrls: IIamge[];
};

const PostContent = ({ contentUrls }: PostContentProps) => {

  const ref = useRef<any>();
  return (
    <div ref={ref} className="overflow-hidden ">
      <div className="relative overflow-hidden h-full w-full block" style={{display:'block'}}>
        <div className="w-full h-full block">
          <ImageSlider images={contentUrls} width={ref?.current?.clientWidth} />
        </div>
      </div>
    </div>
  );
};

export default PostContent;
