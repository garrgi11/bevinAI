"use client";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-10">
      <div className="container flex flex-col items-center justify-between gap-6 md:h-16 md:flex-row">
        <p className="text-sm text-neutral-600">© {new Date().getFullYear()} Bevin.AI. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm text-neutral-600">
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-neutral-900">Features</a>
          <a href="#steps" onClick={(e) => { e.preventDefault(); document.getElementById("steps")?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-neutral-900">How it works</a>
        </div>
      </div>
    </footer>
  );
}
