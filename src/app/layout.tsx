import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { FooterSwitch } from "@/components/FooterSwitch";
import { Header } from "@/components/Header";
import "./globals.css";

const quicksand = Quicksand({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flex Trim | Custom Flexible Moulding",
  description: "Custom flexible moulding and millwork. Interior and exterior trim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="antialiased font-sans bg-white text-neutral-800">
        <Header />
        {children}
        <FooterSwitch />
      </body>
    </html>
  );
}
