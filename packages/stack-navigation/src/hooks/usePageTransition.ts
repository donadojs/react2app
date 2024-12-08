"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { PAGE_CONTAINER_ID } from "../constants/config";
import { ViewData } from "../types";

export function usePageTransition(pathname: string, animationDuration: number) {
  const bottomViewData = useRef<ViewData | null>(null);
  const upcomingBottomViewData = useRef<ViewData | null>(null);
  const [isTransitionReady, setIsTransitionReady] = useState(false);

  useLayoutEffect(() => {
    let requestAnimationFrameId: number;
    const handleScroll = () => {
      requestAnimationFrameId = requestAnimationFrame(() => {
        if (upcomingBottomViewData.current) {
          upcomingBottomViewData.current.scrollPosition = {
            x: window.scrollX,
            y: window.scrollY,
          };
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, []);

  useLayoutEffect(() => {
    // apply previously saved upcomingBottomViewData to bottomViewData
    console.log("upcomingBottomViewData", upcomingBottomViewData.current);
    bottomViewData.current = upcomingBottomViewData.current;
    // save current page to upcomingBottomViewData
    upcomingBottomViewData.current = {
      path: pathname,
      pageCache: document.getElementById(PAGE_CONTAINER_ID)?.innerHTML || null,
      scrollPosition: { x: window.scrollX, y: window.scrollY },
    };
    // start and stop animation
    setIsTransitionReady(true);
    const timer = setTimeout(
      () => setIsTransitionReady(false),
      animationDuration
    );
    return () => clearTimeout(timer);
  }, [pathname, upcomingBottomViewData, bottomViewData, animationDuration]);
  return { bottomViewData, upcomingBottomViewData, isTransitionReady };
}
