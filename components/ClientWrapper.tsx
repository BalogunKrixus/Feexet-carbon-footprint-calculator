"use client";

import dynamic from "next/dynamic";

const JourneyController = dynamic(
  () => import("@/components/JourneyController").then((m) => m.JourneyController),
  { ssr: false }
);

export function ClientWrapper() {
  return <JourneyController />;
}
