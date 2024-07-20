import { getFollowers } from "@/api";
import Avatar from "@/components/shared/Avatar";
import People from "@/components/shared/People";
import { IUser } from "@/lib/types";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const Followers = ({ userId }: any) => {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const [hasNextPage, setNextPage] = useState(false);

  const fetchFollowers = useCallback(async () => {
    try {
      const res = (await getFollowers(page, userId, query)) as any;
      setFollowers(res.followers);
    } catch (error) {
      setError(false);
    }
  }, [page, query]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  return (
    <div className="w-full h-full" id="scrollableDiv">
      <div>
        <div className="flex bg-neutral-900 my-2 items-center rounded-md h-10 mx-2">
          <input
            autoFocus={false}
            className="bg-transparent focus:outline-none px-3 py-2  placeholder:text-[#a8a8a8] text-sm w-full"
            placeholder="Search followers..."
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            value={query}
          />
          {query && (
            <span
              className="mr-2 cursor-pointer bg-gray-300 rounded-full text-[#262626]"
              onClick={() => {
                //   setFocused(false);
                setQuery("");
              }}
            >
              <X size={16} />
            </span>
          )}
        </div>
      </div>
      <InfiniteScroll
        dataLength={followers?.length}
        next={handleLoadMore}
        hasMore={hasNextPage}
        loader={[12, 23, 34].map(() => (
          <li className="flex py-2  gap-3 w-full items-center px-2">
            <Avatar
              src="people"
              className={"w-8 h-8 bg-gray-600 rounded-full"}
            />
            <div className="flex flex-col gap-2">
              <span className="h-4 rounded-md w-24 bg-zinc-800"></span>
              <span className="h-4 rounded-md w-16 bg-zinc-800"></span>
            </div>
            <div className="ml-auto mr-10 self-center">
              <button className="h-6 rounded w-14 bg-zinc-800"></button>
            </div>
          </li>
        ))}
        scrollableTarget={"scrollableDiv"}
      >
        {followers?.map((people: IUser) => {
          return <People key={people._id} people={people} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Followers;
