import type { Metadata } from "next";
import { Baloo_2, Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import CursorSparkle from "@/components/CursorSparkle";
import FloatingButtons from "@/components/FloatingButtons";
import { Providers } from "./providers";
import { preschoolStructuredData } from "@/lib/seo/structuredData";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-baloo" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-fredoka" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-nunito" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kaylanpreschool.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kaylan Preschool | Where Little Dreams Begin — Bangalore",
    template: "%s | Kaylan Preschool",
  },
  description:
    "Kaylan Preschool in Bangalore blends Montessori-inspired learning with the Kreedo curriculum in a magical, storybook world of play, discovery, creativity and love. Book a tour today.",
  keywords: ["preschool Bangalore", "Montessori preschool", "Kreedo curriculum", "daycare Bangalore", "Electronic City preschool"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kaylan Preschool | Where Little Dreams Begin",
    description: "A magical storybook world of play-based early learning in Bangalore.",
    url: SITE_URL,
    siteName: "Kaylan Preschool",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaylan Preschool | Where Little Dreams Begin",
    description: "A magical storybook world of play-based early learning in Bangalore.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${fredoka.variable} ${nunito.variable} font-body bg-white text-[#3a2e4d]`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(preschoolStructuredData()) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <CursorSparkle />
          {children}
          <FloatingButtons />
        </Providers>
      </body>
    </html>
  );
}
