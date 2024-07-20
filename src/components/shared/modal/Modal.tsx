import React, { PropsWithChildren, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import FocusTrap from "./FocusTrap";
import { useClickOutside } from "@react-hookz/web";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ModalProps = {
  onClose: (e: any) => void;
  shouldCloseOutsideClick?: boolean;
  showCloseButton?: boolean;
  animate?: boolean;
  overlayClasses?: string;
};
const Modal = ({
  onClose,
  children,
  shouldCloseOutsideClick = true,
  showCloseButton = true,
  animate = true,
  overlayClasses,
}: PropsWithChildren<ModalProps>) => {
  const elRef = useRef<any>(null);
  const modalRef = useRef<any>(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.body;
    modalRoot.appendChild(elRef.current);
    document.body.classList.add("overflow-hidden");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(event);
      }
    };

    modalRef.current?.focus();

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      modalRoot.removeChild(elRef.current!);
      document.body.classList.remove("overflow-hidden");
      modalRef.current?.blur();
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChildClick = (e: any) => {
    e.stopPropagation();
  };

  useClickOutside(modalRef, (e) => {
    if (shouldCloseOutsideClick) {
      onClose(e);
    }
  });

  const childrenWithProps = React.Children.map(children, (child: any) => {
    return React.cloneElement(child, { onClose: onClose });
  });

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "z-[999] fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50",
        overlayClasses
      )}
    >
      <FocusTrap>
        <div className="flex justify-center items-center w-screen h-dvh">
          {animate ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "tween" }}
              onClick={handleChildClick}
              tabIndex={-1}
              ref={modalRef}
              className="focus-visible:outline-0"
            >
              {childrenWithProps}
            </motion.div>
          ) : (
            <div tabIndex={-1} onClick={handleChildClick} ref={modalRef}>
              {childrenWithProps}
            </div>
          )}

          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute hover:bg-white hover:text-black transition-colors duration-300 ease-linear lg:right-10 right-3 top-3 lg:top-10 lg:p-2 p-1 rounded-md border lg:text-base text-sm text-white"
            >
              Close
            </button>
          )}
        </div>
      </FocusTrap>
    </motion.div>,
    elRef.current
  );
};

export default Modal;
