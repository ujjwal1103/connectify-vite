import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SendIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Appbar = ({ hideAppBar, show }: any) => {
  const variants = {
    visible: {
      y: "0",
    },
    hidden: {
      y: "-100%",
    },
  };

  return (
    <motion.div
      animate={hideAppBar ? "hidden" : "visible"}
      variants={variants}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-2 absolute z-10 w-full bg-zinc-800 sm:hidden  flex items-center justify-between",
        { hidden: !show }
      )}
    >
      <div>
        <Link to={"/"}>
          <span>App Name</span>
        </Link>
      </div>
      <div>
        <Link to="/inbox">
          <SendIcon />
        </Link>
      </div>
    </motion.div>
  );
};

export default Appbar;
