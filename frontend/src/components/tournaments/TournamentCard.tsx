"use client";

import { Tournament } from "@/types/tournament";
import {
  Trophy,
  Users,
  MapPin,
  Clock,
  Coins,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
}

export default function TournamentCard({
  tournament,
  onSelect,
}: TournamentCardProps) {
  const percentFilled = Math.round(
    (tournament.registeredParticipants / tournament.maxParticipants) * 100
  );
  const slotsRemaining =
    tournament.maxParticipants - tournament.registeredParticipants;

  const isFree = tournament.entryFee === 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#0D121C] border border-white/[0.08] hover:border-[#D6A83F]/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(214,168,63,0.15)] hover:-translate-y-1">
      {/* Top ambient hover accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D6A83F]/0 to-transparent group-hover:via-[#D6A83F] transition-all duration-500" />

      {/* Header Banner */}
      <div className="p-5 pb-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* Map & Mode Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#111827] border border-white/10 text-[11px] font-semibold text-white">
              <MapPin className="w-3 h-3 text-[#D6A83F]" />
              {tournament.map}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#9B87D5]/15 border border-[#9B87D5]/30 text-[11px] font-semibold text-[#B9A8EA]">
              <Users className="w-3 h-3" />
              {tournament.category} • {tournament.mode}
            </span>
          </div>

          {/* Status Badge */}
          {tournament.status === "Live" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Live Now
            </span>
          ) : tournament.status === "Completed" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
              Registering
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-[#F5D47A] transition-colors line-clamp-1">
            {tournament.title}
          </h3>
          <p className="text-xs text-[#929BAA] mt-1 line-clamp-2 leading-relaxed">
            {tournament.subtitle}
          </p>
        </div>
      </div>

      {/* Middle Specs Grid */}
      <div className="px-5 py-3 border-y border-white/[0.06] bg-[#0A0E17]/60 grid grid-cols-2 gap-3">
        {/* Prize Pool */}
        <div>
          <span className="text-[10px] text-[#929BAA] uppercase tracking-wider font-medium flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#D6A83F]" />
            Prize Pool
          </span>
          <p className="font-heading font-black text-base text-[#F5D47A] mt-0.5">
            ₹{tournament.prizePool.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Entry Fee */}
        <div>
          <span className="text-[10px] text-[#929BAA] uppercase tracking-wider font-medium flex items-center gap-1">
            <Coins className="w-3 h-3 text-[#9B87D5]" />
            Entry Fee
          </span>
          <p className="font-heading font-bold text-base mt-0.5">
            {isFree ? (
              <span className="text-emerald-400 font-extrabold uppercase text-sm">
                FREE (₹0)
              </span>
            ) : (
              <span className="text-white">₹{tournament.entryFee}</span>
            )}
          </p>
        </div>
      </div>

      {/* Bottom Slots Progress & Action */}
      <div className="p-5 pt-3 space-y-3">
        {/* Slots Capacity Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#929BAA]">
              Capacity:{" "}
              <strong className="text-white">
                {tournament.registeredParticipants}/{tournament.maxParticipants}
              </strong>
            </span>
            <span
              className={`font-semibold ${
                slotsRemaining <= 6 ? "text-amber-400" : "text-[#929BAA]"
              }`}
            >
              {slotsRemaining === 0 ? "Full" : `${slotsRemaining} slots left`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentFilled >= 100
                  ? "bg-red-500"
                  : percentFilled > 80
                  ? "bg-gradient-to-r from-[#D6A83F] to-amber-500"
                  : "bg-gradient-to-r from-[#9B87D5] to-[#D6A83F]"
              }`}
              style={{ width: `${Math.min(percentFilled, 100)}%` }}
            />
          </div>
        </div>

        {/* Schedule & CTA Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="text-[11px] text-[#929BAA] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#929BAA]" />
            <span>{tournament.startTime}</span>
          </div>

          <button
            onClick={() => onSelect(tournament)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-[#D6A83F] text-white hover:text-black font-bold text-xs border border-white/10 hover:border-[#D6A83F] transition-all duration-200"
          >
            <span>Details & Rules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
