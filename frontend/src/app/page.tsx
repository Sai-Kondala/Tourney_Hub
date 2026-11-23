import Navbar from "@/components/layout/Navbar";
import CinematicHero from "@/components/hero/CinematicHero";
import FeaturedTournaments from "@/components/tournaments/FeaturedTournaments";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import LeaderboardPreview from "@/components/leaderboard/LeaderboardPreview";
import PlatformStats from "@/components/stats/PlatformStats";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080B11] text-[#F5F5F5] selection:bg-[#D6A83F]/30 selection:text-white">
      {/* Responsive Navigation Header */}
      <Navbar />

      {/* Main Experience */}
      <main className="flex-1 flex flex-col">
        {/* 1. Cinematic 3D Hero Section */}
        <CinematicHero />

        {/* 2. Featured Tournaments */}
        <FeaturedTournaments />

        {/* 3. How It Works */}
        <HowItWorks />

        {/* 4. Leaderboard Standings Preview */}
        <LeaderboardPreview />

        {/* 5. Platform Telemetry & Statistics */}
        <PlatformStats />
      </main>

      {/* Footer & Disclaimer */}
      <Footer />
    </div>
  );
}
