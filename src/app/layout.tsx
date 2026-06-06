import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rajdhani = localFont({
  src: "../../public/fonts/rajdhani.semibold.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-rajdhani",
});

const blackKastile = localFont({
  src: "../../public/fonts/Black Kastile Modern.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-black-kastile",
});

export const metadata: Metadata = {
  title: "Stats-Tube",
  description: "Paste a YouTube URL, get instant data-driven intelligence. Track engagement rates and uncover momentum. No Logins Required.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${blackKastile.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
