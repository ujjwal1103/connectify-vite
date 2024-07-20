import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; 

interface ConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  children?: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onClose,
  onConfirm,
  title,
  message,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      tabIndex={0}
      className="fixed inset-0 flex items-center justify-center z-50 bg-secondary/50 "
    >
      <motion.div
        initial={{ y: "var(--y-from)", scale: "var(--scale-from)" }}
        animate={{ y: "var(--y-to)", scale: "var(--scale-to)" }}
        exit={{ y: "var(--y-from)", scale: "var(--scale-from)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "md:[--scale-from:0%] md:[--scale-to:100%] [--scale-from:100%] [--scale-to:100%] md:[--y-from:0%] md:[--y-to:0%] [--y-from:100%] [--y-to:0%] fixed bottom-0 w-full md:w-auto md:relative p-3 "
        )}
        tabIndex={-1}
      >
        {children ? (
          children
        ) : (
          <div className="text-primary p-4 md:p-6 shadow-xl rounded-md bg-background md:rounded-lg">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2">{message}</p>
            <div className="justify-end mt-4 flex flex-col-reverse md:flex-row gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary rounded "
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;
