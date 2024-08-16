import SuggetionsSlider from "@/components/shared/suggetionsSliders/SuggetionsSlider";
import { Lock } from "lucide-react";

export const PrivateUser = ({username}:{username:string}) => {
  return (
    <>
      <div className="lg:flex-1 w-full border-t  border-zinc-700 h-52  grid place-content-center">
        <div className="flex flex-col gap-5 text-center items-center">
          <div className="p-2 border-2 rounded-full">
            <Lock size={55} strokeWidth={1} className="" />
          </div>
          <span>This Account is Private</span>
          <span>Follow to see their photos and videos.</span>

          <div></div>
        </div>
      </div>
      <div className="lg:max-w-[834px] xl:max-w-[1000px] md:max-w-[750px] max-w-[1000px] mx-auto">
        {/* <SuggetionsSlider username={username} /> */}
      </div>
    </>
  );
};
