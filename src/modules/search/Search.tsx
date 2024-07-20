import { searchUser } from "@/api";
import Avatar from "@/components/shared/Avatar";
import UsernameLink from "@/components/shared/UsernameLink";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import FollowButton from "@/components/shared/FollowButton";
import { IUser } from "@/lib/types";
import { motion } from "framer-motion";
const Search = () => {
  const [focused, setFocused] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [recents, setRecents] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const debouncedValue: string = useDebounce(searchTerm, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchUsers = useCallback(async () => {
    setLoading(true);
    if (debouncedValue && debouncedValue.length >= 3) {
      const res = await searchUser(debouncedValue ?? "");
      setUsers(res.users);
      setNotFound(res.notFound);
    } else {
      setUsers([]);
      setNotFound(false);
    }
    setLoading(false);
  }, [debouncedValue]);

  useEffect(() => {
    searchUsers();
    const recentsfromLs = JSON.parse(localStorage.getItem("recents")!) ?? [];
    setRecents(recentsfromLs);
  }, [searchUsers]);

  const addToRecent = (user: any) => {
    const recentsFromLs = JSON.parse(localStorage.getItem("recents") || "[]");

    const userExists = recentsFromLs.some((u: any) => u._id === user._id);

    if (!userExists) {
      const all = [user, ...recentsFromLs];
      localStorage.setItem("recents", JSON.stringify(all));
      setRecents(all);
    }
  };

  const handleRemoveRecent = (user: any) => {
    const recentsFromLs = JSON.parse(localStorage.getItem("recents") || "[]");
    const userExists = recentsFromLs.filter((u: any) => u._id !== user._id);
    localStorage.setItem("recents", JSON.stringify(userExists));
    setRecents(userExists);
  };

  const divRef = useRef<any>(null);
  const [hasContentToScroll, setHasContentToScroll] = useState(false);

  useEffect(() => {
    const divElement = divRef.current;
    if (divElement) {
      setHasContentToScroll(divElement.scrollHeight);
    }
  }, [recents]);

  return (
    <div
      ref={searchRef}
      className="h-full pb-8 md:pb-0 scrollbar-none w-full bg-background text-primary md:border-r-[1px] md:border-l-[1px] flex items-center border-border flex-1 flex-col md:rounded-r-xl"
    >
      <h1 className="py-2 px-4 text-2xl w-full hidden md:block">Search</h1>
      <div className="md:w-[90%] w-[95%] flex p-2 md:p-0">
        <div className="flex h-[40px] overflow-hidden bg-secondary w-full rounded-[8px] items-center ">
          {!focused && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="flex items-center px-2  w-full h-full gap-2"
              onClick={() => setFocused(true)}
            >
              <div>
                <SearchIcon size={16} className="text-[#a8a8a8]" />
              </div>
              <span className="text-[#a8a8a8] text-sm">Search </span>
            </motion.div>
          )}

          {/* <AnimatePresence> */}
          {focused && (
            <>
              <motion.input
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                autoFocus={true}
                transition={{ duration: 0.2 }}
                style={{ paddingLeft: "12px", paddingRight: "12px" }}
                className="bg-transparent focus:outline-none placeholder:text-[#a8a8a8] text-sm w-full"
                placeholder="Search"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                value={searchTerm}
              />
              <span
                className="mr-2 cursor-pointer bg-primary-foreground rounded-full"
                onClick={() => {
                  setFocused(false);
                  setSearchTerm("");
                }}
              >
                <X size={16} />
              </span>
            </>
          )}
          {/* </AnimatePresence> */}
        </div>
      </div>
      <div className="w-full border-border border-b-[1px] md:mt-4" />

      {notFound && !loading && focused && (
        <div className="flex flex-col items-center justify-center w-full py-2 gap-2 h-full ">
          <h1>No result found</h1>
        </div>
      )}

      {users.length === 0 && !notFound && (
        <div
          ref={divRef}
          className={cn(
            "flex flex-col w-full md:py-2 scrollbar-none h-full overflow-y-scroll mb-10 md:mb-0",
            {
              "overflow-y-scroll": hasContentToScroll,
            }
          )}
        >
          <div className="flex p-2 text-sm justify-between items-center">
            <span>Recents</span>
            <button
              className=" text-sm text-blue-500 disabled:text-blue-500/50 disabled:select-none"
              onClick={() => {
                localStorage.removeItem("recents");
                setRecents([]);
              }}
              disabled={recents.length === 0}
            >
              Clear All
            </button>
          </div>

          {recents.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full py-2 gap-2 h-full ">
              <h1>No recent</h1>
            </div>
          )}

          {recents &&
            recents.map((user: any) => (
              <ListItem
                username={user?.username}
                name={user?.name}
                avatar={user?.avatar?.url}
                actionBtn={
                  <button
                    onClick={() => {
                      handleRemoveRecent(user);
                    }}
                    className="text-xs flex items-center justify-center"
                  >
                    <X />
                  </button>
                }
              />
            ))}
        </div>
      )}

      {users.length > 0 && focused && (
        <div
          ref={containerRef}
          className={cn(
            "flex flex-col w-full  py-2  h-dvh overflow-y-scroll scrollbar-none mb-10 md:mb-0"
          )}
        >
          {loading &&
            focused &&
            !users.length &&
            !notFound &&
            [1, 2, 3, 4].map(() => {
              return (
                <div className="flex items-center gap-3 ml-2">
                  <div className="size-10 bg-zinc-800 rounded-full animate-pulse"></div>
                  <div className="flex flex-col gap-1">
                    <div className="bg-zinc-800 rounded-xl h-4 w-52 animate-pulse"></div>
                    <div className="bg-zinc-800 rounded-xl h-4 w-28 animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          {users.length > 0 &&
            !notFound &&
            users.map((user: any) => {
              return (
                <ListItem
                  username={user?.username}
                  name={user?.name}
                  avatar={user?.avatar?.url}
                  action={() => {
                    addToRecent(user);
                  }}
                  actionBtn={
                    <FollowButton
                      isFollow={user?.isFollow}
                      userId={user?._id}
                      showRemoveFollowerBtn={false}
                      isRequested={user?.isRequested}
                      isPrivate={user?.isPrivate}
                    />
                  }
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Search;

export const ListItem = ({
  username,
  avatar,
  name,
  action,
  actionBtn,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-3 hover:shadow-md items-center hover:bg-secondary py-2 px-3"
    >
      <UsernameLink
        username={username}
        className="flex flex-1 items-center gap-3  transition-colors ease-in-out duration-300 text-priamry   "
        onClick={action}
      >
        <Avatar src={avatar} name={name} />
        <div className="flex flex-col gap-1 flex-1">
          <div className="text-sm leading-none">{username}</div>
          <div className="text-sm text-card-foreground/70">{name}</div>
        </div>
      </UsernameLink>

      <div>
        <div>{actionBtn}</div>
      </div>
    </motion.div>
  );
};
