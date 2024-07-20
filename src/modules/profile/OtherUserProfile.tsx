import Avatar from "@/components/shared/Avatar";
import FollowButton from "@/components/shared/FollowButton";
import { TabControl } from "@/components/shared/TabControl";
import { Button } from "@/components/ui/button";
import { Grid, Video } from "lucide-react";
import { useState } from "react";

import Posts from "./components/Posts";
import { PrivateUser } from "./components/PrivateUser";
import Reels from "./components/Reels";
import Counts from "./components/Counts";
import PageLoading from "@/components/shared/Loading/PageLoading";
import PageError from "@/components/shared/Error/PageError";
import useOtherUserProfile from "./hooks/useOtherUserProfile";

const tabs = [
  {
    icon: <Grid />,
    name: "posts",
    id: "posts",
  },
  {
    icon: <Video />,
    name: "reels",
    id: "reels",
  },
];

const OtherUserProfile = () => {
  const { loading, user, initialTab, username, navigate, refetch } =
    useOtherUserProfile();
  const [selectedTab, setSelectedTab] = useState(initialTab);

  if (loading) return <PageLoading />;

  if (!user && !loading)
    return <PageError message={`User with username ${username} Not Found`} />;

  return (
    <div
      className="md:flex-1 scrollbar-thin relative w-screen flex-1 flex  md:w-full scrollbar-none  overflow-x-hidden overflow-y-scroll"
      id="scrollableDiv"
    >
      <div className="flex-1 md:w-auto w-screen md:text-sm text-sm">
        <div className="md:px-10 md:py-5 py-3 px-2 flex justify-center    lg:w-[80%] gap-3 md:justify-evenly md:mx-auto">
          <div className="md:border-2 md:size-[162px] size-[90px] flex items-center md:flex-row flex-col border-zinc-800 justify-center p-[4px] rounded-full">
            <Avatar
              src={user?.avatar?.url}
              name={user?.name}
              className="md:size-[150px] size-[90px]"
            />
          </div>
          <div className="md:space-y-3 space-y-2 md:text-sm text-sm">
            <div className="flex md:gap-3 gap-1 items-center">
              <div className="hidden md:block">
                <span>{username}</span>
              </div>
              <FollowButton
                userId={user?._id!}
                isFollow={user?.isFollow ?? false}
                showRemoveFollowerBtn={false}
                isRequested={user?.isRequested ?? false}
                isPrivate={user?.isPrivate ?? false}
                callBack={() => {
                  refetch();
                }}
              />
              {user?.isFollow && (
                <Button className="bg-gradient-to-l text-white text-sm from-blue-900 to-violet-900 h-6 md:h-8 hover:bg-zinc-900  px-2 py-0.5">
                  Message
                </Button>
              )}
            </div>
            <Counts
              posts={user?.posts}
              followers={user?.followers}
              following={user?.following}
              userId={user?._id}
            />
            <div>
              <span>{user?.name}</span>
            </div>
            <div className="break-words">
              <pre className="font-mono">{user?.bio}</pre>
            </div>
          </div>
        </div>
        {user?.isPrivate && !user?.isFollow ? (
          <PrivateUser username={user?.username} />
        ) : (
          <>
            <TabControl
              tabId={"usersTabs"}
              selectedTab={selectedTab}
              setSelectedTab={(tab: string) => {
                setSelectedTab(tab);
                navigate(`?tab=${tab}`, { replace: true });
              }}
              tabs={tabs}
            />
            {selectedTab === "posts" && (
              <Posts isSelfPosts={false} userId={user?._id} />
            )}
            {selectedTab === "reels" && <Reels />}
          </>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;
