import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Quote, 
  BookOpen, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { QueryResponse, CitationItem } from '../../server';
import { ParsedDocument, DocumentChunk } from '../lib/documentParser';

interface ChatAssistantProps {
  documents: ParsedDocument[];
  onSelectCitation: (citationId: string | null) => void;
  selectedCitationId: string | null;
  onQueryComplete: (response: QueryResponse) => void;
  lastResponse: QueryResponse | null;
  sampleQuestions?: {
    grounded: { query: string; expectedAnswer: string; targetDoc: string }[];
    notCovered: { query: string; whyMissing: string }[];
  };
}

export default function ChatAssistant({
  documents,
  onSelectCitation,
  selectedCitationId,
  onQueryComplete,
  lastResponse,
  sampleQuestions,
}: ChatAssistantProps) {
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeDocs = documents.filter((d) => d.isActive);
  const activeChunks: DocumentChunk[] = activeDocs.flatMap((d) => d.chunks);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) {
        setQueryInput(e.detail);
        handleSendQuery(e.detail);
      }
    };
    window.addEventListener('set-query', handler);
    return () => window.removeEventListener('set-query', handler);
  }, [activeChunks]);

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || queryInput).trim();
    if (!q) return;

    if (activeChunks.length === 0) {
      setErrorMsg('No active documents selected. Please check at least one document in the corpus.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setQueryInput(q);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          chunks: activeChunks,
          topK: 5,
          strictness: 'high',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data: QueryResponse = await response.json();
      onQueryComplete(data);
    } catch (err: any) {
      console.error('Query processing error:', err);
      setErrorMsg(err.message || 'Failed to communicate with assistant server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const handleCopy = () => {
    if (!lastResponse?.answer) return;
    navigator.clipboard.writeText(lastResponse.answer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  // Helper to render text with interactive citation tags like [P1]
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[P\d+\])/g);

    return parts.map((part, i) => {
      const citationMatch = part.match(/^\[(P\d+)\]$/);
      if (citationMatch) {
        const citationId = citationMatch[1];
        const isSelected = selectedCitationId === citationId;
        return (
          <button
            key={i}
            onClick={() => onSelectCitation(isSelected ? null : citationId)}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono text-[11px] font-semibold transition-all ${
              isSelected
                ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700'
            }`}
            title={`View Source Citation ${citationId}`}
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F6F3] dark:bg-[#141413] overflow-hidden">
      
      {/* Top Status Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-serif font-medium text-lg text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Document Q&amp;A Assistant</span>
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            Strict Source Grounding · Inline Passage Citations · Non-Found Refusal Verification
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            {activeDocs.length} Docs ({activeChunks.length} Chunks) Active
          </span>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Welcome Card if no query has been made yet */}
        {!lastResponse && !isLoading && (
          <div className="max-w-2xl mx-auto my-6 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                Technical Focus: Document Parsing · Retrieval · Source-Grounded Answers
              </span>
              <h3 className="text-xl font-serif font-medium text-neutral-900 dark:text-neutral-100">
                Ask Questions Grounded Strictly in Uploaded Materials
              </h3>
            </div>
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              This assistant parses multiple documents, indexes semantic chunks, retrieves the most relevant passages via BM25/TF-IDF scoring, and formulates answers with direct in-text citations.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-800 dark:text-neutral-200 space-y-1">
              <strong>Grounding Integrity Rule:</strong>
              <p className="text-[11px] leading-relaxed">
                If the question cannot be answered from the provided documents, the assistant will explicitly state that the information cannot be found rather than hallucinating external facts.
              </p>
            </div>

            {/* Quick Test Bench Prompts */}
            {sampleQuestions && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider block">
                  Click a Sample Prompt to Test Behavior:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {sampleQuestions.grounded.slice(0, 2).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendQuery(q.query)}
                      className="text-left p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-xs transition-colors flex items-center justify-between group"
                    >
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium font-serif">
                        &check; {q.query}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 opacity-80 whitespace-nowrap ml-2">
                        Grounding Test
                      </span>
                    </button>
                  ))}
                  {sampleQuestions.notCovered.slice(0, 1).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendQuery(q.query)}
                      className="text-left p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-xs transition-colors flex items-center justify-between group"
                    >
                      <span className="text-neutral-800 dark:text-neutral-200 font-medium font-serif italic">
                        &times; {q.query}
                      </span>
                      <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 opacity-80 whitespace-nowrap ml-2">
                        Refusal Test
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
              <div className="space-y-1">
                <div className="font-serif font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  Executing Retrieval &amp; Grounding Verification...
                </div>
                <div className="text-[11px] font-mono text-neutral-500">
                  Retrieving top candidate passages across {activeDocs.length} documents
                </div>
              </div>
            </div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/6" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/6" />
          </div>
        )}

        {/* Answer Display */}
        {lastResponse && !isLoading && (
          <div className="max-w-2xl mx-auto space-y-4">
            
            {/* User Question Echo */}
            <div className="p-4 rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700 text-xs md:text-sm font-medium text-neutral-900 dark:text-neutral-100">
              <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">Question</span>
              &ldquo;{lastResponse.query}&rdquo;
            </div>

            {/* If NOT FOUND in material: Explicit Refusal Box */}
            {!lastResponse.isFound ? (
              <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Information Not Found in Supplied Material</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20">
                    Refusal Verified
                  </span>
                </div>

                <div className="text-sm font-serif leading-relaxed whitespace-pre-line text-neutral-900 dark:text-neutral-100">
                  {lastResponse.answer}
                </div>

                {lastResponse.refusalReason && (
                  <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 pt-2 border-t border-amber-500/20">
                    <strong>Refusal Rationale:</strong> {lastResponse.refusalReason}
                  </div>
                )}
              </div>
            ) : (
              /* If FOUND: Source Grounded Answer Card */
              <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
                
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Source-Grounded Answer</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                      Confidence: {lastResponse.confidence.toUpperCase()}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                      title="Copy Answer"
                    >
                      {copiedAnswer ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Formatted Answer Body with Interactive Citation Chips */}
                <div className="text-sm md:text-base font-serif leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-line">
                  {renderFormattedAnswer(lastResponse.answer)}
                </div>

                {/* Inline Citations Drawer */}
                {lastResponse.citations.length > 0 && (
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                      Cited Document Passages (Click to Inspect Source):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lastResponse.citations.map((c) => {
                        const isSelected = selectedCitationId === c.citationId;
                        return (
                          <button
                            key={c.citationId}
                            onClick={() => onSelectCitation(isSelected ? null : c.citationId)}
                            className={`text-left p-2.5 rounded-xl border text-xs transition-all space-y-1 ${
                              isSelected
                                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20'
                                : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                [{c.citationId}] {c.docName}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-serif italic truncate">
                              &ldquo;{c.quote}&rdquo;
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Query Input Footer */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="relative max-w-3xl mx-auto"
        >
          <textarea
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeChunks.length > 0
                ? "Ask anything grounded in the active documents... (Press Enter to submit)"
                : "Please activate at least one document in the left panel to begin asking questions."
            }
            disabled={activeChunks.length === 0 || isLoading}
            rows={2}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs md:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 resize-none shadow-sm disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!queryInput.trim() || isLoading || activeChunks.length === 0}
            className="absolute right-2.5 bottom-3.5 p-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 disabled:opacity-30 transition-opacity"
            title="Submit Question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="max-w-3xl mx-auto flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-2 px-1">
          <span>Model: gemini-3.8-flash (via server-side proxy)</span>
          <span>Shift+Enter for new line · Enter to submit</span>
        </div>
      </div>

    </div>
  );
}
