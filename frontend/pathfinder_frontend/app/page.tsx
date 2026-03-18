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
      text: "As someone switching from marketing, the personalised pathway made my learning plan clear. I landed an data analyst role in months.",
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
    <div className="min-h-screen bg-transparent text-foreground selection:bg-purple-100">
      <Navbar maxWidth="xl" isBordered className="bg-content1/80 backdrop-blur-xl z-50 w-full" onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand as={Link} href="/" className="gap-2 group cursor-pointer max-w-[200px]">
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
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-10" justify="center">
          <NavbarItem isActive>
            <Link
              href="/"
              className="text-sm font-bold text-indigo-600 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-indigo-600 after:rounded-full"
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/skill-assessment"
              className="text-sm font-semibold text-default-400 text-default-500 hover:text-indigo-600 transition-colors"
            >
              Assessment
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/resumes"
              className="text-sm font-semibold text-default-400 text-default-500 hover:text-indigo-600 transition-colors"
            >
              Resumes
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/mentors"
              className="text-sm font-semibold text-default-400 text-default-500 hover:text-indigo-600 transition-colors"
            >
              Mentors
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <Button
              variant="flat"
              color="secondary"
              radius="full"
              className="font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-6 shadow-sm"
              as={Link}
              href="/mentor-dashboard"
            >
              Mentor Sign In
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {navLinks.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link
                className="w-full text-foreground hover:text-indigo-500 font-medium py-2 block"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Button
              variant="flat"
              color="secondary"
              radius="full"
              className="font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm w-full mt-4"
              as={Link}
              href="/mentor-dashboard"
              onClick={() => setIsMenuOpen(false)}
            >
              Mentor Sign In
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <div className="mx-auto max-w-7xl px-6">
        {/* Testimonials - Carousel */}
        <section className="py-32 border-t border-divider relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-purple-200 to-transparent" />
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-black text-foreground tracking-tight">
              Success Stories
            </h2>
            <p className="text-default-400 text-default-500 mt-4 text-lg">
              Join 1,000+ professionals across Sri Lanka
            </p>
          </div>
          <TestimonialCarousel items={testimonials} />
        </section>
      </div>
    </div>
  );
}
