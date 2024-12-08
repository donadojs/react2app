"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "../hooks/usePageTransition";
import useNavigationType, { NAVIGATION_TYPE } from "../hooks/useNavigationType";
import { useRef } from "react";
import TopView from "./TopView";
import BottomView from "./BottomView";
import { PAGE_CONTAINER_ID } from "../constants/config";

export interface StackContainerProps {
  disabled?: boolean;
  children: React.ReactNode;
  animationDisabledUrls?: string[];
  animationDuration?: number;
}

export default function StackContainer({
  children,
  animationDisabledUrls = ["/"],
  animationDuration = 300,
}: StackContainerProps) {
  const pathname = usePathname();
  const topView = useRef(null);
  const bottomView = useRef(null);

  // Disable animation for back navigation
  const navigationType = useNavigationType(animationDuration);

  // Handle page transition
  const { bottomViewData, isTransitionReady } = usePageTransition(
    pathname,
    animationDuration
  );

  // Get whether the current page should animate
  const shouldAnimate =
    isTransitionReady &&
    !animationDisabledUrls.includes(pathname) &&
    navigationType === NAVIGATION_TYPE.FORWARD;

  return (
    <main className="relative w-full min-h-screen">
      <div className="w-full min-h-screen relative">
        <TopView
          ref={topView}
          pageContainerId={PAGE_CONTAINER_ID}
          shouldAnimate={shouldAnimate}
        >
          {children}
        </TopView>
        {shouldAnimate && (
          <BottomView ref={bottomView} viewData={bottomViewData.current} />
        )}
      </div>
    </main>
  );
}
