import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { BottomNavbar } from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: "Inkerra - Discover and Share Blogs",
  description:
    "Welcome to Inkerra, the ultimate blogging platform. Create, share, and explore engaging content from writers across the globe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
      <head>
          {/* Favicon */}
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </head>
        <body
          className={`antialiased bg-gray-100 `}
        >
          <Header />
         <div className="pt-16 pb-16">{children}</div>
          <BottomNavbar />
          <Toaster />
        </body>
      </html>
    </StoreProvider>
  );
}
