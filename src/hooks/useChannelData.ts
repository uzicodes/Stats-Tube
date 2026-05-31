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
      // Fetch Channel Meta & Playlist ID
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

      // Fetch Playlist Items (200 target!)
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

        // If no nextPageToken? end
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

      // Fetch Batch Video Statistics 
      const batchSize = 50;
      const statsPromises = [];

      // queue up requests 
      for (let i = 0; i < allVideoIds.length; i += batchSize) {
        const batch = allVideoIds.slice(i, i + batchSize);
        const batchIdString = batch.join(',');

        statsPromises.push(
          fetch(`/api/youtube?action=stats&ids=${batchIdString}`).then(res => res.json())
        );
      }


      const statsResponses = await Promise.all(statsPromises);

      // combine in array format
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