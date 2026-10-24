/**
 * Document Parsing and Chunking Engine
 * Supports: TXT, Markdown (.md), JSON, CSV, PDF extraction, and text streams
 */

export interface ParsedDocument {
  id: string;
  name: string;
  type: 'pdf' | 'markdown' | 'text' | 'json' | 'csv';
  size: number;
  wordCount: number;
  rawText: string;
  chunks: DocumentChunk[];
  createdAt: string;
  isActive: boolean;
}

export interface DocumentChunk {
  chunkId: string;
  docId: string;
  docName: string;
  section: string;
  pageNumber?: number;
  text: string;
  tokenCount: number;
}

// Estimates token/word count
export function estimateWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Intelligent text chunking by semantic headers and paragraphs
export function chunkText(
  docId: string,
  docName: string,
  rawText: string,
  targetChunkWords: number = 250,
  overlapWords: number = 40
): DocumentChunk[] {
  if (!rawText || rawText.trim().length === 0) return [];

  const chunks: DocumentChunk[] = [];
  
  // Split text by markdown headings or double newlines
  const rawSections = rawText.split(/(?=\n#{1,3}\s+)|(?=\n[A-Z0-9\s]{3,30}:)/g);

  let chunkIndex = 1;

  rawSections.forEach((sectionBlock) => {
    // Detect section heading if present
    const headingMatch = sectionBlock.match(/^\n?(?:#{1,3}\s+|([A-Z0-9\s]{3,30}:))(.*)/);
    const sectionTitle = headingMatch
      ? headingMatch[0].replace(/^#+\s*/, '').replace(/:\s*$/, '').trim()
      : 'General Content';

    const words = sectionBlock.trim().split(/\s+/).filter(Boolean);

    if (words.length <= targetChunkWords) {
      if (words.length > 5) {
        chunks.push({
          chunkId: `${docId}-c${chunkIndex++}`,
          docId,
          docName,
          section: sectionTitle,
          text: words.join(' '),
          tokenCount: words.length,
        });
      }
      return;
    }

    // Window chunking with overlap
    let startIdx = 0;
    while (startIdx < words.length) {
      const endIdx = Math.min(startIdx + targetChunkWords, words.length);
      const chunkWords = words.slice(startIdx, endIdx);

      if (chunkWords.length > 10) {
        chunks.push({
          chunkId: `${docId}-c${chunkIndex++}`,
          docId,
          docName,
          section: sectionTitle,
          text: chunkWords.join(' '),
          tokenCount: chunkWords.length,
        });
      }

      if (endIdx >= words.length) break;
      startIdx += targetChunkWords - overlapWords;
    }
  });

  // If no chunks were created, fallback to simple word chunking
  if (chunks.length === 0) {
    const words = rawText.trim().split(/\s+/).filter(Boolean);
    let start = 0;
    while (start < words.length) {
      const end = Math.min(start + targetChunkWords, words.length);
      chunks.push({
        chunkId: `${docId}-c${chunkIndex++}`,
        docId,
        docName,
        section: 'Document Body',
        text: words.slice(start, end).join(' '),
        tokenCount: end - start,
      });
      if (end >= words.length) break;
      start += targetChunkWords - overlapWords;
    }
  }

  return chunks;
}

// Parses an uploaded File object
export async function parseUploadedFile(file: File): Promise<ParsedDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  let type: ParsedDocument['type'] = 'text';
  let rawText = '';

  if (extension === 'md' || extension === 'markdown') {
    type = 'markdown';
    rawText = await file.text();
  } else if (extension === 'json') {
    type = 'json';
    try {
      const jsonContent = JSON.parse(await file.text());
      rawText = typeof jsonContent === 'string' ? jsonContent : JSON.stringify(jsonContent, null, 2);
    } catch {
      rawText = await file.text();
    }
  } else if (extension === 'csv') {
    type = 'csv';
    rawText = await file.text();
  } else if (extension === 'pdf') {
    type = 'pdf';
    // Attempt PDF extraction via pdfjs-dist if available in browser
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Dynamically import pdfjs
      const pdfjs = await import('pdfjs-dist');
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
      }
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      const textPieces: string[] = [];

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        textPieces.push(`\n## Page ${pageNum}\n${pageText}`);
      }
      rawText = textPieces.join('\n');
    } catch (pdfErr) {
      console.warn('PDF.js client extraction fallback to plain text:', pdfErr);
      rawText = await file.text().catch(() => 'Unable to read binary PDF stream in browser.');
    }
  } else {
    type = 'text';
    rawText = await file.text();
  }

  const chunks = chunkText(id, file.name, rawText);

  return {
    id,
    name: file.name,
    type,
    size: file.size,
    wordCount: estimateWordCount(rawText),
    rawText,
    chunks,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
}
