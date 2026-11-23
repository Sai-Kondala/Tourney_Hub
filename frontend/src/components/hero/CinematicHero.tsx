"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Swords,
  ChevronRight,
  Flame,
  Sparkles,
  Zap,
  Eye,
  RefreshCw,
} from "lucide-react";

// Dynamically import Three.js scene with SSR disabled
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function CinematicHero() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Initializing 3D arena...");
  const [isReady, setIsReady] = useState(false);
  const [hasWebGLSupport, setHasWebGLSupport] = useState(true);
  const [, setWebGLError] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [renderMode, setRenderMode] = useState<"3d" | "fallback">("3d");

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLoadingProgress = useCallback((progress: number, statusText: string) => {
    setLoadProgress(progress);
    setLoadingStatus(statusText);
  }, []);

  const handleFirstModelLoaded = useCallback(() => {
    setIsReady(true);
  }, []);

  const handleSceneError = useCallback((errMsg: string) => {
    setHasWebGLSupport(false);
    setWebGLError(errMsg);
    setRenderMode("fallback");
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col lg:flex-row lg:items-center justify-start lg:justify-center pt-16 sm:pt-20 lg:pt-24 pb-16 overflow-hidden bg-[#080B11]"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#D6A83F]/10 via-[#9B87D5]/5 to-transparent rounded-full blur-[140px]" />
        {/* Subtle ground seam gradient that doesn't block the 3D model */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080B11] to-transparent pointer-events-none z-0 opacity-40" />
      </div>

      {/* 3D Scene / Fallback Canvas layer - Dedicated top stage on mobile, full-bleed on desktop */}
      <div className="w-full h-[50vh] min-h-[380px] max-h-[500px] lg:max-h-none lg:h-full relative lg:absolute lg:inset-0 z-0 overflow-hidden flex-shrink-0">
        {renderMode === "3d" && hasWebGLSupport ? (
          <HeroScene
            onLoadingProgress={handleLoadingProgress}
            onFirstModelLoaded={handleFirstModelLoaded}
            onError={handleSceneError}
            isMobile={isMobileDevice}
          />
        ) : (
          /* Cinematic Static Poster Fallback */
          <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-b from-[#0D121C] to-[#080B11]">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D6A83F_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative z-10 text-center max-w-lg px-6 py-10 rounded-2xl bg-[#0D121C]/80 border border-white/10 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#D6A83F]/10 border border-[#D6A83F]/30 mx-auto flex items-center justify-center mb-4">
                <Trophy className="w-7 h-7 text-[#D6A83F]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Cinematic Squad Arena
              </h3>
              <p className="text-xs text-[#929BAA] leading-relaxed mb-4">
                High-performance static squad presentation active. WebGL is paused or running in
                lightweight presentation mode.
              </p>
              <button
                onClick={() => {
                  setRenderMode("3d");
                  setHasWebGLSupport(true);
                  setWebGLError(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] border border-[#D6A83F]/40 text-xs font-semibold text-[#F5D47A] hover:bg-[#D6A83F]/10 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry 3D WebGL Arena
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Progress Bar (floats until first model is ready) */}
      {!isReady && renderMode === "3d" && (
        <div className="absolute top-20 sm:top-28 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-sm rounded-2xl bg-[#0D121C]/90 border border-white/10 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D6A83F] animate-spin" />
              <span>{loadingStatus}</span>
            </span>
            <span className="text-[#D6A83F] font-bold">{loadProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#D6A83F] to-[#F5D47A] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(loadProgress, 12)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">
            Progressive asset streaming • Vanguard ready first
          </p>
        </div>
      )}

      {/* Foreground Hero Content Overlay - On mobile sits below the 3D model, on desktop 3 columns */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2 lg:mt-0 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Hero Copy - Compact Frosted Glass HUD Card (Below model on mobile, Left on desktop) */}
          <div className="lg:col-span-4 xl:col-span-4 pointer-events-auto max-w-md mx-auto lg:max-w-sm lg:mx-0 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-[#080B11]/90 backdrop-blur-2xl border border-white/15 p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5"
            >
              {/* Subtle gold top hairline accent */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#D6A83F]/75 to-transparent" />

              {/* Live Tournament Status Indicator */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111827]/90 border border-[#D6A83F]/40 shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold tracking-widest text-[#F5D47A] uppercase">
                  Season 1 Qualifiers
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[11px] text-gray-200 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#D6A83F]" />
                  Live Registration
                </span>
              </div>

              {/* Headline - High Contrast with text-shadow */}
              <div className="space-y-2.5">
                <h1 className="font-heading font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl uppercase leading-[1.05] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  ENTER THE <br />
                  <span className="gold-gradient-text drop-shadow-[0_2px_14px_rgba(214,168,63,0.4)]">
                    ARENA.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  Compete with your squad. Rise through the ranks. Claim your victory. The premier
                  community tournament circuit with verified leaderboards and direct payouts.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link
                  href="#tournaments"
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-black transition-all shadow-[0_0_30px_rgba(214,168,63,0.4)] hover:shadow-[0_0_40px_rgba(214,168,63,0.6)] focus:outline-none"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#F5D47A] via-[#D6A83F] to-[#B88728] transition-transform group-hover:scale-105" />
                  <span className="relative flex items-center gap-2 z-10">
                    <Swords className="w-4 h-4 text-black" />
                    <span>Explore Tournaments</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#111827]/90 border border-white/15 hover:border-[#D6A83F]/50 hover:bg-[#162032] transition-all backdrop-blur-sm"
                >
                  <span>How It Works</span>
                </Link>

                {/* Mode switch for user control */}
                <button
                  onClick={() => setRenderMode(renderMode === "3d" ? "fallback" : "3d")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-black/50 border border-white/10 hover:border-white/25 transition"
                  title="Toggle 3D WebGL vs lightweight mode"
                >
                  <Eye className="w-3.5 h-3.5 text-[#9B87D5]" />
                  <span>{renderMode === "3d" ? "Low-Power" : "3D Arena"}</span>
                </button>
              </div>

              {/* Trust highlights - Dark Pill Capsules */}
              <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/10">
                <div className="flex flex-col bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-center">
                  <span className="font-heading font-bold text-[#F5D47A] text-sm drop-shadow-sm">₹50,000</span>
                  <span className="text-[9px] text-slate-300 font-medium">Prize Pool</span>
                </div>
                <div className="flex flex-col bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-center">
                  <span className="font-heading font-bold text-white text-sm drop-shadow-sm">100% Free</span>
                  <span className="text-[9px] text-slate-300 font-medium">Open Tier</span>
                </div>
                <div className="flex flex-col bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-center">
                  <span className="font-heading font-bold text-emerald-400 text-sm drop-shadow-sm">Instant</span>
                  <span className="text-[9px] text-slate-300 font-medium">UID Verify</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Center Column - Wide Unobstructed 3D Stage Corridor */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-5 h-[520px] pointer-events-none" />

          {/* Featured Tournament Spotlight Badge - Right Column on Desktop */}
          <div className="hidden lg:flex lg:col-span-3 xl:col-span-3 justify-end pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-[270px] p-4 rounded-3xl bg-[#080B11]/90 border border-[#D6A83F]/35 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-[#D6A83F]/20 text-[#F5D47A] border border-[#D6A83F]/40 text-[10px] font-bold uppercase tracking-wider">
                  Spotlight Match
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Filling Fast
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  Bermuda Blitz Masters S1
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Battle Royale • Squad (4v4) • 42/48 Slots
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                  <span>Registration Capacity</span>
                  <span className="font-bold text-white">88%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-[#D6A83F] to-emerald-400 w-[88%] rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Prize Pool</p>
                  <p className="font-heading font-bold text-[#F5D47A] text-sm">₹25,000</p>
                </div>
                <Link
                  href="#tournaments"
                  className="px-3.5 py-1.5 rounded-lg bg-[#D6A83F] hover:bg-[#F5D47A] text-black font-bold text-xs transition shadow-md"
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
