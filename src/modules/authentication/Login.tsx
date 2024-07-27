import Input from "@/components/shared/Input";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import Connectify from "./components/Connectify";
import { loginWithEmailAndPassword } from "@/api";
import { PasswordLock, UsernameIcon } from "@/components/icons";
import ConnectifyLogoText from "@/components/icons/ConnectifyLogoText";
import { useAuth } from "@/context/AuthContext";
import { GoogleButton } from "./components/GoogleButton";
import { SubmitButton } from "./components/SubmitButton";

type FormFields = {
  username: string;
  password: string;
};

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<FormFields>({
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormFields) => {
    try {
      const res = await loginWithEmailAndPassword(data);
      if (res.isSuccess) {
        login(res);
      }
    } catch (error: any) {
      setError("root", {
        message: error?.message,
      });
    }
  };

  return (
    <main className="relative w-full h-dvh bg-black  flex lg:flex-row flex-col items-center ">
      <div className=" h-[400px] absolute top-0 lg:block hidden" />
      <div className=" h-[400px] bg-appcolor absolute bottom-0 lg:block hidden " />
      <Connectify />
      <div className=" flex-1 flex justify-center items-center  h-screen w-screen bg-appcolor border-violet-950 p-8 backdrop-blur-sm  lg:rounded-tl-[200px]  ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center  mx-10  gap-5"
        >
          <div className="mb-3 text-bold flex justify-center items-center lg:hidden">
            <ConnectifyLogoText />
          </div>
          <div className="flex 4 flex-col gap-5 dark:text-white text-4xl font-bold">
            Welcome!
          </div>
          <div className="flex flex-col gap-5 dark:text-white text-xl">
            Sign In to Connectify
          </div>

          <Input
            autoFocus={true}
            type="text"
            placeholder="Enter you username"
            prefix={<UsernameIcon size={24} />}
            error={errors?.username}
            {...register("username", {
              required: "Username is Required",
              pattern: {
                value: /^(?=[a-z_])[a-z0-9_]{5,20}$/,
                message: "Invalid Username",
              },
            })}
          />

          <Input
            autoFocus={false}
            {...register("password", {
              required: "Password is Required",
              minLength: {
                value: 8,
                message: "Password should be minimum 8 char long",
              },
            })}
            type={"password"}
            placeholder="Enter you password"
            prefix={<PasswordLock size={24} />}
            error={errors?.password}
          />

          <SubmitButton
            isSubmitting={isSubmitting}
            disabled={!isValid || isSubmitting || isSubmitSuccessful}
          />
          {errors.root && (
            <div className="bg-red-300 text-red-700 px-2 py-1 rounded font-semibold">
              {errors.root.message}
            </div>
          )}

          <p className="text-white">
            Dont have an account?
            <Link
              to={"/new-account"}
              className="text-violet-200 cursor-pointer px-2"
            >
              Register
            </Link>
          </p>

          <GoogleButton />
        </form>
      </div>
      <DevTool control={control} />
    </main>
  );
};

export default Login;
