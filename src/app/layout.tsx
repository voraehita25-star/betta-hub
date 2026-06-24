import type { Metadata } from "next";
import { Trirong, Anuphan } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl } from "@/lib/site";

const trirong = Trirong({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600"],
  variable: "--font-trirong",
  display: "swap",
});

const anuphan = Anuphan({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-anuphan",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "BettaHub — คู่มือและรีวิวเรื่องปลากัด ตู้ปลา และอุปกรณ์",
    template: "%s · BettaHub",
  },
  description:
    "แหล่งรวมความรู้เรื่องปลากัด การจัดตู้ปลา เครื่องกรอง และอุปกรณ์เลี้ยงปลา คู่มือมือใหม่ รีวิวสินค้าจากการใช้จริง พร้อมแนะนำของดีคุ้มราคา",
  keywords: ["ปลากัด", "ตู้ปลา", "เครื่องกรอง", "เลี้ยงปลากัด", "อุปกรณ์ตู้ปลา", "ปลาสวยงาม"],
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    title: "BettaHub — ครบเรื่องปลากัด ตู้ปลา และอุปกรณ์",
    description: "คู่มือเลี้ยงปลากัดสำหรับมือใหม่ + รีวิวอุปกรณ์ตู้ปลาคุ้มราคา",
    siteName: "BettaHub",
    images: [
      {
        url: "/images/hero.jpg",
        // ตรงกับไฟล์จริง public/images/hero.jpg (1800×1200, 3:2) — เดิมประกาศ 1200×630 ไม่ตรง ทำให้ crawler ครอป/ย่อเพี้ยน
        width: 1800,
        height: 1200,
        alt: "BettaHub — ครบเรื่องปลากัด ตู้ปลา และอุปกรณ์",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BettaHub — ครบเรื่องปลากัด ตู้ปลา และอุปกรณ์",
    description: "คู่มือเลี้ยงปลากัดสำหรับมือใหม่ + รีวิวอุปกรณ์ตู้ปลาคุ้มราคา",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${trirong.variable} ${anuphan.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          ข้ามไปยังเนื้อหา
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 scroll-mt-16 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
