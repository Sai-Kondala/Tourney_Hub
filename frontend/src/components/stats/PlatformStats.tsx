import { MOCK_PLATFORM_STATS } from "@/data/mockTournaments";
import { Info } from "lucide-react";

export default function PlatformStats() {
  return (
    <section id="stats" className="relative py-20 bg-[#0D121C] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-3xl uppercase tracking-tight text-white">
              Platform <span className="gold-gradient-text">Metrics</span>
            </h2>
            <p className="text-xs text-[#929BAA] mt-1">
              Operational benchmark data and competitive ecosystem telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM OPERATIONAL</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] border border-white/10 text-xs text-[#929BAA]">
              <Info className="w-3.5 h-3.5 text-[#D6A83F]" />
              <span>PREVIEW STATS</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PLATFORM_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#111827] border border-white/[0.08] space-y-2 hover:border-[#D6A83F]/30 transition-all shadow-lg"
            >
              <span className="text-[11px] text-[#929BAA] font-semibold uppercase tracking-wider block">
                {stat.label}
              </span>
              <p className="font-heading font-black text-2xl sm:text-3xl text-white">
                {stat.value}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">{stat.change}</span>
              </div>
              <p className="text-[11px] text-[#929BAA] leading-relaxed pt-1">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
