import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SiteNavbar } from "@/components/site-navbar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobly - Find work that fits your life",
  description: "A calmer, smarter way for Africans to discover work worth saying yes to.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNavbar />
        {children}
      </body>
    </html>
  );
}
