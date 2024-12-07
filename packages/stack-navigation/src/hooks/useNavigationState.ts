"use client";

import { useRef } from "react";
import { Page } from "../types";

export function useNavigationState() {
  const bottomView = useRef<Page | null>(null);
  const topView = useRef<Page | null>(null);
  const isNavigatingBackRef = useRef(false);

  return {
    bottomView,
    topView,
    isNavigatingBackRef,
  };
}
