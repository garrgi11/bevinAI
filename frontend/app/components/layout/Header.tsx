"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const go = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      if (pathname !== "/") {
        // Navigate home then scroll
        window.history.pushState({}, "", "/#" + id);
        requestAnimationFrame(() => scrollToId(id));
      } else {
        scrollToId(id);
      }
    },
    [pathname],
  );

  return (
    <header
      className={`sticky top-4 z-40 mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
        scrolled
          ? "border-orange-200/30 bg-white/30 backdrop-blur-xl shadow-lg"
          : "border-orange-200 bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-orange-400 via-orange-500 to-amber-400 shadow-glow" />
          <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            Bevin.AI
          </span>
        </Link>

        {/* Show full navigation only on home page */}
        {isHomePage ? (
          <nav className="flex items-center gap-1 sm:gap-6">
            <button onClick={go("features")} className="nav-link hidden sm:inline-flex">
              Features
            </button>
            <button onClick={go("steps")} className="nav-link hidden sm:inline-flex">
              How it works
            </button>
            <Link href="/prmmode" className="nav-link hidden sm:inline-flex">
              PRM Mode
            </Link>
            <a href="https://builder.io/c/docs/projects" target="_blank" rel="noreferrer" className="nav-link">
              Docs
            </a>
            <Link
              href="/prmmode"
              className="ml-2 inline-flex items-center rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-500/10 transition hover:from-orange-400 hover:to-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Get started
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-neutral-600 transition hover:text-orange-500">
              ← Back to Home
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
