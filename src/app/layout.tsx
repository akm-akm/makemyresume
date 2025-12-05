import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import GoatCounter from "@/components/GoatCounter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makemyresume.veeboo.in"),
  title: "MakeMyResume - Free Online Resume Builder | Create Professional Resume in Minutes",
  description: "Create a professional resume for free with MakeMyResume. Choose from expert-designed templates for software engineers, sales professionals, managers, and more. Download as PDF instantly. No signup required.",
  keywords: "resume builder, free resume maker, CV builder, resume templates, professional resume, create resume online, resume maker free, job resume, CV maker, resume generator, ATS friendly resume",
  authors: [{ name: "MakeMyResume" }],
  openGraph: {
    title: "MakeMyResume - Free Professional Resume Builder",
    description: "Create stunning resumes in minutes. Free templates, instant PDF download, ATS-friendly designs for software engineers, sales, and management roles.",
    url: "https://makemyresume.veeboo.in",
    siteName: "MakeMyResume",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MakeMyResume - Free Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakeMyResume - Free Professional Resume Builder",
    description: "Create stunning resumes in minutes. Free templates, instant PDF download.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://makemyresume.veeboo.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased`}
      >
        {children}
        <GoatCounter />
      </body>
    </html>
  );
}
