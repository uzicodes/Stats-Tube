"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import Image from "next/image";
import { SearchInput } from "@/components/ui/SearchInput";
import dynamic from "next/dynamic";
import { useChannelData } from "@/hooks/useChannelData";
import { Activity, Shield, TrendingUp, Bug, CheckCircle2 } from "lucide-react";

const StarBurst = dynamic(() => import("@/components/StarBurst"), { ssr: false });
const Dashboard = dynamic(() => import("@/app/dashboard").then((mod) => mod.Dashboard), { ssr: false });
import Footer from "@/app/footer";
import GlobalLoader from "@/app/GlobalLoader";

export default function Home() {
  const { loading, error, channelData, videosData, fetchChannelData, resetState } = useChannelData();
  const [showDashboard, setShowDashboard] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Bug Report Form States
  const [bugState, setBugState] = useReducer(
    (state: any, action: any) => ({ ...state, ...action }),
    { email: "", details: "", isSubmitting: false, success: false }
  );

  const handleAnalyze = async (type: 'handle' | 'channelId', value: string) => {
    // Save current session to browser storage
    sessionStorage.setItem("st_searchType", type);
    sessionStorage.setItem("st_searchValue", value);

    const success = await fetchChannelData(type, value);

    // Only show dashboard if fetch was successful
    if (success) {
      sessionStorage.setItem("st_showDashboard", "true");
      setShowDashboard(true);
    } else {
      sessionStorage.setItem("st_showDashboard", "false");
    }
  };

  const handleBackToHome = () => {
    // Clear session so a refresh keeps them on the homepage
    sessionStorage.removeItem("st_searchType");
    sessionStorage.removeItem("st_searchValue");
    sessionStorage.setItem("st_showDashboard", "false");

    // Reset all state from the hook
    resetState();
    setShowDashboard(false);
  };

  const hasRestored = useRef(false);

  useEffect(() => {
    // Prevent double-fetching in React Strict Mode
    if (hasRestored.current) return;
    hasRestored.current = true;

    const savedType = sessionStorage.getItem("st_searchType");
    const savedValue = sessionStorage.getItem("st_searchValue");
    const isDashboardActive = sessionStorage.getItem("st_showDashboard");

    // If they were on the dashboard before refreshing, automatically re-analyze!
    if (isDashboardActive === "true" && savedType && savedValue && !channelData) {
      handleAnalyze(savedType as 'handle' | 'channelId', savedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mark initial page load as complete after component mounts
  useEffect(() => {
    // Small delay to ensure all page elements are rendered before hiding loader
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugState.details.trim()) return;
    setBugState({ isSubmitting: true });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "25e65c88-7b8e-4e47-95f0-c289b90213e5",
          subject: "🚨 New Bug Report - Stats-Tube",
          from_name: "Stats-Tube Bug Tracker",
          email: bugState.email || "No email provided",
          message: bugState.details,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBugState({ success: true, email: "", details: "" });
        setTimeout(() => setBugState({ success: false }), 3000);
      } else {
        console.error("Submission failed", result);
        alert("Failed to send report. Please try again.");
      }
    } catch (error) {
      console.error("Error sending bug report:", error);
      alert("An error occurred while sending the report.");
    } finally {
      setBugState({ isSubmitting: false });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-zinc-800 relative flex flex-col">
      {/* Backgrounds */}
      {!showDashboard && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <StarBurst className="absolute inset-0" starCount={249} color="#AAB4F0" starSize={40} />
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Top Navigation */}
      {!showDashboard && (
        <header className="w-full relative z-20 pt-6 px-4 sm:px-8 flex justify-center">
          <div className="max-w-2xl w-full">
            {/* Logo */}
            <div className="flex justify-center mb-1">
              <Image src="/logo2.png" alt="Stats-Tube Logo" width={300} height={80} className="h-20 w-auto object-contain" priority />
            </div>
          </div>
        </header>
      )}

      {/* Global Loader */}
      {(!initialLoadComplete || loading) && <GlobalLoader />}

      <main className="grow relative flex flex-col items-center p-4 sm:p-8 z-10 w-full mt-4">

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-6 space-y-4">
            <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-lg text-left animate-in fade-in">
              {error}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleBackToHome}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}



        {/* LANDING PAGE */}
        {!showDashboard && !loading && !error && (
          <div className="w-full max-w-4xl space-y-12 text-center animate-gpu-fade-in">
            <div className="space-y-1 -mt-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-black-kastile), sans-serif', letterSpacing: '0.10em' }}>
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
                Uncover True Performance !
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
            <div className="max-w-lg mx-auto w-full pt-8 pb-8 text-left">
              <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <Bug className="w-6 h-6 text-zinc-300" />
                  <div>
                    <h3 className="font-semibold text-green-400 text-xl">Spotted a bug ?</h3>
                  </div>
                </div>
                {bugState.success ? (
                  <div className="py-8 text-center text-green-400"><CheckCircle2 className="w-12 h-12 mx-auto mb-3" /><p>Submitted successfully!</p></div>
                ) : (
                  <form onSubmit={handleBugSubmit} className="space-y-4">
                    <input type="email" value={bugState.email} onChange={(e) => setBugState({ email: e.target.value })} placeholder="Email" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm" />
                    <textarea value={bugState.details} onChange={(e) => setBugState({ details: e.target.value })} placeholder="Bug details..." required rows={3} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm resize-none" />
                    <button type="submit" disabled={bugState.isSubmitting} className="px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-medium text-sm">
                      {bugState.isSubmitting ? "Submitting..." : "Submit Report"}
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