import { ReactNode } from "react";

interface CurrentPageLayerProps {
  isAnimating: boolean;
  pathname: string;
  animationDisabledUrls: string[];
  isNavigatingBack: boolean;
  children: ReactNode;
}

export function CurrentPageLayer({
  isAnimating,
  pathname,
  animationDisabledUrls,
  isNavigatingBack,
  children,
}: CurrentPageLayerProps) {
  const shouldAnimate =
    isAnimating &&
    !animationDisabledUrls.includes(pathname) &&
    !isNavigatingBack;

  return (
    <div
      className={`absolute top-0 left-0 right-0 bg-white min-h-screen z-20 ${
        shouldAnimate ? "animate-slideIn" : ""
      }`}
      id="page-container"
    >
      {children}
    </div>
  );
}
