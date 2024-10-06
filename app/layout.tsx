import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

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
          className={` antialiased`}
        >
          {/* bodycolor = bg-gray-100 */}
          <Header />
          {children}
          <Toaster />
        </body>
      </html>
    </StoreProvider>
  );
}
