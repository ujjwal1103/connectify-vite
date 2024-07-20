import { cn } from "@/lib/utils";

const Switch = ({ checked, onChange, className = "" }: any) => {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={cn(
          "relative cursor-pointer w-12 h-7 p-1 bg-secondary rounded-full shadow-inner transition duration-300 ease-in-out",
          className,
          {
            " bg-blue-600": checked,
          }
        )}
      >
        <div
          className={cn(
            "absolute size-5  rounded-full translate-x-0 bg-zinc-100 shadow-md transform transition duration-300 ease-in-out",
            {
              "translate-x-5 ": checked,
            }
          )}
        ></div>
      </div>
    </label>
  );
};

export default Switch;
