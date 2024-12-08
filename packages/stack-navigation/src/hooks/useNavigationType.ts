"use client";

import { useRef, useLayoutEffect } from "react";

export const NAVIGATION_TYPE = {
  BACK: "BACK",
  FORWARD: "FORWARD",
  RELOAD: "RELOAD",
} as const;

export type NavigationType =
  (typeof NAVIGATION_TYPE)[keyof typeof NAVIGATION_TYPE];

export default function useNavigationType(animationDuration: number) {
  const navigationTypeRef = useRef<NavigationType | null>(
    NAVIGATION_TYPE.FORWARD
  );

  // Detect page reload

  useLayoutEffect(() => {
    const handlePopState = () => {
      navigationTypeRef.current = NAVIGATION_TYPE.BACK;
      const timer = setTimeout(() => {
        navigationTypeRef.current = NAVIGATION_TYPE.FORWARD;
      }, animationDuration);
      return () => clearTimeout(timer);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigationTypeRef, animationDuration]);

  return navigationTypeRef.current;
}
