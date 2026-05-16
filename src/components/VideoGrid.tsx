"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, DollarSign, TrendingUp } from "lucide-react";

interface VideoGridProps {
  videosData: any[];
}

export function VideoGrid({ videosData }: VideoGridProps) {
  const [filterType, setFilterType] = useState<'videos' | 'shorts'>('videos');
  if (!videosData || videosData.length === 0) return null;

  // Helper: Convert duration string to seconds
  const durationToSeconds = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    const h = match[1] ? parseInt(match[1]) : 0;
    const m = match[2] ? parseInt(match[2]) : 0;
    const s = match[3] ? parseInt(match[3]) : 0;
    return h * 3600 + m * 60 + s;
  };

  // Separate shorts and videos (shorts are under 60 seconds)
  const shorts = videosData.filter(v => durationToSeconds(v.contentDetails?.duration || 'PT0S') < 60).slice(0, 50);
  const longVideos = videosData.filter(v => durationToSeconds(v.contentDetails?.duration || 'PT0S') >= 60).slice(0, 50);
  const filteredVideos = filterType === 'videos' ? longVideos : shorts;

  // Combine displayed videos for average calculation
  const displayedVideos = [...longVideos, ...shorts];
  const avgViews = displayedVideos.length > 0 
    ? displayedVideos.reduce((sum, v) => sum + (parseInt(v.statistics?.viewCount) || 0), 0) / displayedVideos.length
    : 0;

  // Helper: Format large numbers (498000000 -> 498.0M)
  const formatViews = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Helper: Format YouTube Duration (PT22M38S -> 22:38)
  const parseDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";
    const h = match[1] ? parseInt(match[1]) : 0;
    const m = match[2] ? parseInt(match[2]) : 0;
    const s = match[3] ? parseInt(match[3]) : 0;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Helper: Format "Time Ago" (e.g., 2 years ago)
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  return (
    <div className="w-full mt-8 animate-in slide-in-from-bottom-10 duration-700 delay-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-zinc-100 uppercase tracking-wider text-sm">Content <span className="text-zinc-500 font-normal normal-case ml-2">(Latest {filteredVideos.length} shown)</span></h2>
        <div className="inline-flex gap-0 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setFilterType('videos')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filterType === 'videos'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Long Videos
          </button>
          <button
            onClick={() => setFilterType('shorts')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filterType === 'shorts'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Shorts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => {
          const views = parseInt(video.statistics?.viewCount) || 0;
          const likes = parseInt(video.statistics?.likeCount) || 0;
          const comments = parseInt(video.statistics?.commentCount) || 0;
          
          // Math for badges
          const engagement = views > 0 ? ((likes + comments) / views) * 100 : 0;
          const isAboveAvg = views > avgViews;
          const percentAbove = isAboveAvg ? Math.round(((views - avgViews) / avgViews) * 100) : 0;
          const isTopPerformer = views > (avgViews * 1.5);
          
          // Simulated 0-100 Score based on engagement & views relative to channel average
          const score = Math.min(Math.round(50 + (isAboveAvg ? 20 : -10) + (engagement * 10)), 99);

          return (
            <div key={video.id} className="flex flex-col bg-zinc-950/40 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
              
              {/* THUMBNAIL */}
              <div className="relative w-full aspect-video h-32 bg-zinc-900 border-b border-zinc-800/80">
                <Image 
                  src={video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.high?.url} 
                  alt={video.snippet?.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                  {parseDuration(video.contentDetails?.duration)}
                </div>
                
                {/* Top Performer Badge */}
                {isTopPerformer && (
                  <div className="absolute top-2 left-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                    Top Performer
                  </div>
                )}
              </div>

              {/* CARD CONTENT */}
              <div className="p-3 flex flex-col grow">
                {/* Title & Date */}
                <h3 className="font-bold text-zinc-100 text-sm line-clamp-2 leading-tight mb-0.5 group-hover:text-emerald-400 transition-colors">
                  {video.snippet?.title}
                </h3>
                <p className="text-xs text-zinc-500 mb-2">{timeAgo(video.snippet?.publishedAt)}</p>

                {/* Badges Row */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {engagement.toFixed(2)}% engagement
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${score > 75 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                    Score {score}
                  </span>
                  {isAboveAvg && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Above avg
                    </span>
                  )}
                  {percentAbove > 100 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Unusual spike
                    </span>
                  )}
                </div>

                {/* Views & Performance */}
                <div className="flex items-end justify-between mb-2 mt-auto">
                  <div className="text-xl font-extrabold text-zinc-50 tracking-tight">
                    {formatViews(views)}
                  </div>
                  {isAboveAvg && (
                    <div className="flex items-center text-emerald-400 text-xs font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {percentAbove}%
                    </div>
                  )}
                </div>

                {/* Earnings Box */}
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 mb-2">
                  <div className="flex items-center text-zinc-400 text-xs">
                    <DollarSign className="w-2.5 h-2.5 mr-1 opacity-70" />
                    Est. Earnings
                  </div>
                  <div className="font-bold text-emerald-400 text-xs">
                    ${formatViews((views / 1000) * 4)}
                  </div>
                </div>

                {/* Watch Link */}
                <a 
                  href={`https://youtube.com/watch?v=${video.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Watch on YouTube
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}