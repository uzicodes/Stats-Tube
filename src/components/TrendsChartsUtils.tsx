export const interpolateColor = (color1: string, color2: string, t: number): string => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const formatYAxis = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(0)} M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} K`;
  return num.toString();
};

export const CustomViewTooltip = ({ active, payload }: any) => {
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

export const CustomEngTooltip = ({ active, payload }: any) => {
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

export const CustomTopVideosTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl max-w-sm">
        <p className="text-zinc-100 font-medium text-sm line-clamp-2 mb-2">{payload[0].payload.title}</p>
        <p className="text-emerald-400 font-bold">
          {Intl.NumberFormat('en-US').format(payload[0].value)} Views
        </p>
      </div>
    );
  }
  return null;
};

export const CustomMomentumTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl max-w-sm">
        <p className="text-zinc-400 font-medium text-xs mb-1">{label}</p>
        <p className="text-zinc-100 font-medium text-sm line-clamp-2 mb-2">{payload[0].payload.title}</p>
        <p className="text-[#34d399] font-bold">
          {formatYAxis(payload[0].value)} Views
        </p>
      </div>
    );
  }
  return null;
};
