"use client";

import dynamic from "next/dynamic";

export const TopBarDynamic = dynamic(
  () => import("@/components/platform/TopBar").then((m) => m.TopBar),
  { ssr: false },
);
