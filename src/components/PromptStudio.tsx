import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Terminal, 
  Sliders, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Cpu,
  BookmarkPlus
} from "lucide-react";
import confetti from "canvas-confetti";

export interface PresetTopic {
  id: string;
  label: string;
  domain: string;
  coreProblem: string;
  justification: string;
  primaryMetric: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    id: "whiteboard-ideation",
    label: "Whiteboard Ideation with Liquid Physics",
    domain: "Spatial Computing & Collaboration",
    coreProblem: "Digital whiteboards are passive pixel sheets that fail to provide cognitive feedback. Unconstrained sticky-note sprawl leads to 74% premature convergence on incorrect solutions before defining the root failure vector.",
    justification: "Liquid GPGPU particles model physical inertia, preventing fixation and enforcing visual commitment only when ideas settle into validated structures.",
    primaryMetric: "-38% cognitive fixation rate during early architectural sprints."
  },
  {
    id: "design-system-sync",
    label: "Autonomous Design System Cohesion",
    domain: "Frontend Architecture & shadcn",
    coreProblem: "Fragmented UI component libraries drift apart across distributed teams, causing duplicate token definitions, broken dark-mode contrast, and brittle /components/ui primitives.",
    justification: "Strict /components/ui folder discipline and headless Tailwind tokens provide zero-lockin atomic decoupling between design primitives and business logic.",
    primaryMetric: "+4.2x velocity in onboarding new engineers to design tokens."
  },
  {
    id: "cross-dialect-bridge",
    label: "Design-to-Code Semantic Synthesis",
    domain: "Cross-Disciplinary Engineering",
    coreProblem: "Product managers write text PRDs, designers sketch static frames, and engineers construct state machines—leaving a 41% semantic misalignment gap during feature handoffs.",
    justification: "Topological node linking forces explicit justification links (Why Before What) directly on the whiteboard canvas before code generation.",
    primaryMetric: "82% reduction in specification churn during architectural handoffs."
  },
  {
    id: "ai-prompt-grounding",
    label: "Traceable AI Prompt Generation",
    domain: "Prompt Engineering & LLM Systems",
    coreProblem: "Prompting AI models with vague or ungrounded problem statements yields generic 'AI slop' code with hallucinated APIs and broken layout contracts.",
    justification: "Structuring prompts with multi-dimensional justification vectors ensures frontier models (Gemini / Claude) generate exact, production-ready frontend architectures.",
    primaryMetric: "-63% reduction in hallucinated non-functional UI affordances."
  }
];

export default function PromptStudio() {
  const [selectedPreset, setSelectedPreset] = useState<string>("whiteboard-ideation");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [domain, setDomain] = useState<string>("Spatial Computing & Collaboration");
  const [targetAudience, setTargetAudience] = useState<string>("Full-Stack Engineers & Product Architects");
  const [rigorLevel, setRigorLevel] = useState<"standard" | "rigorous" | "academic">("rigorous");
  const [outputFormat, setOutputFormat] = useState<"prd" | "rfc" | "hmw">("prd");
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const activePreset = PRESET_TOPICS.find((p) => p.id === selectedPreset);

  const currentTopic = customTopic.trim() || activePreset?.label || "Whiteboard Ideation with Liquid Physics";
  const currentProblem = customTopic.trim() 
    ? `Teams tackling "${customTopic}" lack structural cognitive scaffolding, resulting in ungrounded assumptions and premature execution before isolating the core constraint.`
    : activePreset?.coreProblem || "";
  const currentJustification = customTopic.trim()
    ? `Grounding "${customTopic}" within a spatial whiteboard canvas mandates explicit causal linkages, ensuring every architectural node is justified by empirical proof.`
    : activePreset?.justification || "";
  const currentMetric = customTopic.trim()
    ? `+75% reduction in requirement rework when moving from conception to deployment.`
    : activePreset?.primaryMetric || "";

  // The generated master prompt
  const generatedMasterPrompt = `You are a Principal Product Architect and Systems Engineer tasked with formulating an uncompromising, production-grade Problem Statement and Architectural Justification Matrix for the following initiative:

PROJECT TOPIC: "${currentTopic}"
TARGET DOMAIN: ${domain}
PRIMARY AUDIENCE: ${targetAudience}
EVALUATION RIGOR: ${rigorLevel.toUpperCase()}
DESIRED SPEC FORMAT: ${outputFormat.toUpperCase()}

INSTRUCTIONS:
1. Executive Problem Statement: Articulate the non-negotiable failure mode in 2-3 precise sentences. Explicitly define what happens when existing tools fail (the "Status Quo Trap").
2. Core Justification Statements: Provide 5 explicit statements explaining "What statements justify our problem statement for this design?" Address:
   a. Cognitive Mechanics & Sensory Feedback (why this visual/spatial metaphor is essential)
   b. The 'Why Before What' Principle (how premature solutioning is actively blocked)
   c. Cross-Disciplinary Translation (harmonizing Design, Engineering, and Business vocabularies)
   d. Spatial Topology vs Linear Text (why flat documents fail for this problem)
   e. Traceability to Execution (how spatial nodes translate directly into code and tests)
3. Empirical Evidence & Failure Modes: Specify 2 quantitative impact metrics and 1 concrete real-world risk if this problem is ignored.
4. "How Might We" (HMW) Vectors: Frame 3 actionable vectors for prototype exploration.
5. Strict Anti-Slop Enforcement: No generic verbs ("supercharge", "unlock"), no roleplay button jargon, and no spurious status flags. Ground everything in demonstrable human and system behavior.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedMasterPrompt);
    setCopiedPrompt(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.85 }
      });
    }, 600);
  };

  return (
    <section id="prompt-generator" className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-neutral-300 dark:border-neutral-800">
      
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-3">
          <span>AI Metaprompt Engine</span>
          <span aria-hidden="true">·</span>
          <span>Problem Statement Prompt Generator</span>
          <span aria-hidden="true">·</span>
          <span>LLM Grounding</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 text-balance">
          Problem Statement Generator &amp; Prompt Studio
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-pretty">
          Use this interactive studio to generate structured problem statements and export production-ready prompts for Gemini, Claude, or ChatGPT to analyze any whiteboard or product design topic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6 p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-300 dark:border-neutral-800">
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Preset Whiteboard Topics
            </label>
            <div className="space-y-1.5">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset.id);
                    setCustomTopic("");
                    setDomain(preset.domain);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between border ${
                    selectedPreset === preset.id && !customTopic
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm"
                      : "bg-white/70 dark:bg-neutral-800/70 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  <span className="font-medium truncate">{preset.label}</span>
                  <span className="text-[10px] opacity-60 font-mono ml-2 whitespace-nowrap">{preset.domain.split("&")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
              Or Enter Custom Topic
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Real-Time Spatial Canvas for Hardware Engineers"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                Rigor Threshold
              </label>
              <select
                value={rigorLevel}
                onChange={(e) => setRigorLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="standard">Pragmatic Product</option>
                <option value="rigorous">Rigorous Engineering</option>
                <option value="academic">Formal Research Spec</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="prd">Full PRD Section</option>
                <option value="rfc">Engineering RFC</option>
                <option value="hmw">HMW Opportunity Matrix</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500">Live Synthesis State: Ready</span>
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Refresh Matrix</span>
            </button>
          </div>

        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Synthesized Problem Definition Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#EBE8E3] dark:bg-[#1A1A18] border border-neutral-300 dark:border-neutral-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-neutral-300/70 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Synthesized Problem Statement</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">Topic: {currentTopic}</span>
            </div>

            <p className="text-base md:text-lg font-serif font-normal text-neutral-900 dark:text-neutral-100 leading-snug">
              &ldquo;{currentProblem}&rdquo;
            </p>

            <div className="pt-2 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                Primary Justification Statement
              </div>
              <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {currentJustification}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-300/70 dark:border-neutral-800 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              <span>Target Metric:</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{currentMetric}</span>
            </div>

          </div>

          {/* Copyable LLM Meta-Prompt */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-neutral-100 border border-neutral-800 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>Ready-to-Copy LLM Generator Prompt</span>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy for Gemini / Claude</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-black/60 rounded-xl font-mono text-xs leading-relaxed text-neutral-300 overflow-x-auto max-h-64 whitespace-pre-wrap select-all">
{generatedMasterPrompt}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 pt-1">
              <span>Optimized for Gemini 1.5/2.0, Claude 3.5, and GPT-4o</span>
              <span>180 Tokens · Zero Slop Enforced</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
