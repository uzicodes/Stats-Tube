import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChannelHeaderProps {
  channel: any; // We'll type this strictly later
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const snippet = channel.snippet;
  const stats = channel.statistics;
  
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

  return (
    <>
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Home</span>
      </Link>

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

        {/* Stats Row with Channel Creation Date */}
        <div className="flex items-center gap-12 mt-8">
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
      </div>
    </>
  );
}