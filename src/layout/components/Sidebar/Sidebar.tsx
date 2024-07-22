import ConnectifyIcon from "@/components/icons/Connectify";
import ConnectifyLogoText from "@/components/icons/ConnectifyLogoText";
import SidePannel, { Menu } from "@/components/shared/SidePannel/SidePannel";
import { cn } from "@/lib/utils";
import Search from "@/modules/search/Search";
import {
  Compass,
  Heart,
  Home,
  Menu as MenuIcon,
  Search as SearchIcon,
  Send,
  SquarePlay,
  SquarePlus,
  User2,
} from "lucide-react";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import CreateNewPost from "../NewPost/CreateNewPost";
import MoreMenu from "@/components/shared/MoreMenu";
import Notification from "@/modules/notifications/Notifications";
import { AnimatePresence } from "framer-motion";
import Modal from "@/components/shared/modal/Modal";
import { useModalStateSlice } from "@/redux/services/modalStateSlice";

const sidebarRoutes: SidebarRoute[] = [
  { route: "/", label: "Home", icon: <Home /> },
  {
    route: "/search",
    label: "Search",
    icon: <SearchIcon />,
    modal: true,
    modalName: "searchSheet",
  },
  { route: "/explore", label: "Explore", icon: <Compass /> },
  { route: "/reels", label: "Reels", icon: <SquarePlay /> },
  { route: "/inbox", label: "Messages", icon: <Send /> },
  {
    route: "/notifications",
    label: "Notifications",
    icon: <Heart />,
    modal: true,
    modalName: "notiSheet",
  },
  {
    route: "/create",
    label: "Create",
    icon: <SquarePlus />,
    modal: true,
    modalName: "openPostModal",
  },
  { route: "/profile", label: "Profile", icon: <User2 /> },
  {
    route: "/more",
    label: "More",
    icon: <MenuIcon />,
    modal: true,
    modalName: "moreOptions",
  },
];

interface SidebarRoute {
  route: string;
  label: string;
  icon: JSX.Element;
  modal?: boolean;
  modalName?: string;
}

const Sidebar = () => {
  const {
    setModalState,
    notiSheet,
    searchSheet,
    moreOptions,
    openPostModal,
    resetModalState,
  } = useModalStateSlice();

  const sidebarRef = useRef<any>();
  const location = useLocation();

  const isMessenger = useMemo(
    () => location.pathname.includes("inbox"),
    [location.pathname]
  );

  const handleResize = useCallback(() => {
    // resetModalState();
  }, []);
  
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    handleResize();
  }, [location.pathname]);

  const handleModalToggle = (modalName: string) => {
    setModalState(modalName);
  };

  const handleModalClose = (
    modalName: string,
    id: string,
    target: EventTarget
  ) => {
    if (!sidebarRef.current) return;

    const modalElement = sidebarRef.current.querySelector(
      `#${id.toLowerCase()}`
    );
    if (modalElement && modalElement.contains(target as Node)) return;

    setModalState(modalName);
  };

  const renderRouteItem = useCallback(
    ({ route, label, icon, modal, modalName }: SidebarRoute) => {
      const isDisabled = modal
        ? notiSheet || searchSheet || moreOptions || openPostModal
        : false;
      return (
        <li key={route} className="last:mt-auto" id={label.toLowerCase()}>
          <NavLink
            to={route}
            className={({ isActive }) =>
              cn(
                "inline-block lg:flex items-center lg:gap-2 hover:bg-primary-foreground p-2 transition-all  duration-200 ease-linear rounded",
                {
                  "bg-primary-foreground shadow-lg": isActive,
                  "ring ring-background shadow-inner": isDisabled,
                }
              )
            }
            onClick={(e) => {
              if (modal) {
                e.preventDefault();
                handleModalToggle(modalName!);
              }
            }}
          >
            <div className="mx-2">{icon}</div>
            <div
              className={cn("hidden sm:hidden lg:inline-block", {
                "lg:hidden": isMessenger,
              })}
            >
              <span className="text-lg">{label}</span>
            </div>
          </NavLink>
        </li>
      );
    },
    []
  );

  return (
    <>
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={cn(
          "lg:flex-[0.1] max-w-[300px] md:flex flex-col h-dvh bg-background text-foreground font-semibold p-2 hidden z-30",
          { " lg:flex-[0.001]": isMessenger }
        )}
      >
        <div className="w-full h-10 gap-2 flex items-center justify-around z-20">
          <Link to={"/"}>
            <ConnectifyIcon size={42} />
          </Link>
          <Link
            to={"/"}
            className={cn("sm:hidden lg:block", { "lg:hidden": isMessenger })}
          >
            <ConnectifyLogoText w="200" h="44" />
          </Link>
        </div>
        <ul className="flex-[1] py-3 flex flex-col gap-2">
          {sidebarRoutes.map(renderRouteItem)}
        </ul>
      </aside>

      <AnimatePresence>
        {searchSheet && (
          <SidePannel
            width={searchSheet ? sidebarRef?.current?.offsetWidth : -400}
            onClose={(e: any) =>
              handleModalClose("searchSheet", "search", e.target)
            }
          >
            <Search />
          </SidePannel>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notiSheet && (
          <SidePannel
            onClose={(e: any) =>
              handleModalClose("notiSheet", "notifications", e.target)
            }
            width={notiSheet ? sidebarRef?.current?.offsetWidth : -400}
          >
            <Notification />
          </SidePannel>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openPostModal && (
          <Modal
            shouldCloseOutsideClick={false}
            showCloseButton={false}
            onClose={(e: any) =>
              handleModalClose("openPostModal", "create", e?.target)
            }
          >
            <CreateNewPost />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {moreOptions && (
          <Menu

            left={sidebarRef?.current?.offsetWidth}
            onClose={(e: any) =>
              handleModalClose("moreOptions", "more", e?.target)
            }
          >
            <MoreMenu />
          </Menu>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Sidebar);
