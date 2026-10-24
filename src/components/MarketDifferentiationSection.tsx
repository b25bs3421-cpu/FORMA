import React from "react";
import { 
  Sparkles, 
  Check, 
  X, 
  Minus, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from "lucide-react";

interface ComparisonRow {
  dimension: string;
  legacyCanvas: string; // Miro, Mural
  linearDocs: string;   // Notion, Docs
  formaCanvas: string;  // FORMA
  isHighlight?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: "Cognitive Feedback & Sensory Friction",
    legacyCanvas: "Zero (Frictionless infinite pixel sheet; encourages cheap idea proliferation)",
    linearDocs: "Zero (Flat text editor, high cognitive fatigue across long scrolls)",
    formaCanvas: "GPGPU Liquid Particles (~100k nodes) simulate material inertia; ideas settle into solid forms only under deliberate attention",
    isHighlight: true
  },
  {
    dimension: "Causal Anti-Convergence Gating",
    legacyCanvas: "None (Users freely jump to high-fidelity wireframes without root justification)",
    linearDocs: "Partial (Manual bullet lists, easily bypassed during sprint rush)",
    formaCanvas: "Enforced 'Why Before What' node DAG; feature cards require empirical parent anchors before export",
    isHighlight: true
  },
  {
    dimension: "Multi-Disciplinary Dialect Synthesis",
    legacyCanvas: "Unstructured sticky notes; no semantic translation between Design & Code",
    linearDocs: "Siloed departmental sections; high semantic drift",
    formaCanvas: "Semantic compiler unifies Designer affordances, Engineer invariants, and PM metrics into 1 AST",
    isHighlight: true
  },
  {
    dimension: "Direct AI Generation & LLM Grounding",
    legacyCanvas: "Generic sticky note cluster summaries with high hallucination rates",
    linearDocs: "Unstructured document summarization",
    formaCanvas: "Compiles verified node DAGs directly into zero-slop production prompts for Gemini/Claude with -63% code errors",
    isHighlight: true
  },
  {
    dimension: "Component & Design System Compliance",
    legacyCanvas: "Proprietary locked-in drawing shapes; disconnected from code",
    linearDocs: "Static code snippet blocks with no runtime link",
    formaCanvas: "Strict shadcn /components/ui architecture with zero package lock-in and atomic decoupling",
    isHighlight: false
  }
];

export default function MarketDifferentiationSection() {
  return (
    <section id="innovation-differentiation" className="py-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto border-t border-neutral-300 dark:border-neutral-800">
      
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-3">
          <span>Innovation &amp; Creativity</span>
          <span aria-hidden="true">·</span>
          <span>Comparative Analysis</span>
          <span aria-hidden="true">·</span>
          <span>Market Differentiation</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100 mb-4 text-balance">
          Why Existing Solutions Fail &amp; How FORMA Differs
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed text-pretty">
          A side-by-side technical and cognitive comparison illustrating why traditional infinite whiteboards and linear documentation tools are structurally ill-suited for deep problem formulation.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-300 dark:border-neutral-800 bg-neutral-200/50 dark:bg-neutral-800/50 text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              <th className="py-4 px-6 font-semibold w-1/4">Evaluation Dimension</th>
              <th className="py-4 px-6 font-normal text-neutral-500 w-1/4">Legacy Whiteboards (Miro / FigJam)</th>
              <th className="py-4 px-6 font-normal text-neutral-500 w-1/4">Linear Docs (Notion / Confluence)</th>
              <th className="py-4 px-6 font-semibold text-amber-700 dark:text-amber-400 w-1/4">FORMA Causal Whiteboard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs md:text-sm text-neutral-800 dark:text-neutral-200">
            {COMPARISON_DATA.map((row, idx) => (
              <tr 
                key={row.dimension}
                className={`transition-colors ${
                  row.isHighlight 
                    ? "bg-amber-500/[0.03] dark:bg-amber-400/[0.02] hover:bg-amber-500/[0.06]" 
                    : "hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40"
                }`}
              >
                <td className="py-5 px-6 font-medium text-neutral-900 dark:text-neutral-100 align-top">
                  <span className="font-serif block text-sm mb-1">{row.dimension}</span>
                  {row.isHighlight && (
                    <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400">
                      Unique Innovation
                    </span>
                  )}
                </td>
                <td className="py-5 px-6 text-neutral-600 dark:text-neutral-400 align-top leading-relaxed text-xs">
                  {row.legacyCanvas}
                </td>
                <td className="py-5 px-6 text-neutral-600 dark:text-neutral-400 align-top leading-relaxed text-xs">
                  {row.linearDocs}
                </td>
                <td className="py-5 px-6 text-neutral-900 dark:text-neutral-100 font-normal align-top leading-relaxed text-xs bg-amber-500/[0.04] dark:bg-amber-400/[0.03]">
                  {row.formaCanvas}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Innovation Summary Kicker */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-xl bg-neutral-200/50 dark:bg-neutral-900/50 border border-neutral-300 dark:border-neutral-800 text-xs font-mono">
        <div className="space-y-1">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            Innovation Summary:
          </span>
          <span className="text-neutral-600 dark:text-neutral-400 block sm:inline sm:ml-2">
            The first platform to marry GPU particle physics with formal causal DAG verification and downstream LLM prompt synthesis.
          </span>
        </div>
        <a 
          href="#whiteboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity shrink-0"
        >
          <span>Test Innovation on Canvas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </section>
  );
}
