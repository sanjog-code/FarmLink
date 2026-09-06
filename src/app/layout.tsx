import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FarmLink - Smart Agriculture Marketplace",
  description:
    "FarmLink connects farmers directly with consumers and bulk buyers. Fresh produce, fair prices, smarter logistics. Built for Smart India Hackathon 2026.",
  keywords: [
    "farm",
    "agriculture",
    "marketplace",
    "fresh produce",
    "farm to table",
    "bulk buying",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
