"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

interface ChannelHeaderProps {
  channel: any; 
  onBack?: () => void;
}

export function ChannelHeader({ channel, onBack }: ChannelHeaderProps) {
  const snippet = channel.snippet;
  const stats = channel.statistics;
  const [activeTab, setActiveTab] = useState<string>("Overview");
  
  // Format numbers (1,500,000 -> 1.5M)
  const formatCompact = (num: string | number) => {
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(Number(num));
  };

  // channel creation date (month, year)
  const getChannelCreatedDate = () => {
    const date = new Date(snippet.publishedAt);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Calculate milestone & progress
  const getMilestoneData = (subs: number) => {
    let nextMilestone = 1000;
    if (subs >= 100000000) nextMilestone = Math.ceil(subs / 10000000) * 10000000; // 10M increments
    else if (subs >= 10000000) nextMilestone = Math.ceil(subs / 1000000) * 1000000; // 1M increments
    else if (subs >= 1000000) nextMilestone = Math.ceil(subs / 500000) * 500000; // 500K increments
    else if (subs >= 100000) nextMilestone = Math.ceil(subs / 100000) * 100000; // 100K increments
    else if (subs >= 10000) nextMilestone = Math.ceil(subs / 10000) * 10000; // 10K increments
    
    const prevMilestone = nextMilestone > 100000000 ? nextMilestone - 10000000 : 
                          nextMilestone > 10000000 ? nextMilestone - 1000000 : 
                          nextMilestone > 1000000 ? nextMilestone - 500000 : 
                          nextMilestone > 100000 ? nextMilestone - 100000 : 0;
                          
    const progress = Math.min(100, Math.max(0, ((subs - prevMilestone) / (nextMilestone - prevMilestone)) * 100));
    
    return { nextMilestone, progress };
  };

  // Determine Creator Tier
  const getCreatorTier = (subs: number) => {
    if (subs >= 50000000) return { label: "Elite Creator", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
    if (subs >= 10000000) return { label: "Diamond Tier", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" };
    if (subs >= 1000000) return { label: "Gold Tier", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" };
    if (subs >= 100000) return { label: "Silver Tier", color: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10" };
    return { label: "Emerging", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
  };

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return countryCode;
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  const scrollToSection = (sectionId: string) => {
    const capitalizedId = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    setActiveTab(capitalizedId);
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Top Navigation Row (Sticky) */}
      <div className="sticky top-0 z-50 pt-4 pb-4 mb-4 bg-zinc-950/95 backdrop-blur-xl transition-all flex items-center justify-between w-full">
        {/* Back Button */}
        <button onClick={handleBackClick} className="inline-flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors bg-none border-none cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </button>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-end gap-2 sm:gap-3 items-center">
          <button 
            onClick={() => scrollToSection("overview")}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              activeTab === "Overview" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => scrollToSection("trends")}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              activeTab === "Trends" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Trends
          </button>
          <button 
            onClick={() => scrollToSection("content")}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              activeTab === "Content" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Content
          </button>
          <button 
            onClick={() => scrollToSection("compare")}
            className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              activeTab === "Compare" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Main Channel Card (Static, scrolls away) */}
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative z-10 p-6 shadow-2xl">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-zinc-800 bg-zinc-800 overflow-hidden shrink-0">
            <Image
              src={snippet.thumbnails.high.url}
              alt={snippet.title}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover"
            />
          </div>
          
          <div className="text-center sm:text-left grow">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-1">{snippet.title}</h1>
            <p className="text-zinc-400 text-sm mb-4">{snippet.customUrl}</p>
            <p className="text-zinc-400 text-sm max-w-2xl line-clamp-2">
              {snippet.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* (Milestones & Identity) */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mt-4 pt-4 border-t border-zinc-800/50">
          
          {/* Core Stats Group */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex gap-4 sm:gap-6 px-5 py-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">Subs</span>
                <span className="text-lg font-bold text-zinc-100">{formatCompact(stats.subscriberCount)}</span>
              </div>
              <div className="w-px bg-zinc-700/50 hidden sm:block"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">Views</span>
                <span className="text-lg font-bold text-zinc-100">{formatCompact(stats.viewCount)}</span>
              </div>
              <div className="w-px bg-zinc-700/50 hidden sm:block"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-400">Videos</span>
                <span className="text-lg font-bold text-zinc-100">{formatCompact(stats.videoCount)}</span>
              </div>
            </div>
          </div>
          
          {/* Tier Badge */}
          {(() => {
            const tier = getCreatorTier(parseInt(stats.subscriberCount) || 0);
            return (
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${tier.color}`}>
                {tier.label}
              </div>
            );
          })()}
          
          {/* Context & Milestones */}
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80">
            
            {/* Channel Created */}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Established</span>
              <span className="text-sm font-medium text-zinc-200">{getChannelCreatedDate()}</span>
            </div>

            {/* Country */}
            {snippet.country && (
              <>
                <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Location</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ReactCountryFlag 
                      countryCode={snippet.country} 
                      svg 
                      style={{
                        width: '1.25em',
                        height: '1.25em',
                        borderRadius: '2px'
                      }}
                      title={snippet.country}
                    />
                    <span className="text-sm font-medium text-zinc-200">{snippet.country}</span>
                  </div>
                </div>
              </>
            )}

            <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>

            {/* Milestone Tracker */}
            {(() => {
              const { nextMilestone, progress } = getMilestoneData(parseInt(stats.subscriberCount) || 0);
              return (
                <div className="flex flex-col w-full sm:w-48">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Next Milestone</span>
                    <span className="text-xs font-bold text-zinc-500">{formatCompact(nextMilestone)}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-green-900 to-green-400 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>
    </>
  );
}