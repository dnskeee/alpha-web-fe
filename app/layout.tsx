import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "alpha-web-fe",
  description: "alpha web frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
