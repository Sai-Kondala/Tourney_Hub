"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Menu,
  X,
  ShieldCheck,
  Flame,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMockLoggedIn, setIsMockLoggedIn] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Tournaments", href: "#tournaments" },
    { name: "Leaderboard", href: "#leaderboard" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Platform Stats", href: "#stats" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#080B11]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="#hero"
              className="group flex items-center gap-3 transition-transform focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#D6A83F]/40 shadow-[0_0_15px_rgba(214,168,63,0.2)] group-hover:border-[#D6A83F] transition-all">
                <Trophy className="w-5 h-5 text-[#D6A83F] group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6A83F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D6A83F]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black tracking-wider text-xl text-white group-hover:text-[#D6A83F] transition-colors">
                    TOURNEY<span className="text-[#D6A83F]">HUB</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest px-1.5 py-0.5 rounded bg-[#9B87D5]/20 text-[#B9A8EA] border border-[#9B87D5]/30 uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#929BAA] font-medium">
                  Esports Arena
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#0D121C]/80 border border-white/[0.08] rounded-full px-4 py-1.5 backdrop-blur-sm shadow-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 text-xs lg:text-sm font-medium text-[#929BAA] hover:text-white hover:bg-white/[0.05] rounded-full transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Menu */}
            <div className="hidden md:flex items-center gap-3">
              {/* Internal 3D model test link */}
              <Link
                href="/modeltest"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs text-[#929BAA] hover:text-[#D6A83F] px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-[#D6A83F]/30 transition"
                title="Internal 3D asset inspection page"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D6A83F]" />
                <span>3D Test</span>
              </Link>

              {isMockLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#111827] border border-[#D6A83F]/40 hover:border-[#D6A83F] text-xs font-semibold text-white transition-all shadow-[0_0_10px_rgba(214,168,63,0.15)]"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D6A83F] to-[#9B87D5] flex items-center justify-center text-[11px] font-bold text-black">
                      PV
                    </div>
                    <span>Phoenix_Lead</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#929BAA]" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0D121C] border border-white/10 shadow-2xl p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-xs font-bold text-white">Phoenix Vanguard</p>
                          <p className="text-[10px] text-[#929BAA]">UID: 8943120042</p>
                        </div>
                        <Link
                          href="#tournaments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-[#929BAA] hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                          <Flame className="w-3.5 h-3.5 text-[#D6A83F]" />
                          My Registrations
                        </Link>
                        <button
                          onClick={() => {
                            setIsMockLoggedIn(false);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition mt-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Simulate Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal();
                      else setIsMockLoggedIn(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#929BAA] hover:text-white transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal();
                      else setIsMockLoggedIn(true);
                    }}
                    className="relative group overflow-hidden px-4 py-2 rounded-xl text-xs font-bold text-black transition-all shadow-[0_0_20px_rgba(214,168,63,0.3)] hover:shadow-[0_0_25px_rgba(214,168,63,0.5)]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F5D47A] via-[#D6A83F] to-[#B88728] transition-all group-hover:scale-105" />
                    <span className="relative flex items-center gap-1.5 z-10">
                      <ShieldCheck className="w-3.5 h-3.5 text-black" />
                      Sign Up
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#0D121C] border border-white/10 text-white hover:border-[#D6A83F] transition-colors"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#D6A83F]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-[#080B11] border-l border-white/10 p-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#D6A83F]" />
                    <span className="font-heading font-black text-lg text-white">
                      TOURNEY<span className="text-[#D6A83F]">HUB</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-[#929BAA] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#D6A83F] px-2 mb-2">
                    Navigation
                  </p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#F5F5F5] hover:bg-[#111827] hover:text-[#D6A83F] transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/modeltest"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#B9A8EA] hover:bg-[#111827] transition-colors"
                  >
                    3D Model Test Suite
                  </Link>
                </div>
              </div>

              {/* Mobile Drawer Auth */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                {isMockLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D121C] border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D6A83F] to-[#9B87D5] flex items-center justify-center font-bold text-xs text-black">
                        PV
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Phoenix Vanguard</p>
                        <p className="text-[10px] text-[#929BAA]">UID: 8943120042</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMockLoggedIn(false);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsMockLoggedIn(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F5D47A] to-[#D6A83F] text-black font-bold text-xs shadow-lg"
                    >
                      Sign Up & Compete
                    </button>
                    <button
                      onClick={() => {
                        setIsMockLoggedIn(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#111827] border border-white/10 text-white font-medium text-xs hover:border-white/20"
                    >
                      Log In to Squad
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-center text-[#929BAA]">
                  Independent Esports Arena · Phase 1
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
