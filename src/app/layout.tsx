import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "Manoj D — AI Engineer & Full-Stack Developer",
  description: "AI Engineer & Full-Stack Developer. Open to Work / Available for full-time opportunities. Chennai, India.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/android-chrome-512x512.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/android-chrome-512x512.png",
    apple: "/android-chrome-512x512.png"
  },
  openGraph: {
    title: "Manoj D — AI Engineer & Full-Stack Developer (Open to Work)",
    description: "AI Engineer & Full-Stack Developer. Open to Work / Available for full-time opportunities. Chennai, India.",
    type: "website",
    url: "https://manojd.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj D — AI Engineer (Open to Work)",
    description: "Systems-first AI engineer & full-stack developer. Open to Work / Available for full-time roles.",
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
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
