import { cn } from "@/lib/utils";
import {
  Bookmark,
  LogOut,
  Moon,
  Settings2,
  SquareActivity,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronBack } from "../icons";
import { useTheme } from "../ThemeProvider";
import { ChangeEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Switch from "./Inputs/Switch";

const MoreMenu = () => {
  const [themeMenu, setThemeMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex w-64 flex-col justify-end z-100">
      <motion.div className=" mb-3  rounded-md">
        <AnimatePresence initial={false} mode="popLayout">
          {themeMenu && (
            <motion.div
              key="theme-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              variants={containerVariants}
              transition={{ duration: 0.2 }}
              className=" bg-background shadow-xl border border-border text-primary rounded-md overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="flex  items-center justify-between gap-2  w-full">
                  <button
                    className=" cursor-pointer"
                    onClick={() => setThemeMenu(false)}
                  >
                    <ChevronBack size={20} />
                  </button>
                  <div className="">
                    <span className="text-base font-semibold">
                      Switch theme
                    </span>
                  </div>
                  <div className="mx-2">
                    {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex justify-between items-center gap-2 w-full  cursor-pointer  rounded"
                  )}
                  onClick={() => {
                    if (theme === "dark") {
                      setTheme("light");
                    } else {
                      setTheme("dark");
                    }
                  }}
                >
                  <div className="">
                    <span className="text-base font-semibold">Dark Mode</span>
                  </div>
                  <div className="mx-2">
                    <Switch
                      checked={theme === "dark"}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          setTheme("light");
                        } else {
                          setTheme("dark");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!themeMenu && (
            <motion.div
              key="main-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
              variants={containerVariants}
              transition={{ duration: 0.2 }}
              className="shadow-xl bg-background text-primary border border-border rounded-md overflow-hidden"
            >
              <ul className="p-2">
                <li className="hover:bg-secondary rounded">
                  <Link
                    to="/edit?tab=settings"
                    className={cn("flex items-center gap-2 p-2 w-full ")}
                  >
                    <div className="mx-2">
                      <Settings2 />
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">Settings</span>
                    </div>
                  </Link>
                </li>
                <li className="hover:bg-secondary rounded">
                  <Link
                    to={"/activity"}
                    className={cn(
                      "flex   items-center gap-2 p-2 w-full  rounded"
                    )}
                  >
                    <div className="mx-2">
                      <SquareActivity size={20} />
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">
                        Your Activity
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="hover:bg-secondary rounded">
                  <Link
                    to={"/profile?tab=saved"}
                    className={cn(
                      "flex   items-center gap-2 p-2 w-full  rounded"
                    )}
                  >
                    <div className="mx-2">
                      <Bookmark size={20} />
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">Saved</span>
                    </div>
                  </Link>
                </li>
                <li className="hover:bg-secondary rounded">
                  <button
                    className={cn(
                      "flex  items-center gap-2 p-2 w-full  rounded"
                    )}
                    onClick={() => setThemeMenu(true)}
                  >
                    <div className="mx-2">
                      {theme === "dark" ? (
                        <Moon size={20} />
                      ) : (
                        <Sun size={20} />
                      )}
                    </div>
                    <div className="">
                      <span className="text-base font-semibold">
                        Switch appearance
                      </span>
                    </div>
                  </button>
                </li>
                <li className="hover:bg-secondary rounded">
                  <button
                    className={cn(
                      "flex   items-center gap-2 p-2 w-full  rounded"
                    )}
                    onClick={logout}
                  >
                    <span className="mx-2">
                      <LogOut size={20} />
                    </span>
                    <div className="">
                      <span className="text-base font-semibold">Logout</span>
                    </div>
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MoreMenu;
