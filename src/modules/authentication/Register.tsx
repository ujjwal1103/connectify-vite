import { registerWithEmailAndPassword } from "@/api";
import ConnectifyIcon from "@/components/icons/Connectify";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Connectify from "./components/Connectify";
import ConnectifyLogoText from "@/components/icons/ConnectifyLogoText";
import { GoogleButton } from "./components/GoogleButton";
import { SubmitButton } from "./components/SubmitButton";
import { PasswordLock, PersonFill, UsernameIcon } from "@/components/icons";
import Input from "@/components/shared/Input";
import { Mail } from "lucide-react";

const Register = () => {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { register, handleSubmit, setError, clearErrors, formState } = useForm({
    criteriaMode: "all",
    mode: "onSubmit",
  });
  const { errors, isValid, isSubmitting } = formState;
  const onSubmit = (data: any) => {
    userSignUp(data);
  };

  const userSignUp = async (data: any) => {
    setLoading(true);
    try {
      const res = (await registerWithEmailAndPassword(data)) as any;

      if (res.isSuccess) {
        setLoading(false);
        login(res?.user);
        toast.success(res.message, {
          icon: <ConnectifyIcon size={34} />,
          closeOnClick: true,
          closeButton: true,
          autoClose: 2000,
          hideProgressBar: false,
        });
        navigator("/");
      }
    } catch (error: any) {
      setLoading(false);
      setError("root.serverError", {
        type: error?.statusCode,
        message: error?.message,
      });
      toast.error(error?.response?.data?.message || error.message);
      setTimeout(() => {
        clearErrors();
      }, 5000);
    }
  };

  useEffect(() => {
    document.title = "connectify-register";
  }, []);

  return (
    <div className="w-full h-full relative bg-appcolor flex lg:flex-row flex-col items-center flex-1">
      <div className="w-full h-[400px] bg-black absolute top-0 lg:block hidden" />
      <div className="w-full h-[400px]  absolute bottom-0 lg:block hidden " />
      <Connectify />
      <div className="lg:flex-1 h-full flex justify-center items-center bg-appcolor p-3 lg:p-8 backdrop-blur-sm lg:rounded-tl-[200px]">
        {/* <FadeInAnimation> */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-3 "
        >
          <h1 className="text-bold flex justify-center items-center lg:hidden">
            <ConnectifyLogoText />
          </h1>
          <div className="flex flex-col gap-2 dark:text-white text-3xl font-bold">
            Welcome!
          </div>
          <div className="flex flex-col gap-2 dark:text-white text-xl">
            Register To Connectify
          </div>

          <Input
            autoFocus={true}
            type="text"
            placeholder="Username"
            prefix={<UsernameIcon size={24} />}
            error={errors?.username}
            {...register("username", {
              required: "Username is Required",
              pattern: {
                value: /^(?=[a-z_])[a-z0-9_]{5,20}$/,
                message: "Invalid Username",
              },
              validate: (val) => {
                return val !== "ujjwallade" || "Value should be ujjwal lade";
              },
            })}
          />
          <Input
            autoFocus={false}
            type="text"
            placeholder="Name"
            prefix={<PersonFill size={24} />}
            error={errors?.name}
            {...register("name", { required: "Name is Required" })}
          />

          <Input
            autoFocus={false}
            type="text"
            placeholder="Email"
            prefix={<Mail size={24} />}
            error={errors?.email}
            {...register("email", {
              required: "Email is Required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Invalid Email",
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
            placeholder="Password"
            prefix={<PasswordLock size={24} />}
            error={errors?.password}
          />

          <SubmitButton
            title={"Register"}
            isSubmitting={isSubmitting}
            isValid={isValid}
            loading={loading}
          />

          <p className="text-white">
            Already have an account
            <Link to={"/login"} className="text-violet-200 cursor-pointer px-2">
              Login
            </Link>
          </p>

          <GoogleButton />
        </form>
        {/* </FadeInAnimation> */}
      </div>
    </div>
  );
};

export default Register;
