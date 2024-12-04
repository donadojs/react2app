"use client";

import React from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import Link from "next/link";
import { insets } from "../AppLayout/AppLayout.js";

interface Tab {
  path: string;
  icon: React.ReactNode;
  onClick?: () => void;
}
export default function AppNavbar({
  tabs,
  backgroundColor,
}: {
  tabs: Tab[];
  backgroundColor: string;
}) {
  const pathname = usePathname();

  const shouldShowNavbar = tabs.some((tab) => {
    return pathname === tab.path;
  });

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <nav
      className={classNames(
        "fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white good border-t border-gray-100",
        backgroundColor || "bg-white border-t border-gray-200"
      )}
      style={{ paddingBottom: insets.bottom, height: insets.bottom + 52 }}
    >
      {tabs.map((tab, index) => {
        return (
          <Link
            key={index}
            href={tab.path}
            onClick={tab.onClick}
            className={classNames(
              "flex items-center justify-center w-[48px] h-full active:text-blue-600",
              tab.path === pathname ? "text-blue-600" : ""
            )}
            replace
          >
            {React.cloneElement(tab.icon as React.ReactElement, {
              className: classNames(" text-[24px]"),
            })}
          </Link>
        );
      })}
    </nav>
  );
}
