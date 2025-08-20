import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CompleteFooterSection from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "react-hot-toast";
import ScrollButton from "@/components/ScrollButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aitoolscover.com"),
  title: "AI Tools Cover - Discover the Best AI Tools",
  description:
    "Find and explore the best AI tools for your needs. Comprehensive directory of artificial intelligence software and applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B1170RF10M"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B1170RF10M');
            `,
          }}
        />
      </head>
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
       <body
  className="antialiased"
  suppressHydrationWarning={true}
>
        <Navbar />
        <Toaster />
        <LayoutWrapper>{children}</LayoutWrapper>
        <CompleteFooterSection />
        <ScrollButton type="top" />
        <ScrollButton type="bottom" />
      </body>
    </html>
  );
}