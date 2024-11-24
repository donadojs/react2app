"use client";

import { useLayoutEffect } from "react";

export function usePopStateListener(
  isNavigatingBackRef: React.MutableRefObject<boolean>,
  duration: number
) {
  useLayoutEffect(() => {
    const handlePopState = () => {
      isNavigatingBackRef.current = true;
      const timer = setTimeout(() => {
        isNavigatingBackRef.current = false;
      }, duration);
      return () => clearTimeout(timer);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isNavigatingBackRef, duration]);
}
