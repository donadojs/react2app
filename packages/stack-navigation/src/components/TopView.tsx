import { ReactNode } from "react";

interface TopViewProps {
  isAnimating: boolean;
  children: ReactNode;
  pageContainerId: string;
}

export function TopView({
  isAnimating,
  pageContainerId,
  children,
}: TopViewProps) {
  return (
    <div
      className={`absolute top-0 left-0 right-0 min-h-screen z-20 bg-red-300 ${
        isAnimating && "animate-slideIn"
      }`}
      id={pageContainerId}
    >
      {children}
    </div>
  );
}
