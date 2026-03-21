"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, Input, Button } from "@heroui/react";
import { SparklesIcon, LockIcon, MailIcon, ArrowRightIcon, Eye, EyeOff } from "lucide-react";

export default function MentorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // For demo purposes, any non-empty login works
      router.push("/mentor-dashboard");
    }, 1000);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden font-sans">
      {/* Universal Pathfinder Navbar */}
      <div className="bg-content1/80 backdrop-blur-xl border-b border-divider relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Image
              src="/logonb.png"
              alt="PathFinder+ Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              PathFinder+
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm font-semibold text-default-600 hover:text-purple-600 transition-all"
            >
              Home
            </Link>
            <Link
              href="/skill-assessment"
              className="text-sm font-semibold text-default-600 hover:text-purple-600 transition-all"
            >
              Assessment
            </Link>
            <Link
              href="/resumes"
              className="text-sm font-semibold text-default-600 hover:text-purple-600 transition-all"
            >
              Resumes
            </Link>
            <Link
              href="/mentors"
              className="text-sm font-semibold text-purple-600 transition-all"
            >
              Mentors
            </Link>
          </div>
          <div className="w-20 hidden md:block"></div> {/* Spacer */}
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="flex-1 flex items-center justify-center p-6 mt-10 relative z-10 w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 mb-6 relative">
              <div className="absolute inset-0 bg-content1/20 rounded-2xl backdrop-blur-sm"></div>
              <SparklesIcon size={32} className="text-white relative z-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Mentor Portal
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Sign in to manage your student connections.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <Card className="bg-content1/80 backdrop-blur-xl shadow-2xl shadow-purple-900/5 border border-white">
            <CardBody className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Work Email
                  </label>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    startContent={
                      <MailIcon size={18} className="text-gray-400 mr-2" />
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    classNames={{
                      inputWrapper:
                        "bg-gray-50 hover:bg-gray-100 focus-within:! bg-content1 focus-within:!ring-2 focus-within:!ring-purple-500/20 border-transparent transition-all",
                    }}
                    size="lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Password
                  </label>
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••••"
                    startContent={
                      <LockIcon size={18} className="text-gray-400 mr-2" />
                    }
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
                        {isVisible ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                      </button>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    classNames={{
                      inputWrapper:
                        "bg-gray-50 hover:bg-gray-100 focus-within:! bg-content1 focus-within:!ring-2 focus-within:!ring-purple-500/20 border-transparent transition-all",
                    }}
                    size="lg"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-purple-600 focus:ring-purple-500/50 w-4 h-4 border-gray-300"
                    />
                    <span className="text-gray-600 font-medium">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-purple-500/25 h-12 mt-4"
                  isLoading={isLoading}
                  endContent={!isLoading && <ArrowRightIcon size={18} />}
                >
                  Sign In to Dashboard
                </Button>
              </form>
            </CardBody>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Interested in guiding the next generation?{" "}
            <a href="#" className="text-purple-600 font-bold hover:underline">
              Apply to be a Mentor
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
