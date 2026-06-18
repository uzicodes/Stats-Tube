"use client";

import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell 
} from "recharts";
import { CustomTooltip, formatCompact } from "./CompareUtils";

export function CompareReachChart({ reachChartData }: { reachChartData: any[] }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full min-h-[300px]">
      <h3 className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-6 text-center">Reach Comparison</h3>
      <div className="grow w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reachChartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCompact} stroke="#22c55e" fontSize={12} tickLine={false} axisLine={false} />
            <RechartsTooltip cursor={{ fill: '#27272a', opacity: 0.4 }} content={<CustomTooltip />} />
            <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {reachChartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
