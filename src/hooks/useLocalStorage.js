import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useLocalStorage
 * A small persistence hook that mirrors a piece of React state into
 * localStorage under `key`. It never throws — if localStorage is
 * unavailable (e.g. private browsing edge cases) it silently no-ops
 * and the app keeps working purely in-memory.
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - fallback value if nothing is stored yet
 * @returns {[any, Function, Function]} [value, setValue, clearValue]
 */
export function useLocalStorage(key, initialValue) {
  const isFirstRun = useRef(true);

  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: failed to read key "${key}"`, error);
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`useLocalStorage: failed to write key "${key}"`, error);
      }
    },
    [key]
  );

  const clearValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: failed to clear key "${key}"`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Avoid writing back the initial read on mount (no-op optimization).
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    }
  }, []);

  return [storedValue, setValue, clearValue];
}