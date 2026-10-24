import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  CheckSquare, 
  Square, 
  Plus, 
  FileCode, 
  Layers, 
  Sparkles,
  BookOpen,
  X,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { ParsedDocument, parseUploadedFile } from '../lib/documentParser';
import { SAMPLE_CORPORA, SampleCorpus } from '../lib/sampleDocuments';

interface DocumentManagerProps {
  documents: ParsedDocument[];
  onDocumentsChange: (docs: ParsedDocument[]) => void;
  selectedCorpusId: string;
  onSelectCorpus: (corpusId: string) => void;
  onSelectSampleQuestion: (query: string) => void;
}

export default function DocumentManager({
  documents,
  onDocumentsChange,
  selectedCorpusId,
  onSelectCorpus,
  onSelectSampleQuestion,
}: DocumentManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<ParsedDocument | null>(null);
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const parsedList: ParsedDocument[] = [];
      for (let i = 0; i < files.length; i++) {
        const doc = await parseUploadedFile(files[i]);
        parsedList.push(doc);
      }
      onDocumentsChange([...documents, ...parsedList]);
    } catch (err) {
      console.error('File parsing error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and drop handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const parsedList: ParsedDocument[] = [];
      for (let i = 0; i < files.length; i++) {
        const doc = await parseUploadedFile(files[i]);
        parsedList.push(doc);
      }
      onDocumentsChange([...documents, ...parsedList]);
    } catch (err) {
      console.error('Drop error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle active document
  const toggleDocActive = (docId: string) => {
    onDocumentsChange(
      documents.map((d) => (d.id === docId ? { ...d, isActive: !d.isActive } : d))
    );
  };

  // Toggle all active
  const toggleAll = (activate: boolean) => {
    onDocumentsChange(documents.map((d) => ({ ...d, isActive: activate })));
  };

  // Delete document
  const deleteDoc = (docId: string) => {
    onDocumentsChange(documents.filter((d) => d.id !== docId));
  };

  // Submit pasted text
  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    const name = pasteTitle.trim() || `Manual_Note_${Date.now()}.md`;
    const blob = new Blob([pasteContent], { type: 'text/markdown' });
    const file = new File([blob], name, { type: 'text/markdown' });
    parseUploadedFile(file).then((doc) => {
      onDocumentsChange([...documents, doc]);
      setPasteTitle('');
      setPasteContent('');
      setIsPasteOpen(false);
    });
  };

  const activeCount = documents.filter((d) => d.isActive).length;
  const totalChunks = documents
    .filter((d) => d.isActive)
    .reduce((acc, d) => acc + d.chunks.length, 0);
  const totalWords = documents
    .filter((d) => d.isActive)
    .reduce((acc, d) => acc + d.wordCount, 0);

  const currentCorpus = SAMPLE_CORPORA.find((c) => c.id === selectedCorpusId);

  return (
    <div className="bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="font-serif font-medium text-base text-neutral-900 dark:text-neutral-100">
              Document Corpus
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {activeCount} of {documents.length} Active
          </span>
        </div>

        {/* Corpus Switcher Preset */}
        <div className="space-y-1.5 mt-3">
          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
            Curated Corpora Presets
          </label>
          <div className="grid grid-cols-1 gap-1">
            {SAMPLE_CORPORA.map((corpus) => {
              const isSelected = corpus.id === selectedCorpusId;
              return (
                <button
                  key={corpus.id}
                  onClick={() => onSelectCorpus(corpus.id)}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between border ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm'
                      : 'bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <span className="truncate">{corpus.title}</span>
                  <span className="text-[10px] opacity-60 ml-2 whitespace-nowrap">
                    {corpus.documents.length} docs
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upload & Action Bar */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-500" />
            <span>{isUploading ? 'Parsing...' : 'Upload Files'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".txt,.md,.markdown,.json,.csv,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => setIsPasteOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-500" />
            <span>Paste Text</span>
          </button>
        </div>

        {/* Multi-doc Quick Filter */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-2 px-1">
          <button
            onClick={() => toggleAll(true)}
            className="hover:text-neutral-900 dark:hover:text-neutral-200 underline"
          >
            Select All
          </button>
          <span>·</span>
          <button
            onClick={() => toggleAll(false)}
            className="hover:text-neutral-900 dark:hover:text-neutral-200 underline"
          >
            Deselect All
          </button>
          <span>·</span>
          <span>{totalChunks} Chunks / {totalWords.toLocaleString()} Words</span>
        </div>
      </div>

      {/* Documents List */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto p-3 space-y-2"
      >
        {documents.length === 0 ? (
          <div className="h-48 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex flex-col items-center justify-center p-4 text-center text-xs text-neutral-500">
            <Upload className="w-6 h-6 mb-2 opacity-50" />
            <p className="font-medium text-neutral-700 dark:text-neutral-300">Drop files here to parse</p>
            <p className="text-[11px] text-neutral-400 mt-1">Supports PDF, Markdown, TXT, JSON, CSV</p>
          </div>
        ) : (
          documents.map((doc) => {
            const isDocActive = doc.isActive;
            return (
              <div
                key={doc.id}
                className={`p-3 rounded-xl border transition-all text-xs flex flex-col gap-2 ${
                  isDocActive
                    ? 'bg-neutral-50/80 dark:bg-neutral-800/40 border-neutral-300 dark:border-neutral-700'
                    : 'bg-neutral-100/40 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 overflow-hidden">
                    <button
                      onClick={() => toggleDocActive(doc.id)}
                      className="mt-0.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 shrink-0"
                      title={isDocActive ? 'Deactivate from retrieval' : 'Activate for retrieval'}
                    >
                      {isDocActive ? (
                        <CheckSquare className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>
                    <div className="overflow-hidden">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate" title={doc.name}>
                        {doc.name}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-2 mt-0.5">
                        <span className="uppercase">{doc.type}</span>
                        <span>·</span>
                        <span>{doc.chunks.length} chunks</span>
                        <span>·</span>
                        <span>{doc.wordCount.toLocaleString()} words</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                      title="Inspect Parsed Chunks"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteDoc(doc.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded"
                      title="Remove Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Suggested Questions Section */}
      {currentCorpus && (
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 shrink-0 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 flex items-center justify-between">
            <span>Test Bench Prompts</span>
            <span className="text-amber-600 dark:text-amber-400">Grounding Checks</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block font-medium">
              &check; Answerable in Corpus:
            </span>
            {currentCorpus.sampleQuestions.grounded.slice(0, 2).map((q, i) => (
              <button
                key={i}
                onClick={() => onSelectSampleQuestion(q.query)}
                className="text-left text-[11px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white truncate block w-full hover:underline font-normal"
                title={q.query}
              >
                &bull; {q.query}
              </button>
            ))}
          </div>

          <div className="space-y-1 pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <span className="text-[10px] font-mono text-rose-700 dark:text-rose-400 block font-medium">
              &times; Deliberately Absent (Test Refusal):
            </span>
            {currentCorpus.sampleQuestions.notCovered.slice(0, 1).map((q, i) => (
              <button
                key={i}
                onClick={() => onSelectSampleQuestion(q.query)}
                className="text-left text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-rose-700 dark:hover:text-rose-300 truncate block w-full hover:underline italic font-normal"
                title={q.query}
              >
                &bull; {q.query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inspect Document Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="font-serif font-medium text-lg text-neutral-900 dark:text-neutral-100">
                  {viewingDoc.name}
                </h3>
                <div className="text-xs font-mono text-neutral-500 mt-0.5">
                  Type: {viewingDoc.type.toUpperCase()} · {viewingDoc.wordCount.toLocaleString()} Words · {viewingDoc.chunks.length} Chunks Generated
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <h4 className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
                Parsed Chunks &amp; Boundary Segmentation:
              </h4>
              <div className="space-y-3">
                {viewingDoc.chunks.map((chunk, idx) => (
                  <div
                    key={chunk.chunkId}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Chunk #{idx + 1} ({chunk.chunkId})
                      </span>
                      <span>Section: {chunk.section} · {chunk.tokenCount} words</span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed text-xs">
                      {chunk.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 text-xs font-medium rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paste Text Modal */}
      {isPasteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-serif font-medium text-lg text-neutral-900 dark:text-neutral-100">
                Paste Document Text
              </h3>
              <button
                onClick={() => setIsPasteOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-neutral-500 block mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Security_Compliance_Audit_2026.md"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-neutral-500 block mb-1">
                  Document Content (Markdown or Text)
                </label>
                <textarea
                  rows={8}
                  placeholder="Paste raw specification, contractual clauses, or policy text..."
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPasteOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pasteContent.trim()}
                className="px-5 py-2 text-xs font-medium rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-50"
              >
                Parse &amp; Add Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
