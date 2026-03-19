"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userName", data.name || "User");
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
    <main className="min-h-screen flex items-center justify-center py-20 px-4 pattern-bg relative overflow-hidden">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 md:p-10 bg-content1/70 backdrop-blur-xl border border-divider shadow-2xl rounded-3xl z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-br from-foreground to-default-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-default-500 text-sm">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email"
            variant="faded"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={<Mail size={18} className="text-default-400" />}
            isRequired
          />
          <Input 
            label="Password" 
            type="password"
            variant="faded"
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startContent={<Lock size={18} className="text-default-400" />}
            isRequired
          />

          <Button 
            type="submit" 
            color="secondary" 
            size="lg" 
            fullWidth 
            className="font-bold shadow-lg shadow-secondary/30 mt-2"
            isLoading={isLoading}
            endContent={!isLoading && <LogIn size={18} />}
          >
            Login to PathFinder+
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-default-500 font-medium pb-2 border-b border-divider">
          Are you a mentor?{" "}
          <Link href="/mentor-login" className="text-secondary hover:text-purple-600 transition-colors flex items-center justify-center gap-1 mt-1 pb-4 group">
            Go to Mentor Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-default-500 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="text-secondary hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </main>
  );
}