import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary-foreground">
      {/* Subtle light background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/20 to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(70rem_35rem_at_50%_-10%,rgba(255,138,76,0.12),transparent)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      </div>

      <Header />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
}
