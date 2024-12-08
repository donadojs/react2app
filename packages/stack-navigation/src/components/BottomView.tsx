import { forwardRef, useLayoutEffect, ForwardedRef } from "react";
import { ViewData } from "../types";
import "../styles.css";

interface BottomViewProps {
  viewData: ViewData | null;
}

const BottomView = forwardRef<HTMLDivElement, BottomViewProps>(
  ({ viewData }, ref: ForwardedRef<HTMLDivElement>) => {
    useLayoutEffect(() => {
      if (!ref || typeof ref !== "object" || !ref.current) return;
      ref.current.scrollTo({
        top: viewData?.scrollPosition?.y ?? 0,
        left: viewData?.scrollPosition?.x ?? 0,
        behavior: "instant",
      });
    }, [viewData, ref]);

    if (!viewData) return null;
    return (
      <div
        ref={ref}
        className="absolute top-0 left-0 right-0 h-screen z-10  overflow-scroll hide-scrollbar"
        dangerouslySetInnerHTML={{ __html: viewData.pageCache ?? "" }}
      />
    );
  }
);

export default BottomView;
