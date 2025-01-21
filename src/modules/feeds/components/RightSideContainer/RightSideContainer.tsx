import Self from "./Self";
import Suggetions from "./Suggetions";

const RightSideContainer = () => {
  return (
    <section className="p-4 sticky top-0 hidden md:flex flex-col gap-2 flex-[0.3] bg-background">
      <Self />
      <Suggetions />
    </section>
  );
};
export default RightSideContainer;
