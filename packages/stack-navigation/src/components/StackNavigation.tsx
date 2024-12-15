"use client";
import React, { useEffect, useState } from "react";
import StackContainer from "./StackContainer";
import { isDesktop } from "react-device-detect";

interface StackNavigationProps {
  disabled?: boolean;
  children: React.ReactNode;
  animationDisabledUrls?: string[];
}

export default function StackNavigation({
  disabled = true,
  children,
  animationDisabledUrls,
}: StackNavigationProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  useEffect(() => {
    if (disabled || isDesktop) {
      setIsEnabled(false);
    }
  }, []);
  if (!isEnabled) return <>{children}</>;
  return (
    <StackContainer animationDisabledUrls={animationDisabledUrls}>
      {children}
    </StackContainer>
  );
}
