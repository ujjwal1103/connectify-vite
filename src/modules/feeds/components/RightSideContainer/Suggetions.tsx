import Suggetion from "./suggetion";

// import UserLoading from "../../common/loading/UserLoading";
import { Link } from "react-router-dom";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import { IUser } from "@/lib/types";

const Suggetions = () => {
  const { suggetions, loading } = useGetSuggestedUsers() as any;

  return (
    <div className="hidden md:block divide-y-[0.5px]  divide-secondary divide-y-reverse divide-solid text-foreground">
      {suggetions?.length > 0 && (
        <div className="py-2 items-center text-xl flex justify-between text-foreground">
          <span>Suggested for you</span>
          <Link to="/explore" className="text-link text-sm text-blue-500 hover:underline hover:underline-offset-2">
            see all
          </Link>
        </div>
      )}
      <div className="bg-background px-2 rounded">
      {!loading &&
        suggetions
          ?.slice(0, 10)
          ?.map((u: IUser) => <Suggetion key={u?._id} user={u} />)}
      </div>
    </div>
  );
};
export default Suggetions;
