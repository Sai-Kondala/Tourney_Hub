"use client";

import { useState } from "react";
import {
  MOCK_LEADERBOARD,
  MOCK_SOLO_LEADERBOARD,
} from "@/data/mockTournaments";
import { Trophy, Info, Users, User, Shield } from "lucide-react";

export default function LeaderboardPreview() {
  const [activeTab, setActiveTab] = useState<"Squad" | "Solo">("Squad");

  const entries = activeTab === "Squad" ? MOCK_LEADERBOARD : MOCK_SOLO_LEADERBOARD;

  const podiumOrder = [entries[1], entries[0], entries[2]]; // 2nd, 1st, 3rd for podium visualization
  const remainingEntries = entries.slice(3);

  return (
    <section id="leaderboard" className="relative py-24 bg-[#080B11] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6A83F]/10 border border-[#D6A83F]/30 text-[11px] font-bold text-[#F5D47A] uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5 text-[#D6A83F]" />
              <span>Standings Circuit</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
              Community <span className="gold-gradient-text">Leaderboard</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#929BAA] max-w-xl">
              Live circuit rankings based on match points, survival finishes, and tournament wins.
            </p>
          </div>

          {/* Tab Switcher & Sample Data indicator */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="flex items-center bg-[#0D121C] border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("Squad")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "Squad"
                    ? "bg-[#D6A83F] text-black shadow-lg"
                    : "text-[#929BAA] hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Squads</span>
              </button>
              <button
                onClick={() => setActiveTab("Solo")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "Solo"
                    ? "bg-[#D6A83F] text-black shadow-lg"
                    : "text-[#929BAA] hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Solo Contenders</span>
              </button>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] border border-white/10 text-xs text-[#929BAA]">
              <Info className="w-3.5 h-3.5 text-[#D6A83F]" />
              <span>SAMPLE PREVIEW DATA</span>
            </div>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2nd Place */}
          {podiumOrder[0] && (
            <div className="relative p-6 rounded-2xl bg-[#0D121C] border border-zinc-500/30 shadow-xl space-y-4 md:order-1 order-2">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-zinc-500/20 border border-zinc-400 text-zinc-300 font-heading font-black text-sm flex items-center justify-center">
                  #2
                </span>
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Silver Medalist
                </span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {podiumOrder[0].name}
                </h3>
                <p className="text-xs text-[#929BAA]">Tag: [{podiumOrder[0].tag}]</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Points</span>
                  <span className="font-heading font-bold text-white">
                    {podiumOrder[0].points}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Wins</span>
                  <span className="font-heading font-bold text-emerald-400">
                    {podiumOrder[0].wins}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Win Rate</span>
                  <span className="font-heading font-bold text-[#F5D47A]">
                    {podiumOrder[0].winRate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Center Hero Card) */}
          {podiumOrder[1] && (
            <div className="relative p-7 rounded-2xl bg-[#111827] border-2 border-[#D6A83F] shadow-[0_0_35px_rgba(214,168,63,0.25)] space-y-5 md:order-2 order-1 md:-translate-y-4">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F5D47A] to-[#D6A83F] text-black font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-black" />
                <span>Champion Leader</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="w-10 h-10 rounded-xl bg-[#D6A83F]/20 border border-[#D6A83F] text-[#F5D47A] font-heading font-black text-lg flex items-center justify-center">
                  #1
                </span>
                <span className="text-xs font-bold text-[#F5D47A] uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#D6A83F]" />
                  Undefeated Streak
                </span>
              </div>

              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  {podiumOrder[1].name}
                </h3>
                <p className="text-xs text-[#929BAA]">Tag: [{podiumOrder[1].tag}]</p>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#080B11] border border-[#D6A83F]/20 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Points</span>
                  <span className="font-heading font-black text-base text-[#F5D47A]">
                    {podiumOrder[1].points}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Wins</span>
                  <span className="font-heading font-black text-base text-emerald-400">
                    {podiumOrder[1].wins}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Win Rate</span>
                  <span className="font-heading font-black text-base text-white">
                    {podiumOrder[1].winRate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {podiumOrder[2] && (
            <div className="relative p-6 rounded-2xl bg-[#0D121C] border border-amber-700/40 shadow-xl space-y-4 md:order-3 order-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-700/20 border border-amber-600 text-amber-300 font-heading font-black text-sm flex items-center justify-center">
                  #3
                </span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Bronze Medalist
                </span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {podiumOrder[2].name}
                </h3>
                <p className="text-xs text-[#929BAA]">Tag: [{podiumOrder[2].tag}]</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Points</span>
                  <span className="font-heading font-bold text-white">
                    {podiumOrder[2].points}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Wins</span>
                  <span className="font-heading font-bold text-emerald-400">
                    {podiumOrder[2].wins}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#929BAA] block">Win Rate</span>
                  <span className="font-heading font-bold text-[#F5D47A]">
                    {podiumOrder[2].winRate}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table for Ranks 4+ */}
        {remainingEntries.length > 0 && (
          <div className="overflow-x-auto rounded-2xl bg-[#0D121C] border border-white/[0.08]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-[#929BAA] uppercase font-bold tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4 text-center">Matches</th>
                  <th className="py-3.5 px-4 text-center">Wins</th>
                  <th className="py-3.5 px-4 text-center">Kills</th>
                  <th className="py-3.5 px-4 text-center">Win Rate</th>
                  <th className="py-3.5 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[#F5F5F5]">
                {remainingEntries.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-heading font-bold text-white">
                      #{entry.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{entry.name}</span>
                        <span className="text-[10px] text-[#929BAA] font-mono">[{entry.tag}]</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#929BAA]">{entry.matches}</td>
                    <td className="py-3.5 px-4 text-center text-emerald-400 font-semibold">
                      {entry.wins}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#9B87D5] font-semibold">
                      {entry.kills}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white">{entry.winRate}</td>
                    <td className="py-3.5 px-4 text-right font-heading font-bold text-[#F5D47A]">
                      {entry.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
