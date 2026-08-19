/**
 * @file analyticsCalculations.ts
 * @description Calibrated YouTube revenue & engagement estimation utilities
 * for the unified YouTube Data API v3 view counting methodology.
 */

/**
 * Baseline RPM Constants (in USD)
 *
 * RATIONALE:
 * Under YouTube Data API v3, views reflect immediate playback start rather than the legacy
 * 30-second engagement threshold. Because gross start counts inflate top-line view numbers
 * without proportional increases in monetized ad impressions:
 * - Standard long-form baseline is calibrated down to $2.75 / 1k gross starts (from legacy $4.00+).
 * - Shorts baseline is anchored to $0.06 / 1k views to model the Shorts Creator Pool payout share.
 */
export const BASELINE_LONG_FORM_RPM = 2.75;
export const BASELINE_SHORTS_RPM = 0.06;

/**
 * Result structure returned by revenue calculation utilities.
 */
export interface RevenueProjection {
  /** Estimated total revenue amount in USD rounded to 2 decimal places */
  estimatedTotalRevenue: number;
  /** The effective RPM applied per 1,000 views */
  effectiveRpm: number;
  /** Contextual explanation of the baseline or override used */
  methodologyNote: string;
  /** Formatted USD string representation (e.g., "$1,234.56") */
  formattedRevenue: string;
}

/**
 * Engagement rate performance tiers calibrated for gross video start view counting.
 */
export type EngagementTier = "viral" | "high" | "healthy" | "low";

/**
 * Result structure returned by engagement calculation utilities.
 */
export interface EngagementMetrics {
  /** Calculated engagement rate percentage as a number rounded to 2 decimal places (e.g., 3.42) */
  rate: number;
  /** Formatted rate string with percentage symbol (e.g., "3.42%") */
  formattedRate: string;
  /** Categorized performance tier */
  tier: EngagementTier;
  /** Human-readable tier label */
  label: string;
  /** Tailwind CSS styling classes for background, text, and border */
  badgeColor: string;
}

/**
 * Shared USD currency formatter configured with 2-digit fixed precision.
 */
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Safely parses and sanitizes a numerical input to a finite, non-negative number.
 * Returns 0 if the value is NaN, negative, null, undefined, or non-finite.
 */
function sanitizeNonNegative(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, value);
}

/**
 * Calculates estimated YouTube creator earnings based on view counts and content format.
 *
 * @param totalViews - The total raw views recorded by the YouTube Data API v3.
 * @param isShortsOnly - Flag indicating if the view volume consists exclusively of YouTube Shorts. Defaults to `false`.
 * @param customRpm - Optional creator/niche-specific RPM override. When provided (>= 0), overrides default baselines.
 * @returns {RevenueProjection} Detailed projection containing revenue, effective RPM, and calculation metadata.
 *
 * @example
 * // Long-form standard calculation
 * calculateEstimatedRevenue(500_000);
 * // => { estimatedTotalRevenue: 1375.00, effectiveRpm: 2.75, formattedRevenue: "$1,375.00", ... }
 *
 * @example
 * // Shorts calculation
 * calculateEstimatedRevenue(2_500_000, true);
 * // => { estimatedTotalRevenue: 150.00, effectiveRpm: 0.06, formattedRevenue: "$150.00", ... }
 *
 * @example
 * // Custom RPM override (e.g., Finance / SaaS niche)
 * calculateEstimatedRevenue(100_000, false, 8.50);
 * // => { estimatedTotalRevenue: 850.00, effectiveRpm: 8.50, formattedRevenue: "$850.00", ... }
 */
export function calculateEstimatedRevenue(
  totalViews: number,
  isShortsOnly: boolean = false,
  customRpm?: number
): RevenueProjection {
  // 1. Sanitize raw views against NaN, negative numbers, and non-finite values
  const safeViews = sanitizeNonNegative(totalViews);

  // 2. Determine effective RPM and methodology note
  let effectiveRpm: number;
  let methodologyNote: string;

  const hasValidCustomRpm =
    typeof customRpm === "number" &&
    Number.isFinite(customRpm) &&
    !Number.isNaN(customRpm) &&
    customRpm >= 0;

  if (hasValidCustomRpm) {
    effectiveRpm = Math.round(customRpm * 100) / 100;
    methodologyNote = `Calculated using custom creator override of ${usdFormatter.format(
      effectiveRpm
    )} RPM per 1,000 views.`;
  } else if (isShortsOnly) {
    effectiveRpm = BASELINE_SHORTS_RPM;
    methodologyNote = `Calculated using calibrated YouTube Shorts baseline of ${usdFormatter.format(
      BASELINE_SHORTS_RPM
    )} RPM (calibrated for Shorts Creator Pool ad pool distribution).`;
  } else {
    effectiveRpm = BASELINE_LONG_FORM_RPM;
    methodologyNote = `Calculated using calibrated gross-starts baseline of ${usdFormatter.format(
      BASELINE_LONG_FORM_RPM
    )} RPM (calibrated for immediate video start tracking in YouTube Data API v3).`;
  }

  // 3. Compute revenue: (Views / 1,000) * RPM
  const rawRevenue = (safeViews / 1000) * effectiveRpm;

  // 4. Round to 2 decimal places using standard financial precision
  const estimatedTotalRevenue = Math.round((rawRevenue + Number.EPSILON) * 100) / 100;

  // 5. Format currency string
  const formattedRevenue = usdFormatter.format(estimatedTotalRevenue);

  return {
    estimatedTotalRevenue,
    effectiveRpm,
    methodologyNote,
    formattedRevenue,
  };
}

/**
 * Calculates audience engagement rate ((likes + comments) / views * 100)
 * calibrated for gross video start counting in YouTube Data API v3.
 *
 * Tiers:
 * - >= 5.0%: "Viral Engagement" (Emerald styling)
 * - >= 2.5%: "High Engagement" (Blue styling)
 * - >= 1.0%: "Healthy Engagement" (Amber styling)
 * - < 1.0%: "Low Engagement" (Rose styling)
 *
 * @param likes - Total like count recorded for the video/channel.
 * @param comments - Total comment count recorded for the video/channel.
 * @param views - Total gross views recorded by YouTube Data API v3.
 * @returns {EngagementMetrics} Calibrated engagement rate, tier, label, and Tailwind badge styling.
 *
 * @example
 * calculateEngagementRate(12000, 800, 250000);
 * // => { rate: 5.12, formattedRate: "5.12%", tier: "viral", label: "Viral Engagement", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
 */
export function calculateEngagementRate(
  likes: number,
  comments: number,
  views: number
): EngagementMetrics {
  const safeLikes = sanitizeNonNegative(likes);
  const safeComments = sanitizeNonNegative(comments);
  const safeViews = sanitizeNonNegative(views);

  if (safeViews === 0) {
    return {
      rate: 0,
      formattedRate: "0.00%",
      tier: "low",
      label: "Low Engagement",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
  }

  const rawRate = ((safeLikes + safeComments) / safeViews) * 100;
  const rate = Math.round((rawRate + Number.EPSILON) * 100) / 100;
  const formattedRate = `${rate.toFixed(2)}%`;

  let tier: EngagementTier;
  let label: string;
  let badgeColor: string;

  if (rate >= 5.0) {
    tier = "viral";
    label = "Viral Engagement";
    badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (rate >= 2.5) {
    tier = "high";
    label = "High Engagement";
    badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  } else if (rate >= 1.0) {
    tier = "healthy";
    label = "Healthy Engagement";
    badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else {
    tier = "low";
    label = "Low Engagement";
    badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
  }

  return {
    rate,
    formattedRate,
    tier,
    label,
    badgeColor,
  };
}
