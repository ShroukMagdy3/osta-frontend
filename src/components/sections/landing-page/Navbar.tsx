"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/logo.svg";

const navLinks = [
  { label: "الرئيسية", href: "/landing" },
  { label: "الأقسام", href: "/categories" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/landing") return pathname === "/landing" || pathname === "/";
    return pathname === href;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between bg-[#FEFEFE70]/50 rounded-2xl sm:rounded-3xl shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Image
            src={logo}
            alt="أسطى"
            width={90}
            height={36}
            className="object-contain sm:w-[100px] sm:h-[40px]"
          />
        </div>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-bold transition-colors ${
                isActive(link.href)
                  ? "text-[var(--primary-color)] bg-white px-5 py-2 rounded-full shadow-sm"
                  : "text-white hover:text-[var(--accent-color)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Login Button — desktop */}
        <Link
          href="/login"
          className="hidden md:inline-flex bg-[var(--accent-color)] text-[var(--primary-color)] font-black text-sm px-6 py-3 rounded-full hover:bg-[var(--accent-hover)] transition-all whitespace-nowrap shadow-lg"
        >
          تسجيل الدخول
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mx-4 mt-1 rounded-2xl bg-[var(--primary-color)]/95 backdrop-blur-sm px-5 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold transition-colors py-1 ${
                isActive(link.href)
                  ? "text-[var(--accent-color)]"
                  : "text-white hover:text-[var(--accent-color)]"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-1 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-5 py-2.5 rounded-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            تسجيل الدخول
          </Link>
        </div>
      )}
    </header>
  );
}
