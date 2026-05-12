import { NextResponse } from 'next/server';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: { message: 'YouTube API key is missing from environment variables.' } }, { status: 500 });
  }

  try {
    let url = '';

    switch (action) {
      // Fetch channel info (handle/ID)
      case 'channel':
        const handle = searchParams.get('handle');
        const channelId = searchParams.get('channelId');
        
        if (handle) {
          // must include '@' when passed to API
          url = `${YOUTUBE_API_URL}/channels?part=snippet,statistics,contentDetails&forHandle=${handle}&key=${apiKey}`;
        } else if (channelId) {
          url = `${YOUTUBE_API_URL}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${apiKey}`;
        } else {
          return NextResponse.json({ error: { message: 'Must provide handle or channelId' } }, { status: 400 });
        }
        break;

      // Fetch list of videos from channel
      case 'videos':
        const playlistId = searchParams.get('playlistId');
        const pageToken = searchParams.get('pageToken') || '';
        const maxResults = searchParams.get('maxResults') || '50';
        
        if (!playlistId) {
          return NextResponse.json({ error: { message: 'Must provide playlistId' } }, { status: 400 });
        }
        url = `${YOUTUBE_API_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&pageToken=${pageToken}&key=${apiKey}`;
        break;

      // Fetch actual view/like stats of video IDs
      case 'stats':
        const ids = searchParams.get('ids');
        
        if (!ids) {
          return NextResponse.json({ error: { message: 'Must provide comma-separated video ids' } }, { status: 400 });
        }
        url = `${YOUTUBE_API_URL}/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${apiKey}`;
        break;

      default:
        return NextResponse.json({ error: { message: 'Invalid action parameter' } }, { status: 400 });
    }

    // Execute fetch
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('YouTube API Proxy Error:', error);
    return NextResponse.json({ error: { message: 'Internal Server Error fetching YouTube data' } }, { status: 500 });
  }
}