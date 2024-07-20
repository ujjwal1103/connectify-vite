import React, { useRef, useEffect, PropsWithChildren } from "react";

const FocusTrap = ({ children }: PropsWithChildren) => {
  const trapRef = useRef<any>(null);

  useEffect(() => {
    const trapElement = trapRef.current;
    const focusableEls = trapElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    const firstFocusableEl = focusableEls[0];

    const handleFocus = (event:any) => {
      const isTabPressed = event.key === "Tab" || event.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          event.preventDefault();
        } else {
          firstFocusableEl.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          event.preventDefault();
        }
      }
    };

    trapElement.addEventListener("keydown", handleFocus);

    return () => {
      trapElement.removeEventListener("keydown", handleFocus);
    };
  }, []);

  return (
    <div ref={trapRef} className="focus:bg-red-500">
      {children}
    </div>
  );
};

export default FocusTrap;
