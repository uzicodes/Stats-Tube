"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ChannelHeaderProps {
  channel: any; // We'll type this strictly later
  onBack?: () => void;
}

export function ChannelHeader({ channel, onBack }: ChannelHeaderProps) {
  const snippet = channel.snippet;
  const stats = channel.statistics;
  const [activeTab, setActiveTab] = useState<string>("Overview");
  
  // Format numbers to look clean (e.g., 1,500,000 -> 1.5M)
  const formatCompact = (num: string | number) => {
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(Number(num));
  };

  // Format channel creation date (month, year)
  const getChannelCreatedDate = () => {
    const date = new Date(snippet.publishedAt);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <>
      {/* Back Button */}
      <button onClick={handleBackClick} className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6 bg-none border-none cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </button>

      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative z-10 p-6">
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

        {/* Stats Row &  Channel Creation Date */}
        <div className="flex items-center gap-8 mt-8 justify-between">
          <div className="flex items-center gap-8">
            <div className="inline-flex gap-8 px-5 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-400">Subscribers</span>
                <span className="text-lg font-bold text-zinc-100">{formatCompact(stats.subscriberCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-400">Total views</span>
                <span className="text-lg font-bold text-zinc-100">{formatCompact(stats.viewCount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-400">Videos</span>
                <span className="text-lg font-bold text-zinc-100">{formatCompact(stats.videoCount)}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-zinc-400">Channel created</p>
              <p className="text-sm font-semibold text-zinc-100">{getChannelCreatedDate()}</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setActiveTab("Overview")}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                activeTab === "Overview" 
                  ? "text-amber-400 border-amber-400" 
                  : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("Trends")}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                activeTab === "Trends" 
                  ? "text-amber-400 border-amber-400" 
                  : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
              }`}
            >
              Trends
            </button>
            <button 
              onClick={() => setActiveTab("Content")}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                activeTab === "Content" 
                  ? "text-amber-400 border-amber-400" 
                  : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
              }`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab("Compare")}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                activeTab === "Compare" 
                  ? "text-amber-400 border-amber-400" 
                  : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
              }`}
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </>
  );
}