import type { Metadata } from "next";
import { Do_Hyeon, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { SITE } from "@/site.config";

const display = Do_Hyeon({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-display",
});

const sans = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${SITE.name} | 전화 한 통이면 꽃이 달려갑니다 · 전국 당일배송`,
  description: `축하화환·근조화환·꽃다발·꽃바구니·관엽화분·난, 전화 한 통으로 주문하세요. ${SITE.name}가 전국 어디든 당일 배송해 드립니다. 주문·상담 ${SITE.phone}`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`h-full antialiased ${display.variable} ${sans.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
