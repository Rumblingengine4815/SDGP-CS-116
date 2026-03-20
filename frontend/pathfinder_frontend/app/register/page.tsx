"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8001/api/auth/register", {
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
        className="w-full max-w-lg p-8 md:p-10 bg-white/70 dark:bg-zinc-900/90 backdrop-blur-xl border border-divider shadow-2xl rounded-[2.5rem] z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-br from-foreground to-default-500 bg-clip-text text-transparent mb-2">
            Create an Account
          </h1>
          <p className="text-default-500 text-sm">Join PathFinder+ and map your future</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="First Name" 
              variant="faded" color="secondary"
              value={firstName} onChange={(e) => setFirstName(e.target.value)}
              startContent={<User size={18} className="text-default-400" />}
              isRequired
            />
            <Input 
              label="Last Name" 
              variant="faded" color="secondary"
              value={lastName} onChange={(e) => setLastName(e.target.value)}
              isRequired
            />
          </div>

          <Input 
            label="Email Address" 
            type="email" variant="faded" color="secondary"
            value={email} onChange={(e) => setEmail(e.target.value)}
            startContent={<Mail size={18} className="text-default-400" />}
            isRequired
          />

          <Input 
            label="New Password" 
            type="password" variant="faded" color="secondary"
            value={password} onChange={(e) => setPassword(e.target.value)}
            startContent={<Lock size={18} className="text-default-400" />}
            isRequired
          />

          <Input 
            label="Confirm Password" 
            type="password" variant="faded" color="secondary"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            startContent={<Lock size={18} className="text-default-400" />}
            isRequired
          />

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

        <div className="mt-8 text-center text-sm text-default-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </main>
  );
}