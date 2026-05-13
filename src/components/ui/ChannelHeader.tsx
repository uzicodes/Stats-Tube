import Image from "next/image";

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

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative z-10">
      {/* Banner Image */}
      <div className="h-32 sm:h-48 w-full bg-zinc-800 relative">
        {channel.brandingSettings?.image?.bannerExternalUrl ? (
          <Image
            src={channel.brandingSettings.image.bannerExternalUrl}
            alt="Channel Banner"
            fill
            className="object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-zinc-800 to-zinc-900" />
        )}
      </div>

      {/* Profile Section */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-4">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden shrink-0">
            <Image
              src={snippet.thumbnails.high.url}
              alt={snippet.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="text-center sm:text-left flex-grow pb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">{snippet.title}</h1>
            <p className="text-zinc-400">{snippet.customUrl}</p>
          </div>

          <div className="flex gap-4 sm:gap-8 pb-2">
            <div className="text-center sm:text-left">
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Subscribers</p>
              <p className="text-xl font-bold text-zinc-100">{formatCompact(stats.subscriberCount)}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Total Views</p>
              <p className="text-xl font-bold text-zinc-100">{formatCompact(stats.viewCount)}</p>
            </div>
          </div>
        </div>
        
        <p className="text-zinc-400 text-sm max-w-3xl mt-4 line-clamp-2">
          {snippet.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}