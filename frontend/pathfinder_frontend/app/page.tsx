"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TestimonialCarousel from "./components/TestimonialCarousel";
import { Button } from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";
import { DoodleBackground } from "@/components/DoodleBackground";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Particles } from "@/components/ui/particles";
import { ArrowRight, Brain, Network, TrendingUp, BotMessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/skill-assessment", label: "Assessment" },
    { href: "/resumes", label: "Resumes" },
    { href: "/mentors", label: "Mentors" },
  ];

  const testimonials = [
    {
      name: "Nishan Perera",
      role: "Backend Developer — Colombo",
      text: "PathFinder+ helped me identify the exact short courses I needed to move from a part-time developer role to a full-time position.",
      img: "/team/p1.jpg",
    },
    {
      name: "Kasun Samantha",
      role: "Data Analyst — Kandy",
      text: "As someone switching from marketing, the personalised pathway made my learning plan clear. I landed a data analyst role in months.",
      img: "/team/p2.jpg",
    },
    {
      name: "Amaara Silva",
      role: "Junior Developer — Galle",
      text: "The recommendations matched live job descriptions I was targeting. I moved from intern to junior dev in three months.",
      img: "/team/p3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-pf-purple-50 text-foreground selection:bg-purple-100 dark:bg-zinc-900 border-none">
      <DoodleBackground>
        {/* Dynamic Purple Header */}
        <Navbar maxWidth="xl" isBordered className="bg-content1/90 backdrop-blur-xl z-50 w-full" onMenuOpenChange={setIsMenuOpen}>
          <NavbarContent>
            <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
            <NavbarBrand as={Link} href="/" className="gap-2 group cursor-pointer max-w-[200px] overflow-visible">
              <div className="w-10 h-10 flex items-center justify-center overflow-visible">
                <Image src="/logonb.png" alt="PathFinder+ Logo" width={48} height={48} className="object-contain scale-150 transform origin-center drop-shadow-md" />
              </div>
              <span className="text-xl font-sora font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                PathFinder+
              </span>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden sm:flex gap-10" justify="center">
            <NavbarItem isActive>
              <Link href="/" className="text-sm font-bold text-pf-purple-600 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-pf-purple-600 after:rounded-full">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem><Link href="/skill-assessment" className="text-sm font-semibold text-foreground hover:text-pf-purple-600 transition-colors">Assessment</Link></NavbarItem>
            <NavbarItem><Link href="/resumes" className="text-sm font-semibold text-foreground hover:text-pf-purple-600 transition-colors">Resumes</Link></NavbarItem>
            <NavbarItem><Link href="/mentors" className="text-sm font-semibold text-foreground hover:text-pf-purple-600 transition-colors">Mentors</Link></NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end" className="gap-3">
            <NavbarItem className="hidden sm:flex gap-2">
              <Button variant="light" className="font-bold font-sora text-foreground hover:bg-content2 hover:text-pf-purple-600 px-4 transition-all" as={Link} href="/login">
                Log In
              </Button>
              <Button variant="solid" radius="full" className="font-bold bg-gradient-to-r from-pf-purple-600 to-indigo-600 text-white hover:opacity-90 hover:-translate-y-0.5 transition-all px-6 shadow-md shadow-pf-purple-500/20 font-dm-sans" as={Link} href="/register">
                Sign Up Free
              </Button>
            </NavbarItem>
          </NavbarContent>

          {/* Mobile Menu */}
          <NavbarMenu>
            {navLinks.map((item, index) => (
              <NavbarMenuItem key={`${item.label}-${index}`}>
                <Link className="w-full text-foreground hover:text-pf-purple-500 font-medium py-2 block" href={item.href} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>

        {/* Hero Section */}
        <main className="relative flex flex-col lg:flex-row items-center justify-center pt-32 pb-24 overflow-hidden min-h-[90vh] px-6 max-w-7xl mx-auto gap-12">
          {/* Physics Particles Overlay */}
          <Particles className="absolute inset-0 z-0 opacity-50 dark:opacity-20" quantity={60} ease={80} color="#7C3AED" refresh />

          <div className="z-10 text-left max-w-2xl flex flex-col items-start gap-6 lg:w-1/2">
            <h1 className="text-5xl md:text-7xl font-black font-sora text-foreground tracking-tight leading-tight">
              Plan Your Career With <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">AI-Powered Guidance</span>
            </h1>

            <p className="text-lg md:text-xl text-default-600 max-w-xl font-dm-sans leading-relaxed">
              Discover the right career path, assess your unique skills, and stay ahead of job market trends—all in one intelligent platform tailored for Sri Lanka.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Button size="lg" radius="full" className="font-bold bg-content2 text-foreground hover:bg-content3 shadow-sm border border-divider hover:-translate-y-1 px-8 py-6 transition-all font-sans" as={Link} href="/skill-assessment">
                Assess Skills <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" radius="full" className="font-bold bg-content2 text-foreground hover:bg-content3 shadow-sm border border-divider hover:-translate-y-1 px-8 py-6 transition-all font-sans" as={Link} href="/mentors">
                Find a Mentor
              </Button>
            </div>
          </div>

          <div className="z-10 lg:w-1/2 w-full flex justify-center hidden md:flex items-center">
            <Image src="/illustrations/robot.png" alt="PathFinder NextGen Hero Bot" width={600} height={500} className="object-contain w-full h-auto drop-shadow-2xl opacity-100 dark:opacity-90" priority />
          </div>
        </main>

        {/* Features Grid */}
        <section className="py-24 bg-transparent border-t border-divider relative z-10 w-full px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
              <h2 className="text-3xl font-black font-sora text-foreground">Intelligent Ecosystem</h2>
              <p className="text-default-500 font-dm-sans mt-4 max-w-2xl mx-auto">Providing end-to-end guidance from skill gaps to career placement.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard hover className="p-8 flex flex-col items-start gap-4">
                <div className="p-4 bg-pf-purple-100 rounded-2xl text-pf-purple-600">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-sora text-foreground">Personalized AI Navigator</h3>
                <p className="text-default-600 font-dm-sans leading-relaxed text-sm">Our AI analyzes your skills, education level, and goals to recommend the most lucrative career paths.</p>
              </GlassCard>

              <GlassCard hover className="p-8 flex flex-col items-start gap-4">
                <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-sora text-foreground">Course Matching</h3>
                <p className="text-default-600 font-dm-sans leading-relaxed text-sm">Find diplomas, degrees, and modern certifications that fit your specific budget, time frame, and qualifications.</p>
              </GlassCard>

              <GlassCard hover className="p-8 flex flex-col items-start gap-4 ring-2 ring-amber-100 dark:ring-amber-900/40 border-amber-200">
                <div className="w-full flex justify-between items-start">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600">
                    <Network className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-amber-500 px-2 py-1 rounded">Premium Request</span>
                </div>
                <h3 className="text-xl font-bold font-sora text-foreground mt-2">Mentor Guidance</h3>
                <p className="text-default-600 font-dm-sans leading-relaxed text-sm">Connect directly with industry operators. Gain deep insights into in-demand required skills and interview expectations.</p>
              </GlassCard>

              <GlassCard hover className="p-8 flex flex-col items-start gap-4">
                <div className="p-4 bg-sky-100 dark:bg-sky-900/60 rounded-2xl text-sky-600">
                  <BotMessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-sora text-foreground">AI Help Bot</h3>
                <p className="text-default-600 font-dm-sans leading-relaxed text-sm">Get instant answers regarding academic programs, local university rankings, and exact career transitions 24/7 directly from our localized agent.</p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
          {/* Testimonials - Carousel */}
          <section className="py-24 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-pf-purple-200 to-transparent" />
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-foreground tracking-tight font-sora">
                Success Stories
              </h2>
              <p className="text-default-500 mt-4 text-lg font-dm-sans">
                Join 1,000+ professionals growing their careers in Sri Lanka
              </p>
            </div>
            <TestimonialCarousel items={testimonials} />
          </section>
        </div>

      </DoodleBackground>
    </div>
  );
}
