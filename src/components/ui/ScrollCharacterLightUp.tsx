import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { Sparkles } from "lucide-react";

interface ScrollCharacterLightUpProps {
  text: string;
  className?: string;
  headlineAccent?: string;
  tagline?: string;
  size?: "md" | "lg";
  showProgress?: boolean;
}

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
  isAccent?: boolean;
}

function Character({ char, progress, range, isAccent }: CharProps) {
  // Opacity: starts dim (0.15), illuminates to 1.0 as scroll passes through range
  const opacity = useTransform(progress, range, [0.15, 1]);
  
  // Color & luminous bloom on scroll: flashes warm metallic gold/amber as it lights up
  const color = useTransform(
    progress,
    [range[0], (range[0] + range[1]) / 2, range[1]],
    isAccent
      ? [
          "rgba(217, 119, 6, 0.2)",
          "rgba(245, 158, 11, 1)",
          "var(--sh-acc, #D97706)"
        ]
      : [
          "rgba(120, 113, 108, 0.2)",
          "rgba(245, 158, 11, 0.95)",
          "currentColor"
        ]
  );

  const textShadow = useTransform(
    progress,
    [range[0], (range[0] + range[1]) / 2, range[1]],
    [
      "0 0 0px transparent",
      "0 0 14px rgba(245, 158, 11, 0.65)",
      "0 0 0px transparent"
    ]
  );

  const scale = useTransform(
    progress,
    [range[0], (range[0] + range[1]) / 2, range[1]],
    [0.98, 1.04, 1]
  );

  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <motion.span
      style={{
        opacity,
        color,
        textShadow,
        scale,
        display: "inline-block",
        transformOrigin: "bottom center",
        transition: "text-shadow 0.2s ease"
      }}
      whileHover={{
        scale: 1.15,
        color: "rgb(245, 158, 11)",
        textShadow: "0 0 16px rgba(245, 158, 11, 0.85)"
      }}
      className={`select-none cursor-default transition-all will-change-[transform,opacity] ${
        isAccent ? "font-serif italic font-normal" : ""
      }`}
    >
      {char}
    </motion.span>
  );
}

export default function ScrollCharacterLightUp({
  text,
  className = "",
  headlineAccent = "",
  tagline = "Scroll to illuminate",
  size = "lg",
  showProgress = true
}: ScrollCharacterLightUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"]
  });

  const words = text.split(" ");
  
  // Calculate total characters to map progressive intervals
  let totalChars = 0;
  for (const word of words) {
    totalChars += word.length + 1; // +1 for trailing space
  }

  let charIndexCounter = 0;

  const sizeClasses = size === "lg" 
    ? "text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-normal leading-[1.18] tracking-tight"
    : "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-normal leading-[1.25] tracking-tight";

  return (
    <section 
      ref={containerRef} 
      className={`relative py-16 md:py-24 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto border-t border-neutral-300 dark:border-neutral-800 ${className}`}
    >
      {/* Eyebrow Label */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span>On-Scroll Character Illumination</span>
          <span aria-hidden="true">·</span>
          <span>Kinetic Particle Resonance</span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:inline-block">
          {tagline} ↓
        </span>
      </div>

      {/* Main Light-Up Character Canvas */}
      <div className={`${sizeClasses} text-neutral-900 dark:text-neutral-100 flex flex-wrap gap-x-[0.28em] gap-y-2`}>
        {words.map((word, wordIdx) => {
          const isWordAccent = headlineAccent && word.toLowerCase().includes(headlineAccent.toLowerCase());
          const wordChars = word.split("");

          return (
            <span key={wordIdx} className="inline-flex whitespace-nowrap">
              {wordChars.map((char) => {
                const charIdx = charIndexCounter++;
                // Progress window for this character
                const start = (charIdx / totalChars) * 0.85;
                const end = Math.min(start + 0.15, 1.0);

                return (
                  <Character
                    key={charIdx}
                    char={char}
                    progress={scrollYProgress}
                    range={[start, end]}
                    isAccent={Boolean(isWordAccent)}
                  />
                );
              })}
              {/* Space after word */}
              {wordIdx < words.length - 1 && (() => {
                const spaceIdx = charIndexCounter++;
                const start = (spaceIdx / totalChars) * 0.85;
                const end = Math.min(start + 0.15, 1.0);
                return (
                  <Character
                    key={`space-${wordIdx}`}
                    char=" "
                    progress={scrollYProgress}
                    range={[start, end]}
                  />
                );
              })()}
            </span>
          );
        })}
      </div>

      {/* Subtle indicator bar */}
      <div className="mt-10 flex items-center gap-4 pt-6 border-t border-neutral-300/60 dark:border-neutral-800 text-xs font-mono text-neutral-500">
        <div className="w-24 h-1 bg-neutral-300 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: "left center" }}
            className="w-full h-full bg-amber-500 dark:bg-amber-400"
          />
        </div>
        <span className="text-[11px]">Dynamic Scroll Filament · Synchronized with Particle Sculpture</span>
      </div>
    </section>
  );
}
