import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TabControlProps {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  tabs: { name: string; icon?: any; id: string }[];
  tabId: string;
  indicatorClasses?: string;
}

export const TabControl = ({
  selectedTab,
  setSelectedTab,
  tabs,
  tabId,
  indicatorClasses = "",
}: TabControlProps) => {
  return (
    <div className="flex w-full ">
      {tabs.map((tab: any) => {
        return (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={cn(
              "flex-1 w-1/2 hover:text-white/60 relative px-3 py-1.5 uppercase flex justify-center gap-2 bg-secondary items-center text-sm font-medium h-[40px]  text-foreground transition focus-visible:outline-2",
            
            )}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {selectedTab === tab.id && (
              <motion.span
                layoutId={tabId}
                className={cn(
                  "absolute w-full inset-0 mix-blend-exclusion  top-[35px] h-[5px] z-10 bg-foreground",
                  indicatorClasses
                )}
                style={{ borderRadius: 10 }}
                transition={{ duration: 0.2 }}
              />
            )}
            {tab.icon}
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};
