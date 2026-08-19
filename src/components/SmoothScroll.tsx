"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * SmoothScroll Provider
 * Wraps the entire application layout with Lenis smooth scrolling.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
