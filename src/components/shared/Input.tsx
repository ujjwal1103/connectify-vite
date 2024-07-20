import { ChangeEvent, ForwardedRef, forwardRef, useState } from "react";

import { cn } from "@/lib/utils";
import { EyeFill, FillEyeSlashFill } from "../icons";

const ShowPassword = ({ showPassword, setShowPassword }: any) => {
  if (showPassword) {
    return <FillEyeSlashFill onClick={() => setShowPassword(false)} />;
  }

  return <EyeFill onClick={() => setShowPassword(true)} />;
};

type InputProps = {
  type: string;
  placeholder: string;
  prefix?: any;
  sufix?: any;
  value?: string;
  error?: any;
  autoFocus: boolean;
  sufixClassname?: string;
  disabled?: boolean;
  className?: string;
  onChange: (e: ChangeEvent) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const Input = (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const {
    type,
    placeholder,
    prefix = "",
    sufix = "",
    error,
    sufixClassname,
    className = "",
    disabled,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col justify-center  w-full">
      <div className="flex items-center relative ">
        <input
          ref={ref}
          {...props}
          type={showPassword ? "text" : type}
          className={cn(
            "peer w-full rounded-xl p-2 px-10 border-2 border-gray-300  focus-visible:border-blue-500 ",
            className,
            { "peer-focus-visible:border-red-500": error }
          )}
          autoComplete={undefined}
          placeholder={placeholder}
          disabled={disabled}
        />
        <span
          className={cn(
            "absolute px-2  text-gray-300 peer-focus-visible:text-blue-500",
            { "peer-focus-visible:text-red-500": error }
          )}
        >
          {prefix}
        </span>
        <span
          className={cn(
            "absolute right-0 px-3 text-gray-300 peer-focus-visible:text-blue-500",
            sufixClassname
          )}
        >
          {type === "password" ? (
            <ShowPassword
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          ) : (
            sufix
          )}
        </span>
      </div>
      {error && <p className={cn("text-red-500 text-sm")}>{error.message}</p>}
    </div>
  );
};

export default forwardRef(Input);
