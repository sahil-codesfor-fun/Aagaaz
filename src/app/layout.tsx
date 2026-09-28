import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainWrapper from "@/components/layout/MainWrapper";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getBaseUrl = (): URL => {
  let rawUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://aagaaz-gu.vercel.app");

  rawUrl = rawUrl.trim();
  if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    rawUrl = `https://${rawUrl}`;
  }

  try {
    return new URL(rawUrl);
  } catch {
    return new URL("https://aagaaz-gu.vercel.app");
  }
};

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: "Aagaz 2K26 – Star Night | Geeta University",
  description: "Official entry pass and event platform for Aagaz 2K26 Star Night featuring Sunanda Sharma at Geeta University.",
  icons: {
    icon: "/geeta_logo.png",
    shortcut: "/geeta_logo.png",
    apple: "/geeta_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Providers>
          <MainWrapper>{children}</MainWrapper>
        </Providers>
      </body>
    </html>
  );
}
