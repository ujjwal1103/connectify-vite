import { getCurrentUser } from "@/api";
import Avatar from "@/components/shared/Avatar";
import { TabControl } from "@/components/shared/TabControl";
import { Button } from "@/components/ui/button";
import { Bookmark, Grid } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Posts from "./components/Posts";
import SavedPost from "./components/SavedPost";
import { useProfileSlice } from "@/redux/services/profileSlice";
import Counts from "./components/Counts";
import PageLoading from "@/components/shared/Loading/PageLoading";
import PageError from "@/components/shared/Error/PageError";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  {
    icon: <Grid />,
    name: "posts",
    id: "posts",
  },
  {
    icon: <Bookmark />,
    name: "saved",
    id: "saved",
  },
];

const SelfProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialTab = query.get("tab") || "posts";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const { user, loading } = useAuth();

  useEffect(() => {
    setSelectedTab(initialTab);
  }, [initialTab]);

  if (loading) return <PageLoading />;

  if (!user && !loading) return <PageError message="User Not Found" />;

  return (
    <div
      className="md:flex-1 scrollbar-thin relative w-screen mt-10 md:mt-0 mb-8 md:mb-0 flex-1 flex  md:w-full scrollbar-none  overflow-x-hidden overflow-y-scroll"
      id="scrollableDiv"
    >
      <div className="flex-1 md:w-auto w-screen md:text-sm text-sm">
        <div className="md:px-10 md:py-5 py-3 px-2 flex justify-center    lg:w-[80%] gap-3 md:justify-evenly md:mx-auto">
          <div className="md:border-2 md:size-[162px] size-[90px] flex items-center md:flex-row flex-col border-zinc-800 justify-center p-[4px] rounded-full">
            <Avatar
              src={user?.avatar?.url}
              name={user?.name}
              className="md:size-[150px] size-[90px] "
            />
          </div>
          <div className="md:space-y-3 space-y-2 md:text-sm text-sm">
            <div className="flex md:gap-3 gap-1 items-center">
              <div className="hidden md:inline">
                <span>{user?.username}</span>
              </div>
              <Button className="bg-secondary hover:bg-secondary md:h-9 h-5 px-2 md:px-4">
                <Link
                  to="/edit"
                  className="text-sm md:text-sm text-foreground"
                >
                  Edit Profile
                </Link>
              </Button>
              <Button className="bg-secondary hover:bg-secondary text-sm md:text-sm text-foreground md:h-9 h-5 px-2 md:px-4">
                View Archive
              </Button>
              <Button className="bg-secondary hover:bg-secondary md:h-9 h-5 px-2 text-sm md:text-sm md:px-4">
                <IoIosSettings
                  size={24}
                  className="size-5 text-foreground"
                />
              </Button>
            </div>
            <Counts
              posts={user?.posts}
              followers={user?.followers}
              following={user?.following}
              userId={user?._id}
            />
            <div className="">
              <span>{user?.name}</span>
            </div>
            <div >
              <pre className="text-txs md:text-sm">{user?.bio}</pre>
            </div>
          </div>
        </div>
        <TabControl
          tabId={"tabs"}
          selectedTab={selectedTab}
          setSelectedTab={(tab: string) => {
            setSelectedTab(tab);
            navigate(`?tab=${tab}`, { replace: true });
          }}
          tabs={tabs}
        />
        {selectedTab === "posts" && <Posts />}
        {selectedTab === "saved" && <SavedPost />}
      </div>
    </div>
  );
};

export default SelfProfile;
