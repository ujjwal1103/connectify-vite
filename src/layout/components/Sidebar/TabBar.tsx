import { cn } from "@/lib/utils";
import { useModalStateSlice } from "@/redux/services/modalStateSlice";
import { motion } from "framer-motion";
import { Home, SearchIcon, SquarePlus, Heart, User2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const sidebarRoutes: any[] = [
  { route: "/", label: "Home", icon: <Home /> },
  {
    route: "/search",
    label: "Search",
    icon: <SearchIcon />,
    modalName: "searchSheet",
  },
  // { route: "/explore", label: "Explore", icon: <Compass /> },
  // { route: "/reels", label: "Reels", icon: <SquarePlay /> },
  // { route: "/inbox", label: "Messages", icon: <Send /> },

  {
    route: "/create",
    label: "Create",
    icon: <SquarePlus />,
    modal: true,
    modalName: "openPostModal",
  },
  {
    route: "/notifications",
    label: "Notifications",
    icon: <Heart />,
    modalName: "notiSheet",
  },
  { route: "/profile", label: "Profile", icon: <User2 /> },
];

const TabBar = ({ hideAppBar, show }: any) => {
  const variants = {
    visible: {
      y: "0",
    },
    hidden: {
      y: "100%",
    },
  };

  const { setModalState } = useModalStateSlice();

  return (
    <motion.div
      animate={hideAppBar ? "hidden" : "visible"}
      variants={variants}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-2 bg-zinc-800 sm:hidden block absolute bottom-0 w-full",
        { hidden: !show }
      )}
    >
      <div className="">
        <ul className="flex justify-evenly">
          {sidebarRoutes.map(({ route, label, icon, modal }) => (
            <li key={label} className="cursor-pointer">
              <NavLink
                to={route}
                onClick={(e) => {
                  if (modal) {
                    e.preventDefault();
                    setModalState("openPostModal");
                  }
                }}
              >
                {icon}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TabBar;
