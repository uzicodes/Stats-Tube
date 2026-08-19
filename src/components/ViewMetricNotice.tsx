"use client";

import { useState } from "react";
import { Info, X, Sparkles } from "lucide-react";

interface ViewMetricNoticeProps {
  /** Optional custom update date text (default: August 24, 2026) */
  effectiveDate?: string;
  /** Optional callback fired when the notice is dismissed */
  onDismiss?: () => void;
}

/**
 * ViewMetricNotice Component
 *
 * Informs creators and analysts about the YouTube Data API v3 view counting methodology
 * update (effective August 24, 2026) where views are recorded immediately at video start.
 */
export function ViewMetricNotice({
  effectiveDate = "August 24, 2026",
  onDismiss,
}: ViewMetricNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div
      role="alert"
      className="w-full mb-6 p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-100 backdrop-blur-md shadow-lg shadow-blue-950/20 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Icon & Text Content */}
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>

          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                YouTube API Methodology Notice
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Effective {effectiveDate}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed max-w-4xl">
              YouTube Data API v3 now counts gross views <strong>immediately at playback start</strong> rather
              than waiting for the legacy 30-second threshold. Because gross view counts are higher under this definition,
              raw engagement percentages may appear lower. <strong>Stats-Tube</strong> has automatically recalibrated
              all RPM revenue models and engagement tier benchmarks to keep your performance insights accurate.
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss view counting notice"
          className="p-1.5 rounded-lg text-blue-400/80 hover:text-blue-200 hover:bg-blue-500/20 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
