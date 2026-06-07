import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GreenPrint: Know your carbon footprint",
  description: "A personalised carbon footprint calculator built for the Nigerian community by Feexet.",
  keywords: ["carbon footprint", "Nigeria", "climate", "sustainability", "Feexet"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full`}>
      <head>
        <link
          rel="preload"
          href="/fonts/CalSans-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Inline @font-face bypasses Turbopack CSS processing — most reliable way to load local fonts in Next.js 16 */}
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: "Cal Sans";
            src: url("/fonts/CalSans-SemiBold.woff2") format("woff2");
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
          }
        `}} />
      </head>
      <body className="min-h-full font-body bg-near-black text-off-white antialiased">
        {children}
      </body>
    </html>
  );
}
