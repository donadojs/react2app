"use client";

import { StackNavigation } from "@next2app/stack-navigation";

export const insets = { top: 56, bottom: 24 };
export default function AppLayout({
  navbar,
  children,
}: {
  navbar?: React.ReactNode;
  children: React.ReactNode;
}) {
  const navbarElement = navbar as React.ReactElement;
  const navPaths: string[] =
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
