"use client";

import { Tournament } from "@/types/tournament";
import {
  X,
  Trophy,
  CheckCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface TournamentModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onRegisterClick: (tournament: Tournament) => void;
}

export default function TournamentModal({
  tournament,
  onClose,
  onRegisterClick,
}: TournamentModalProps) {
  if (!tournament) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#0D121C] border border-[#D6A83F]/30 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#929BAA] hover:text-white transition"
          aria-label="Close tournament modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-[#D6A83F]/20 text-[#F5D47A] text-[11px] font-bold uppercase tracking-wider border border-[#D6A83F]/30">
              {tournament.tier} Tier
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#111827] text-white text-[11px] font-medium border border-white/10">
              {tournament.map} • {tournament.mode}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#9B87D5]/20 text-[#B9A8EA] text-[11px] font-medium border border-[#9B87D5]/30">
              {tournament.category}
            </span>
          </div>

          <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
            {tournament.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#929BAA] leading-relaxed">
            {tournament.subtitle}
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#080B11] border border-white/5">
          <div>
            <span className="text-[10px] text-[#929BAA] uppercase tracking-wider block">
              Prize Pool
            </span>
            <span className="font-heading font-black text-lg text-[#F5D47A]">
              ₹{tournament.prizePool.toLocaleString("en-IN")}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#929BAA] uppercase tracking-wider block">
              Entry Fee
            </span>
            <span className="font-heading font-black text-lg text-white">
              {tournament.entryFee === 0 ? "FREE" : `₹${tournament.entryFee}`}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#929BAA] uppercase tracking-wider block">
              Slots Filled
            </span>
            <span className="font-heading font-bold text-base text-white">
              {tournament.registeredParticipants} / {tournament.maxParticipants}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#929BAA] uppercase tracking-wider block">
              Start Time
            </span>
            <span className="font-heading font-bold text-base text-[#9B87D5]">
              {tournament.startTime}
            </span>
          </div>
        </div>

        {/* Prize Distribution Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#D6A83F]" />
            Prize Distribution
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tournament.prizeBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#111827] border border-white/5 text-xs"
              >
                <span className="text-[#929BAA] font-medium">{item.rank}</span>
                <span className="text-[#F5D47A] font-bold font-heading">
                  {item.prize}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules & Requirements */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#9B87D5]" />
            Tournament Rules & Verification
          </h4>
          <ul className="space-y-2 text-xs text-[#929BAA]">
            {tournament.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D6A83F] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Anti-cheat disclaimer */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            All players must be registered with their authentic in-game UID. Emulator usage is
            restricted based on tournament configuration. Post-match verification screenshots
            required for prize disbursements.
          </p>
        </div>

        {/* CTA Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs text-[#929BAA]">
            <span>Deadline: </span>
            <strong className="text-white">{tournament.registrationDeadline}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-medium text-white transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRegisterClick(tournament);
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F5D47A] to-[#D6A83F] text-black font-bold text-xs shadow-lg hover:shadow-[0_0_20px_rgba(214,168,63,0.4)] transition"
            >
              Proceed to Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
