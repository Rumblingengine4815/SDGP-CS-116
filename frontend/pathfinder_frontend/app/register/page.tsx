"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName + " " + lastName,
          email: email,
          password: password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User registered successfully");
        window.location.href = "/login";
      } else {
        alert(data.detail || "Registration failed");
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
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-6 md:p-8 bg-white/70 dark:bg-zinc-900/90 backdrop-blur-xl border border-divider shadow-2xl rounded-[2.5rem] z-10"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-black bg-gradient-to-br from-foreground to-default-500 bg-clip-text text-transparent mb-1">
            Create an Account
          </h1>
          <p className="text-default-500 text-sm">Join PathFinder+ and map your future</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-foreground ml-1 block mb-1">First Name *</label>
              <Input 
                placeholder="John"
                variant="faded" color="secondary"
                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                startContent={<User size={18} className="text-default-400 ml-1" />}
                isRequired
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground ml-1 block mb-1">Last Name *</label>
              <Input 
                placeholder="Doe"
                variant="faded" color="secondary"
                value={lastName} onChange={(e) => setLastName(e.target.value)}
                isRequired
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-foreground ml-1 block mb-1">Email Address *</label>
            <Input 
              placeholder="john@example.com"
              type="email" variant="faded" color="secondary"
              value={email} onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail size={18} className="text-default-400 ml-1" />}
              isRequired
            />
          </div>

          <div>
            <label className="text-sm font-bold text-foreground ml-1 block mb-1">New Password *</label>
            <Input 
              placeholder="••••••••"
              type={isVisible ? "text" : "password"} variant="faded" color="secondary"
              value={password} onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock size={18} className="text-default-400 ml-1" />}
              endContent={
                <button className="focus:outline-none pr-1" type="button" onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? <EyeOff size={18} className="text-default-400" /> : <Eye size={18} className="text-default-400" />}
                </button>
              }
              isRequired
            />
          </div>

          <div>
            <label className="text-sm font-bold text-foreground ml-1 block mb-1">Confirm Password *</label>
            <Input 
              placeholder="••••••••"
              type={isConfirmVisible ? "text" : "password"} variant="faded" color="secondary"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              startContent={<Lock size={18} className="text-default-400 ml-1" />}
              endContent={
                <button className="focus:outline-none pr-1" type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)}>
                  {isConfirmVisible ? <EyeOff size={18} className="text-default-400" /> : <Eye size={18} className="text-default-400" />}
                </button>
              }
              isRequired
            />
          </div>

          <Button 
            type="submit" 
            color="secondary" 
            size="lg" 
            fullWidth 
            className="font-bold shadow-lg shadow-secondary/30 mt-4"
            isLoading={isLoading}
            endContent={!isLoading && <UserPlus size={18} />}
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-bold transition-colors">
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}