import Stories from "./components/stories/Stories";
import { getAllPost } from "@/api";
import Post from "./components/post/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import { useFetchFeeds } from "@/hooks/useFetch";
import RightSideContainer from "./components/RightSideContainer/RightSideContainer";
import { Loader } from "lucide-react";
import { IPost } from "@/lib/types";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef } from "react";
import { useOutletContext } from "react-router-dom";

const fetchPosts = (page: number) =>
  getAllPost(page).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }));

const Feeds = () => {
  const { feeds, hasNextPage, setPage, page } =
    useFetchFeeds<IPost>(fetchPosts);
  const setHide: any = useOutletContext();

  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const { scrollY } = useScroll({
    container: containerRef,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous! && latest > 150) {
      setHide(true);
    } else {
      setHide(false);
    }
  });

  return (
    <main
      ref={containerRef}
      className="md:flex md:justify-center lg:justify-start w-full sm:my-0 md:p-2 block h-full overflow-y-scroll lg:scrollbar scrollbar-none overflow-x-hidden"
      id="scrollableDiv"
    >
      <section className="flex flex-col md:flex-[0.8] lg:flex-[0.6] mt-10 md:mt-0 flex-1 md:p-3 py-1 md:gap-3 gap-2 ">
        <Stories />

        <div className="flex flex-col w-full ">
          <div className="flex flex-col">
            <InfiniteScroll
              className="flex flex-col"
              dataLength={feeds?.length}
              next={handleLoadMore}
              hasMore={hasNextPage}
              loader={[12].map(() => (
                <li className="flex py-2 justify-center gap-3 w-full items-center px-2">
                  <Loader className="animate-spin" />
                </li>
              ))}
              scrollableTarget={"scrollableDiv"}
            >
              {feeds?.map((feed: any) => (
                <Post post={feed} />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </section>
      <section className="flex-[0.4] hidden lg:block">
        <RightSideContainer />
      </section>
    </main>
  );
};

export default Feeds;
