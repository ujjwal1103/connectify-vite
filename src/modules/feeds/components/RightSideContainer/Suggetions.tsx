import Suggetion from "./suggetion";

// import UserLoading from "../../common/loading/UserLoading";
import { Link } from "react-router-dom";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import { IUser } from "@/lib/types";

const Suggetions = () => {
  const { suggetions, loading } = useGetSuggestedUsers() as any;

  return (
    <div className="hidden md:block divide-y-[0.5px]  divide-zinc-800 divide-y-reverse divide-solid text-foreground">
      {suggetions?.length > 0 && (
        <div className="py-2 text-xl flex justify-between dark:text-gray-100">
          <span>Suggested for you</span>
          <Link to="/explore" className="text-link text-sm text-blue-500 hover:underline hover:underline-offset-2">
            see all
          </Link>
        </div>
      )}
      {!loading &&
        suggetions
          ?.slice(0, 10)
          ?.map((u: IUser) => <Suggetion key={u?._id} user={u} />)}
    </div>
  );
};

export default Suggetions;
