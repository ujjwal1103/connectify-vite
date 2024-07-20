/**
 * A custom React hook for debouncing a value.
 *
 * @param {any} value - The value to be debounced.
 * @param {number} delay - The delay in milliseconds before updating the debounced value.
 * @returns {any} debouncedValue - The debounced value that gets updated after the specified delay.
 */


import { useState, useEffect } from 'react';

export const useDebounce = (value:any, delay:number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout on component unmount or when the value changes
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Example usage:
// const debouncedSearchTerm = useDebounce(searchTerm, 300);

// You can then use `debouncedSearchTerm` in your component, and it will only update
// after 300 milliseconds have passed since the last change to `searchTerm`.
