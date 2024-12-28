import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";
import { BottomNavbar } from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: "Blog App",
  description: "it is an Blog App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
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
