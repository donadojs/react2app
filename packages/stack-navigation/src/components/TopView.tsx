import { forwardRef, ReactNode } from "react";

interface TopViewProps {
  shouldAnimate: boolean;
  children: ReactNode;
  pageContainerId: string;
}

const TopView = forwardRef<HTMLDivElement, TopViewProps>(
  ({ shouldAnimate, pageContainerId, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute top-0 left-0 right-0 min-h-screen z-20 bg-white ${
          shouldAnimate && "animate-slideIn"
        }`}
        id={pageContainerId}
      >
        {children}
      </div>
    );
  }
);

export default TopView;
