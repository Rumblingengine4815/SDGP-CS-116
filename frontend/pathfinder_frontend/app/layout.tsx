import type { Metadata } from "next";
import { Sora, DM_Sans, JetBrains_Mono, Geist } from 'next/font/google';
import { Providers } from "./providers";
import Footer from "./components/layout/footer";
import ChatbotPopup from "../components/ChatbotPopup";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export const metadata: Metadata = {
  title: "PathFinder+",
  description: "PathFinder+ career guidance platform",
};

const bgDoodle = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M10 10l10-10m0 20L10 10m40 40l10-10m0 20L50 50m40-20l10-10m0 20L90 30M10 70l10-10m0 20L10 70m40 20l10-10m0 20L50 90' stroke='%236366f1' stroke-width='1.5' stroke-opacity='0.08' fill='none' stroke-linecap='round'/%3E%3Ccircle cx='50' cy='10' r='3' fill='none' stroke='%236366f1' stroke-width='1.5' stroke-opacity='0.08'/%3E%3Cpath d='M8 40h4v4H8z' fill='none' stroke='%236366f1' stroke-width='1.5' stroke-opacity='0.08'/%3E%3C/svg%3E")`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("scroll-smooth", sora.variable, dmSans.variable, jetbrains.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-foreground font-sans antialiased relative"
        suppressHydrationWarning
      >
        {/* Global Fixed Doodle Overlay */}
        <div 
          className="fixed inset-0 z-[50] pointer-events-none" 
          style={{ backgroundImage: bgDoodle }} 
        />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="grow">{children}</main>

            <Footer />
            <ChatbotPopup />
            <ThemeSwitcher />
          </div>
        </Providers>
      </body>
    </html>
  );
}
