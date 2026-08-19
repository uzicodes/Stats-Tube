/**
 * @file hitRateNormalization.ts
 * @description Date-aware YouTube view count normalization utility for Hit Rate and
 * performance benchmark calculations, adjusting for YouTube's August 24, 2026
 * 0-second playback start view counting methodology.
 */

/**
 * The effective timestamp when YouTube Data API v3 switched to 0-second video start counting.
 */
export const YOUTUBE_API_SHIFT_DATE = "2026-08-24T00:00:00Z";

/**
 * Normalization deflation factor applied to post-shift views (0.8 = 20% deflation
 * to calibrate against legacy 30-second historical averages).
 */
export const POST_SHIFT_NORMALIZATION_FACTOR = 0.8;

/**
 * Result structure returned by calculateNormalizedHitRate.
 */
export interface NormalizedHitRateResult {
  /** True if the normalized view count exceeds the historical channel average */
  isHit: boolean;
  /** Ratio of normalized views compared to historical average (e.g. 1.25 for 25% above average) */
  performanceRatio: number;
  /** The effective view count used after date-based normalization */
  normalizedViewsUsed: number;
}

/**
 * Safely sanitizes numeric inputs to non-negative finite numbers.
 */
function sanitizeNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, value);
}

/**
 * Determines whether a video's publication date falls on or after the YouTube API view counting shift.
 *
 * @param publishedAt - ISO date string, Date object, or unix timestamp.
 * @returns `true` if the video was published on or after August 24, 2026 UTC.
 */
export function isPostApiShiftDate(publishedAt: string | Date | number | null | undefined): boolean {
  if (!publishedAt) return false;
  const pubTime = new Date(publishedAt).getTime();
  if (Number.isNaN(pubTime)) return false;

  const shiftTime = new Date(YOUTUBE_API_SHIFT_DATE).getTime();
  return pubTime >= shiftTime;
}

/**
 * Calculates whether a video qualifies as a channel "Hit" by normalizing
 * gross view counts for videos published on or after the August 24, 2026 API methodology change.
 *
 * @param videoViews - The raw view count recorded by YouTube Data API v3.
 * @param publishedAt - The publication date of the video (ISO string, Date, or timestamp).
 * @param historicalAverage - The channel's average view count baseline.
 * @returns {NormalizedHitRateResult} Hit status, performance ratio, and normalized views.
 *
 * @example
 * // Pre-shift video: raw 120,000 views vs 100,000 avg => 1.20x (Hit)
 * calculateNormalizedHitRate(120_000, "2026-05-10T12:00:00Z", 100_000);
 * // => { isHit: true, performanceRatio: 1.2, normalizedViewsUsed: 120000 }
 *
 * @example
 * // Post-shift video: raw 120,000 views * 0.8 = 96,000 normalized vs 100,000 avg => 0.96x (Not Hit)
 * calculateNormalizedHitRate(120_000, "2026-09-01T12:00:00Z", 100_000);
 * // => { isHit: false, performanceRatio: 0.96, normalizedViewsUsed: 96000 }
 */
export function calculateNormalizedHitRate(
  videoViews: number,
  publishedAt: string | Date | number | null | undefined,
  historicalAverage: number
): NormalizedHitRateResult {
  const safeViews = sanitizeNumber(videoViews);
  const safeAverage = sanitizeNumber(historicalAverage);

  const isPostShift = isPostApiShiftDate(publishedAt);
  const normalizedViewsUsed = isPostShift
    ? Math.round((safeViews * POST_SHIFT_NORMALIZATION_FACTOR + Number.EPSILON) * 100) / 100
    : safeViews;

  if (safeAverage <= 0) {
    const isHit = normalizedViewsUsed > 0;
    return {
      isHit,
      performanceRatio: isHit ? 1.0 : 0.0,
      normalizedViewsUsed,
    };
  }

  const rawRatio = normalizedViewsUsed / safeAverage;
  const performanceRatio = Math.round((rawRatio + Number.EPSILON) * 100) / 100;
  const isHit = normalizedViewsUsed > safeAverage;

  return {
    isHit,
    performanceRatio,
    normalizedViewsUsed,
  };
}
