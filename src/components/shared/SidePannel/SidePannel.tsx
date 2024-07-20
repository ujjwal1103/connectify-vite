import { useClickOutside } from "@react-hookz/web";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const SidePannel = ({ width, children, onClose }: any) => {
  const portalRoot = document.getElementsByTagName("body")[0];
  const ref = useRef<any>();

  if (!portalRoot) {
    throw new Error("Portal root element not found");
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(event);
      }
    };

    ref.current?.focus();

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      ref.current?.blur();
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useClickOutside(ref, onClose);

  return ReactDOM.createPortal(
    <motion.div
      ref={ref}
      initial={{ x: -500 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ x: -500 }}
      transition={{ duration: 0.2, ease: "linear" }}
      className="w-80 h-full z-20 fixed top-0 transition-all duration-300 focus-visible:outline-0"
      style={{ left: width }}
      tabIndex={-1}
    >
      {children}
    </motion.div>,
    portalRoot
  );
};

export const Menu = ({
  triggerRef,
  onClose,
  children,
  open,
  left = 0,
}: any) => {
  const [menuPosition, setMenuPosition] = useState<any>({
    top: 0,
    left: left,
    bottom: "auto",
    right: "auto",
  });

  const portalRoot = document.getElementsByTagName("body")[0];

  const ref = useRef<any>();

  if (!portalRoot) {
    throw new Error("Portal root element not found");
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(event);
      }
    };

    ref.current?.focus();

    document.body.addEventListener("keydown", handleKeyDown);

    return () => {
      ref.current?.blur();
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useLayoutEffect(() => {
    if (left) {
      setMenuPosition({
        left: left > 100 ? 180 : 95,
        bottom: 0,
      });
    }
  }, [left]);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const buttonRect = triggerRef.current.getBoundingClientRect();
      const menuHeight = 200; // Approximate height of the menu
      const menuWidth = 200; // Approximate width of the menu

      let top = buttonRect.bottom + window.scrollY + 8;
      let left = buttonRect.left + window.scrollX;
      let bottom = "auto";
      let right = "auto";

      if (window.innerHeight - buttonRect.bottom < menuHeight) {
        top = buttonRect.top + window.scrollY - menuHeight - 8;
      }

      if (window.innerWidth - buttonRect.right < menuWidth) {
        left = buttonRect.right + window.scrollX - menuWidth - 8;
      }

      if (top < 0) {
        top = 8;
        bottom = "auto";
      }

      if (left < 0) {
        left = 8;
        right = "auto";
      }

      setMenuPosition({ top, left, bottom, right });
    }
  }, [open]);

  useClickOutside(ref, onClose);

  if (menuPosition.top === 0 && menuPosition.left === 0) {
    return null;
  }

  return ReactDOM.createPortal(
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 400 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 400 }}
      transition={{ duration: 0.2 }}
      className="z-50 fixed h-fit focus-visible:outline-0 "
      tabIndex={-1}
      style={{
        top: menuPosition?.top,
        left: menuPosition?.left,
        bottom: menuPosition?.bottom,
        right: menuPosition?.right,
      }}
    >
      {children}
    </motion.div>,
    portalRoot
  );
};

export default SidePannel;
