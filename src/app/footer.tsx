"use client";

import { Star, Mail } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1 4.98 2.12 4.98 3.5ZM.2 8.25H4.8V24H.2V8.25ZM8.14 8.25h4.41v2.15h.06c.61-1.16 2.11-2.38 4.35-2.38 4.65 0 5.51 3.06 5.51 7.05V24h-4.59v-7.38c0-1.76-.03-4.03-2.45-4.03-2.45 0-2.82 1.91-2.82 3.9V24H8.14V8.25Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.73.5.75 5.58.75 11.93c0 5.07 3.29 9.37 7.86 10.89.58.11.79-.25.79-.56v-2.1c-3.2.72-3.87-1.36-3.87-1.36-.53-1.38-1.31-1.75-1.31-1.75-1.07-.75.08-.73.08-.73 1.18.08 1.8 1.24 1.8 1.24 1.05 1.83 2.76 1.3 3.43.99.11-.78.41-1.31.74-1.61-2.56-.3-5.25-1.31-5.25-5.84 0-1.29.45-2.34 1.2-3.17-.12-.3-.52-1.5.11-3.12 0 0 .98-.32 3.21 1.21a10.91 10.91 0 0 1 5.84 0c2.23-1.53 3.2-1.21 3.2-1.21.64 1.62.24 2.82.12 3.12.75.83 1.2 1.88 1.2 3.17 0 4.54-2.69 5.54-5.25 5.83.42.37.81 1.09.81 2.2v3.27c0 .31.2.68.8.56 4.57-1.52 7.86-5.82 7.86-10.89C23.25 5.58 18.27.5 12 .5Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 sm:px-8 border-t border-zinc-900/50 bg-zinc-950/50 backdrop-blur-sm z-30 relative">
      <div className="flex items-center justify-center w-full relative">
        <div className="absolute left-0 flex items-center gap-4 pl-4 sm:pl-0">
          <a 
            href="mailto:utshozi11@gmail.com" 
            className="text-zinc-400 hover:text-green-400 transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a 
            href="https://github.com/uzicodes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-green-400 transition-colors"
            title="GitHub"
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a 
            href="https://linkedin.com/in/utsho-heaven-chowdhury" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-green-400 transition-colors"
            title="LinkedIn"
          >
            <LinkedInIcon className="w-4 h-4" />
          </a>
        </div>
        
        <p className="text-blue-400 text-sm">© {new Date().getFullYear()} StatsTube</p>
        
        <a 
          href="https://github.com/uzicodes/Stats-Tube" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group absolute right-4 sm:right-4 flex items-center gap-2 px-2 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-green-400 hover:text-green-400 transition-colors"
        >
          <Star className="w-4 h-4 group-hover:text-yellow-400 group-hover:fill-yellow-400 transition-colors" />
          <span className="text-xs font-medium">Star this repo</span>
        </a>
      </div>
    </footer>
  );
}
