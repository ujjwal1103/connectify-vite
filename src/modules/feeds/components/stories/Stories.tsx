import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import Avatar from "@/components/shared/Avatar";
import { CircleChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const storyImages = [
  {
    story_id: "1",
    user_id: "1001",
    user_name: "john_doe",
    user_profile_picture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    story_image_url:
      "https://images.unsplash.com/photo-1534126511673-b6899657816a",
    timestamp: "2024-05-27T10:00:00Z",
  },
  {
    story_id: "2",
    user_id: "1002",
    user_name: "jane_smith",
    user_profile_picture:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
    story_image_url:
      "https://images.unsplash.com/photo-1534081333815-ae5019106622",
    timestamp: "2024-05-27T10:05:00Z",
  },
  {
    story_id: "3",
    user_id: "1003",
    user_name: "alice_jones",
    user_profile_picture:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    story_image_url:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    timestamp: "2024-05-27T10:10:00Z",
  },
  {
    story_id: "4",
    user_id: "1004",
    user_name: "bob_martin",
    user_profile_picture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    story_image_url:
      "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb",
    timestamp: "2024-05-27T10:15:00Z",
  },
  {
    story_id: "5",
    user_id: "1005",
    user_name: "charlie_clark",
    user_profile_picture:
      "https://images.unsplash.com/photo-1507537509458-b8312d35a233",
    story_image_url:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    timestamp: "2024-05-27T10:20:00Z",
  },
  {
    story_id: "6",
    user_id: "1006",
    user_name: "diana_wright",
    user_profile_picture:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    story_image_url:
      "https://images.unsplash.com/photo-1515376721779-7db6951da88d",
    timestamp: "2024-05-27T10:25:00Z",
  },
  {
    story_id: "7",
    user_id: "1007",
    user_name: "edward_hall",
    user_profile_picture:
      "https://images.unsplash.com/photo-1522364723953-452d3431c267",
    story_image_url:
      "https://images.unsplash.com/photo-1519882175379-fb77aaff82d0",
    timestamp: "2024-05-27T10:30:00Z",
  },
  {
    story_id: "8",
    user_id: "1008",
    user_name: "fiona_lee",
    user_profile_picture:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    story_image_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    timestamp: "2024-05-27T10:35:00Z",
  },
  {
    story_id: "9",
    user_id: "1009",
    user_name: "george_scott",
    user_profile_picture:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
    story_image_url:
      "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759",
    timestamp: "2024-05-27T10:40:00Z",
  },
  {
    story_id: "10",
    user_id: "1010",
    user_name: "hannah_walker",
    user_profile_picture:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    story_image_url:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    timestamp: "2024-05-27T10:45:00Z",
  },
  {
    story_id: "11",
    user_id: "1011",
    user_name: "ian_adams",
    user_profile_picture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    story_image_url:
      "https://images.unsplash.com/photo-1519337265831-281ec6cc8514",
    timestamp: "2024-05-27T10:50:00Z",
  },
  {
    story_id: "12",
    user_id: "1012",
    user_name: "jessica_brown",
    user_profile_picture:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
    story_image_url:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    timestamp: "2024-05-27T10:55:00Z",
  },
  {
    story_id: "13",
    user_id: "1013",
    user_name: "kevin_white",
    user_profile_picture:
      "https://images.unsplash.com/photo-1519337265831-281ec6cc8514",
    story_image_url:
      "https://images.unsplash.com/photo-1519882175379-fb77aaff82d0",
    timestamp: "2024-05-27T11:00:00Z",
  },

  {
    story_id: "16",
    user_id: "1016",
    user_name: "nina_martinez",
    user_profile_picture:
      "https://images.unsplash.com/photo-1522364723953-452d3431c267",
    story_image_url:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    timestamp: "2024-05-27T11:15:00Z",
  },
  {
    story_id: "17",
    user_id: "1017",
    user_name: "oliver_james",
    user_profile_picture:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    story_image_url:
      "https://images.unsplash.com/photo-1534081333815-ae5019106622",
    timestamp: "2024-05-27T11:20:00Z",
  },
  {
    story_id: "18",
    user_id: "1018",
    user_name: "peter_clark",
    user_profile_picture:
      "https://images.unsplash.com/photo-1507537509458-b8312d35a233",
    story_image_url:
      "https://images.unsplash.com/photo-1534126511673-b6899657816a",
    timestamp: "2024-05-27T11:25:00Z",
  },

  {
    story_id: "20",
    user_id: "1020",
    user_name: "rachel_hall",
    user_profile_picture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    story_image_url:
      "https://images.unsplash.com/photo-1515376721779-7db6951da88d",
    timestamp: "2024-05-27T11:35:00Z",
  },
];

const Stories = () => {
  const [stories, _] = useState(storyImages); // Assuming storyImages is defined elsewhere
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef?.current?.scrollBy({
        left: -625-10, // Adjust as needed
        behavior: 'smooth',
      });
    }
  };  

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 625+10, // Adjust as needed
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className="md:max-w-[625px] w-full flex items-center z-0 min-h-16 overflow-hidden relative ">
      <div className="flex max-h-20 overflow-x-scroll scrollbar-none" ref={scrollContainerRef}>
        {stories.map((story, index) => (
          <div key={index} className="flex basis-4 mr-2 first:ml-2 items-center justify-center">
            <div className="  bg-gradient-to-r from-amber-500 to-pink-500 rounded-full  flex items-center justify-center">
              <div className="p-[2px] flex  items-center justify-center rounded-full">
                <Avatar
                  className="w-12 h-12 rounded-full object-cover"
                  src={story.user_profile_picture}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

       {/* Scroll buttons */}
       <div className="flex justify-between mt-2 absolute top-6 -translate-y-1/2 w-full">
        <button onClick={scrollLeft} className="bg-transparent  text-sm ml-2 p-1  absoulute right-0  rounded-full disabled:opacity-50">
        <IoChevronBackCircle size={24}/>
        </button>
        <button onClick={scrollRight} className="bg-transparent text-sm mr-2 p-1 text-white absoulute right-0 rounded-full disabled:opacity-50">
        <IoChevronForwardCircle size={24}/>
        </button>
      </div>
    </div>
  );
};

export default Stories;
