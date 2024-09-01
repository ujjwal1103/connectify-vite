import Avatar from "@/components/shared/Avatar";
import People from "@/components/shared/People";

import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import { IUser } from "@/lib/types";

import InfiniteScroll from "react-infinite-scroll-component";

const Explore = () => {
  const { suggetions, loading, hasNextPage, setPage, page } =
    useGetSuggestedUsers() as any;

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="h-dvh flex-1 flex justify-center items-center">
        <div>
          <span>Loading... first</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="md:h-full h-dvh  overflow-y-scroll md:w-1/2 w-full mx-auto md:my-10 border border-border rounded scrollbar-none"
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={suggetions?.length}
        next={handleLoadMore}
        hasMore={hasNextPage}
        loader={[12].map(() => (
          <li className="flex py-2 gap-3 w-full items-center px-4">
            <Avatar
              src="people"
              className={"w-8 h-8 bg-gray-600 rounded-full"}
            />
            <div className="flex flex-col gap-2">
              <span className="h-4 rounded-md w-24 bg-zinc-800"></span>
              <span className="h-4 rounded-md w-16 bg-zinc-800"></span>
            </div>
            <div className="ml-auto  self-center">
              <button className="h-6 rounded w-16 p-3 bg-zinc-800"></button>
            </div>
          </li>
        ))}
        scrollableTarget={"scrollableDiv"}
      >
        {suggetions?.map((people: IUser) => {
          return <People key={people._id} people={people} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Explore;
