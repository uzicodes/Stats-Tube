import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseChannelUrl(input: string): { type: 'handle' | 'channelId' | 'invalid'; value: string } {
  const trimmed = input.trim();

  //  Check channel ID 
  if (trimmed.startsWith('UC') && trimmed.length === 24) {
    return { type: 'channelId', value: trimmed };
  }

  // Check @handle format (Keep @ )
  if (trimmed.startsWith('@')) {
    return { type: 'handle', value: trimmed };
  }

  // Check YouTube URL formats
  const urlPatterns = [
    /youtube\.com\/@([^/?]+)/,         // Handle URL
    /youtube\.com\/channel\/([^/?]+)/, // Channel ID URL
    /youtube\.com\/c\/([^/?]+)/,       // Legacy URL format
  ];

  try {
    // parse as a URL
    const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const url = new URL(urlString);
    
    for (const pattern of urlPatterns) {
      const match = url.href.match(pattern);
      if (match && match[1]) {
        let value = match[1];
        
        // If extracted channel ID
        if (value.startsWith('UC') && value.length === 24) {
          return { type: 'channelId', value };
        }
        
        // If extracted handle, (ensure @)
        if (!value.startsWith('@')) {
          value = `@${value}`;
        }
        
        return { type: 'handle', value };
      }
    }
  } catch {
  }
  return { type: 'invalid', value: '' };
}