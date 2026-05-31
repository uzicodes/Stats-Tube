import { useState } from 'react';

// We will define strict types later, but using 'any' temporarily to get the engine running
export function useChannelData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [videosData, setVideosData] = useState<any[] | null>(null);

  const fetchChannelData = async (type: 'handle' | 'channelId', value: string): Promise<boolean> => {
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

      // 2. Fetch Playlist Items (Restored to your original 200 target!)
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
        return true;
      }

      // 3. Fetch Batch Video Statistics (Concurrent fetch for maximum speed)
      const batchSize = 50;
      const statsPromises = [];

      // We queue up the requests instead of waiting for them one by one
      for (let i = 0; i < allVideoIds.length; i += batchSize) {
        const batch = allVideoIds.slice(i, i + batchSize);
        const batchIdString = batch.join(',');

        statsPromises.push(
          fetch(`/api/youtube?action=stats&ids=${batchIdString}`).then(res => res.json())
        );
      }

      // Fire all stats requests to YouTube simultaneously!
      const statsResponses = await Promise.all(statsPromises);

      // Combine the fast results back into your original array format
      const allStats: any[] = [];
      for (const statsJson of statsResponses) {
        if (statsJson.items) {
          allStats.push(...statsJson.items);
        }
      }

      setVideosData(allStats);
      return true;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while fetching data.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setChannelData(null);
    setVideosData(null);
  };

  return {
    loading,
    error,
    channelData,
    videosData,
    fetchChannelData,
    resetState
  };
}