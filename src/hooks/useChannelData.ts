import { useState } from 'react';

// We will define strict types later, but using 'any' temporarily to get the engine running
export function useChannelData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [videosData, setVideosData] = useState<any[] | null>(null);

  const fetchChannelData = async (type: 'handle' | 'channelId', value: string) => {
    setLoading(true);
    setError(null);
    setChannelData(null);
    setVideosData(null);

    try {
      // 1. Fetch Channel Meta & Playlist ID
      const channelRes = await fetch(`/api/youtube?action=channel&${type}=${encodeURIComponent(value)}`);
      const channelJson = await channelRes.json();

      if (!channelRes.ok || !channelJson.items || channelJson.items.length === 0) {
        throw new Error(channelJson.error?.message || "Channel not found. Please check the URL.");
      }

      const channel = channelJson.items[0];
      setChannelData(channel);

      const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsPlaylistId) {
        throw new Error("Could not find uploads playlist for this channel.");
      }

      // 2. Fetch Playlist Items (Recent Videos) - with pagination
      let allVideoIds: string[] = [];
      let pageToken = '';
      let totalFetched = 0;
      const targetVideos = 200;

      while (totalFetched < targetVideos) {
        const url = `/api/youtube?action=videos&playlistId=${uploadsPlaylistId}&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ''}`;
        const playlistRes = await fetch(url);
        const playlistJson = await playlistRes.json();

        if (!playlistRes.ok || !playlistJson.items) {
          throw new Error("Failed to fetch videos from the channel.");
        }

        const videoIds = playlistJson.items.map((item: any) => item.contentDetails.videoId);
        allVideoIds = [...allVideoIds, ...videoIds];
        totalFetched += videoIds.length;

        // If there's no nextPageToken, we've reached the end
        if (!playlistJson.nextPageToken) {
          break;
        }
        pageToken = playlistJson.nextPageToken;
      }

      const videoIdString = allVideoIds.join(',');

      if (!videoIdString) {
        setVideosData([]); // Channel has no videos
        setLoading(false);
        return;
      }

      // 3. Fetch Batch Video Statistics (YouTube API limit is 50 IDs per request)
      const allStats: any[] = [];
      const batchSize = 50;

      for (let i = 0; i < allVideoIds.length; i += batchSize) {
        const batch = allVideoIds.slice(i, i + batchSize);
        const batchIdString = batch.join(',');
        
        const statsRes = await fetch(`/api/youtube?action=stats&ids=${batchIdString}`);
        const statsJson = await statsRes.json();

        if (!statsRes.ok || !statsJson.items) {
          throw new Error("Failed to fetch statistics for the videos.");
        }

        allStats.push(...statsJson.items);
      }

      setVideosData(allStats);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    channelData,
    videosData,
    fetchChannelData
  };
}