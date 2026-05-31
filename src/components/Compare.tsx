"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X, Swords, Crown, Sparkles } from "lucide-react";
import { useChannelData } from "@/hooks/useChannelData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CompareSectionProps {
  baseChannel: any;
  baseVideos: any[];
}

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

  const formatCompact = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Helper: Calculate average days between uploads
  const calculateUploadVelocity = (videos: any[]) => {
    if (!videos || videos.length < 2) return 0;
    const newest = new Date(videos[0].snippet.publishedAt).getTime();
    const oldest = new Date(videos[videos.length - 1].snippet.publishedAt).getTime();
    const diffDays = (newest - oldest) / (1000 * 3600 * 24);
    return Math.max(0.1, diffDays / videos.length); // Avoid division by zero
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

  const chartData = [
    { name: baseChannel.snippet.title, views: baseAvgViews, fill: "#6366f1" },
    { name: compChannel.snippet.title, views: compAvgViews, fill: "#f43f5e" }
  ];

  const CustomCompareTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-100 font-medium text-sm mb-1">{label}</p>
          <p className="text-emerald-400 font-bold">{formatCompact(Number(value))} Avg Views</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mt-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Head to Head</h2>
        <button
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* THE TALE OF THE TAPE */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-3 p-4 border-b border-zinc-800 bg-zinc-900/60 items-center">

            {/* Base Channel Profile */}
            <div className="flex flex-col items-center text-center relative">
              {baseWins && <Crown className="absolute -top-4 text-yellow-400 w-5 h-5 drop-shadow-md animate-in zoom-in" />}
              <Image src={baseChannel.snippet.thumbnails.high.url} alt="Base" width={48} height={48} className="rounded-full mb-2 border-2 border-indigo-500" />
              <span className="font-bold text-sm text-zinc-100 line-clamp-1">{baseChannel.snippet.title}</span>
            </div>

            <div className="flex justify-center items-center">
              <div className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-bold uppercase tracking-widest">VS</div>
            </div>

            {/* Comp Channel Profile */}
            <div className="flex flex-col items-center text-center relative">
              {compWins && <Crown className="absolute -top-4 text-yellow-400 w-5 h-5 drop-shadow-md animate-in zoom-in" />}
              <Image src={compChannel.snippet.thumbnails.high.url} alt="Comp" width={48} height={48} className="rounded-full mb-2 border-2 border-rose-500" />
              <span className="font-bold text-sm text-zinc-100 line-clamp-1">{compChannel.snippet.title}</span>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="flex flex-col divide-y divide-zinc-800/50 p-4">

            {/* Subscribers */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${parseInt(baseChannel.statistics.subscriberCount) > parseInt(compChannel.statistics.subscriberCount) ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(parseInt(baseChannel.statistics.subscriberCount))}
              </div>
              <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Subscribers</div>
              <div className={`text-center font-bold text-lg ${parseInt(compChannel.statistics.subscriberCount) > parseInt(baseChannel.statistics.subscriberCount) ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(parseInt(compChannel.statistics.subscriberCount))}
              </div>
            </div>

            {/* Avg Views */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseAvgViews > compAvgViews ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(baseAvgViews)}
              </div>
              <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Avg Views</div>
              <div className={`text-center font-bold text-lg ${compAvgViews > baseAvgViews ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(compAvgViews)}
              </div>
            </div>

            {/* Engagement */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseEng > compEng ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {baseEng.toFixed(2)}%
              </div>
              <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Engagement</div>
              <div className={`text-center font-bold text-lg ${compEng > baseEng ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {compEng.toFixed(2)}%
              </div>
            </div>

            {/* Financial Clash */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseEarnings > compEarnings ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCurrency(baseEarnings)}
              </div>
              <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Avg Rev / Video</div>
              <div className={`text-center font-bold text-lg ${compEarnings > baseEarnings ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCurrency(compEarnings)}
              </div>
            </div>

            {/* Upload Velocity  */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseVelocity < compVelocity ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {baseVelocity.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">days</span>
              </div>
              <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Upload Pace</div>
              <div className={`text-center font-bold text-lg ${compVelocity < baseVelocity ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {compVelocity.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">days</span>
              </div>
            </div>

          </div>
        </div>

        {/* VISUAL CHART */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full min-h-[300px]">
          <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6">Reach Comparison</h3>
          <div className="grow w-full h-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCompact} stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  content={<CustomCompareTooltip />}
                />
                <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}