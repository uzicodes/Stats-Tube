"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X, Swords } from "lucide-react";
import { useChannelData } from "@/hooks/useChannelData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CompareSectionProps {
  baseChannel: any;
  baseVideos: any[];
}

export function CompareSection({ baseChannel, baseVideos }: CompareSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  
  // We can reuse your exact same hook for the competitor!
  const { loading, error, channelData: compChannel, videosData: compVideos, fetchChannelData } = useChannelData();

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    // Simple check if it's an ID or Handle
    const type = searchInput.startsWith("UC") ? "channelId" : "handle";
    let formattedValue = searchInput;
    if (type === "handle" && !searchInput.startsWith("@")) {
      formattedValue = `@${searchInput}`;
    }
    
    await fetchChannelData(type, formattedValue);
  };

  // Helper: Format large numbers
  const formatCompact = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Pre-calculate Base Channel Stats
  const baseAvgViews = baseVideos.reduce((sum, v) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / baseVideos.length;
  const baseEng = (baseVideos.reduce((sum, v) => {
    const likes = parseInt(v.statistics?.likeCount) || 0;
    const comments = parseInt(v.statistics?.commentCount) || 0;
    const views = parseInt(v.statistics?.viewCount) || 1;
    return sum + ((likes + comments) / views * 100);
  }, 0) / baseVideos.length);
  const baseHitRate = (baseVideos.filter(v => (parseInt(v.statistics?.viewCount) || 0) > baseAvgViews).length / baseVideos.length) * 100;

  // Render the initial Search State if no competitor is loaded yet
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

  // Pre-calculate Competitor Channel Stats
  const compAvgViews = compVideos.reduce((sum, v) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / compVideos.length;
  const compEng = (compVideos.reduce((sum, v) => {
    const likes = parseInt(v.statistics?.likeCount) || 0;
    const comments = parseInt(v.statistics?.commentCount) || 0;
    const views = parseInt(v.statistics?.viewCount) || 1;
    return sum + ((likes + comments) / views * 100);
  }, 0) / compVideos.length);
  const compHitRate = (compVideos.filter(v => (parseInt(v.statistics?.viewCount) || 0) > compAvgViews).length / compVideos.length) * 100;

  // Chart Data Preparation
  const chartData = [
    {
      name: baseChannel.snippet.title,
      views: baseAvgViews,
      fill: "#6366f1"
    },
    {
      name: compChannel.snippet.title,
      views: compAvgViews,
      fill: "#f43f5e"
    }
  ];

  return (
    <div className="w-full mt-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-wider">Head to Head</h2>
        <button 
          onClick={() => window.location.reload()} // Quick hack to reset state
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Clear Matchup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* THE TALE OF THE TAPE (Data Table) */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-3 p-4 border-b border-zinc-800 bg-zinc-900/60 items-center">
            <div className="flex flex-col items-center text-center">
              <Image src={baseChannel.snippet.thumbnails.high.url} alt="Base" width={48} height={48} className="rounded-full mb-2 border-2 border-indigo-500" />
              <span className="font-bold text-sm text-zinc-100 line-clamp-1">{baseChannel.snippet.title}</span>
            </div>
            <div className="flex justify-center items-center">
              <div className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-bold uppercase tracking-widest">VS</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src={compChannel.snippet.thumbnails.high.url} alt="Comp" width={48} height={48} className="rounded-full mb-2 border-2 border-rose-500" />
              <span className="font-bold text-sm text-zinc-100 line-clamp-1">{compChannel.snippet.title}</span>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="flex flex-col divide-y divide-zinc-800/50 p-4">
            
            {/* Metric: Subscribers */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${parseInt(baseChannel.statistics.subscriberCount) > parseInt(compChannel.statistics.subscriberCount) ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(parseInt(baseChannel.statistics.subscriberCount))}
              </div>
              <div className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">Subscribers</div>
              <div className={`text-center font-bold text-lg ${parseInt(compChannel.statistics.subscriberCount) > parseInt(baseChannel.statistics.subscriberCount) ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(parseInt(compChannel.statistics.subscriberCount))}
              </div>
            </div>

            {/* Metric: Recent Views */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseAvgViews > compAvgViews ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(baseAvgViews)}
              </div>
              <div className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">Avg Views</div>
              <div className={`text-center font-bold text-lg ${compAvgViews > baseAvgViews ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {formatCompact(compAvgViews)}
              </div>
            </div>

            {/* Metric: Engagement */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseEng > compEng ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {baseEng.toFixed(2)}%
              </div>
              <div className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">Engagement</div>
              <div className={`text-center font-bold text-lg ${compEng > baseEng ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {compEng.toFixed(2)}%
              </div>
            </div>

            {/* Metric: Hit Rate */}
            <div className="grid grid-cols-3 py-4 items-center">
              <div className={`text-center font-bold text-lg ${baseHitRate > compHitRate ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {baseHitRate.toFixed(0)}%
              </div>
              <div className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">Hit Rate</div>
              <div className={`text-center font-bold text-lg ${compHitRate > baseHitRate ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {compHitRate.toFixed(0)}%
              </div>
            </div>

          </div>
        </div>

        {/* VISUAL CHART */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6">Reach Comparison</h3>
          <div className="grow min-h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCompact} stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }} 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  formatter={(value: any) => [formatCompact(Number(value)), "Avg Views"]}
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