import { Camera } from "lucide-react";

export const EmptyPost = ({ message }: { message: string }) => {
  return (
    <div className="lg:flex-1 w-full   grid place-content-center">
      <div className="flex flex-col gap-5 text-center items-center">
        <div className="p-2 border-2 rounded-full">
          <Camera size={55} strokeWidth={1} className="" />
        </div>
        <span>{message || "No Post Yet"}</span>
      </div>
    </div>
  );
};
