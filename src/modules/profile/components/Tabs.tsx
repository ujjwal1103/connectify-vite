import { TabControl } from "@/components/shared/TabControl";
import { useState } from "react";
import Followers from "./Followers";
import Following from "./Following";
import { ChevronLeft } from "lucide-react";

const Tabs = ({ userId, activeTab, onClose, disabledTabs }: any) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || "followers");
  return (
    <div className="flex h-dvh flex-col  bg-background ">
      <div className="flex items-center ">
        <div className="absolute  md:hidden cursor-pointer left-2 z-[999]">
          <ChevronLeft onClick={onClose} />
        </div>
        <TabControl
          tabId={"bubble"}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          tabs={[
            { name: "Followers", id: "followers", disabled: disabledTabs.followers },
            { name: "Following", id: "following", disabled: disabledTabs.following },
          ]}
        />
      </div>

      <div className="flex h-full scrollbar-none overflow-y-scroll" id='scrollfollowers'>
        {selectedTab === "followers" && <Followers userId={userId} />}
        {selectedTab === "following" && <Following userId={userId} />}
      </div>
    </div>
  );
};

export default Tabs;
