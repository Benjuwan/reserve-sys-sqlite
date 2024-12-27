import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

export const metadata: Metadata = {
  title: "Reserve-Sys",
  description: "予約システムUI",
  robots: {
    index: false, // noindex
    follow: false // nofollow
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body>
        <Header />
        <div className="globalWrapper">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}