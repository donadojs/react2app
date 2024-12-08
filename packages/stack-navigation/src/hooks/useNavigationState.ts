"use client";

import { useRef } from "react";
import { ViewData } from "../types";

export function useNavigationState() {
  const bottomView = useRef<ViewData | null>(null);
  const topView = useRef<ViewData | null>(null);
  const isNavigatingBackRef = useRef(false);

  return {
    bottomView,
    topView,
    isNavigatingBackRef,
  };
}
