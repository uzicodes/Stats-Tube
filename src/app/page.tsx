"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput"; 
import Galaxy from "@/components/Galaxy";
import { useChannelData } from "@/hooks/useChannelData";
import { Activity, Shield, TrendingUp, Bug, CheckCircle2 } from "lucide-react";
import { Dashboard } from "@/app/dashboard";
import Footer from "@/app/footer";

export default function Home() {
  const { loading, error, channelData, videosData, fetchChannelData } = useChannelData();
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Bug Report Form States
  const [bugEmail, setBugEmail] = useState("");
  const [bugDetails, setBugDetails] = useState("");
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);

  const handleAnalyze = async (type: 'handle' | 'channelId', value: string) => {
    await fetchChannelData(type, value);
    setShowDashboard(true);
  };

  const handleBackToHome = () => {
    setShowDashboard(false);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDetails.trim()) return;
    setIsSubmittingBug(true);
    setTimeout(() => {
      setIsSubmittingBug(false);
      setBugSuccess(true);
      setBugEmail("");
      setBugDetails("");
      setTimeout(() => setBugSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-zinc-800 relative overflow-hidden flex flex-col">
      {/* Backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <Galaxy className="absolute inset-0" starSpeed={0.5} density={1} hueShift={140} speed={1} glowIntensity={0.3} saturation={0} mouseRepulsion repulsionStrength={2} twinkleIntensity={0.3} rotationSpeed={0.1} transparent />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      {/* Top Navigation */}
      <header className="w-full relative z-20 pt-6 px-4 sm:px-8 flex justify-center">
         <div className="max-w-2xl w-full">
            {/* Logo */}
            <div className="flex justify-center mb-1">
              <img src="/logo2.png" alt="Stats-Tube Logo" className="h-20 w-auto object-contain" />
            </div>
         </div>
      </header>

      <main className="grow relative flex flex-col items-center p-4 sm:p-8 z-10 w-full mt-4">
        
        {/* Loading State */}
        {loading && (
          <div className="w-full max-w-4xl mx-auto mt-12 p-8 text-center text-zinc-400 animate-pulse">
            <div className="inline-block w-8 h-8 border-4 border-zinc-600 border-t-zinc-200 rounded-full animate-spin mb-4"></div>
            <p>Scanning channel and running proprietary analytics...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-left animate-in fade-in">
            {error}
          </div>
        )}



        {/* LANDING PAGE */}
        {!showDashboard && !loading && !error && (
          <div className="w-full max-w-4xl space-y-12 text-center animate-in fade-in duration-700">
            <div className="space-y-1 -mt-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: '"Black Kastile Modern", sans-serif', letterSpacing: '0.10em' }}>
                STATS-TUBE
              </h1>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto w-full">
              <div className="p-0.5 rounded-full bg-linear-to-tr from-zinc-800 via-zinc-700 to-zinc-800 shadow-2xl">
                <div className="bg-zinc-950 rounded-full">
                  <SearchInput onAnalyze={handleAnalyze} isLoading={loading} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl text-transparent bg-clip-text bg-linear-to-r from-zinc-200 to-zinc-600" style={{ letterSpacing: 'normal', fontFamily: 'system-ui, sans-serif' }}>
                Uncover channels' true performance.
              </h2>
              <p className="max-w-4xl mx-auto text-sm sm:text-base text-zinc-400">
                Paste a YouTube URL, get instant data-driven intelligence. 
                Track engagement rates and uncover momentum. <br />
                No Logins Required.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-left">
              <div className="group flex flex-col space-y-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-green-400 transition-colors">
                <Activity className="w-6 h-6 text-amber-400" />
                <h3 className="font-semibold text-zinc-100 text-lg group-hover:text-green-400 transition-colors">Deep Engagement</h3>
                <p className="text-sm text-zinc-400">Analyze likes, views, and comments for real interaction rates.</p>
              </div>
              <div className="group flex flex-col space-y-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-green-400 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold text-zinc-100 text-lg group-hover:text-green-400 transition-colors">Proprietary Scoring</h3>
                <p className="text-sm text-zinc-400">0-100 score based on baselines, recency, and momentum.</p>
              </div>
              <div className="group flex flex-col space-y-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-green-400 transition-colors">
                <Shield className="w-6 h-6 text-red-400" />
                <h3 className="font-semibold text-zinc-100 text-lg group-hover:text-green-400 transition-colors">Secure & Fast</h3>
                <p className="text-sm text-zinc-400">Server-side edge routing keeps API keys hidden entirely.</p>
              </div>
            </div>

            {/* Bug Report Form */}
            <div className="max-w-2xl mx-auto w-full pt-8 pb-8 text-left">
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <Bug className="w-6 h-6 text-zinc-300" />
                  <div>
                    <h3 className="font-semibold text-green-400 text-xl">Spotted a bug ?</h3>
                  </div>
                </div>
                {bugSuccess ? (
                  <div className="py-8 text-center text-green-400"><CheckCircle2 className="w-12 h-12 mx-auto mb-3" /><p>Submitted successfully!</p></div>
                ) : (
                  <form onSubmit={handleBugSubmit} className="space-y-4">
                    <input type="email" value={bugEmail} onChange={(e) => setBugEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm" />
                    <textarea value={bugDetails} onChange={(e) => setBugDetails(e.target.value)} placeholder="Bug details..." required rows={3} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm resize-none" />
                    <button type="submit" disabled={isSubmittingBug} className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium text-sm">
                      {isSubmittingBug ? "Submitting..." : "Submit Report"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}



        {/* DASHBOARD */}
        {showDashboard && channelData && videosData && !loading && (
          <Dashboard 
            channelData={channelData} 
            videosData={videosData} 
            onBack={handleBackToHome} 
          />
        )}

      </main>

      <Footer />
    </div>
  );
}