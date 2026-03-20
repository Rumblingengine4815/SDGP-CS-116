"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, Progress } from "@heroui/react";
import { UploadCloud, FileText, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(20);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate parsing progress
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p));
      }, 500);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const headersInit: HeadersInit = {};
      const token = localStorage.getItem("token");
      if (token) {
        headersInit["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${apiUrl}/api/resume/upload`, {
        method: "POST",
        headers: headersInit,
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      const data = await res.json();
      localStorage.setItem("resultData", JSON.stringify(data));
      
      // Short delay for visual completion
      setTimeout(() => {
        window.location.href = '/results';
      }, 800);
      
    } catch (err) {
      console.error(err);
      alert("Error parsing resume. Please try again.");
      setIsUploading(false);
      setProgress(0);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen relative flex items-center justify-center py-20 px-4 bg-slate-50 dark:bg-zinc-950 pattern-bg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-200 dark:bg-indigo-900 mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center py-20 px-4 bg-slate-50 dark:bg-zinc-950 pattern-bg">
      <div className="absolute top-8 left-8">
        <Button as={Link} href="/dashboard" variant="light" startContent={<ChevronLeft size={20} />} className="font-semibold px-6">
          Back to Dashboard
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-indigo-800 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
            Fast-Track Persona Extraction
          </h1>
          <p className="text-foreground/70 text-lg max-w-xl mx-auto">
            Upload your resume and let our ML Engine instantly map your trajectory, identifying your core alignment and live market opportunities.
          </p>
        </div>

        <Card className="border border-divider bg-white/80 dark:bg-zinc-900/90 backdrop-blur-3xl shadow-2xl rounded-[2.5rem]">
          <CardBody className="p-8 md:p-12">
            {!file ? (
              <div 
                className="border-3 border-dashed border-divider hover:border-indigo-400 dark:hover:border-indigo-500 rounded-[2rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all bg-default-50/50 hover:bg-indigo-50/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 group"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                />
                <div className="p-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Drag & Drop your Resume</h3>
                <p className="text-foreground/60 font-medium">or click here to browse files (PDF, DOCX)</p>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center gap-6 p-6 rounded-2xl border-2 border-indigo-500/20 bg-indigo-50 dark:bg-indigo-900/10 mb-8">
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 shadow-sm text-indigo-600">
                    <FileText size={32} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-lg truncate flex items-center gap-2">
                      {file.name} <CheckCircle2 size={18} className="text-success-500" />
                    </p>
                    <p className="text-sm text-foreground/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  {!isUploading && (
                    <Button variant="light" color="danger" onPress={() => setFile(null)}>Remove</Button>
                  )}
                </div>

                {isUploading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      <span>Synthesizing structural insights...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      color="secondary" 
                      classNames={{ indicator: "bg-gradient-to-r from-indigo-500 to-purple-500" }} 
                    />
                  </div>
                ) : (
                  <Button 
                    color="secondary" 
                    size="lg" 
                    className="w-full font-bold h-16 text-lg shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
                    onPress={handleUpload}
                  >
                    Generate AI Persona
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </main>
  );
}
