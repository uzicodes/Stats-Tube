"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });

interface TrendsChartsProps {
  videosData: any[];
}

import { 
  interpolateColor, 
  formatYAxis, 
  CustomViewTooltip, 
  CustomEngTooltip, 
  CustomTopVideosTooltip, 
  CustomMomentumTooltip 
} from "./TrendsChartsUtils";
export function TrendsCharts({ videosData }: TrendsChartsProps) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process and reverse data so oldest is on the left, newest on the right
  // Limit to latest 50 videos to keep charts clean and readable
  const chartData = useMemo(() => {
    if (!videosData) return [];
    
    return videosData
      .slice(0, 50) // Take only the latest 50 videos for cleaner charts
      .map((video) => {
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

  // Process data for View Momentum chart (10 most recent, chronological)
  const momentumData = useMemo(() => {
    if (!videosData) return [];
    
    return videosData
      .slice(0, 10)
      .reverse()
      .map((video, i) => ({
        name: `Video -${9 - i}`,
        views: parseInt(video.statistics?.viewCount) || 0,
        title: video.snippet?.title || "Video",
      }));
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
          shortTitle: title.length > (isMobile ? 15 : 45) ? title.substring(0, isMobile ? 15 : 45) + "..." : title,
          views: views,
          date: new Date(video.snippet?.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10); // Take the top 10 videos
  }, [videosData, isMobile]);



  if (!videosData || videosData.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      
      {/* VIEW TREND CHART */}
      <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col">
        <h3 className="text-xs font-bold tracking-widest text-[#F16AAD] uppercase mb-6 text-center">View Trend — Latest 50</h3>
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
        <h3 className="text-xs font-bold tracking-widest text-[#F16AAD] uppercase mb-6 text-center">Engagement By Video</h3>
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
        <h3 className="text-xs font-bold tracking-widest text-[#F16AAD] uppercase mb-6 text-center">Top Videos by Views</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topVideosData} 
              layout="vertical"
              margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 100 : 250, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                type="number" 
                tickFormatter={formatYAxis} 
                stroke="#52525b" 
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#fbbf24' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                dataKey="shortTitle" 
                type="category" 
                width={isMobile ? 90 : 240}
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#a1a1aa' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                content={<CustomTopVideosTooltip />}
                cursor={{ fill: '#27272a', opacity: 0.1 }}
              />
              <Bar 
                dataKey="views" 
                radius={[0, 4, 4, 0]}
                barSize={16}
              >
                {topVideosData.map((entry, index) => {
                  const maxViews = Math.max(...topVideosData.map(v => v.views));
                  const minViews = Math.min(...topVideosData.map(v => v.views));
                  const range = maxViews - minViews || 1;
                  const normalized = (entry.views - minViews) / range; // 0 to 1
                  
                  // Color interpolation between 3 colors
                  // Lowest: #9AB8EF, Middle: #729CE9, Highest: #497EE3
                  const colors = ['#9AB8EF', '#729CE9', '#497EE3'];
                  
                  let color: string;
                  if (normalized < 0.5) {
                    // Interpolate between color 0 and 1
                    const t = normalized * 2; // 0 to 1
                    const c1 = colors[0];
                    const c2 = colors[1];
                    color = interpolateColor(c1, c2, t);
                  } else {
                    // Interpolate between color 1 and 2
                    const t = (normalized - 0.5) * 2; // 0 to 1
                    const c1 = colors[1];
                    const c2 = colors[2];
                    color = interpolateColor(c1, c2, t);
                  }
                  
                  return <Cell key={`cell-${entry.title || index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* VIEW MOMENTUM CHART */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col lg:col-span-2">
        <h3 className="text-xs font-bold tracking-widest text-[#F16AAD] uppercase mb-6 text-center">View Momentum</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={momentumData} margin={{ top: 5, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                dataKey="name" 
                stroke="#52525b" 
                tick={{ fontSize: 12, fill: '#a1a1aa' }} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                stroke="#52525b" 
                tick={{ fontSize: 12, fill: '#fbbf24' }} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip content={<CustomMomentumTooltip />} cursor={{ stroke: '#27272a', strokeWidth: 1 }} />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#34d399" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#10b981", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}