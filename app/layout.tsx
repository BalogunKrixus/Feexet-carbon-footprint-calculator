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
      </head>
      <body className="min-h-full font-body bg-near-black text-off-white antialiased">
        {children}
      </body>
    </html>
  );
}
