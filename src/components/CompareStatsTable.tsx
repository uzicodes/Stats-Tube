import Image from "next/image";
import { Crown } from "lucide-react";

const formatCompact = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + ' M';
  if (num >= 1000) return (num / 1000).toFixed(1) + ' K';
  return num.toString();
};

interface CompareStatsTableProps {
  baseChannel: any;
  compChannel: any;
  baseWins: boolean;
  compWins: boolean;
  baseAvgViews: number;
  compAvgViews: number;
  baseEng: number;
  compEng: number;
  baseVelocity: number;
  compVelocity: number;
  baseShortsPct: number;
  compShortsPct: number;
}

export function CompareStatsTable({
  baseChannel,
  compChannel,
  baseWins,
  compWins,
  baseAvgViews,
  compAvgViews,
  baseEng,
  compEng,
  baseVelocity,
  compVelocity,
  baseShortsPct,
  compShortsPct
}: CompareStatsTableProps) {
  return (
    <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
      {/* Header Row */}
      <div className="grid grid-cols-3 p-4 border-b border-zinc-800 bg-zinc-900/60 items-center">
        {/* Base Channel Profile */}
        <div className="flex flex-col items-center text-center relative">
          {baseWins && <Crown className="absolute -top-4 text-yellow-400 w-5 h-5 drop-shadow-md animate-in zoom-in" />}
          <Image src={baseChannel.snippet.thumbnails.high.url} alt="Base" width={48} height={48} className="rounded-full mb-2 border-2 border-indigo-500" />
          <span className="font-bold text-sm text-zinc-100 line-clamp-1">{baseChannel.snippet.title}</span>
        </div>

        <div className="flex justify-center items-center">
          <div className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-bold uppercase tracking-widest">VS</div>
        </div>

        {/* Comp Channel Profile */}
        <div className="flex flex-col items-center text-center relative">
          {compWins && <Crown className="absolute -top-4 text-yellow-400 w-5 h-5 drop-shadow-md animate-in zoom-in" />}
          <Image src={compChannel.snippet.thumbnails.high.url} alt="Comp" width={48} height={48} className="rounded-full mb-2 border-2 border-rose-500" />
          <span className="font-bold text-sm text-zinc-100 line-clamp-1">{compChannel.snippet.title}</span>
        </div>
      </div>

      {/* Metric Rows */}
      <div className="flex flex-col divide-y divide-zinc-800/50 p-4">
        <div className="grid grid-cols-3 py-3 items-center">
          <div className={`text-center font-bold text-lg ${parseInt(baseChannel.statistics.subscriberCount) > parseInt(compChannel.statistics.subscriberCount) ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {formatCompact(parseInt(baseChannel.statistics.subscriberCount))}
          </div>
          <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Subscribers</div>
          <div className={`text-center font-bold text-lg ${parseInt(compChannel.statistics.subscriberCount) > parseInt(baseChannel.statistics.subscriberCount) ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {formatCompact(parseInt(compChannel.statistics.subscriberCount))}
          </div>
        </div>

        <div className="grid grid-cols-3 py-3 items-center">
          <div className={`text-center font-bold text-lg ${baseAvgViews > compAvgViews ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {formatCompact(baseAvgViews)}
          </div>
          <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Avg Views</div>
          <div className={`text-center font-bold text-lg ${compAvgViews > baseAvgViews ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {formatCompact(compAvgViews)}
          </div>
        </div>

        <div className="grid grid-cols-3 py-3 items-center">
          <div className={`text-center font-bold text-lg ${baseEng > compEng ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {baseEng.toFixed(2)}%
          </div>
          <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Engagement</div>
          <div className={`text-center font-bold text-lg ${compEng > baseEng ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {compEng.toFixed(2)}%
          </div>
        </div>

        <div className="grid grid-cols-3 py-3 items-center">
          <div className={`text-center font-bold text-lg ${baseVelocity < compVelocity ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {baseVelocity.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">d</span>
          </div>
          <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Upload Pace</div>
          <div className={`text-center font-bold text-lg ${compVelocity < baseVelocity ? 'text-emerald-400' : 'text-zinc-300'}`}>
            {compVelocity.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">d</span>
          </div>
        </div>

        <div className="grid grid-cols-3 py-3 items-center">
          <div className="text-center font-bold text-lg text-indigo-400">
            {baseShortsPct.toFixed(0)}% <span className="text-xs text-zinc-500 font-normal">Shorts</span>
          </div>
          <div className="text-center text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Content Strategy</div>
          <div className="text-center font-bold text-lg text-rose-400">
            {compShortsPct.toFixed(0)}% <span className="text-xs text-zinc-500 font-normal">Shorts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
