export const formatCompact = (num: number | string) => {
  const parsed = Number(num);
  if (parsed >= 1000000) return (parsed / 1000000).toFixed(1) + ' M';
  if (parsed >= 1000) return (parsed / 1000).toFixed(1) + ' K';
  return parsed.toString();
};

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl min-w-[150px]">
        <p className="text-zinc-400 font-medium text-xs mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={entry.name || index} className="flex justify-between items-center gap-4 mb-1">
            <span style={{ color: entry.color }} className="font-semibold text-sm line-clamp-1">{entry.name}</span>
            <span className="text-zinc-100 font-bold text-sm">{formatCompact(Number(entry.value))}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
