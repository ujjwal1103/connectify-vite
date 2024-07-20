import { CommentIcon } from "@/components/icons";
import Avatar from "@/components/shared/Avatar";
import { LikeButton } from "@/components/shared/LikeButton";
import { Ellipsis, Play, Send } from "lucide-react";

const src =
  "https://images.pexels.com/photos/12882773/pexels-photo-12882773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const Reels = () => {
  return (
    <div className="flex items-center justify-center py-10 h-dvh">
      <div className="my-3 h-full overflow-y-scroll bg-background  scrollbar-none rounded-xl w-1/3 snap-mandatory snap-both">
        {Array(12)
          .fill(1)
          .map((_, it) => (
            <div key={it} className="h-full snap-start relative">
              <div className="h-full ">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
              <div className=" absolute top-0 flex items-center justify-center w-full h-full">
                <div>
                  <span>
                    <Play size={50} />
                    {/* <Pause size={50} /> */}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 w-full p-3  flex">
                <div className="self-end">
                  <div className="flex items-center gap-3">
                    <div>
                      <Avatar
                        src="https://images.pexels.com/photos/806835/pexels-photo-806835.jpeg?auto=compress&cs=tinysrgb&w=600"
                        className="w-10 shadow-md"
                      />
                    </div>
                    <div>
                      <span className="">Ujjwal Lade</span>
                    </div>
                    <div>
                      <button className="px-2 border rounded">follow</button>
                    </div>
                  </div>
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Fuga, suscipit?
                  </div>
                </div>
                <div className="items-center h-full p-3 gap-2 flex flex-col justify-end ">
                  <div className="flex flex-col items-center cursor-pointer">
                    <Ellipsis />
                  </div>
                  <div className="flex flex-col items-center text-xl">
                    <LikeButton id={''} isLiked={true} postUserId={""} size={0} />
                    <span className="text-sm">218k</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CommentIcon />
                    <span>10k</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Send />
                    <span>1.3k</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reels;
