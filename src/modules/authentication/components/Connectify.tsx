import backgroundImage from '../../../assets/background/bgg.png'
import { motion } from "framer-motion";
import ConnectifyLogoText from "@/components/icons/ConnectifyLogoText";
import ConnectifyIcon from "@/components/icons/Connectify";

const Connectify = () => {
  return (
    <div className="relative hidden bg-black dark:text-white lg:flex-1 lg:h-screen   w-full   lg:p-8 p-6 lg:flex justify-center items-center flex-col lg:rounded-br-[200px]">
      <h1 className="mb-3 text-bold flex justify-center items-center z-10">
        <ConnectifyLogoText/>
      </h1>
      <motion.span
       animate={{ scale: [1, 1.2, 1] }}
       transition={{ duration: 1.5, repeat: Infinity }}
        className="fixed z-50 top-10 left-10 shadow-2xl"
      >
        <ConnectifyIcon size={56} />
      </motion.span>
      <h3 className="lg:text-2xl text-justify font-display lg:block hidden z-10">
        Connectify Redefining the Way You Connect <br />
        and Share by Offering a Seamless, Intuitive, <br />
        and Personalized Environment.
      </h3>
      <img src={backgroundImage} alt="" className="absolute opacity-30 "/>
    </div>
  );
};

export default Connectify;
