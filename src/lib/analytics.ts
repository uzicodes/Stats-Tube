// src/lib/analytics.ts

/**
 * Calculates standard engagement rate: (Likes + Comments) / Views
 */
export function calculateEngagementRate(likes: number, comments: number, views: number): number {
  if (views === 0) return 0;
  return ((likes + comments) / views) * 100;
}

/**
 * Calculates days between a published date string and today
 */
export function getDaysSince(dateString: string): number {
  const published = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - published.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates a proprietary 0-100 Performance Score.
 * * Score Breakdown (100 pts total):
 * - Views vs Channel Avg (40 pts)
 * - Engagement vs Channel Avg (35 pts)
 * - Recency Bonus (25 pts)
 */
export function calculatePerformanceScore(
  videoViews: number,
  channelAvgViews: number,
  videoEngagementRate: number,
  channelAvgEngagementRate: number,
  daysSincePublish: number
): number {
  
  // 1. View Score (up to 40 points)
  // We cap the ratio at 3x so one massive viral video doesn't break the math
  const viewRatio = channelAvgViews > 0 ? Math.min(videoViews / channelAvgViews, 3) : 1;
  const viewScore = (viewRatio / 3) * 40;

  // 2. Engagement Score (up to 35 points)
  const engRatio = channelAvgEngagementRate > 0 ? Math.min(videoEngagementRate / channelAvgEngagementRate, 3) : 1;
  const engScore = (engRatio / 3) * 35;

  // 3. Recency Bonus (up to 25 points)
  // Rewards videos that are getting traffic quickly
  let recencyScore = 0;
  if (daysSincePublish <= 7) recencyScore = 25;
  else if (daysSincePublish <= 30) recencyScore = 15;
  else if (daysSincePublish <= 90) recencyScore = 8;

  // Combine and round to a clean integer (0-100)
  const totalScore = Math.round(viewScore + engScore + recencyScore);
  
  // Ensure it never somehow drops below 0 or exceeds 100
  return Math.min(Math.max(totalScore, 0), 100);
}