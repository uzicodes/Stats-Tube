"use client";

import { useState } from "react";
import { Search, X, Swords, Sparkles } from "lucide-react";
import { useChannelData } from "@/hooks/useChannelData";
import { CompareStatsTable } from "./CompareStatsTable";
import dynamic from "next/dynamic";

const CompareReachChart = dynamic(
  () => import("./CompareReachChart").then((mod) => mod.CompareReachChart),
  { ssr: false }
);

const CompareMomentumChart = dynamic(
  () => import("./CompareMomentumChart").then((mod) => mod.CompareMomentumChart),
  { ssr: false }
);

interface CompareSectionProps {
  baseChannel: any;
  baseVideos: any[];
}

// Helper: Convert duration to seconds to find Shorts
const durationToSeconds = (duration: string): number => {
  const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  return h * 3600 + m * 60 + s;
};

// Helper: Calculate Shorts Percentage
const getShortsPercentage = (videos: any[]) => {
  if (!videos || videos.length === 0) return 0;
  const shortsCount = videos.filter(v => durationToSeconds(v.contentDetails?.duration || 'PT0S') < 60).length;
  return (shortsCount / videos.length) * 100;
};

// Helper: Calculate average days between uploads
const calculateUploadVelocity = (videos: any[]) => {
  if (!videos || videos.length < 2) return 0;
  const newest = new Date(videos[0].snippet.publishedAt).getTime();
  const oldest = new Date(videos[videos.length - 1].snippet.publishedAt).getTime();
  const diffDays = (newest - oldest) / (1000 * 3600 * 24);
  return Math.max(0.1, diffDays / videos.length);
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const formatCurrency = (num: number) => {
  return currencyFormatter.format(num);
};

export function CompareSection({ baseChannel, baseVideos }: CompareSectionProps) {
  const [searchInput, setSearchInput] = useState("");

  const { loading, error, channelData: compChannel, videosData: compVideos, fetchChannelData } = useChannelData();

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const type = searchInput.startsWith("UC") ? "channelId" : "handle";
    let formattedValue = searchInput;
    if (type === "handle" && !searchInput.startsWith("@")) {
      formattedValue = `@${searchInput}`;
    }

    await fetchChannelData(type, formattedValue);
  };



  // --- Pre-calculate Base Stats ---
  const baseAvgViews = baseVideos.reduce((sum, v) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / baseVideos.length;
  const baseEng = (baseVideos.reduce((sum, v) => {
    const likes = parseInt(v.statistics?.likeCount) || 0;
    const comments = parseInt(v.statistics?.commentCount) || 0;
    const views = parseInt(v.statistics?.viewCount) || 1;
    return sum + ((likes + comments) / views * 100);
  }, 0) / baseVideos.length);
  const baseHitRate = (baseVideos.filter(v => (parseInt(v.statistics?.viewCount) || 0) > baseAvgViews).length / baseVideos.length) * 100;
  const baseVelocity = calculateUploadVelocity(baseVideos);
  const baseEarnings = (baseAvgViews / 1000) * 4; // $4 RPM
  const baseShortsPct = getShortsPercentage(baseVideos);

  if (!compChannel || !compVideos) {
    return (
      <div className="w-full mt-12 p-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
        <Swords className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="text-xl font-bold text-zinc-100 mb-2">Compare Channels</h3>
        <p className="text-zinc-400 text-sm mb-6 max-w-md">
          Search a competitor for <span className="text-indigo-400 font-semibold">{baseChannel.snippet.title}</span> to see head-to-head metrics, engagement battles, and viewership trends.
        </p>

        <form onSubmit={handleCompare} className="relative w-full max-w-md flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-zinc-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter competitor @handle..."
            aria-label="Competitor YouTube handle or channel name"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-full py-3 pl-12 pr-4 text-xs md:text-base text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-4 py-1.5 bg-zinc-100 text-zinc-900 rounded-full font-medium text-sm hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Compare"}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    );
  }

  // --- Pre-calculate Competitor Stats ---
  const compAvgViews = compVideos.reduce((sum, v) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / compVideos.length;
  const compEng = (compVideos.reduce((sum, v) => {
    const likes = parseInt(v.statistics?.likeCount) || 0;
    const comments = parseInt(v.statistics?.commentCount) || 0;
    const views = parseInt(v.statistics?.viewCount) || 1;
    return sum + ((likes + comments) / views * 100);
  }, 0) / compVideos.length);
  const compHitRate = (compVideos.filter(v => (parseInt(v.statistics?.viewCount) || 0) > compAvgViews).length / compVideos.length) * 100;
  const compVelocity = calculateUploadVelocity(compVideos);
  const compEarnings = (compAvgViews / 1000) * 4;
  const compShortsPct = getShortsPercentage(compVideos);

  // --- Calculate Dominance & Summary ---
  let baseScore = 0;
  let compScore = 0;

  if (parseInt(baseChannel.statistics.subscriberCount) > parseInt(compChannel.statistics.subscriberCount)) baseScore++; else compScore++;
  if (baseAvgViews > compAvgViews) baseScore++; else compScore++;
  if (baseEng > compEng) baseScore++; else compScore++;
  if (baseHitRate > compHitRate) baseScore++; else compScore++;

  const baseWins = baseScore > compScore;
  const compWins = compScore > baseScore;

  const generateSummary = () => {
    const winnerName = baseWins ? baseChannel.snippet.title : (compWins ? compChannel.snippet.title : "Both creators");
    const engWinner = baseEng > compEng ? baseChannel.snippet.title : compChannel.snippet.title;
    const grindWinner = baseVelocity < compVelocity ? baseChannel.snippet.title : compChannel.snippet.title;

    if (baseScore === compScore) return `An extremely tight matchup. While ${engWinner} holds the edge in audience loyalty, the overall core metrics remain deadlocked.`;

    return `${winnerName} is dominating this matchup, winning ${Math.max(baseScore, compScore)} out of 4 core metrics. Interestingly, ${grindWinner} is putting in more work on the upload schedule, but ${engWinner} is capturing higher audience engagement.`;
  };

  // --- Chart 1 Data (Bar - Avg Reach) ---
  const reachChartData = [
    { name: baseChannel.snippet.title, views: baseAvgViews, fill: "#6366f1" },
    { name: compChannel.snippet.title, views: compAvgViews, fill: "#f43f5e" }
  ];

  // --- Chart 2 Data (Line - Momentum) ---
  // Grabs the 10 most recent videos, reverses them so they read chronologically (left to right)
  const momentumData = Array.from({ length: 10 }).map((_, i) => {
    return {
      name: `Video -${9 - i}`,
      baseViews: baseVideos[9 - i] ? (parseInt(baseVideos[9 - i].statistics?.viewCount) || 0) : 0,
      compViews: compVideos[9 - i] ? (parseInt(compVideos[9 - i].statistics?.viewCount) || 0) : 0,
    };
  });



  return (
    <div className="w-full mt-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Head to Head</h2>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <X className="w-3 h-3" /> Clear Matchup
        </button>
      </div>

      {/* Intelligent Matchup Summary */}
      <div className="w-full mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-200/90 leading-relaxed">
          <span className="font-bold text-indigo-300">AI Matchup Insight:</span> {generateSummary()}
        </p>
      </div>

      {/* TOP ROW: Table & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <CompareStatsTable 
          baseChannel={baseChannel}
          compChannel={compChannel}
          baseWins={baseWins}
          compWins={compWins}
          baseAvgViews={baseAvgViews}
          compAvgViews={compAvgViews}
          baseEng={baseEng}
          compEng={compEng}
          baseVelocity={baseVelocity}
          compVelocity={compVelocity}
          baseShortsPct={baseShortsPct}
          compShortsPct={compShortsPct}
        />

        <CompareReachChart reachChartData={reachChartData} />
      </div>

      <CompareMomentumChart 
        momentumData={momentumData}
        baseChannelTitle={baseChannel.snippet.title}
        compChannelTitle={compChannel.snippet.title}
      />

    </div>
  );
}