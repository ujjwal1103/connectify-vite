import { OutlineLoading } from "@/components/icons";

type SubmitButtonProps = {
  disabled: boolean;
  isSubmitting: boolean;
  title?: string;
};

export const SubmitButton = ({
  disabled,
  isSubmitting,
  title = "Login",
}: SubmitButtonProps) => {
  return (
    <div className="flex justify-between w-full items-center">
      <button
        type="submit"
        disabled={disabled}
        className="w-full disabled:bg-slate-500 h-10 disabled:text-gray-400 disabled:cursor-not-allowed bg-zinc-950 rounded  text-white  hover:bg-black"
      >
        {isSubmitting ? (
          <span className="flex justify-center">
            <OutlineLoading className="animate-spin" />
          </span>
        ) : (
          title
        )}
      </button>
    </div>
  );
};
