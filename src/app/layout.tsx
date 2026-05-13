import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";

import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMA VisiSekolah | Unggul dalam Prestasi dan Karakter",
  description: "Portal resmi SMA VisiSekolah. Platform pendidikan terintegrasi untuk siswa, guru, dan orang tua.",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <LanguageProvider>
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
