"use client";

import { useState, useMemo } from "react";
import { Tournament } from "@/types/tournament";
import { MOCK_TOURNAMENTS } from "@/data/mockTournaments";
import TournamentCard from "./TournamentCard";
import TournamentModal from "./TournamentModal";
import { Trophy, Filter, Sparkles, Check, Info } from "lucide-react";

export default function FeaturedTournaments() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [feeFilter, setFeeFilter] = useState<string>("All");
  const [formatFilter, setFormatFilter] = useState<string>("All");
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState<string | null>(null);

  const filteredTournaments = useMemo(() => {
    return MOCK_TOURNAMENTS.filter((tourney) => {
      // Status filter
      if (statusFilter !== "All" && tourney.status !== statusFilter) {
        return false;
      }
      // Fee filter
      if (feeFilter === "Free" && tourney.entryFee !== 0) {
        return false;
      }
      if (feeFilter === "Paid" && tourney.entryFee === 0) {
        return false;
      }
      // Format filter
      if (formatFilter !== "All" && tourney.category !== formatFilter) {
        return false;
      }
      return true;
    });
  }, [statusFilter, feeFilter, formatFilter]);

  const handleRegisterClick = (tourney: Tournament) => {
    setRegisteredSuccessMsg(
      `Registration preview for "${tourney.title}" selected! Full registration flow with database checks and verified checkout unlocks in Phase 2.`
    );
    setTimeout(() => {
      setRegisteredSuccessMsg(null);
    }, 6000);
  };

  return (
    <section id="tournaments" className="relative py-20 bg-[#080B11] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6A83F]/10 border border-[#D6A83F]/30 text-[11px] font-bold text-[#F5D47A] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D6A83F]" />
              <span>Competitive Circuit</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
              Featured <span className="gold-gradient-text">Tournaments</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#929BAA] max-w-xl">
              Discover official community tournaments across Bermuda, Purgatory, Kalahari, and
              Alpine. Filter by category, entry tier, and format.
            </p>
          </div>

          {/* Phase 1 Mock Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] border border-white/10 text-xs text-[#929BAA] self-start md:self-auto">
            <Info className="w-3.5 h-3.5 text-[#D6A83F]" />
            <span className="font-medium">MOCK DATA • PHASE 1 PREVIEW</span>
          </div>
        </div>

        {/* Registration Flash Message */}
        {registeredSuccessMsg && (
          <div className="p-4 rounded-xl bg-[#D6A83F]/15 border border-[#D6A83F]/40 text-xs text-[#F5D47A] flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{registeredSuccessMsg}</span>
            </div>
            <button
              onClick={() => setRegisteredSuccessMsg(null)}
              className="text-white hover:text-gray-300 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D121C] border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#D6A83F]" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Pills */}
            <div className="flex items-center bg-[#111827] rounded-xl p-1 border border-white/5">
              {["All", "Upcoming", "Live", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === status
                      ? "bg-[#D6A83F] text-black shadow-md"
                      : "text-[#929BAA] hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Fee Filter */}
            <div className="flex items-center bg-[#111827] rounded-xl p-1 border border-white/5">
              {["All", "Free", "Paid"].map((fee) => (
                <button
                  key={fee}
                  onClick={() => setFeeFilter(fee)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    feeFilter === fee
                      ? "bg-[#9B87D5] text-black shadow-md"
                      : "text-[#929BAA] hover:text-white"
                  }`}
                >
                  {fee === "All" ? "All Fees" : fee}
                </button>
              ))}
            </div>

            {/* Format Filter */}
            <div className="flex items-center bg-[#111827] rounded-xl p-1 border border-white/5">
              {["All", "Squad", "Solo"].map((format) => (
                <button
                  key={format}
                  onClick={() => setFormatFilter(format)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    formatFilter === format
                      ? "bg-white text-black shadow-md"
                      : "text-[#929BAA] hover:text-white"
                  }`}
                >
                  {format === "All" ? "All Formats" : format}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tournament Cards Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-[#0D121C] border border-white/5">
            <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-white text-base">
              No Tournaments Found
            </h4>
            <p className="text-xs text-[#929BAA] mt-1">
              Try adjusting your filter selection to view upcoming matches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onSelect={(tourney) => setSelectedTournament(tourney)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details & Rules Modal */}
      <TournamentModal
        tournament={selectedTournament}
        onClose={() => setSelectedTournament(null)}
        onRegisterClick={handleRegisterClick}
      />
    </section>
  );
}
