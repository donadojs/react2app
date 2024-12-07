"use client";

import { usePathname } from "next/navigation";
import { TopView } from "./TopView";
import { BottomView } from "./BottomView";
import type { StackNavigationProps } from "../types";
import { usePageTransition } from "../hooks/usePageTransition";
import useNavigationType, { NAVIGATION_TYPE } from "../hooks/useNavigationType";

export const PAGE_CONTAINER_ID = "page-container";

export interface View {
  path: string;
  pageCache: string | null;
}

export default function StackNavigation({
  children,
  animationDisabledUrls = ["/"],
  animationDuration = 300,
}: StackNavigationProps) {
  const pathname = usePathname();

  // Disable animation for back navigation
  const navigationType = useNavigationType(animationDuration);

  // Handle page transition
  const { bottomView, isAnimating } = usePageTransition(
    pathname,
    animationDuration
  );

  // Get whether the current page should animate
  const shouldAnimate =
    isAnimating &&
    !animationDisabledUrls.includes(pathname) &&
    navigationType === NAVIGATION_TYPE.FORWARD;

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden">
      <div className="w-full min-h-screen relative">
        <TopView
          pageContainerId={PAGE_CONTAINER_ID}
          isAnimating={shouldAnimate}
        >
          {children}
          <div className="h-[500px] w-10 bg-red-300" />
        </TopView>
        <BottomView pageCache={bottomView.current?.pageCache ?? null} />
      </div>
    </main>
  );
}
