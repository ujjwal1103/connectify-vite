import { useLayoutEffect, useState } from "react";

const useScreenSize = () => {
  const [device, setDevice] = useState("desktop");

  useLayoutEffect(() => {
    const updateDevice = () => {
      if (window.innerWidth < 768) {
        setDevice("mobile");
      } else if (window.innerWidth < 1024) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
    };

    updateDevice(); // Initial check
    window.addEventListener("resize", updateDevice);

    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  return device;
};

export default useScreenSize;
