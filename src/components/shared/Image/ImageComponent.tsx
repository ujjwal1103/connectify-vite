import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { memo, useState } from "react";

const ImageComponent = ({
  src,
  alt,
  loader,
  fallback,
  className = "",
  ...props
}: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <>
      {loading && (
        <div className="w-full flex items-center justify-center h-96">
          <Loader className="animate-spin" />
        </div>
      )}
      {!error ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(className, { hidden: loading })}
          {...props}
        />
      ) : (
        <div className="fallback w-full h-96 flex items-center justify-center">
          <div>Failed to load image.</div>
        </div>
      )}
    </>
  );
};

export default memo(ImageComponent);
