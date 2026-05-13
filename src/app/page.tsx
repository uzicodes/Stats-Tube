"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import Galaxy from "@/components/Galaxy";
import { useChannelData } from "@/hooks/useChannelData";
import { Activity, Shield, TrendingUp, Bug, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { loading, error, channelData, videosData, fetchChannelData } = useChannelData();
  
  // Bug Report Form States
  const [bugEmail, setBugEmail] = useState("");
  const [bugDetails, setBugDetails] = useState("");
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);

  const handleAnalyze = async (type: 'handle' | 'channelId', value: string) => {
    await fetchChannelData(type, value);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDetails.trim()) return;
    
    setIsSubmittingBug(true);
    
    // Simulate an API call delay
    setTimeout(() => {
      setIsSubmittingBug(false);
      setBugSuccess(true);
      setBugEmail("");
      setBugDetails("");
      
      // Hide success message after 3 seconds
      setTimeout(() => setBugSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-zinc-800 relative overflow-hidden flex flex-col">
      {/* Galaxy Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <Galaxy
          className="absolute inset-0"
          starSpeed={0.5}
          density={1}
          hueShift={140}
          speed={1}
          glowIntensity={0.3}
          saturation={0}
          mouseRepulsion
          repulsionStrength={2}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          transparent
        />
      </div>

      {/* BG Grid/Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      <main className="grow relative flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-4xl space-y-12 text-center pt-10 sm:pt-20">
          
          {/* Logo */}
          <div className="flex justify-center -mt-8 sm:-mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <img 
              src="/logo2.png" 
              alt="Stats-Tube Logo"
              className="h-26 w-auto"
            />
          </div>
          
          {/* Hero Section */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Status Badge */}
            <div className="inline-flex items-center justify-center px-3 py-1 mb-4 text-sm font-medium rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              <span className="flex w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              YouTube API v3
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: '"Black Kastile Modern", sans-serif', letterSpacing: '0.10em' }}>
              STATS-TUBE <br className="hidden sm:block" />
              <span className="text-4xl text-transparent bg-clip-text bg-linear-to-r from-zinc-200 to-zinc-600" style={{ letterSpacing: 'normal' }}>
                Uncover channels' true performance.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400">
              Paste a YouTube URL, get instant data-driven intelligence. 
              Track engagement rates, spot outliers, and uncover momentum. No Login Required.
            </p>
          </div>

          {/* Search Bar Wrapper */}
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            <div className="p-0.5 rounded-full bg-linear-to-tr from-zinc-800 via-zinc-700 to-zinc-800 shadow-2xl">
              <div className="bg-zinc-950 rounded-full">
                <SearchInput onAnalyze={handleAnalyze} isLoading={loading} />
              </div>
            </div>
          </div>
          
          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 text-left">
            
            {/* Feature 1 */}
            <div className="flex flex-col space-y-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-all duration-300 group">
              <div className="p-3 w-fit rounded-lg bg-zinc-800/50 text-zinc-300 group-hover:text-blue-400 group-hover:bg-blue-900/20 transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-zinc-100 text-lg group-hover:text-green-500 transition-colors">Deep Engagement</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We analyze likes, views, and comments to calculate real audience retention and interaction rates.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col space-y-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-all duration-300 group">
              <div className="p-3 w-fit rounded-lg bg-zinc-800/50 text-zinc-300 group-hover:text-purple-400 group-hover:bg-purple-900/20 transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-zinc-100 text-lg group-hover:text-green-500 transition-colors">Proprietary Scoring</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Every video gets a normalized 0-100 score based on channel baselines, recency, and momentum.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col space-y-3 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 transition-all duration-300 group">
              <div className="p-3 w-fit rounded-lg bg-zinc-800/50 text-zinc-300 group-hover:text-red-400 group-hover:bg-red-900/20 transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-zinc-100 text-lg group-hover:text-green-500 transition-colors">100% Secure & Fast</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Server-side edge routing keeps your API keys hidden while delivering lightning-fast results.
              </p>
            </div>

          </div>

          {/* Bug Report Form */}
          <div className="max-w-lg mx-auto w-full pt-16 pb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 text-left">
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md relative overflow-hidden">
              <div className="flex flex-col items-center gap-3 mb-6 text-center">
                <div className="p-2.5 rounded-lg bg-zinc-800/50 text-zinc-300">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-500 text-xl">Spotted a bug?</h3>
                  <p className="text-sm text-zinc-400">Help us improve the platform.</p>
                </div>
              </div>

              {bugSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-green-400 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-12 h-12 mb-3 opacity-80" />
                  <p className="font-medium text-lg">Report submitted successfully!</p>
                  <p className="text-sm text-green-500/70 mt-1">Thank you for your help.</p>
                </div>
              ) : (
                <form onSubmit={handleBugSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-green-500 pl-1">
                      Email address 
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={bugEmail}
                      onChange={(e) => setBugEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="details" className="text-sm font-medium text-green-500 pl-1">
                      Bug Details
                    </label>
                    <textarea
                      id="details"
                      value={bugDetails}
                      onChange={(e) => setBugDetails(e.target.value)}
                      placeholder="What were you doing when the bug occurred?"
                      rows={4}
                      required
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmittingBug || !bugDetails.trim()}
                      className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingBug ? (
                        <>
                          <div className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Report"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-8 text-center text-sm text-zinc-600 border-t border-zinc-900/50 bg-zinc-950/50 backdrop-blur-sm z-10">
        <p className="text-blue-400">© {new Date().getFullYear()}  StatsTube</p>
      </footer>
    </div>
  );
}