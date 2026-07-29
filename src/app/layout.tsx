import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom left enabled — disabling it is an accessibility regression.
  maximumScale: 5,
};

export const metadata: Metadata = {
  // Resolves relative OG/Twitter image paths to absolute URLs.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://greatoutdoor.in",
  ),
  title: {
    default: "Great Outdoor — Outdoor Furniture",
    template: "%s | Great Outdoor",
  },
  description:
    "Hand-woven outdoor furniture — chairs, tables and accessories built for gardens, patios and terraces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
