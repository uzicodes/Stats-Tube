"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactCountryFlag from "react-country-flag";

interface ChannelHeaderProps {
  channel: any; 
  onBack?: () => void;
}

export function ChannelHeader({ channel, onBack }: ChannelHeaderProps) {
  const snippet = channel.snippet;
  const stats = channel.statistics;
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const isScrollingToRef = useRef<string | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // ── Scroll-spy: determine which section is active based on scroll position ──
  useEffect(() => {
    const SECTIONS = [
      { id: "overview", name: "Overview" },
      { id: "trends",   name: "Trends" },
      { id: "content",  name: "Content" },
      { id: "compare",  name: "Compare" },
    ];

    const getActiveSection = (): string => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // ① At the bottom of the page → always activate the last section
      if (scrollY + windowHeight >= docHeight - 100) {
        return SECTIONS[SECTIONS.length - 1].name;
      }

      // ② At the very top → always Overview
      if (scrollY < 10) {
        return "Overview";
      }

      // ③ Walk forward through sections. Keep updating `active` for every
      //    section whose top has scrolled past the trigger line. The last
      //    one that qualifies is the deepest section currently in view.
      //    Using absolute document coordinates (scrollY + rect.top) is
      //    stable regardless of scroll timing or animation state.
      const triggerLine = scrollY + 130; // 130px below the viewport top
      let active = "Overview";

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        // Absolute Y position of this section's top in the document
        const sectionTop = el.getBoundingClientRect().top + scrollY;
        if (sectionTop <= triggerLine) {
          active = section.name;
        } else {
          break; // sections are in DOM order, no need to check further
        }
      }

      return active;
    };

    const handleScroll = () => {
      // While a button-click scroll is in progress, don't override the tab
      if (isScrollingToRef.current) return;
      setActiveTab(getActiveSection());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Format numbers (1,500,000 -> 1.5M)
  const formatCompact = (num: string | number) => {
    return Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(Number(num));
  };

  // channel creation date (month, year)
  const getChannelCreatedDate = () => {
    const date = new Date(snippet.publishedAt);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Calculate milestone & progress
  const getMilestoneData = (subs: number) => {
    let nextMilestone = 1000;
    if (subs >= 100000000) nextMilestone = Math.ceil(subs / 10000000) * 10000000; // 10M increments
    else if (subs >= 10000000) nextMilestone = Math.ceil(subs / 1000000) * 1000000; // 1M increments
    else if (subs >= 1000000) nextMilestone = Math.ceil(subs / 500000) * 500000; // 500K increments
    else if (subs >= 100000) nextMilestone = Math.ceil(subs / 100000) * 100000; // 100K increments
    else if (subs >= 10000) nextMilestone = Math.ceil(subs / 10000) * 10000; // 10K increments
    
    const prevMilestone = nextMilestone > 100000000 ? nextMilestone - 10000000 : 
                          nextMilestone > 10000000 ? nextMilestone - 1000000 : 
                          nextMilestone > 1000000 ? nextMilestone - 500000 : 
                          nextMilestone > 100000 ? nextMilestone - 100000 : 0;
                          
    const progress = Math.min(100, Math.max(0, ((subs - prevMilestone) / (nextMilestone - prevMilestone)) * 100));
    
    return { nextMilestone, progress };
  };

  // Determine Creator Tier
  const getCreatorTier = (subs: number) => {
    if (subs >= 50000000) return { label: "Elite Creator", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
    if (subs >= 10000000) return { label: "Diamond Tier", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" };
    if (subs >= 1000000) return { label: "Gold Tier", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" };
    if (subs >= 100000) return { label: "Silver Tier", color: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10" };
    return { label: "Emerging", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
  };

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return countryCode;
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  // ── Navigate to a section on button click ──
  const scrollToSection = (sectionId: string) => {
    const name = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    setActiveTab(name);

    // Lock the scroll-spy so it doesn't override the tab during smooth scroll
    isScrollingToRef.current = name;

    // Overview = scroll to page top; others = scroll to their section anchor
    if (sectionId.toLowerCase() === "overview") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId.toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    // Detect when smooth scroll finishes: wait for 150ms of scroll silence.
    // This is more reliable than a fixed timeout since smooth scroll
    // duration varies across browsers and distances.
    const unlockAfterIdle = () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(() => {
        window.removeEventListener("scroll", unlockAfterIdle);
        isScrollingToRef.current = null;
      }, 150);
    };
    window.addEventListener("scroll", unlockAfterIdle, { passive: true });

    // Hard fallback: unlock after 2s no matter what
    setTimeout(() => {
      window.removeEventListener("scroll", unlockAfterIdle);
      isScrollingToRef.current = null;
    }, 2000);
  };

  return (
    <>
      {/* Top Navigation Row (Sticky) */}
      <div className="sticky top-0 z-50 pt-4 pb-4 mb-4 bg-zinc-950/95 backdrop-blur-xl transition-all flex items-center justify-between w-full">
        {/* Back Button */}
        <button onClick={handleBackClick} className="inline-flex items-center gap-1 sm:gap-2 text-zinc-400 hover:text-green-400 transition-colors bg-none border-none cursor-pointer shrink-0 pr-2">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs sm:text-sm hidden sm:inline">Back to Home</span>
          <span className="text-xs sm:hidden">Back</span>
        </button>

        {/* Tab Buttons - Scaled for Mobile */}
        <div className="flex flex-nowrap sm:flex-wrap justify-end gap-1 sm:gap-3 items-center overflow-x-auto no-scrollbar">
          <button 
            onClick={() => scrollToSection("overview")}
            className={`px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-sm border rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "Overview" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => scrollToSection("trends")}
            className={`px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-sm border rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "Trends" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Trends
          </button>
          <button 
            onClick={() => scrollToSection("content")}
            className={`px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-sm border rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "Content" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Content
          </button>
          <button 
            onClick={() => scrollToSection("compare")}
            className={`px-2 py-1 text-[11px] sm:px-3 sm:py-1.5 sm:text-sm border rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "Compare" 
                ? "text-amber-400 border-amber-400" 
                : "text-zinc-300 border-zinc-600 hover:border-zinc-400 hover:text-zinc-100"
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Main Channel Card (Static, scrolls away) */}
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative z-10 p-5 sm:p-6 shadow-2xl">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
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
            <p className="text-zinc-400 text-sm mb-3 sm:mb-4">{snippet.customUrl}</p>
            <p className="text-zinc-400 text-sm max-w-2xl line-clamp-3 sm:line-clamp-2 px-2 sm:px-0">
              {snippet.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* (Milestones & Identity) */}
        <div className="flex flex-col xl:flex-row items-center xl:items-center justify-between gap-6 mt-6 sm:mt-4 pt-6 sm:pt-4 border-t border-zinc-800/50">
          
          {/* Core Stats Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full xl:w-auto">
            {/* Stats Box - Now stretches full width on mobile */}
            <div className="flex justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-6 px-4 sm:px-5 py-3 sm:py-4 bg-zinc-800/40 border border-zinc-700/50 rounded-xl">
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-blue-400">Subs</span>
                <span className="text-base sm:text-lg font-bold text-zinc-100">{formatCompact(stats.subscriberCount)}</span>
              </div>
              <div className="w-px bg-zinc-700/50 hidden sm:block"></div>
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-blue-400">Views</span>
                <span className="text-base sm:text-lg font-bold text-zinc-100">{formatCompact(stats.viewCount)}</span>
              </div>
              <div className="w-px bg-zinc-700/50 hidden sm:block"></div>
              <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-blue-400">Videos</span>
                <span className="text-base sm:text-lg font-bold text-zinc-100">{formatCompact(stats.videoCount)}</span>
              </div>
            </div>
          </div>
          
          {/* Tier Badge - Positioned to the right */}
          {(() => {
            const tier = getCreatorTier(parseInt(stats.subscriberCount) || 0);
            return (
              <div className={`px-3 py-1.5 rounded-lg border text-[11px] sm:text-xs font-bold uppercase tracking-wider ${tier.color}`}>
                {tier.label}
              </div>
            );
          })()}
          
          {/* Context & Milestones */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 w-full xl:w-auto bg-zinc-900/40 p-4 sm:p-3 rounded-xl border border-zinc-800/80">
            
            {/* Channel Created */}
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Established</span>
              <span className="text-sm font-medium text-zinc-200">{getChannelCreatedDate()}</span>
            </div>

            {/* Country */}
            {snippet.country && (
              <>
                <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Location</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ReactCountryFlag 
                      countryCode={snippet.country} 
                      svg 
                      style={{
                        width: '1.25em',
                        height: '1.25em',
                        borderRadius: '2px'
                      }}
                      title={snippet.country}
                    />
                    <span className="text-sm font-medium text-zinc-200">{snippet.country}</span>
                  </div>
                </div>
              </>
            )}

            <div className="w-full sm:w-px sm:h-8 bg-zinc-800/50 h-px block sm:block my-2 sm:my-0"></div>

            {/* Milestone Tracker */}
            {(() => {
              const { nextMilestone, progress } = getMilestoneData(parseInt(stats.subscriberCount) || 0);
              return (
                <div className="flex flex-col w-full sm:w-48">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Next Milestone</span>
                    <span className="text-xs font-bold text-zinc-500">{formatCompact(nextMilestone)}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-linear-to-r from-green-900 to-green-400 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>
    </>
  );
}