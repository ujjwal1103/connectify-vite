import Avatar from "@/components/shared/Avatar";
import UsernameLink from "../../shared/UsernameLink";
import { Link } from "react-router-dom";
import FollowButton from "../FollowButton";
import { useEffect, useRef, useState } from "react";
import { ChevronBack, ChevronForward } from "@/components/icons";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import { IUser } from "@/lib/types";

const SuggetionsSlider = ({ username }: { username?: string }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { suggetions, loading } = useGetSuggestedUsers() as any;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollButtons = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    updateScrollButtons();
    scrollRef.current?.addEventListener("scroll", updateScrollButtons);

    return () => {
      scrollRef.current?.removeEventListener("scroll", updateScrollButtons);
    };
  }, [JSON.stringify(suggetions)]);

  const handleScrollLeft = () => {
    if (suggetions.length && scrollRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current;
      const scroll = scrollLeft + clientWidth - scrollWidth;
      const absScroll = Math.abs(scroll);
      const left = (absScroll < clientWidth
        ? clientWidth + absScroll
        : clientWidth);
      scrollRef.current.scrollBy({ left: -left, behavior: "smooth" });
    }
  };
  const handleScrollRight = () => {
    if (suggetions.length && scrollRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current;

      const scroll = scrollLeft + clientWidth - scrollWidth;
      const absScroll = Math.abs(scroll);
      scrollRef.current.scrollBy({
        left: absScroll < clientWidth ? clientWidth + absScroll : clientWidth,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-20 bg-[#0D0D0D] hidden">
        <div className=" w-[50%]  m-auto flex  flex-col items-center">
          <div className="flex justify-start  w-full p-2">
            <span className="h-6 bg-zinc-800 rounded-md w-44 "></span>
          </div>
          loading
        </div>
      </div>
    );
  }

  return (
    <div className=" ">
      <div className="p-2 flex justify-between ">
        <span>Suggested for you</span>
        <Link to="/explore">See all</Link>
      </div>
      <div className="relative z-1">
        <div className="flex justify-between z-10 w-full px-2 mb-2 absolute top-1/2 -translate-y-1/2">
          <button
            className="border text-sm ml-2 p-1 bg-background rounded absoulute left-0 disabled:opacity-50"
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronBack />
          </button>
          <button
            className="border text-sm mr-2 p-1 bg-background absoulute right-0 rounded disabled:opacity-50"
            onClick={handleScrollRight}
            disabled={!canScrollRight}
          >
            <ChevronForward />
          </button>
        </div>
        <div
          ref={scrollRef}
          className="overflow-x-scroll relative snap-x scrollbar-none overflow-hidden"
        >
          <div className="inline-flex h-44 max-h-44 snap-center">
            {suggetions
              .filter((people: IUser) => people.username !== username)
              ?.map((people: IUser) => {
                return <People key={people._id} {...people} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggetionsSlider;

const People = ({ avatar, username, name, _id }: any) => (
  <div className="w-36 p-2 rounded-lg border  dark:border-zinc-500/30  flex items-center justify-between flex-col mx-2 mb-2">
    <Avatar src={avatar?.url} className={"w-14 h-14 rounded-full"} />
    <div className="flex flex-col justify-center">
      <span className="text-sm">{name}</span>
      <UsernameLink username={username} className="text-gray-400 text-xs">
        <span>{username}</span>
      </UsernameLink>
    </div>
    <div className="flex justify-center">
      <FollowButton
        size="sm"
        isFollow={false}
        userId={_id}
        showRemoveFollowerBtn={false}
        isRequested={false}
        isPrivate={false}
      />
    </div>
  </div>
);
