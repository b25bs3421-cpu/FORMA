import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  X, 
  Code2, 
  Layers, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { DocumentChunk } from '../lib/documentParser';

interface TechnicalFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChunks: DocumentChunk[];
}

export default function TechnicalFocusModal({
  isOpen,
  onClose,
  activeChunks,
}: TechnicalFocusModalProps) {
  const [activeTab, setActiveTab] = useState<'parsing' | 'retrieval' | 'grounding'>('parsing');
  const [sandboxQuery, setSandboxQuery] = useState('oxygen life support pressure');
  const [sandboxResults, setSandboxResults] = useState<{ chunk: DocumentChunk; score: number }[]>([]);

  if (!isOpen) return null;

  const runSandboxSearch = () => {
    if (!sandboxQuery.trim() || activeChunks.length === 0) return;
    const terms = sandboxQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const scored = activeChunks.map((chunk) => {
      let score = 0;
      const textLower = chunk.text.toLowerCase();
      terms.forEach((term) => {
        const regex = new RegExp(`\\b${term}`, 'gi');
        const matches = (chunk.text.match(regex) || []).length;
        if (matches > 0) {
          score += matches * 1.5;
        }
        if (chunk.section.toLowerCase().includes(term)) score += 2.0;
        if (chunk.docName.toLowerCase().includes(term)) score += 1.2;
      });
      return { chunk, score };
    });

    setSandboxResults(
      scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 4)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span>Technical Deep-Dive</span>
              <span>·</span>
              <span>Document Intelligence Pipeline</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-medium tracking-tight">
              Technical Focus: Parsing • Retrieval • Source-Grounded Answers
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('parsing')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeTab === 'parsing'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            1. Document Parsing
          </button>
          <button
            onClick={() => setActiveTab('retrieval')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeTab === 'retrieval'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            2. Retrieval &amp; Scoring
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeTab === 'grounding'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            3. Source-Grounded Answers &amp; Refusal
          </button>
        </div>

        {/* Tab 1: Document Parsing */}
        {activeTab === 'parsing' && (
          <div className="pt-6 space-y-6 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-neutral-900 dark:text-neutral-100">
                Multi-Format Ingestion &amp; Chunk Segmentation
              </h3>
              <p className="leading-relaxed font-normal">
                Raw documents arrive in diverse encodings (Markdown, PDF text streams, structured JSON, CSV tables, plain text). Our parser transforms them into standardized atomic chunks while preserving structural context.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block font-mono text-xs">
                  Header-Aware Splitting
                </span>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Splits text across H1/H2/H3 markdown headings and colon-delimited sections to keep conceptual paragraphs coherent.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block font-mono text-xs">
                  Sliding-Window Overlap
                </span>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Applies a 250-word window with a 40-word overlap, preventing cross-chunk sentence truncation and retaining semantic flow.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 block font-mono text-xs">
                  Metadata Tagging
                </span>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Every chunk carries a unique ID (e.g. <code>doc-space-1-c2</code>), document title, section heading, and token count.
                </p>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-neutral-500">Chunk Data Contract:</span>
              <pre className="p-4 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
{`interface DocumentChunk {
  chunkId: string;     // Unique immutable ID (e.g. "doc-space-1-c3")
  docId: string;       // Parent document reference
  docName: string;     // Source filename
  section: string;     // Section title (e.g. "1. Atmosphere Revitalization Loop")
  text: string;        // Verbatim text passage
  tokenCount: number;  // Word count approximation
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Retrieval Engine & Interactive Sandbox */}
        {activeTab === 'retrieval' && (
          <div className="pt-6 space-y-6 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-neutral-900 dark:text-neutral-100">
                BM25-Weighted Term Frequency &amp; N-Gram Ranking
              </h3>
              <p className="leading-relaxed font-normal">
                Retrieval evaluates candidate passages across all active documents using a multi-factor scoring function combining Inverse Document Frequency (IDF), term frequency saturation, and phrase matching.
              </p>
            </div>

            {/* Interactive Sandbox */}
            <div className="p-5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-700 dark:text-amber-400 font-semibold">
                  Live Retrieval Sandbox (Testing {activeChunks.length} Indexed Chunks)
                </span>
                <button
                  onClick={runSandboxSearch}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90"
                >
                  <Play className="w-3 h-3" />
                  <span>Execute Search</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={sandboxQuery}
                  onChange={(e) => setSandboxQuery(e.target.value)}
                  placeholder="Enter keywords to test ranking..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none font-mono"
                />
              </div>

              {sandboxResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Top Ranked Passages:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sandboxResults.map((r, i) => (
                      <div
                        key={r.chunk.chunkId}
                        className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[140px]">
                            #{i + 1} {r.chunk.docName}
                          </span>
                          <span className="text-emerald-600 font-semibold">
                            Score: {r.score.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-3 font-serif">
                          {r.chunk.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Source-Grounded Answers & Refusal */}
        {activeTab === 'grounding' && (
          <div className="pt-6 space-y-6 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-neutral-900 dark:text-neutral-100">
                Strict Grounding, Inline Citations &amp; Refusal Policy
              </h3>
              <p className="leading-relaxed font-normal">
                Unlike open-domain chatbots that fabricate facts when uncertain, our assistant is bound by a strict grounding contract: every assertion must be proven by a verbatim passage excerpt, and out-of-corpus queries must be unambiguously refused.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grounding &amp; Citation Binding</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Every factual clause is tagged with an interactive bracketed citation (e.g. <code>[P1]</code>, <code>[P2]</code>). Clicking a citation immediately highlights the verbatim quote in the Source Inspector drawer.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-800 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Explicit Refusal for Missing Info</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  If the answer is absent from the active corpus (e.g., asking about Artemis launch budgets when only propulsion specs were provided), the system explicitly flags <code>isFound: false</code> and outputs:
                  <span className="block italic mt-1 font-serif text-[11px] text-amber-900 dark:text-amber-200">
                    &ldquo;The provided documents do not contain information to answer this question.&rdquo;
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-1 font-mono text-xs">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                Model: gemini-3.8-flash (via Server-Side Proxy Route)
              </span>
              <p className="text-[11px] text-neutral-500">
                All API keys remain securely on the server; zero browser exposure; deterministic temperature of 0.1 for maximum factual fidelity.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
