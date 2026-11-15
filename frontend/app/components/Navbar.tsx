
 // Path: frontend/app/components/Navbar.tsx

"use client";

import Link from "next/link";
import { Fingerprint, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1016d8]/75 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-14">

        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-cyan-200/30 bg-gradient-to-br from-cyan-300/25 to-white/5 text-cyan-100 shadow-[0_0_25px_rgba(0,217,255,.12)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(0,217,255,.3)]">
            <Fingerprint size={25} strokeWidth={1.6} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
          </div>

          <div>
            <span className="text-[22px] font-black tracking-[-1.2px]">
              dephantom<span className="text-[#ff82bd]">.</span>
            </span>
            <p className="mt-[-2px] text-[8px] font-bold tracking-[2.5px] text-cyan-100/45">
              QUESTION THE ANSWER
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-9 md:flex">
          <Link
            href="/"
            className="text-xs font-bold text-blue-100/60 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/verify"
            className="text-xs font-bold text-cyan-200 transition hover:text-white"
          >
            Investigate
          </Link>

          <a
            href="/#about"
            className="text-xs font-bold text-blue-100/60 transition hover:text-white"
          >
            About
          </a>
        </div>

        {/* Desktop CTA */}
        <Link
          href="/verify"
          className="hidden items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-5 py-3 text-xs font-black text-cyan-100 shadow-[0_0_25px_rgba(0,217,255,.08)] transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/20 md:flex"
        >
          Start investigating
          <ArrowUpRight size={15} />
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0b119f]/95 px-6 py-5 backdrop-blur-2xl md:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-blue-100/75 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/verify"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-cyan-200"
            >
              Investigate
            </Link>

            <a
              href="/#about"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-blue-100/75 hover:text-white"
            >
              About
            </a>

            <Link
              href="/verify"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-[#8aeaff] px-5 py-3 text-xs font-black text-[#1016a8]"
            >
              Start investigating <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
