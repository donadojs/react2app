"use client";

import { StackNavigation } from "@react2app/stack-navigation";
import { AppNavbar } from "../AppNavbar";
import { usePathname } from "next/navigation";

export const insets = { top: 56, bottom: 24 };
export default function AppLayout({
  navbar,
  children,
}: {
  navbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const navbarElement = navbar as React.ReactElement;
  const navPaths =
    navbarElement?.props?.tabs?.map((tab: { path: string }) => tab.path) || [];

  return (
    <div>
      <StackNavigation animationDisabledUrls={navPaths}>
        {children}
        {navbar}
      </StackNavigation>
    </div>
  );
}
