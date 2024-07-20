import { useEffect, useState } from "react";
import { makeRequest } from "@/config/api.config";
import People from "@/components/shared/People";
import { X } from "lucide-react";

const Likes = ({ like, postId, onClose }: any) => {
  const [likes, setLikes] = useState<any[]>([]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (like > 0) {
          const res = (await makeRequest(`/likes/${postId}`)) as any;
          setLikes(res.likes);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikes();
  }, [like, postId]);

  return (
    <div className="w-screen lg:w-96 max-h-screen relative bg-background overflow">
      <div className="bg-secondary py-3 text-xl px-3 text-foreground flex items-center justify-between  w-full">
        <span>Likes</span>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="h-full">
        <ul className="p-2 flex flex-col h-128 overflow-y-scroll scrollbar-thin ">
          {likes?.map((lk) => {
            return <People key={lk._id} people={lk} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Likes;
