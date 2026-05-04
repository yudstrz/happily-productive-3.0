import type { Metadata, Viewport } from "next";
import { Nunito, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/layout/Shell";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--hp-font",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--hp-font-mono",
});

export const viewport: Viewport = {
  themeColor: "#FDB913",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Flow Productivity",
  description: "Intelligent Happiness — Human-Centered Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flow",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${nunito.variable} ${jetbrains.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
