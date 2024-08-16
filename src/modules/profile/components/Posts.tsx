import { getSelfPosts, getUserPosts } from "@/api";
import { ProfilePost } from "@/components/posts/ProfilePost";
import { usePostSlice } from "@/redux/services/postSlice";
import { useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { EmptyPost } from "./EmptyPost";
import SuggetionsSlider from "@/components/shared/suggetionsSliders/SuggetionsSlider";
import { Loader } from "lucide-react";

const fetchPosts = (page: number) =>
  getSelfPosts(page).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }));
const fetchOtherPosts = (page: number, userId: string) =>
  getUserPosts(page, userId).then((res: any) => ({
    data: res.posts,
    pagination: res.pagination,
  }));

const Posts = ({ isSelfPosts = true, userId }: any) => {
  const { page, setPage, setPosts, posts, hasNext, loadingPost, reset } =
    usePostSlice();

  const fetchItems = useCallback(async () => {
    try {
      let res;
      if (isSelfPosts) {
        res = (await fetchPosts(page)) as any;
      } else {
        res = (await fetchOtherPosts(page, userId)) as any;
      }
      setPosts(res);
    } catch (error) {
      alert("something went wrong");
    }
  }, [page, userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [userId]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  if (loadingPost) {
    return (
      <div
        className=" md:w-full w-screen flex flex-wrap overflow-hidden"
        id="postLoader"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          return (
            <div
              key={i}
              className="border w-1/3 border-background animate-pulse aspect-square grid grid-cols-3 gap-[2px] place-content-center bg-secondary"
            ></div>
          );
        })}
      </div>
    );
  }

  if (!loadingPost && !posts.length) {
    return (
      <div className="py-10">
        <EmptyPost message="" />
        <div className="lg:max-w-[834px] xl:max-w-[1000px] md:max-w-[750px] max-w-[1000px] mx-auto">
          <SuggetionsSlider />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <InfiniteScroll
        className="flex flex-col"
        dataLength={posts?.length}
        next={handleLoadMore}
        hasMore={hasNext}
        loader={[12].map(() => (
          <div
            className="w-full py-3 flex items-center justify-center"
            role="status"
          >
            <Loader className="animate-spin" />
          </div>
        ))}
        scrollableTarget={"scrollableDiv"}
      >
        <div className=" grid grid-cols-3 gap-[1px] place-content-center ">
          {posts?.map((feed: any) => (
            <ProfilePost key={feed._id} post={feed} isSelfPosts={isSelfPosts} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Posts;
