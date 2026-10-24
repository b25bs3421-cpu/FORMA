/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import SculptureHero from "@/components/ui/liquid-sculpture-hero";
import WhiteboardCanvas from "@/components/WhiteboardCanvas";
import DocumentAssistantSpace from "@/components/DocumentAssistantSpace";
import ProblemStatementSection from "@/components/ProblemStatementSection";
import PromptStudio from "@/components/PromptStudio";
import MarketDifferentiationSection from "@/components/MarketDifferentiationSection";
import TechnicalArchitectureSection from "@/components/TechnicalArchitectureSection";
import TargetAudienceImpactSection from "@/components/TargetAudienceImpactSection";
import PricingPremiumSection from "@/components/PricingPremiumSection";
import ScrollCharacterLightUp from "@/components/ui/ScrollCharacterLightUp";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sync theme changes with HTML root class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-[#111110] text-[#F1EFEA]" : "bg-[#EBE9E5] text-[#151514]"}`}>
      
      {/* 1. Main Hero with Liquid Sculpture (Unmodified exact physics & layout) */}
      <header>
        <SculptureHero
          theme={theme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          brand="FORMA®"
          eyebrow="Spatial Ideation & Problem Synthesis — Est. 2026"
          headline="Form that&#10;answers back."
          headlineAccent="answers back."
          body="We shape chaotic problems, architectural constraints and spatial canvases with the precision of engineering and the fluidity of liquid physics — ideation that holds up under scrutiny."
          primaryCta={{ label: "Launch Whiteboard Canvas", href: "#whiteboard" }}
          secondaryCta={{ label: "Buy Premium (1 Mo Free)", href: "#pricing" }}
          navLinks={[
            { label: "Problem Framework", href: "#problem-framework" },
            { label: "Justification Matrix", href: "#justifications" },
            { label: "Interactive Canvas", href: "#whiteboard" },
            { label: "Doc Assistant", href: "#document-assistant" },
            { label: "Prompt Studio", href: "#prompt-generator" },
            { label: "Pricing", href: "#pricing" },
          ]}
          navCta={{ label: "Buy Premium", href: "#pricing" }}
          showNav={true}
          themeToggle={true}
          loadFonts={true}
          interactive={true}
          backdropText="forma"
        />
      </header>

      {/* On-Scroll Character Illumination (Synchronized with top liquid particle physics) */}
      <div id="scroll-lightup">
        <ScrollCharacterLightUp
          text="When problems are conceived in the abstract, they remain chaotic and turbulent. As you scroll, every character awakens with structural intent—transforming fluid intuition into crystalline architectural form."
          headlineAccent="architectural form"
          tagline="Scroll to ignite characters"
          size="lg"
        />
      </div>

      {/* 2. Main Spaces */}
      <main>
        {/* Interactive Collaborative Whiteboard Canvas */}
        <WhiteboardCanvas />

        {/* Dedicated Space for Grounded Document Assistant */}
        <DocumentAssistantSpace />

        {/* Core Problem Statement & Justification Matrix */}
        <ProblemStatementSection />

        {/* Problem Statement Generator & Prompt Studio */}
        <PromptStudio />

        {/* Innovation & Market Differentiation Matrix */}
        <MarketDifferentiationSection />

        {/* Technical Architecture & Execution Pipeline */}
        <TechnicalArchitectureSection />

        {/* Target Audience, Personas & Quantified Impact */}
        <TargetAudienceImpactSection />

        {/* Pricing & Buy Premium Section (1 Month Free, then 299/mo Autopay) */}
        <PricingPremiumSection />
      </main>

      {/* 3. Philosophical Comparison / Architectural Comparison */}
      <section className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-neutral-300 dark:border-neutral-800">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-2">
            <span>Methodology Comparison</span>
            <span aria-hidden="true">·</span>
            <span>Traditional Whiteboard vs. FORMA Justified Canvas</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
            Why Traditional Whiteboards Break Down at Scale
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legacy Whiteboards */}
          <div className="p-8 rounded-2xl bg-neutral-200/50 dark:bg-neutral-900/40 border border-neutral-300 dark:border-neutral-800 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-rose-700 dark:text-rose-400">
              The Legacy Infinite Canvas Trap
            </div>
            <h4 className="text-xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
              Unconstrained Infinite Sticky Sprawl
            </h4>
            <ul className="space-y-3 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-mono mt-0.5">&times;</span>
                <span><strong>No Causal Gating:</strong> Teams scatter hundreds of low-intent sticky notes without articulating root causes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-mono mt-0.5">&times;</span>
                <span><strong>Premature Solutioning:</strong> Jump straight into low-fidelity boxes without justifying why the feature is necessary.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-mono mt-0.5">&times;</span>
                <span><strong>Context Evaporation:</strong> Once the session ends, the rationale behind layout choices vanishes within 7 days.</span>
              </li>
            </ul>
          </div>

          {/* FORMA Justified Whiteboard */}
          <div className="p-8 rounded-2xl bg-[#E2DFDA]/70 dark:bg-[#1A1A18] border border-neutral-400/70 dark:border-neutral-700 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              The FORMA Justification Framework
            </div>
            <h4 className="text-xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
              Crystalline Topological Problem Architecture
            </h4>
            <ul className="space-y-3 text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">&check;</span>
                <span><strong>Kinetic Particle Physics:</strong> 100k GPU simulated particles provide physical resistance, making decisions tangible.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">&check;</span>
                <span><strong>Why-Before-What Anchoring:</strong> Every canvas card requires an explicit justification statement and impact metric.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">&check;</span>
                <span><strong>Direct AI Grounding:</strong> Whiteboard topologies compile into rigorous LLM prompts with zero intent decay.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Clean Editorial Footer */}
      <footer className="border-t border-neutral-300 dark:border-neutral-800 py-12 px-6 md:px-12 text-xs font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-serif text-base text-neutral-900 dark:text-neutral-100">
              FORMA®
            </div>
            <p className="text-neutral-500 max-w-sm">
              Spatial ideation, GPGPU particle physics, and structured problem statement synthesis for design and engineering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-600 dark:text-neutral-400">
            <a href="#problem-framework" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Problem Justification
            </a>
            <a href="#whiteboard" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Interactive Canvas
            </a>
            <a href="#document-assistant" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Doc Assistant
            </a>
            <a href="#prompt-generator" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Prompt Studio
            </a>
            <a href="#architecture" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Architecture
            </a>
            <a href="#pricing" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Pricing &amp; Premium
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>&copy; {new Date().getFullYear()} FORMA Ideation Systems. All rights reserved.</span>
          <span>TypeScript · Tailwind CSS v4 · WebGL2 GPGPU · Multi-Document Retrieval Engine</span>
        </div>
      </footer>

    </div>
  );
}
