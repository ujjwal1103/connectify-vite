import Avatar from "@/components/shared/Avatar";
import UsernameLink from "@/components/shared/UsernameLink";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "@/lib/localStorage";
import { Edit, EllipsisVertical, Loader, X } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "@react-hookz/web";
import { useChatSlice } from "@/redux/services/chatSlice";
import Modal from "@/components/shared/modal/Modal";
import { makeRequest } from "@/config/api.config";
import { BiLoader } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IUser } from "@/lib/types";
import { createNewChat, createGroup } from "@/api";
import { readFileAsDataURL } from "@/lib/utils";

const ChatListHeader = () => {
  const [open, setOpen] = useState(false);
  const [openNewChat, setOpenNewChat] = useState(false);
  const user = getCurrentUser();
  const { selectChats, setSelectChats } = useChatSlice();
  const menuRef = useRef<any>(null);
  const buttonRef = useRef<any>(null);

  useClickOutside(menuRef, (e) => {
    if (buttonRef.current && buttonRef.current.contains(e.target)) {
      return;
    }
    setOpen(false);
  });

  return (
    <div className="flex-[0.1] flex items-center ">
      <div className="flex md:gap-4  gap-2 w-full p-2 items-center justify-between">
        <Avatar
          src={user?.avatar.url}
          className="inline-block lg:size-12 size-9 rounded-full hover:scale-90 duration-500 object-cover"
        />
        <div className="text-base 0 flex-1">
          <h4 className="font-semibold text-sm leading-4">{user?.name}</h4>
          <UsernameLink
            username={user?.username}
            className="text-xss text-foreground lg:text-base"
          >
            <span className="text-sm"> {user?.username}</span>
          </UsernameLink>
        </div>
        <div className="">
          <div
            className="tooltip md:tooltip-right tooltip-bottom"
            data-tip="New Chat"
          >
            <button
              className="mr-2"
              onClick={() => {
                setOpenNewChat(!openNewChat);
              }}
            >
              <Edit />
            </button>
          </div>
          <div className="inline-block relative">
            <div
              className="tooltip cursor-pointer md:tooltip-right tooltip-left"
              data-tip="Menu"
            >
              <button
                ref={buttonRef}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <EllipsisVertical />
              </button>
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{
                    top: "32",
                    right: "8px",
                    width: "170px",
                    transformOrigin: "top right",
                  }}
                  className="absolute rounded bg-primary-foreground shadow-lg z-[90] "
                >
                  <ul
                    ref={menuRef}
                    tabIndex={0}
                    className=" z-[100]  menu p-2 shadow  "
                  >
                    <li className="text-sm ">
                      <span>Profile</span>
                    </li>
                    <li className="text-sm ">
                      <button
                        onClick={() => {
                          setSelectChats(!selectChats);
                          setOpen(false);
                        }}
                      >
                        <span>Select Chats</span>
                      </button>
                    </li>
                    <li className="text-sm ">
                      <span>Clear Chat</span>
                    </li>
                    <li className="text-sm ">
                      <span>Delete Chat</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openNewChat && (
          <Modal
            overlayClasses={"bg-opacity-80"}
            showCloseButton={false}
            shouldCloseOutsideClick={false}
            onClose={() => {
              setOpenNewChat(false);
            }}
          >
            <AddNewUser />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatListHeader;

const AddNewUser = ({ onClose }: any) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createGroup, setCreateGroup] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    { username: string; userId: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setChat } = useChatSlice();
  const navigate = useNavigate();

  const getAllUsers = useCallback(async (showLoader = true) => {
    showLoader && setIsLoading(true);
    try {
      const res = await makeRequest.get(`/newchat/users`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  // const handleChange = (e: any) => {
  //   setSearchTerm(e.target.value);

  //   if (e.target.value === "") {
  //     getAllUsers(false);
  //   }
  //   setUsers((prevs) =>
  //     prevs.filter((user) => user?.username.includes(e.target.value))
  //   );
  // };

  const handleUserSelect = async () => {
    try {
      setLoading(true);
      const response = (await createNewChat(selectedUsers[0].userId)) as any;
      if (response.isSuccess) {
        setChat(response.chat);
        navigate(`/inbox/${response.chat._id}`);
        onClose();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (userId: string, username: string) => {
    setSelectedUsers((prev) => {
      // Check if the user is already in the array
      const userExists = prev.some((user) => user.userId === userId);

      // If the user exists, remove them from the array
      if (userExists) {
        return prev.filter((user) => user.userId !== userId);
      }

      // If the user doesn't exist, add them to the array
      return [...prev, { userId, username }];
    });
  };
  const handleCreateNewGroup = async () => {
    setCreateGroup(true);
  };

  return (
    <div className="scrollbar-none h-144 z-10 bg-background text-foreground relative">
      <div className="overflow-y-scroll h-full scrollbar-none pb-12">
        <div className="md:w-96 w-screen overflow-y-scroll scrollbar-none h-full shadow-lg ">
          <div className="p-2 mb-2 rounded-sm shadow-lg text-foreground font-medium  flex items-center justify-between">
            <h1>{selectedUsers.length <= 1 ? "New Chat" : "New Group"}</h1>
            <button type="button" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>
          <div>
            <div className="flex bg-card my-2 items-center rounded-md h-10 mx-2">
              <input
                autoFocus={false}
                className="bg-transparent text-forground focus:outline-none px-3 py-2  placeholder:text-foreground text-sm w-full"
                placeholder="Search followers..."
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                value={searchTerm}
              />
              {searchTerm && (
                <span
                  className="mr-2 cursor-pointer text-secondary bg-foreground rounded-full "
                  onClick={() => {
                    //   setFocused(false);
                    setSearchTerm("");
                  }}
                >
                  <X size={16} />
                </span>
              )}
            </div>
          </div>
          {!isLoading && users.length === 0 && (
            <div className="flex items-center p-4 gap-3 m-2 bg-zinc-800 rounded-xl">
              no user found
            </div>
          )}

          {isLoading && (
            <div className="flex-center">
              <BiLoader className="animate-spin text-white" size={24} />
            </div>
          )}
          <div className="flex flex-wrap px-3 pb-2 gap-2">
            {selectedUsers.map((user) => {
              return (
                <span className="bg-secondary px-2 rounded-md flex items-center gap-2">
                  <span>{user?.username}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedUsers((prev) => {
                        // Check if the user is already in the array
                        const userExists = prev.some(
                          (u) => u.userId === user?.userId
                        );

                        // If the user exists, remove them from the array
                        if (userExists) {
                          return prev.filter((u) => u.userId !== user?.userId);
                        }

                        // If the user doesn't exist, add them to the array
                        return prev;
                      });
                    }}
                  >
                    <X size={12} />
                  </span>
                </span>
              );
            })}
          </div>
          <div className="relative">
            {users?.map((user) => {
              return (
                <div
                  className="flex group items-center p-2 px-4 gap-3  hover:bg-secondary transition-all"
                  key={user._id}
                >
                  <div>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleSelectChat(user._id, user?.username)
                      }
                      checked={selectedUsers.some(
                        (u) => u.userId === user?._id
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user?.avatar?.url}
                      className="inline-block h-8 w-8 rounded-full hover:scale-90 duration-500 object-cover"
                    />
                    <UsernameLink
                      username={user?.username}
                      className="text-sm text-foreground"
                    >
                      <span>{user?.username}</span>
                    </UsernameLink>
                  </div>

                  {/* <div className="flex-1 flex justify-end w-full">
                    <button
                      disabled={loading}
                      onClick={() => handleUserSelect(user?._id)}
                      className="bg-blue-600 disabled:opacity-65 overflow-hidden text-gray-50 text-xs  rounded-lg w-0 p-0  group-hover:w-auto group-hover:p-1 group-hover:transition-all transition-all"
                    >
                      Chat
                    </button>
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-2  absolute bottom-0 w-full flex items-center justify-center">
        {selectedUsers.length <= 1 && (
          <button
            className="bg-blue-500   p-2 flex items-center gap-3 justify-center rounded-md w-full disabled:opacity-50"
            onClick={handleUserSelect}
            disabled={loading || !selectedUsers.length}
          >
            <span> SEND MESSAGE </span>
            <span>
              {loading && <Loader size={16} className="animate-spin" />}
            </span>
          </button>
        )}
        {selectedUsers.length > 1 && (
          <button
            className="bg-blue-500  p-2 rounded-md w-full"
            onClick={handleCreateNewGroup}
          >
            Create New Group
          </button>
        )}
      </div>
      <AnimatePresence>
        {createGroup && (
          <Modal
            onClose={() => {
              setCreateGroup(false);
            }}
            overlayClasses={"bg-opacity-90"}
            showCloseButton={false}
          >
            <CreateGroup selectedUsers={selectedUsers} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreateGroup = ({ selectedUsers, onClose }: any) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState("");

  const handleCreateNewGroup = async () => {
    const users = selectedUsers.map((u: any) => u.userId);
    const formData = new FormData();
    formData.set("users", JSON.stringify(users));
    formData.set("groupName", groupName);
    if (avatar) {
      formData.set("avatar", file!);
    }
    const res = await createGroup(formData);
    console.log(res);
  };

  const handleImagePic = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files![0];
    const url = (await readFileAsDataURL(f)) as string;
    setAvatar(url);
    setFile(f);
  };

  return (
    <div className=" bg-background w-96 h-96 shadow-lg py-3">
      <div>
        <div>
          <div className="p-2 mb-2 rounded-sm shadow-lg text-gray-50  flex items-center justify-between">
            <h1>New Group</h1>
            <button type="button" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap px-3 pb-2 gap-2">
            {selectedUsers.map((user: { username: string }) => {
              return (
                <span className="bg-black px-2 rounded-md flex items-center gap-2">
                  <span>{user?.username}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      // setSelectedUsers((prev) => {
                      //   // Check if the user is already in the array
                      //   const userExists = prev.some(
                      //     (u) => u.userId === user?.userId
                      //   );
                      //   // If the user exists, remove them from the array
                      //   if (userExists) {
                      //     return prev.filter((u) => u.userId !== user?.userId);
                      //   }
                      //   // If the user doesn't exist, add them to the array
                      //   return prev;
                      // });
                    }}
                  >
                    <X size={12} />
                  </span>
                </span>
              );
            })}
          </div>
          <div className="flex items-center justify-center py-3">
            <label
              htmlFor="avatar"
              className="flex items-center justify-center"
            >
              <Avatar className="size-24" src={avatar!} />
              <input
                type="file"
                name="avatar"
                id="avatar"
                hidden
                onChange={handleImagePic}
              />
            </label>
          </div>
          <div className="flex bg-neutral-900 my-2 items-center border-b-2 border-black h-10 mx-2">
            <input
              autoFocus={false}
              className="bg-transparent focus:outline-none px-3 py-2  placeholder:text-[#a8a8a8] text-sm w-full"
              placeholder="Group Name"
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              value={groupName}
            />
            {groupName && (
              <span
                className="mr-2 cursor-pointer bg-gray-300 rounded-full text-[#262626]"
                onClick={() => {
                  //   setFocused(false);
                  setGroupName("");
                }}
              >
                <X size={16} />
              </span>
            )}
          </div>
          <div className="px-2 py-4">
            <button
              className="bg-blue-500 text-white p-2 rounded-md w-full"
              onClick={handleCreateNewGroup}
            >
              Create New Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
