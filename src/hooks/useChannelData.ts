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

      // 2. Fetch Playlist Items (Recent Videos)
      const playlistRes = await fetch(`/api/youtube?action=videos&playlistId=${uploadsPlaylistId}&maxResults=50`);
      const playlistJson = await playlistRes.json();

      if (!playlistRes.ok || !playlistJson.items) {
        throw new Error("Failed to fetch videos from the channel.");
      }

      const videoIds = playlistJson.items.map((item: any) => item.contentDetails.videoId).join(',');

      if (!videoIds) {
        setVideosData([]); // Channel has no videos
        setLoading(false);
        return;
      }

      // 3. Fetch Batch Video Statistics
      const statsRes = await fetch(`/api/youtube?action=stats&ids=${videoIds}`);
      const statsJson = await statsRes.json();

      if (!statsRes.ok || !statsJson.items) {
        throw new Error("Failed to fetch statistics for the videos.");
      }

      setVideosData(statsJson.items);

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