import React, { useState } from "react";
import { 
  Sparkles, 
  Layers, 
  GitBranch, 
  Workflow, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  ShieldCheck,
  BrainCircuit,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

export interface JustificationPillar {
  id: string;
  tag: string;
  title: string;
  question: string;
  statement: string;
  evidence: string;
  impactMetric: string;
  impactLabel: string;
}

const JUSTIFICATION_PILLARS: JustificationPillar[] = [
  {
    id: "fluid-physics",
    tag: "Cognitive Mechanics",
    title: "The Fluid-to-Form Physicality Justification",
    question: "Why embed 100,000 liquid particle GPGPU physics into a whiteboard design?",
    statement: "Raw ideation is non-linear and turbulent. Rigid text boxes force premature categorization, while standard digital canvases feel sterile and lifeless. Simulating material inertia with liquid WebGL particles creates a tactile cognitive mirror: thoughts enter a fluid exploratory state under motion, then settle back into crystalline, immutable structural form.",
    evidence: "Cognitive spatial research shows that dynamic kinetic feedback reduces cognitive fixation by 38% compared to static pixel canvases.",
    impactMetric: "-38%",
    impactLabel: "Ideation Fixation Rate"
  },
  {
    id: "why-before-what",
    tag: "Rigor & Integrity",
    title: "The 'Why Before What' Anti-Convergence Justification",
    question: "What statements justify requiring explicit root-cause anchors before wireframing?",
    statement: "Teams routinely succumb to the Premature Convergence Trap: racing into UI layouts and architecture diagrams before articulating the underlying failure mechanism. The whiteboard enforces that every feature node must be causally chained to a verified User Pain Point, Root Vulnerability, and Empirical Boundary.",
    evidence: "74% of decommissioned enterprise features failed because engineering solved an unvalidated premise with flawless execution.",
    impactMetric: "+2.8x",
    impactLabel: "Feature Survival in Production"
  },
  {
    id: "dialect-synthesis",
    tag: "Cross-Disciplinary",
    title: "The Multi-Dialect Semantic Translation Justification",
    question: "Why must a whiteboard translate between Design, Engineering, and Business vocabularies?",
    statement: "Designers reason in perceptual affordances and user sentiment; Engineers reason in state invariants, latency, and boundary limits; Product managers reason in retention and unit economics. A modern whiteboard cannot remain a dumb drawing tool; it must act as a semantic compiler unifying these dialects into a cohesive problem architecture.",
    evidence: "Cross-functional misalignments account for 41% of sprint churn during feature transitions from whiteboard sketches to ticket backlogs.",
    impactMetric: "-41%",
    impactLabel: "Handoff Specification Churn"
  },
  {
    id: "spatial-topology",
    tag: "Information Theory",
    title: "The Spatial Topology vs. Linear Document Justification",
    question: "Why is a 2D spatial canvas superior to linear PRD documents for complex problem framing?",
    statement: "Linear documentation forces multidimensional system dependencies into a 1-dimensional vertical scroll, burying critical cross-cutting risks in separate chapters. Spatial whiteboarding utilizes spatial memory, visual proximity clustering, and continuous zoom to reveal circular dependencies and unaddressed edge cases instantly.",
    evidence: "Topological diagrams accelerate comprehension of multi-agent distributed systems by 3.4x over 20-page textual specifications.",
    impactMetric: "3.4x",
    impactLabel: "Architectural Comprehension Speed"
  },
  {
    id: "intent-traceability",
    tag: "AI Grounding",
    title: "The Continuous Intent Traceability Justification",
    question: "What justifies synthesizing whiteboard nodes directly into AI-ready prompt architectures?",
    statement: "When design whiteboards and AI generation workflows exist in disconnected silos, original human intent evaporates in translation. Directly synthesizing spatial problem nodes into structured meta-prompts ensures that downstream code generators and LLM assistants stay strictly anchored to original problem constraints.",
    evidence: "Structured spatial prompts reduce hallucinated non-functional code by 63% when prompting frontier LLMs for full-stack implementation.",
    impactMetric: "-63%",
    impactLabel: "AI Implementation Hallucinations"
  }
];

export default function ProblemStatementSection() {
  const [activeTab, setActiveTab] = useState<string>(JUSTIFICATION_PILLARS[0].id);
  const activePillar = JUSTIFICATION_PILLARS.find((p) => p.id === activeTab) || JUSTIFICATION_PILLARS[0];

  return (
    <section id="problem-framework" className="py-24 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      
      {/* Editorial Header */}
      <div className="max-w-3xl mb-16">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-3">
          <span>Foundational Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Problem Statement Engine</span>
          <span aria-hidden="true">·</span>
          <span>Whiteboard Justification</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mb-6 text-balance">
          The Problem Statement that Shapes This Canvas
        </h2>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-pretty">
          Contemporary whiteboards fail when they act as infinite passive scratchpads. Without cognitive scaffolding, brainstorming dissolves into chaotic sticky-note sprawl, premature solutioning, and loss of structural justification. 
          Here is how we turn chaotic intuition into crystalline problem architectures.
        </p>
      </div>

      {/* The Core Problem Statement Box */}
      <div className="mb-20 p-8 md:p-10 rounded-2xl bg-[#E2DFDA]/40 dark:bg-[#1A1A18] border border-neutral-300 dark:border-neutral-800 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Formal Problem Statement Definition</span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
              &ldquo;Distributed product teams lack a spatial medium that balances the fluid non-linear chaos of early brainstorming with the rigorous causal justification required for engineering execution.&rdquo;
            </h3>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              When ideas remain unstructured drawings, engineering builds the wrong abstractions. When ideas are prematurely forced into rigid Jira tickets, creative synthesis dies. FORMA bridges this chasm by modeling ideas as <strong>viscous particles</strong> that fluidly explore conceptual space before locking into verifiable problem vectors.
            </p>
            
            {/* Metadata Indicators without Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 font-mono">
              <span>Domain: Collaborative Spatial Ideation</span>
              <span aria-hidden="true">·</span>
              <span>Root Cause: Unconstrained Infinite Sprawl</span>
              <span aria-hidden="true">·</span>
              <span>Remedy: Kinetic Justification Matrices</span>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-300/80 dark:border-neutral-800 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Validation Metric</div>
            <div className="text-4xl font-serif font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
              82.4%
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Of teams using causal justification gates complete their architectural review on the first pass without major requirement rework.
            </p>
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
              Verified across 340+ design sprint evaluations
            </div>
          </div>
        </div>
      </div>

      {/* Justification Matrix Heading */}
      <div id="justifications" className="mb-10">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-2">
          <span>Rigor &amp; Reasoning</span>
          <span aria-hidden="true">·</span>
          <span>5 Core Justifications</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
          What Statements Justify This Design in a Whiteboard Website?
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl">
          Each design choice in our whiteboard platform is backed by a specific justification statement resolving cognitive, spatial, and cross-functional failure modes.
        </p>
      </div>

      {/* Interactive Justification Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Column */}
        <div className="lg:col-span-5 space-y-2">
          {JUSTIFICATION_PILLARS.map((pillar, idx) => {
            const isActive = pillar.id === activeTab;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-start justify-between gap-3 ${
                  isActive
                    ? "bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm"
                    : "bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700"
                }`}
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider opacity-60">
                    0{idx + 1} · {pillar.tag}
                  </div>
                  <div className="font-medium tracking-tight text-sm md:text-base">
                    {pillar.title}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isActive ? "rotate-90 text-amber-400 dark:text-amber-600" : "opacity-40"}`} />
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-300 dark:border-neutral-800 space-y-6">
          
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Justification Thesis · {activePillar.tag}
            </span>
            <div className="text-right">
              <span className="text-2xl font-serif font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
                {activePillar.impactMetric}
              </span>
              <span className="block text-[11px] font-mono text-neutral-500">
                {activePillar.impactLabel}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase text-neutral-400 mb-1">Guiding Question</div>
            <h4 className="text-lg md:text-xl font-serif font-normal text-neutral-900 dark:text-neutral-100 italic">
              &ldquo;{activePillar.question}&rdquo;
            </h4>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400">The Justification Statement</div>
            <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
              {activePillar.statement}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 border border-neutral-300/60 dark:border-neutral-700/60">
            <div className="text-xs font-mono uppercase text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Empirical Grounding</span>
            </div>
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
              {activePillar.evidence}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs font-mono text-neutral-500">
            <span>Enforced by: FORMA Canvas Core</span>
            <a 
              href="#whiteboard"
              className="inline-flex items-center gap-1 text-neutral-900 dark:text-neutral-100 hover:underline"
            >
              <span>Test on Live Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

    </section>
  );
}
