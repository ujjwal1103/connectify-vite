import Self from "./Self";
import Suggetions from "./Suggetions";

const RightSideContainer = () => {
  return (
    <div className="flex-[0.4] hidden md:block">
      <Self />
      <Suggetions />
    </div>
  );
};
export default RightSideContainer;
