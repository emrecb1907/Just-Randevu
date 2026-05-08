import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import "./globals.css";

const helvena = localFont({
  src: [
    {
      path: "./fonts/helvena-extralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/helvena-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/helvena-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/helvena-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/helvena-semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/helvena-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/helvena-extrabold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/helvena-black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-helvena",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Just Randevu",
  description: "Çok işletmeli randevu, personel ve operasyon yönetimi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${helvena.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
