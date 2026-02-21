"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full border-b border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Pathfinder+ logo"
                        width={36}
                        height={36}
                    />
                    <span className="text-xl font-semibold text-slate-900">
                        Pathfinder+
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
                    <a href="#home" onClick={() => setOpen(false)}>Home</a>
                    <a href="#features" onClick={() => setOpen(false)}>Features</a>
                    <a href="#about" onClick={() => setOpen(false)}>About</a>

                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button className="px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                        Join Waitlist
                    </button>
                    <button className="px-4 text-sm text-black">
                        Contact Us
                    </button>
                </div>

                {/* Mobile Burger */}
                <button
                    className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-slate-100"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="h-6 w-6 text-slate-900"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-6 py-4 flex flex-col gap-4 text-sm text-slate-700">
                        <a href="#home" onClick={() => setOpen(false)} className="hover:text-slate-900">Home</a>
                        <a href="#features" onClick={() => setOpen(false)} className="hover:text-slate-900">Features</a>
                        <a href="#about" onClick={() => setOpen(false)} className="hover:text-slate-900">About</a>

                        <button className="mt-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white">
                            Join Waitlist
                        </button>
                        <button className="text-sm text-left text-black">
                            Contact Us
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
