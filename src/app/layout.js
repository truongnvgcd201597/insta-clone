import { Inter } from "next/font/google";
import "./globals.css";
import Headers from "@/components/headers/Header";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Instagram Clone",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <Headers />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
