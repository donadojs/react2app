"use client";

import { useLayoutEffect, useState } from "react";
import { Page } from "../types";

export function usePageTransition(
  pathname: string,
  currentPage: React.MutableRefObject<Page | null>,
  previousPage: React.MutableRefObject<Page | null>,
  duration: number
) {
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    previousPage.current = currentPage.current;
    currentPage.current = {
      path: pathname,
      pageCache: document.getElementById("page-container")?.innerHTML || null,
    };

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), duration);
    return () => clearTimeout(timer);
  }, [pathname, currentPage, previousPage, duration]);

  return isAnimating;
}
