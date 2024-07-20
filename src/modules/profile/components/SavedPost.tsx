import { getBookmarks } from "@/api";
import { ProfilePost } from "@/components/posts/ProfilePost";
import { useSavedPostSlice } from "@/redux/services/savedPostSlice";
import { useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { EmptyPost } from "./EmptyPost";
import SuggetionsSlider from "@/components/shared/suggetionsSliders/SuggetionsSlider";
import { Loader } from "lucide-react";

const fetchPosts = (page: number) =>
  getBookmarks(page).then((res: any) => ({
    data: res.bookmarks,
    pagination: res.pagination,
  }));

const SavedPost = () => {
  const {
    page,
    setPage,
    setSavedPosts,
    savedPost,
    hasNext,
    loadingPost,
  } = useSavedPostSlice();

  const fetchItems = useCallback(async () => {
    try {
      const res = (await fetchPosts(page)) as any;
      setSavedPosts(res);
    } catch (error) {}
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleLoadMore = () => {
    if (hasNext) {
      setPage(page + 1);
    }
  };

  if (loadingPost) {
    return (
      <div className=" md:w-full w-screen flex flex-wrap overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
          return (
            <div className="border w-1/3 border-zinc-950 animate-pulse aspect-square grid grid-cols-3 gap-[2px] place-content-center bg-zinc-900"></div>
          );
        })}
      </div>
    );
  }

  if (!loadingPost && !savedPost.length) {
    return (
      <div className="py-10">
        <EmptyPost message="No Saved Post"/>
        <div className="max-w-[1000px] mx-auto">
          <SuggetionsSlider />
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <InfiniteScroll
        className="flex flex-col"
        dataLength={savedPost?.length}
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
        <div className=" grid grid-cols-3 gap-px place-content-center ">
          {savedPost?.map(({ post }: any) => (
            <ProfilePost key={post?._id} post={post} pageName="SavedPost" />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default SavedPost;
