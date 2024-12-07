"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PAGE_CONTAINER_ID, View } from "../components/StackNavigation";

export function usePageTransition(pathname: string, animationDuration: number) {
  const bottomView = useRef<View | null>(null);
  const upcomingBottomView = useRef<View | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    // apply previously saved upcomingBottomView to bottomView
    bottomView.current = upcomingBottomView.current;
    // save current page to upcomingBottomView
    upcomingBottomView.current = {
      path: pathname,
      pageCache: document.getElementById(PAGE_CONTAINER_ID)?.innerHTML || null,
    };
    // start and stop animation
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), animationDuration);
    return () => clearTimeout(timer);
  }, [pathname, upcomingBottomView, bottomView, animationDuration]);
  return { bottomView, upcomingBottomView, isAnimating };
}
