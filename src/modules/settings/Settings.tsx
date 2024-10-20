import { useState } from "react";
import Switch from "@/components/shared/Inputs/Switch";
import { useAuth } from "@/context/AuthContext";
import { makePrivate } from "@/api";
import SentRequests from "./SentRequests";
import { motion } from "framer-motion";

const PrivateAccount = () => {
  const { user } = useAuth();
  const [checked, setChecked] = useState<boolean>(!!user?.isPrivate);

  const handleChange = async () => {
    setChecked(!checked);
    (await makePrivate(checked)) as any;
  };

  return (
    <div className="py-3 flex justify-between items-center">
      <label htmlFor="private_account" className="text-[16px]">
        Private account
      </label>
      <Switch
        checked={checked}
        onChange={handleChange}
        className="bg-background"
      />
    </div>
  );
};

const settings = [
  {
    id: "101",
    title: "Account Privacy",
    subText:
      "When your account is public, your profile and posts can be seen by anyone.",
    component: <PrivateAccount />,
  },
];

const Setting = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="md:w-1/2 w-[95%] mx-auto"
    >
      <header className=" py-4">
        <h1 className="font-bold text-xl">Settings</h1>
      </header>
      <section className="">
        {settings.map((setting) => {
          return (
            <div className="bg-secondary p-2 rounded-md">
              <h2 className="text-semibold text-xl">{setting.title}</h2>
              <div>{setting.component}</div>
              <p className="text-xs">{setting.subText}</p>
            </div>
          );
        })}

        <SentRequests />
      </section>
    </motion.div>
  );
};

export default Setting;
