import { updateUserDetails } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { DevTool } from "@hookform/devtools";
import { Loader } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import EditAvatar from "./EditAvatar";
import { updateDataInLocalStorage } from "@/lib/localStorage";
import { useAuth } from "@/context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { TabControl } from "@/components/shared/TabControl";
import { useState } from "react";
import Setting from "../settings/Settings";
import { motion } from "framer-motion";

const EditProfileSchema = z.object({
  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),
  gender: z.enum(["Male", "Female"]),
  name: z.string().nonempty("Name is required"),
});

const Edit = () => {
  const { user, loading, updateUser } = useAuth();
  const [tab, setTab] = useState("editProfile");
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      bio: user?.bio,
      gender: user?.gender,
      name: user?.name,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const res = (await updateUserDetails(data)) as any;
    updateDataInLocalStorage(res.updatedData);
    updateUser({ ...user, ...res.updatedData });
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!user && !loading) {
    return <div>User not found</div>;
  }

  return (
    <div className="flex-1 scrollbar-none h-auto   md:text-sm text-sm overflow-y-scroll relative">
      <div className="sticky w-full top-0">
        <div className="md:w-1/2 w-3/4 mx-auto pt-3 rounded-sm">
          <div className="overflow-clip rounded-md">
            <TabControl
              selectedTab={tab}
              setSelectedTab={setTab}
              tabs={[
                {
                  name: "Edit Profle",
                  id: "editProfile",
                },
                {
                  name: "Settings",
                  id: "settings",
                },
              ]}
              tabId={"settingsTabs"}
              indicatorClasses="h-full top-0 p-2"
            />
          </div>
        </div>
      </div>
      {tab === "editProfile" && (
        <motion.div   initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} className="md:p-20 p-2">
          <header className="flex gap-2">
            <button className="md:hidden block" onClick={() => navigate(-1)}>
              <IoChevronBack size={24} />
            </button>
            <h1 className="font-bold text-xl">Edit profile</h1>
          </header>

          <EditAvatar />
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-3 mt-5">
              <label htmlFor="bio">Name</label>
              <div className="relative">
                <Input
                  placeholder="Full Name"
                  className="border-[#363636] placeholder:text-[#363636] pr-14 focus-visible:border-gray-300 resize-none"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <span className="text-red-600">{errors.name.message}</span>
                )}
              </div>
            </div>
            <div className="space-y-3 mt-5">
              <label htmlFor="bio">Bio</label>
              <div className="relative">
                <Textarea
                  style={{
                    height: watch("bio")
                      ? `${document.getElementById("bio")?.scrollHeight}px`
                      : "auto",
                  }}
                  id="bio"
                  placeholder="Tell us a little bit about yourself"
                  className="border-[#363636] scrollbar-none max-h-40 h-fit resize-none min-h-14 placeholder:text-[#363636] pr-14 focus-visible:border-gray-300"
                  {...register("bio", {
                    maxLength: {
                      value: 200,
                      message: "Bio cannot exceed 200 characters",
                    },
                  })}
                />
                <span className="absolute right-3 bottom-2 text-sm text-[#838282]">
                  {watch("bio")?.trim().length}/200
                </span>
                {errors.bio && (
                  <span className="text-red-600">{errors.bio.message}</span>
                )}
              </div>
            </div>
            <div className="space-y-3 mt-5">
              <label htmlFor="bio">Gender</label>
              <div className="relative">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} disabled={!!user?.gender}>
                      <SelectTrigger className="border-[#363636]">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary border-[#363636]">
                        <SelectItem value="Male" className="cursor-pointer">
                          Male
                        </SelectItem>
                        <SelectItem value="Female" className="cursor-pointer">
                          Female
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <span className="text-red-600">{errors.gender.message}</span>
                )}
              </div>
            </div>
            <div className="space-y-3 mt-5 flex justify-end">
              <Button
                disabled={!isValid || !isDirty}
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-800 self-end md:w-44 md:px-4 px-5 py-2 md:text-sm text-sm disabled:opacity-50 disabled:pointer-events-none"
              >
                Submit
              </Button>
            </div>
          </motion.form>
          <DevTool control={control} />
        </motion.div>
      )}
      {tab === "settings" && <Setting />}
    </div>
  );
};
export default Edit;
