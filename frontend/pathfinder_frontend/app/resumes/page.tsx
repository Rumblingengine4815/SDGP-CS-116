"use client";

import ResumeScannerStructure from "@/components/ResumeScannerStructure";
import Navbar from "@/components/Navbar";
import { DoodleBackground } from "@/components/DoodleBackground";

export default function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter overflow-x-hidden relative flex flex-col">
      <DoodleBackground>
      <Navbar />
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 mb-24 z-10 relative mt-8">
         <ResumeScannerStructure />
      </main>
      </DoodleBackground>
    </div>
  );
}
