import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  Quote, 
  Sparkles, 
  BookOpen, 
  Layers, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { CitationItem } from '../../server';

interface SourceInspectorProps {
  retrievedPassages: {
    chunkId: string;
    docName: string;
    section: string;
    text: string;
    score: number;
  }[];
  citations: CitationItem[];
  selectedCitationId: string | null;
  onSelectCitation: (id: string | null) => void;
  isFound: boolean;
  refusalReason?: string;
}

export default function SourceInspector({
  retrievedPassages,
  citations,
  selectedCitationId,
  onSelectCitation,
  isFound,
  refusalReason,
}: SourceInspectorProps) {
  const [activeTab, setActiveTab] = useState<'citations' | 'passages'>('citations');

  return (
    <div className="bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-serif font-medium text-base text-neutral-900 dark:text-neutral-100">
              Source &amp; Grounding Inspector
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {citations.length} Verified Citations
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/70 rounded-lg text-xs font-mono mt-3">
          <button
            onClick={() => setActiveTab('citations')}
            className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
              activeTab === 'citations'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Passage Citations ({citations.length})
          </button>
          <button
            onClick={() => setActiveTab('passages')}
            className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
              activeTab === 'passages'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-medium'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Retrieved Chunks ({retrievedPassages.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* If question was refused / not found */}
        {!isFound && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Grounding Refusal Verified</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {refusalReason || 'The query parameters could not be substantiated by any active document chunks.'}
            </p>
          </div>
        )}

        {/* Tab 1: Citations & Verbatim Quotes */}
        {activeTab === 'citations' && (
          <div className="space-y-3">
            {citations.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400 space-y-2">
                <Quote className="w-6 h-6 mx-auto opacity-30" />
                <p>No citations for current response.</p>
                <p className="text-[10px]">Ask a question to see cited quotes.</p>
              </div>
            ) : (
              citations.map((cite) => {
                const isSelected = selectedCitationId === cite.citationId;
                return (
                  <div
                    key={cite.citationId}
                    onClick={() => onSelectCitation(isSelected ? null : cite.citationId)}
                    className={`p-3.5 rounded-xl border transition-all text-xs cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-500/60 ring-2 ring-amber-500/20'
                        : 'bg-neutral-50/70 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-semibold px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        [{cite.citationId}]
                      </span>
                      <span className="text-neutral-500 truncate max-w-[180px]" title={cite.docName}>
                        {cite.docName}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-neutral-500">
                      Section: {cite.section}
                    </div>

                    <blockquote className="border-l-2 border-amber-600/70 pl-2.5 italic text-neutral-700 dark:text-neutral-300 font-serif text-xs leading-relaxed">
                      &ldquo;{cite.quote}&rdquo;
                    </blockquote>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1">
                      <span>Chunk ID: {cite.chunkId}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verbatim Match</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: All Retrieved Passages & Scores */}
        {activeTab === 'passages' && (
          <div className="space-y-3">
            {retrievedPassages.length === 0 ? (
              <div className="text-center py-12 text-xs text-neutral-400 space-y-2">
                <BookOpen className="w-6 h-6 mx-auto opacity-30" />
                <p>No retrieved candidate passages yet.</p>
              </div>
            ) : (
              retrievedPassages.map((p, idx) => (
                <div
                  key={p.chunkId}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      Rank #{idx + 1} · {p.docName}
                    </span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Score: {p.score}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-neutral-500">
                    § {p.section} · {p.chunkId}
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed line-clamp-5 text-xs">
                    {p.text}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 text-[11px] font-mono text-neutral-500 flex items-center justify-between shrink-0">
        <span>Temperature: 0.1 (Strict)</span>
        <span>Grounding Verification: Active</span>
      </div>

    </div>
  );
}
