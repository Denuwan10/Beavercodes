"use client";

import { useState } from "react";
import { cn } from "@/utils/math";

/** An image that removes itself (and shows `fallback`) if the file is missing. */
export function OptionalImage({
  src,
  alt,
  className,
  fallback = null,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setFailed(true)} />
  );
}

/** A muted, looping video that removes itself if the file is missing. */
export function OptionalVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <video
      className={cn("block", className)}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      onError={() => setFailed(true)}
    />
  );
}
