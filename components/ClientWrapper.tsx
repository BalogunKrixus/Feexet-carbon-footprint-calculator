"use client";

import dynamic from "next/dynamic";

function AppLoader() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#062436",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "2px solid rgba(5,167,180,0.2)",
            borderTop: "2px solid #05A7B4",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p
          style={{
            color: "rgba(245,248,250,0.4)",
            fontSize: 13,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Loading GreenPrint…
        </p>
      </div>
    </div>
  );
}

const JourneyController = dynamic(
  () => import("@/components/JourneyController").then((m) => m.JourneyController),
  { ssr: false, loading: () => <AppLoader /> }
);

export function ClientWrapper() {
  return <JourneyController />;
}
