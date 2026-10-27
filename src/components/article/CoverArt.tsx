import React from "react";
import { cn } from "@/lib/utils";
import { hashString } from "@/lib/content-utils";

/**
 * Deterministic cover art. Every article without a cover image gets a generated
 * one derived from its slug, tinted by its topic hue, so the grid stays varied
 * without depending on an external image host.
 */
export function CoverArt({
  seed,
  hue,
  className,
  label,
}: {
  seed: string;
  hue: number;
  className?: string;
  label?: string;
}) {
  const id = React.useId().replace(/[:]/g, "");
  const h = hashString(seed);
  const variant = h % 4;
  // Keep the second hue near the topic hue so a cover always reads as its topic.
  const hueB = (hue + 14 + (h % 26)) % 360;
  const tilt = (h % 40) - 20;
  const cx = 120 + (h % 500);
  const cy = 80 + ((h >> 3) % 280);

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ? `Cover art for ${label}` : "Cover art"}
      className={cn("block h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`base-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 42% 11%)`} />
          <stop offset="55%" stopColor={`hsl(${(hue + 18) % 360} 48% 17%)`} />
          <stop offset="100%" stopColor={`hsl(${hueB} 52% 26%)`} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hueB} 90% 62%)`} stopOpacity="0.55" />
          <stop offset="100%" stopColor={`hsl(${hueB} 90% 62%)`} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow2-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hue} 95% 58%)`} stopOpacity="0.4" />
          <stop offset="100%" stopColor={`hsl(${hue} 95% 58%)`} stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
        <filter id={`grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width="800" height="500" fill={`url(#base-${id})`} />
      <rect width="800" height="500" fill={`url(#grid-${id})`} />
      <circle cx={cx} cy={cy} r="320" fill={`url(#glow-${id})`} />
      <circle cx={800 - cx} cy={500 - cy} r="260" fill={`url(#glow2-${id})`} />

      <g transform={`rotate(${tilt} 400 250)`} opacity="0.85">
        {variant === 0 &&
          Array.from({ length: 9 }).map((_, i) => (
            <circle
              key={i}
              cx="400"
              cy="250"
              r={40 + i * 42}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.16 - i * 0.012}
              strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
            />
          ))}
        {variant === 1 &&
          Array.from({ length: 22 }).map((_, i) => (
            <line
              key={i}
              x1={-200 + i * 56}
              y1="-80"
              x2={-20 + i * 56}
              y2="580"
              stroke="#fff"
              strokeOpacity={i % 4 === 0 ? 0.22 : 0.08}
              strokeWidth={i % 4 === 0 ? 2 : 1}
            />
          ))}
        {variant === 2 &&
          Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={`M-40 ${140 + i * 46} C 180 ${60 + i * 46}, 420 ${300 + i * 36}, 860 ${120 + i * 50}`}
              fill="none"
              stroke="#fff"
              strokeOpacity={0.22 - i * 0.02}
              strokeWidth={1.4}
            />
          ))}
        {variant === 3 && (
          <g>
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 18 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={30 + col * 44}
                  cy={30 + row * 40}
                  r={((row + col + (h % 5)) % 5) * 0.9 + 1}
                  fill="#fff"
                  fillOpacity="0.2"
                />
              )),
            )}
          </g>
        )}
      </g>

      <rect
        width="800"
        height="500"
        filter={`url(#grain-${id})`}
        opacity="0.16"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}

export function ArticleCover({
  slug,
  hue,
  image,
  title,
  className,
}: {
  slug: string;
  hue: number;
  image?: string;
  title: string;
  className?: string;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={title}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return <CoverArt seed={slug} hue={hue} label={title} className={className} />;
}
