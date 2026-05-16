"use client";

import { ChannelHeader } from "@/components/ui/ChannelHeader";
import { TrendsCharts } from "@/components/TrendsCharts";
import { Info } from "lucide-react";

interface DashboardProps {
  channelData: any;
  videosData: any[];
  onBack?: () => void;
}

export function Dashboard({ channelData, videosData, onBack }: DashboardProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 space-y-6 text-left animate-in slide-in-from-bottom-8 duration-700">
      <ChannelHeader channel={channelData} onBack={onBack} />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {videosData && videosData.length > 0 ? (
          <>
            {/* Usual Views Per Upload */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-sm font-medium mb-2">Usual views per upload</p>
              <p className="text-2xl font-bold text-green-400">
                {formatNumber(
                  Math.round(
                    videosData.reduce((sum: number, video: any) => sum + (parseInt(video.statistics?.viewCount) || 0), 0) / videosData.length
                  )
                )}
              </p>
            </div>

            {/* Engagement Rate */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-zinc-400 text-sm font-medium">Engagement</p>
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Likes & Comments per view
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {(
                  (videosData.reduce((sum: number, video: any) => {
                    const likes = parseInt(video.statistics?.likeCount) || 0;
                    const comments = parseInt(video.statistics?.commentCount) || 0;
                    const views = parseInt(video.statistics?.viewCount) || 1;
                    return sum + ((likes + comments) / views * 100);
                  }, 0) / videosData.length)
                ).toFixed(2)}%
              </p>
            </div>

            {/* Top Video Views */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-sm font-medium mb-2">Top Video Views</p>
              <p className="text-2xl font-bold text-green-400">
                {formatNumber(
                  Math.max(
                    ...videosData.map((video: any) => parseInt(video.statistics?.viewCount) || 0)
                  )
                )}
              </p>
            </div>

            {/* Est. Lifetime Earnings */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-zinc-400 text-sm font-medium">Est. Lifetime Earnings</p>
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Based on total channel views (Blended $2.00 CPM)
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">
                ${formatNumber(
                  (parseInt(channelData.statistics?.viewCount) / 1000) * 2.00
                )}
              </p>
            </div>

            {/* Active Audience Rate */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-zinc-400 text-sm font-medium">Active Audience</p>
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Average views vs Total Subscribers (Capped at 100%)
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {(() => {
                  const avgViews = videosData.reduce((sum: number, video: any) => sum + (parseInt(video.statistics?.viewCount) || 0), 0) / videosData.length;
                  const subs = parseInt(channelData.statistics?.subscriberCount);
                  const percentage = (avgViews / subs) * 100;
                  
                  return Math.min(percentage, 100).toFixed(1) + "%";
                })()}
              </p>
            </div>

            {/* Upload Frequency */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-zinc-400 text-sm font-medium">Upload Frequency</p>
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Average days between recent uploads
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {(() => {
                  if (videosData.length < 2) return "N/A";
                  const newest = new Date(videosData[0].snippet.publishedAt).getTime();
                  const oldest = new Date(videosData[videosData.length - 1].snippet.publishedAt).getTime();
                  const diffDays = (newest - oldest) / (1000 * 60 * 60 * 24);
                  const freq = diffDays / videosData.length;
                  return freq < 1 ? "< 1 day" : `1 in ${freq.toFixed(1)} days`;
                })()}
              </p>
            </div>

            {/* View Momentum */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-zinc-400 text-sm font-medium">View Momentum</p>
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Last 5 videos vs older videos
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {(() => {
                  if (videosData.length < 10) return "N/A";
                  const recent5 = videosData.slice(0, 5).reduce((sum: number, v: any) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / 5;
                  const older = videosData.slice(5).reduce((sum: number, v: any) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / (videosData.length - 5);
                  const diff = ((recent5 - older) / older) * 100;
                  return (diff > 0 ? "+" : "") + diff.toFixed(1) + "%";
                })()}
              </p>
            </div>

            {/* Hit Rate */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-zinc-400 text-sm font-medium">Hit Rate</p>
                <div className="group relative">
                  <Info className="w-4 h-4 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    % of videos beating channel average
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {(() => {
                  const avg = videosData.reduce((sum: number, v: any) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / videosData.length;
                  const hits = videosData.filter((v: any) => (parseInt(v.statistics?.viewCount) || 0) > avg).length;
                  return ((hits / videosData.length) * 100).toFixed(1) + "%";
                })()}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="h-32 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl"></div>
            <div className="h-32 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl"></div>
            <div className="h-32 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl"></div>
            <div className="h-32 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl"></div>
          </>
        )}
      </div>
      
      {/* Trends Charts */}
      <TrendsCharts videosData={videosData} />
    </div>
  );
}
