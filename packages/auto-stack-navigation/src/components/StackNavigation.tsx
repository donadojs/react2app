"use client";

import { usePathname } from "next/navigation";
import { useNavigationState } from "../hooks/useNavigationState";
import { usePopStateListener } from "../hooks/usePopStateListener";
import { usePageTransition } from "../hooks/usePageTransition";
import { CurrentPageLayer } from "./CurrentPageLayer";
import { PreviousPageLayer } from "./PreviousPageLayer";
import type { StackNavigationProps } from "../types";

export default function StackNavigation({
  children,
  animationDisabledUrls = ["/"],
  animationDuration = 300,
}: StackNavigationProps) {
  const pathname = usePathname();
  const { previousPage, currentPage, isNavigatingBackRef } =
    useNavigationState();

  usePopStateListener(isNavigatingBackRef, animationDuration);
  const isAnimating = usePageTransition(
    pathname,
    currentPage,
    previousPage,
    animationDuration
  );

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <div className="w-full min-h-screen relative">
        <CurrentPageLayer
          isAnimating={isAnimating}
          pathname={pathname}
          animationDisabledUrls={animationDisabledUrls}
          isNavigatingBack={isNavigatingBackRef.current}
        >
          {children}
        </CurrentPageLayer>
        <PreviousPageLayer
          pageCache={previousPage.current?.pageCache ?? null}
        />
      </div>
    </main>
  );
}
