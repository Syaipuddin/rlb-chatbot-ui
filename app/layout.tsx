import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script  from "next/script";
import "./globals.css";

const inter = Inter({ 
  weight: "400",
  subsets: ["greek"] 
});

export const metadata: Metadata = {
  title: "Chatbot Melati",
  description: "Chatbot Melati",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
            src="https://kit.fontawesome.com/134ecf86d0.js" 
            crossOrigin="anonymous" 
            strategy="afterInteractive" // Load the script after the page becomes interactive
          />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
