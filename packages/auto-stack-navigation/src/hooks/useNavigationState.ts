"use client";

import { useRef } from "react";
import { Page } from "../types";

export function useNavigationState() {
  const previousPage = useRef<Page | null>(null);
  const currentPage = useRef<Page | null>(null);
  const isNavigatingBackRef = useRef(false);

  return {
    previousPage,
    currentPage,
    isNavigatingBackRef,
  };
}
