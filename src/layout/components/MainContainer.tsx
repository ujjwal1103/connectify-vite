import { Outlet } from "react-router-dom";
import useMobileSidebar from "../hooks/useMobileSidebar";
import Appbar from "./Sidebar/AppBar";
import TabBar from "./Sidebar/TabBar";
import { lazy } from "react";

const Sidebar = lazy(() => import("./Sidebar/Sidebar"));

const MainContainer = () => {
  const { show, hideAppBar, setHideAppBar } = useMobileSidebar();
  return (
    <main className="flex h-full w-full min-w-80 flex-1 sm:flex-row flex-col bg-background-secondary text-foreground">
      <Sidebar />
      <Appbar hideAppBar={hideAppBar} show={show} />
      <main className="h-dvh sm:w-full flex-1 lg:flex-1 md:bg-inherit flex flex-col">
        <Outlet context={setHideAppBar} />
      </main>
      <TabBar hideAppBar={hideAppBar} show={show} />
    </main>
  );
};

export default MainContainer;
