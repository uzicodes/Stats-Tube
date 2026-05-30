import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize the Redis client using the automatic environment variables
const redisClient = Redis.fromEnv();

// Create a sliding window rate limiter: 60 requests per 1 minute
export const ratelimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "@ratelimit/stats-tube",
});