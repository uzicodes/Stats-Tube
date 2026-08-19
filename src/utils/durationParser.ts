/**
 * @file durationParser.ts
 * @description ISO-8601 duration parser and YouTube Shorts classification utility.
 * Accommodates YouTube's policy update extending the maximum YouTube Shorts duration
 * to 3 minutes (180 seconds).
 */

/**
 * Maximum duration for a video to be classified as a YouTube Short (3 minutes / 180 seconds).
 */
export const MAX_SHORTS_DURATION_SECONDS = 180;

/**
 * Parses an ISO-8601 duration string (standard format used by YouTube Data API v3)
 * into the total duration in seconds.
 *
 * Supported formats:
 * - "PT15S" -> 15 seconds
 * - "PT2M30S" -> 150 seconds
 * - "PT3M" -> 180 seconds
 * - "PT1H15M30S" -> 4530 seconds
 * - "P1DT2H3M4S" -> 93784 seconds
 *
 * @param duration - Raw ISO-8601 duration string (e.g., "PT2M30S").
 * @returns Total duration in seconds, or 0 if invalid/empty.
 *
 * @example
 * parseIsoDurationToSeconds("PT2M30S"); // 150
 * parseIsoDurationToSeconds("PT45S");   // 45
 * parseIsoDurationToSeconds("PT1H");    // 3600
 * parseIsoDurationToSeconds("");        // 0
 */
export function parseIsoDurationToSeconds(duration: string | null | undefined): number {
  if (!duration || typeof duration !== "string") {
    return 0;
  }

  // ISO-8601 Regex supporting Days (D), Hours (H), Minutes (M), Seconds (S)
  const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i;
  const matches = duration.match(regex);

  if (!matches) {
    return 0;
  }

  const days = matches[1] ? parseInt(matches[1], 10) : 0;
  const hours = matches[2] ? parseInt(matches[2], 10) : 0;
  const minutes = matches[3] ? parseInt(matches[3], 10) : 0;
  const seconds = matches[4] ? parseInt(matches[4], 10) : 0;

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Determines whether a YouTube video is classified as a YouTube Short.
 * Calibrated for YouTube's extended 3-minute (180 seconds) Shorts format threshold.
 *
 * @param durationStr - Raw ISO-8601 duration string (e.g., from `video.contentDetails.duration`).
 * @returns `true` if the video duration is greater than 0 and <= 180 seconds, otherwise `false`.
 *
 * @example
 * isYouTubeShort("PT45S");   // true (45 seconds <= 180s)
 * isYouTubeShort("PT2M50S"); // true (170 seconds <= 180s)
 * isYouTubeShort("PT3M0S");  // true (180 seconds <= 180s)
 * isYouTubeShort("PT3M01S"); // false (181 seconds > 180s)
 * isYouTubeShort("PT15M");   // false (900 seconds > 180s)
 */
export function isYouTubeShort(durationStr: string | null | undefined): boolean {
  const durationSeconds = parseIsoDurationToSeconds(durationStr);
  return durationSeconds > 0 && durationSeconds <= MAX_SHORTS_DURATION_SECONDS;
}

/**
 * Formats an ISO-8601 duration string into human-readable MM:SS or H:MM:SS format.
 *
 * @param durationStr - Raw ISO-8601 duration string (e.g., "PT22M38S").
 * @returns Formatted time string (e.g. "22:38", "1:05:20", or "0:00").
 *
 * @example
 * formatDurationDisplay("PT45S");    // "0:45"
 * formatDurationDisplay("PT2M30S");  // "2:30"
 * formatDurationDisplay("PT1H5M3S"); // "1:05:03"
 */
export function formatDurationDisplay(durationStr: string | null | undefined): string {
  const totalSeconds = parseIsoDurationToSeconds(durationStr);
  if (totalSeconds <= 0) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
