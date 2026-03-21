"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userEmail", email);
        window.location.href = "/dashboard";
      } else {
        alert(data.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-20 px-4 bg-slate-50 dark:bg-zinc-950 pattern-bg relative overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-6 md:p-8 bg-white/70 dark:bg-zinc-900/90 backdrop-blur-xl border border-divider shadow-2xl rounded-3xl z-10"
      >
        <div className="text-center mb-9">
          <h1 className="text-3xl font-black bg-gradient-to-br from-foreground to-default-500 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h1>
          <p className="text-default-500 text-sm">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-foreground ml-1 block mb-1">Email Address *</label>
              <Input
                type="email"
                placeholder="Enter your email"
                variant="faded"
                color="secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail size={18} className="text-default-400 ml-1" />}
                isRequired
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground ml-1 block mb-1">Password *</label>
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Enter your password"
                variant="faded"
                color="secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Lock size={18} className="text-default-400 ml-1" />}
                endContent={
                  <button className="focus:outline-none pr-1" type="button" onClick={() => setIsVisible(!isVisible)}>
                    {isVisible ? <EyeOff size={18} className="text-default-400" /> : <Eye size={18} className="text-default-400" />}
                  </button>
                }
                isRequired
              />
            </div>
          </div>

          <Button
            type="submit"
            color="secondary"
            size="lg"
            fullWidth
            className="font-bold shadow-lg shadow-secondary/30 mt-4"
            isLoading={isLoading}
            endContent={!isLoading && <LogIn size={18} />}
          >
            Login to PathFinder+
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-bold transition-colors">
              Sign up
            </Link>
          </div>

          <div className="w-full h-px bg-divider my-2"></div>

          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
            Are you a mentor?{" "}
            <Link href="/mentor-login" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-bold transition-colors flex items-center gap-1 group">
              Go to Mentor Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}