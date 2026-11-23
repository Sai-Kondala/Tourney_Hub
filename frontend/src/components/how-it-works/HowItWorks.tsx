import { UserPlus, Swords, CreditCard, Award, ArrowRight, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Create An Account",
    description:
      "Register with your email and link your authenticated in-game UID. Set up your squad roster or prepare to compete as a solo contender.",
    icon: UserPlus,
    accent: "from-[#D6A83F]/20 to-[#D6A83F]/5",
    border: "border-[#D6A83F]/30",
    badge: "Fast Setup",
  },
  {
    step: "02",
    title: "Choose A Tournament",
    description:
      "Filter by map, tier, format (Solo vs Squad 4v4), and entry fees. Select from free community scrimmages or high-stakes prize pools.",
    icon: Swords,
    accent: "from-[#9B87D5]/20 to-[#9B87D5]/5",
    border: "border-[#9B87D5]/30",
    badge: "Multiple Tiers",
  },
  {
    step: "03",
    title: "Register & Pay Securely",
    description:
      "Lock in your team roster with atomic capacity checks. Where paid entry is enabled, complete verified server-side payment with instant confirmation.",
    icon: CreditCard,
    accent: "from-[#D6A83F]/20 to-[#D6A83F]/5",
    border: "border-[#D6A83F]/30",
    badge: "Verified Checkout",
  },
  {
    step: "04",
    title: "Compete & Follow Results",
    description:
      "Receive match room credentials 15 minutes before launch. Drop into the arena, submit screenshot verification, and claim verified prize disbursements.",
    icon: Award,
    accent: "from-[#9B87D5]/20 to-[#9B87D5]/5",
    border: "border-[#9B87D5]/30",
    badge: "Direct Payouts",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 bg-[#0D121C] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#D6A83F]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#9B87D5]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9B87D5]/15 border border-[#9B87D5]/30 text-[11px] font-bold text-[#B9A8EA] uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9B87D5]" />
            <span>Tournament Playbook</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            How It <span className="gold-gradient-text">Works</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#929BAA] leading-relaxed">
            Four simple steps from squad registration to tournament victory. Built for fairness,
            speed, and competitive integrity.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#111827] border border-white/[0.08] hover:border-[#D6A83F]/40 transition-all duration-300 shadow-xl hover:-translate-y-1.5"
              >
                {/* Step pill & icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-2xl text-white/30 group-hover:text-[#D6A83F] transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#929BAA]">
                      {item.badge}
                    </span>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} border ${item.border} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#F5D47A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#929BAA] mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Subtle bottom indicator */}
                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#929BAA] group-hover:text-white transition-colors">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6A83F] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
