import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const SessionExpire = () => {
  const { logout } = useAuth();
  return (
    <section className="bg-white h-full dark:bg-zinc-950">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            401
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Session Expire
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Your session has expired due to inactivity. Please log in again to
            continue.
          </p>
          <Link
            to="/login"
            onClick={logout}
            className="inline-flex text-white bg-orange-600 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md hover:text-white text-sm px-5 py-2.5 text-center dark:focus:ring-orange-900 my-4"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SessionExpire;
