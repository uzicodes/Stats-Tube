"use client";

import dynamic from "next/dynamic";
import { CustomTooltip, formatCompact } from "./CompareUtils";

const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const RechartsTooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false });

export function CompareMomentumChart({ 
  momentumData, 
  baseChannelTitle, 
  compChannelTitle 
}: { 
  momentumData: any[], 
  baseChannelTitle: string, 
  compChannelTitle: string 
}) {
  return (
    <div className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col h-[350px]">
      <div className="flex flex-col mb-4">
        <h3 className="text-xs font-bold tracking-widest text-amber-500 uppercase">View Momentum</h3>
        <p className="text-zinc-500 text-xs">Chronological view count for their 10 most recent uploads.</p>
      </div>

      <div className="grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={momentumData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCompact} stroke="#22c55e" fontSize={10} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            <Line
              type="monotone"
              name={baseChannelTitle}
              dataKey="baseViews"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              name={compChannelTitle}
              dataKey="compViews"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#fb7185", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
