import type { Metadata, Viewport } from "next";
import { AuraHeader } from "@/components/layout/AuraHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotify Aura — AI Discovery Companion",
  description: "Discover music beyond your listening history",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121212",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-spotify-black text-spotify-text-primary font-sans antialiased min-h-screen selection:bg-spotify-green/30">
        <AuraHeader />
        <main className="max-w-md mx-auto px-4 pb-24 pt-3 min-h-[calc(100vh-120px)]">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
