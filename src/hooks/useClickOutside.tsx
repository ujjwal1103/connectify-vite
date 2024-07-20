import { useEffect, RefObject, MutableRefObject } from 'react';

const useClickOutside = (
  callback: () => void, 
  ref?: MutableRefObject<HTMLElement | undefined>, 
  ignoreRef?: RefObject<HTMLElement> | null
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ignoreRef && ignoreRef.current && event.target instanceof Node && ignoreRef.current.contains(event.target)) {
        return; 
      }

      if (ref?.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    // Add event listeners when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Remove event listeners when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [ref, callback, ignoreRef]);
};

export default useClickOutside;
