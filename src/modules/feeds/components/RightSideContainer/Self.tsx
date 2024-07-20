import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Modal from "@/components/shared/modal/Modal";
import Logo from "@/components/icons/Logo";

import Avatar from "@/components/shared/Avatar";
import { getCurrentUser } from "@/lib/localStorage";
import useResetStore from "@/hooks/useResetStore";

const Self = () => {
  const [switchLogin, setSwitchLogin] = useState(false);
  const user = getCurrentUser();
  const reset = useResetStore();
  const navigate = useNavigate();

  const handleLogin = () => {
    reset();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-card p-2 rounded">
      <div className="flex items-center  justify-between space-x-2 duration-500 rounded-xl ">
        <div className="flex items-center space-x-2">
          <Avatar
            src={user?.avatar?.url}
            name={"name"}
            className="inline-block h-12  w-12 rounded-full hover:scale-90 duration-500 object-cover"
          />
          <span className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <Link
              to="/profile"
              className="text-sm font-medium text-foreground-secondary"
            >
              {user?.username}
            </Link>
          </span>
        </div>
        <button
          onClick={() => setSwitchLogin(true)}
          className="text-sm bg-gradient-to-l from-sky-900 to-indigo-900 px-2 rounded-xl text-sky-100 py-1"
        >
          Switch
        </button>
      </div>

      {switchLogin && (
        <Modal onClose={() => setSwitchLogin(false)}>
          <form className=" p-3 flex flex-col justify-center bg-black items-center rounded-xl shadow-2xl">
            <div className="flex justify-center items-center flex-1">
              <Logo className={"dark:fill-white p-2 "} size={340} />
            </div>
            <div className="w-full dark:text-white">
              <div>
                <button
                  className="w-full bg-gradient-to-l p-2 from-sky-900 to-indigo-900 hover:from-sky-800 hover:to-indigo-800 rounded my-2"
                  value={"Login"}
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Self;
