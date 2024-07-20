import Input from "@/components/shared/Input";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Connectify from "./components/Connectify";
// import FadeInAnimation from "../../utils/Animation/FadeInAnimation";
import { loginWithEmailAndPassword } from "@/api";
import { PasswordLock, UsernameIcon } from "@/components/icons";
import ConnectifyIcon from "@/components/icons/Connectify";
import ConnectifyLogoText from "@/components/icons/ConnectifyLogoText";
import { useAuth } from "@/context/AuthContext";
import { GoogleButton } from "./components/GoogleButton";
import { SubmitButton } from "./components/SubmitButton";

const Login = () => {
  const navigator = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const onSubmit = (data: any) => {
    if (loading) return;
    loginUserWithEmailAndPassword(data);
  };
  const loginUserWithEmailAndPassword = async ({ username, password }: any) => {
    setLoading(true);

    try {
      const res = (await loginWithEmailAndPassword({
        username,
        password,
      })) as any;
      if (res.isSuccess) {
        login(res);
        toast.success("Welcome Back!!", {
          icon: <ConnectifyIcon size={34} />,
          closeOnClick: true,
          closeButton: true,
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
      setLoading(false);
      navigator("/", { replace: true });
    } catch (error: any) {
      console.log(error);
      setError("root.serverError", {
        type: error?.error?.statusCode,
        message: error?.message,
      });
      setLoading(false);
      setTimeout(() => {
        clearErrors();
      }, 3000);
    }
  };

  useEffect(() => {
    document.title = "connectify-Login";
  }, []);

  return (
    <main className="relative w-full h-full bg-black  flex lg:flex-row flex-col items-center ">
      <div className=" h-[400px] absolute top-0 lg:block hidden" />
      <div className=" h-[400px] bg-appcolor absolute bottom-0 lg:block hidden " />
      <Connectify />
      <div className=" flex-1 flex justify-center items-center  h-screen w-screen bg-appcolor border-violet-950 p-8 backdrop-blur-sm  lg:rounded-tl-[200px]  ">
        {/* <FadeInAnimation> */}
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
            isValid={isValid}
            loading={loading}
          />

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
        {/* </FadeInAnimation> */}
      </div>
      <DevTool control={control} />
    </main>
  );
};

export default Login;
