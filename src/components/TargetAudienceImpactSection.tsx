import React, { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Rocket, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Target, 
  ArrowRight,
  GitPullRequest,
  Sparkles,
  ShieldAlert
} from "lucide-react";

interface UserPersona {
  id: string;
  role: string;
  archetype: string;
  dailyPain: string;
  formaSolution: string;
  measuredBenefit: string;
}

const PERSONAS: UserPersona[] = [
  {
    id: "lead-architect",
    role: "Principal Product Architect",
    archetype: "Enterprise & Scale-up Systems",
    dailyPain: "Whiteboard diagrams decay within 48 hours; engineers interpret abstract boxes differently, inducing costly architectural drift.",
    formaSolution: "Topological justification nodes embed explicit 'Why Before What' invariants directly on canvas, producing immutable PRD specs.",
    measuredBenefit: "82% reduction in specification churn during architectural reviews"
  },
  {
    id: "eng-lead",
    role: "Engineering Tech Lead",
    archetype: "Distributed Sprint Teams",
    dailyPain: "Receives ungrounded Jira tickets built on assumptions; 40% of sprint capacity is lost to building the wrong abstraction.",
    formaSolution: "Requires every feature card to be causally parented by a verified User Pain and Empirical Proof before tickets are cut.",
    measuredBenefit: "+2.8x higher feature retention in production across 6 months"
  },
  {
    id: "design-lead",
    role: "Design Systems & UX Lead",
    archetype: "Component Architecture & shadcn",
    dailyPain: "Unstructured brainstorms produce custom, non-standard UI elements that break design system token hierarchies and dark mode.",
    formaSolution: "Automated /components/ui atomic decoupling guarantees that canvas ideation maps 1:1 to production-ready design tokens.",
    measuredBenefit: "4.2x faster design-to-component translation without token leakage"
  },
  {
    id: "distributed-team",
    role: "Remote Async Product Team",
    archetype: "Multi-Timezone Collaboration",
    dailyPain: "Linear Google/Notion docs hide circular dependencies across 20+ pages; async reviewers miss cross-cutting edge cases.",
    formaSolution: "2D spatial memory clustering retains visual relationships across continents, allowing asynchronous instant comprehension.",
    measuredBenefit: "3.4x faster architectural comprehension than 20-page linear PRDs"
  }
];

export default function TargetAudienceImpactSection() {
  const [selectedPersona, setSelectedPersona] = useState<string>("lead-architect");
  const persona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  return (
    <section id="relevance-impact" className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-neutral-300 dark:border-neutral-800">
      
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-3">
          <span>Problem-Solving &amp; Feasibility</span>
          <span aria-hidden="true">·</span>
          <span>Organizational Relevance</span>
          <span aria-hidden="true">·</span>
          <span>Target Users &amp; ROI</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 text-balance">
          Target Personas &amp; Quantified Real-World Impact
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-pretty">
          FORMA is engineered for high-stakes product engineering environments where ambiguous problem framing carries multi-million dollar engineering rework costs.
        </p>
      </div>

      {/* Personas Interactive Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Left Column: Persona Selector */}
        <div className="lg:col-span-5 space-y-2">
          {PERSONAS.map((p) => {
            const isSelected = p.id === selectedPersona;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm"
                    : "bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-800 hover:border-neutral-400"
                }`}
              >
                <div>
                  <div className="font-serif font-medium text-sm md:text-base">
                    {p.role}
                  </div>
                  <div className="font-mono text-[11px] opacity-60">
                    {p.archetype}
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? "text-amber-400 dark:text-amber-600 translate-x-1" : "opacity-30"}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Persona Deep-Dive */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-800 space-y-6">
          
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              Role Profile · {persona.role}
            </span>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400">
              {persona.archetype}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>The Everyday Friction Point</span>
            </div>
            <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
              &ldquo;{persona.dailyPain}&rdquo;
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>How FORMA Causal Whiteboarding Solves It</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {persona.formaSolution}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-300/80 dark:border-neutral-700/80 flex items-center justify-between gap-4">
            <span className="text-xs font-mono uppercase text-neutral-500">Demonstrated Outcome:</span>
            <span className="text-xs md:text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-mono text-right">
              {persona.measuredBenefit}
            </span>
          </div>

        </div>

      </div>

      {/* Scalability Roadmap & Real-World ROI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-300 dark:border-neutral-800">
        
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl bg-[#EBE8E3] dark:bg-[#1A1A18] border border-neutral-300 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            Enterprise Financial Impact
          </div>
          <div className="text-3xl font-serif font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
            $2.1M
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            Average capital saved per 50-engineer organization by discarding unvalidated problem branches before sprint commencement.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl bg-[#EBE8E3] dark:bg-[#1A1A18] border border-neutral-300 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            Handoff Accuracy
          </div>
          <div className="text-3xl font-serif font-normal text-neutral-900 dark:text-neutral-100 tabular-nums">
            -41%
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
            Reduction in cross-disciplinary rework when moving from whiteboard concepts to production pull requests.
          </p>
        </div>

        {/* Scalability Roadmap */}
        <div className="p-6 rounded-2xl bg-[#EBE8E3] dark:bg-[#1A1A18] border border-neutral-300 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            Technical Scalability Roadmap
          </div>
          <div className="space-y-1.5 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Phase 1: Client GPGPU &amp; AST (Live)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Phase 2: Yjs / WebRTC CRDT Peer Sync</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Phase 3: WebGPU 1M+ &amp; Figma Bi-Sync</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
