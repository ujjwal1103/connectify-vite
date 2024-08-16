import { Loader } from "lucide-react";

const PageLoading = () => {
  return (
    <div className="flex-1 min-h-dvh flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default PageLoading;
