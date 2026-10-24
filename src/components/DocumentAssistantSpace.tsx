import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Code2
} from 'lucide-react';
import DocumentManager from './DocumentManager';
import ChatAssistant from './ChatAssistant';
import SourceInspector from './SourceInspector';
import TechnicalFocusModal from './TechnicalFocusModal';
import { ParsedDocument } from '../lib/documentParser';
import { SAMPLE_CORPORA } from '../lib/sampleDocuments';
import { QueryResponse } from '../../server';

export default function DocumentAssistantSpace() {
  const [selectedCorpusId, setSelectedCorpusId] = useState<string>(SAMPLE_CORPORA[0].id);
  const [documents, setDocuments] = useState<ParsedDocument[]>(SAMPLE_CORPORA[0].documents);
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<QueryResponse | null>(null);
  const [isTechFocusOpen, setIsTechFocusOpen] = useState<boolean>(false);

  const activeCorpus = SAMPLE_CORPORA.find((c) => c.id === selectedCorpusId) || SAMPLE_CORPORA[0];
  const activeDocs = documents.filter((d) => d.isActive);
  const activeChunks = activeDocs.flatMap((d) => d.chunks);

  const handleSelectCorpus = (corpusId: string) => {
    setSelectedCorpusId(corpusId);
    const corpus = SAMPLE_CORPORA.find((c) => c.id === corpusId);
    if (corpus) {
      setDocuments(corpus.documents);
      setLastResponse(null);
      setSelectedCitationId(null);
    }
  };

  const handleSelectSampleQuestion = (queryText: string) => {
    // Passed to ChatAssistant
    const event = new CustomEvent('set-query', { detail: queryText });
    window.dispatchEvent(event);
  };

  return (
    <section id="document-assistant" className="py-20 px-4 md:px-10 lg:px-16 max-w-7xl mx-auto border-t border-neutral-300 dark:border-neutral-800">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 mb-2">
            <span>Agent Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Document Parsing</span>
            <span aria-hidden="true">·</span>
            <span>Retrieval (BM25)</span>
            <span aria-hidden="true">·</span>
            <span>Source-Grounded Answers</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 dark:text-neutral-100">
            Multi-Document Knowledge Assistant
          </h2>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl font-normal leading-relaxed">
            Ingest multiple technical files, query across their combined corpus, inspect verified passage citations, and verify strict refusal whenever the answer cannot be found in the supplied material.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsTechFocusOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Technical Focus Deep Dive</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xl min-h-[720px]">
        
        {/* Left Panel: Document Library (4 cols on lg) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#151514]">
          <DocumentManager
            documents={documents}
            onDocumentsChange={setDocuments}
            selectedCorpusId={selectedCorpusId}
            onSelectCorpus={handleSelectCorpus}
            onSelectSampleQuestion={handleSelectSampleQuestion}
          />
        </div>

        {/* Center Panel: Chat & Query Engine (5 cols on lg) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full bg-white dark:bg-neutral-900">
          <ChatAssistant
            documents={documents}
            onSelectCitation={setSelectedCitationId}
            selectedCitationId={selectedCitationId}
            onQueryComplete={setLastResponse}
            lastResponse={lastResponse}
            sampleQuestions={activeCorpus.sampleQuestions}
          />
        </div>

        {/* Right Panel: Source & Grounding Inspector (3 cols on lg) */}
        <div className="lg:col-span-3 flex flex-col h-full bg-[#FAF9F6] dark:bg-[#151514]">
          <SourceInspector
            retrievedPassages={lastResponse?.retrievedPassages || []}
            citations={lastResponse?.citations || []}
            selectedCitationId={selectedCitationId}
            onSelectCitation={setSelectedCitationId}
            isFound={lastResponse?.isFound ?? true}
            refusalReason={lastResponse?.refusalReason}
          />
        </div>

      </div>

      {/* Technical Focus Modal */}
      <TechnicalFocusModal
        isOpen={isTechFocusOpen}
        onClose={() => setIsTechFocusOpen(false)}
        activeChunks={activeChunks}
      />

    </section>
  );
}
