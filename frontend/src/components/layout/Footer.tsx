import Link from "next/link";
import { Trophy, Shield, Swords, Mail, HeartHandshake, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="relative bg-[#05070B] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D6A83F]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#9B87D5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="#hero" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#D6A83F]/40 shadow-[0_0_15px_rgba(214,168,63,0.2)]">
                <Trophy className="w-5 h-5 text-[#D6A83F]" />
              </div>
              <span className="font-heading font-black tracking-wider text-xl text-white">
                TOURNEY<span className="text-[#D6A83F]">HUB</span>
              </span>
            </Link>

            <p className="text-xs text-[#929BAA] leading-relaxed max-w-sm">
              The premier competitive esports arena for community tournament players and squads.
              Compete in verified solo and squad circuits, follow real-time leaderboards, and claim
              transparent payouts.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827] border border-[#D6A83F]/30 text-[11px] text-[#F5D47A]">
                <Shield className="w-3.5 h-3.5 text-[#D6A83F]" />
                <span>Fair Play Certified • Anti-Cheat Anti-Teaming Code</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#929BAA]">
              <li>
                <Link href="#tournaments" className="hover:text-white transition-colors">
                  Explore Tournaments
                </Link>
              </li>
              <li>
                <Link href="#leaderboard" className="hover:text-white transition-colors">
                  Circuit Leaderboards
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#stats" className="hover:text-white transition-colors">
                  Platform Statistics
                </Link>
              </li>
              <li>
                <Link href="/modeltest" className="text-[#9B87D5] hover:text-[#B9A8EA] transition-colors flex items-center gap-1">
                  <span>3D Character Lab</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Rules & Fair Play */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
              Rules & Trust
            </h4>
            <ul className="space-y-2 text-xs text-[#929BAA]">
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  Esports Rulebook
                </a>
              </li>
              <li>
                <a href="#fair-play" className="hover:text-white transition-colors">
                  Anti-Cheat Code
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#responsible" className="hover:text-white transition-colors">
                  Responsible Competition
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
              Community
            </h4>
            <ul className="space-y-2 text-xs text-[#929BAA]">
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D6A83F] transition-colors flex items-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5 text-[#D6A83F]" />
                  <span>Discord Community</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@tourneyhub.gg"
                  className="hover:text-[#D6A83F] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#9B87D5]" />
                  <span>support@tourneyhub.gg</span>
                </a>
              </li>
              <li>
                <a href="#dispute" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#929BAA]" />
                  <span>Dispute Resolution</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box as explicitly requested in Section 1 and Section 4.G */}
        <div className="mt-8 p-4 rounded-xl bg-[#0D121C] border border-white/5 text-[11px] text-[#929BAA] leading-relaxed">
          <p className="font-semibold text-white/90 mb-1">Independent Community Disclaimer</p>
          <p>
            Tourney Hub is an independent community esports tournament platform. We are not
            affiliated with, sponsored by, or endorsed by Garena, Free Fire, or any game publishers.
            All game titles, trademarks, logos, and character designs are the property of their
            respective owners. Tournaments hosted on Tourney Hub are community competitions operated
            under fair-play guidelines.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#929BAA]">
          <p>© 2026 Tourney Hub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Server Time: IST (UTC+5:30)</span>
            <span>Version: 0.1.0-phase1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
