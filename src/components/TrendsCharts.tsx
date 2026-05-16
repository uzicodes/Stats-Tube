"use client";

import { useMemo } from "react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

interface TrendsChartsProps {
  videosData: any[];
}

export function TrendsCharts({ videosData }: TrendsChartsProps) {
  // Process and reverse data so oldest is on the left, newest on the right
  const chartData = useMemo(() => {
    if (!videosData) return [];
    
    return videosData.map((video) => {
      const views = parseInt(video.statistics?.viewCount) || 0;
      const likes = parseInt(video.statistics?.likeCount) || 0;
      const comments = parseInt(video.statistics?.commentCount) || 0;
      const engagement = views > 0 ? ((likes + comments) / views) * 100 : 0;
      
      return {
        title: video.snippet?.title || "Video",
        views: views,
        engagement: Number(engagement.toFixed(2)),
        date: new Date(video.snippet?.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    }).reverse();
  }, [videosData]);

  // Process data for the Top Videos chart (sorted by views descending)
  const topVideosData = useMemo(() => {
    if (!videosData) return [];
    
    return [...videosData]
      .map((video) => {
        const views = parseInt(video.statistics?.viewCount) || 0;
        const title = video.snippet?.title || "Video";
        return {
          title: title,
          // Create a shorter version of the title for the Y-Axis so it doesn't break the layout
          shortTitle: title.length > 45 ? title.substring(0, 45) + "..." : title,
          views: views,
          date: new Date(video.snippet?.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10); // Take the top 10 videos
  }, [videosData]);

  // Formatter for large numbers on the Y-Axis (e.g., 1500000 -> 1.5M)
  const formatYAxis = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // Custom Dark Mode Tooltip for Views
  const CustomViewTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl max-w-62.5">
          <p className="text-zinc-400 text-xs mb-1">{payload[0].payload.date}</p>
          <p className="text-zinc-100 font-medium text-sm line-clamp-2 mb-2">{payload[0].payload.title}</p>
          <p className="text-indigo-400 font-bold">
            {Intl.NumberFormat('en-US').format(payload[0].value)} Views
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Dark Mode Tooltip for Engagement
  const CustomEngTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl max-w-62.5">
          <p className="text-zinc-400 text-xs mb-1">{payload[0].payload.date}</p>
          <p className="text-zinc-100 font-medium text-sm line-clamp-2 mb-2">{payload[0].payload.title}</p>
          <p className="text-indigo-400 font-bold">
            {payload[0].value}% Engagement
          </p>
        </div>
      );
    }
    return null;
  };

  if (!videosData || videosData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      
      {/* VIEW TREND CHART */}
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col">
        <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6">View Trend — Latest {videosData.length}</h3>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis dataKey="date" hide />
              <YAxis 
                tickFormatter={formatYAxis} 
                stroke="#52525b" 
                tick={{ fontSize: 12, fill: '#fbbf24' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomViewTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#818cf8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ENGAGEMENT CHART */}
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col">
        <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6">Engagement By Video</h3>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis dataKey="date" hide />
              <YAxis 
                tickFormatter={(value) => `${value}%`} 
                stroke="#52525b" 
                tick={{ fontSize: 12, fill: '#fbbf24' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomEngTooltip />} cursor={{ fill: '#27272a', opacity: 0.4 }} />
              <Bar 
                dataKey="engagement" 
                fill="#818cf8" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP VIDEOS BY VIEWS CHART */}
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col lg:col-span-2">
        <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-6">Top Videos by Views</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topVideosData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 250, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                type="number" 
                tickFormatter={formatYAxis} 
                stroke="#52525b" 
                tick={{ fontSize: 12, fill: '#fbbf24' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                dataKey="shortTitle" 
                type="category" 
                width={240}
                tick={{ fontSize: 12, fill: '#a1a1aa' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                formatter={(value) => Intl.NumberFormat('en-US').format(value as number)}
                labelStyle={{ color: '#a1a1aa' }}
                cursor={{ fill: '#27272a', opacity: 0.1 }}
              />
              <Bar 
                dataKey="views" 
                fill="#818cf8" 
                radius={[0, 4, 4, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}