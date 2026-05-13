"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseChannelUrl } from "@/lib/utils";

interface SearchInputProps {
  onAnalyze: (type: 'handle' | 'channelId', value: string) => void;
  isLoading: boolean;
}

export function SearchInput({ onAnalyze, isLoading }: SearchInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url) return;

    const parsed = parseChannelUrl(url);

    if (parsed.type === 'invalid') {
      setError("Please enter a valid YouTube channel URL or @handle.");
      return;
    }

    // Pass the parsed data back up to the parent component
    onAnalyze(parsed.type, parsed.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube channel URL or @handle..."
          className="h-14 pl-10 pr-24 text-lg bg-zinc-950 border-zinc-800 rounded-full shadow-sm focus-visible:ring-zinc-700"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !url}
          className="absolute right-1.5 h-11 rounded-full px-6 bg-zinc-100 text-zinc-900 hover:bg-green-500 hover:text-white"
        >
          {isLoading ? "Scanning..." : "Analyze"}
        </Button>
      </form>
      {error && <p className="text-sm text-red-500 px-4 text-left">{error}</p>}
    </div>
  );
}