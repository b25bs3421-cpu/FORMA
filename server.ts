import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Interface Definitions
export interface DocumentChunk {
  chunkId: string;
  docId: string;
  docName: string;
  section: string;
  pageNumber?: number;
  text: string;
  tokenCount: number;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
  matchedTerms: string[];
}

export interface CitationItem {
  citationId: string;
  docId: string;
  docName: string;
  section: string;
  quote: string;
  chunkId: string;
}

export interface QueryResponse {
  answer: string;
  isFound: boolean;
  refusalReason?: string;
  citations: CitationItem[];
  confidence: 'high' | 'medium' | 'low' | 'not_found';
  retrievedPassages: {
    chunkId: string;
    docName: string;
    section: string;
    text: string;
    score: number;
  }[];
  query: string;
  timestamp: string;
}

// Multi-document Retrieval Engine (BM25 + TF-IDF n-gram scoring)
function retrieveRelevantPassages(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 5,
  minScoreThreshold: number = 0.05
): RetrievalResult[] {
  if (!query || chunks.length === 0) return [];

  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with', 'what', 'when', 'where', 'who', 'how', 'why', 'can', 'does',
    'did', 'should', 'would', 'could', 'about', 'any', 'tell', 'me', 'please'
  ]);

  const rawTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));

  const queryBigrams: string[] = [];
  for (let i = 0; i < rawTerms.length - 1; i++) {
    queryBigrams.push(`${rawTerms[i]} ${rawTerms[i + 1]}`);
  }

  // Document chunk frequencies
  const docCount = chunks.length;
  const termDocFreq: Record<string, number> = {};

  chunks.forEach((chunk) => {
    const textLower = chunk.text.toLowerCase();
    const seenTerms = new Set<string>();
    rawTerms.forEach((term) => {
      if (textLower.includes(term)) seenTerms.add(term);
    });
    seenTerms.forEach((t) => {
      termDocFreq[t] = (termDocFreq[t] || 0) + 1;
    });
  });

  const scoredResults: RetrievalResult[] = chunks.map((chunk) => {
    const textLower = chunk.text.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();
    const titleLower = chunk.docName.toLowerCase();
    const matchedTerms: string[] = [];
    let score = 0;

    rawTerms.forEach((term) => {
      // Regex count
      const regex = new RegExp(`\\b${term}`, 'gi');
      const matches = (chunk.text.match(regex) || []).length;
      if (matches > 0) {
        matchedTerms.push(term);
        // IDF weight
        const df = termDocFreq[term] || 1;
        const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
        // Term frequency saturation
        const tf = (matches * 2.2) / (matches + 1.2 * (0.25 + 0.75 * (chunk.text.length / 500)));
        score += tf * Math.max(idf, 0.2);
      }

      // Section and document title matches carry extra weight
      if (sectionLower.includes(term)) score += 1.8;
      if (titleLower.includes(term)) score += 1.2;
    });

    // Bigram phrase matches
    queryBigrams.forEach((bigram) => {
      if (textLower.includes(bigram)) {
        score += 2.5;
        matchedTerms.push(bigram);
      }
    });

    return { chunk, score, matchedTerms };
  });

  return scoredResults
    .filter((r) => r.score >= minScoreThreshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// Fallback Local Grounded Answer Synthesizer (when Gemini API key is missing or offline)
function synthesizeLocalGroundedAnswer(
  query: string,
  retrieved: RetrievalResult[]
): QueryResponse {
  const timestamp = new Date().toISOString();

  // If retrieval found virtually no overlap, explicitly indicate NOT FOUND
  if (retrieved.length === 0 || retrieved[0].score < 0.15) {
    return {
      query,
      timestamp,
      isFound: false,
      confidence: 'not_found',
      refusalReason:
        'The supplied document corpus does not contain information to answer this question. No relevant sections or passages were identified matching your query parameters.',
      answer:
        '**The provided documents do not contain information to answer this question.**\n\n' +
        'None of the uploaded or active documents discuss this subject. To receive an answer, please provide documents containing relevant details or rephrase the query using terms present in the material.',
      citations: [],
      retrievedPassages: retrieved.map((r) => ({
        chunkId: r.chunk.chunkId,
        docName: r.chunk.docName,
        section: r.chunk.section,
        text: r.chunk.text.slice(0, 200) + '...',
        score: Number(r.score.toFixed(3)),
      })),
    };
  }

  // Find sentences directly matching query keywords
  const citations: CitationItem[] = [];
  const relevantSentences: string[] = [];
  const queryLower = query.toLowerCase();

  retrieved.forEach((r, idx) => {
    const citationId = `P${idx + 1}`;
    const sentences = r.chunk.text.split(/(?<=[.?!])\s+/);
    const matchedSentences = sentences.filter((s) => {
      const sLower = s.toLowerCase();
      return r.matchedTerms.some((t) => sLower.includes(t.toLowerCase()));
    });

    const keySentence = matchedSentences[0] || sentences[0] || r.chunk.text.slice(0, 160);
    citations.push({
      citationId,
      docId: r.chunk.docId,
      docName: r.chunk.docName,
      section: r.chunk.section,
      quote: keySentence.trim(),
      chunkId: r.chunk.chunkId,
    });

    relevantSentences.push(
      `According to **${r.chunk.docName}** (§${r.chunk.section}) [${citationId}]: "${keySentence.trim()}"`
    );
  });

  const answer =
    `Based on the provided documents, here is the source-grounded finding:\n\n` +
    relevantSentences.join('\n\n') +
    `\n\n*All assertions above are strictly cited from the active document corpus.*`;

  return {
    query,
    timestamp,
    isFound: true,
    confidence: retrieved[0].score > 1.2 ? 'high' : 'medium',
    answer,
    citations,
    retrievedPassages: retrieved.map((r) => ({
      chunkId: r.chunk.chunkId,
      docName: r.chunk.docName,
      section: r.chunk.section,
      text: r.chunk.text,
      score: Number(r.score.toFixed(3)),
    })),
  };
}

// API: Query Document Assistant
app.post('/api/query', async (req: Request, res: Response) => {
  try {
    const {
      query,
      chunks,
      topK = 5,
      strictness = 'high',
    } = req.body as {
      query: string;
      chunks: DocumentChunk[];
      topK?: number;
      strictness?: 'high' | 'medium';
    };

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      res.status(400).json({
        error: 'No document chunks provided. Please upload or activate at least one document.',
      });
      return;
    }

    // 1. Retrieve Candidate Passages
    const minThreshold = strictness === 'high' ? 0.12 : 0.05;
    const retrieved = retrieveRelevantPassages(query, chunks, topK, minThreshold);

    // 2. Check if Gemini API is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to local heuristic RAG synthesis engine
      const fallbackResult = synthesizeLocalGroundedAnswer(query, retrieved);
      res.json(fallbackResult);
      return;
    }

    // 3. Build Source Context for Gemini
    if (retrieved.length === 0) {
      res.json({
        query,
        timestamp: new Date().toISOString(),
        isFound: false,
        confidence: 'not_found',
        refusalReason:
          'No matching passages found in the supplied material. The active documents do not contain relevant information for this query.',
        answer:
          '**The provided documents do not contain information to answer this question.**\n\n' +
          'I searched across the supplied materials, but no passages substantiate or mention the subject of your inquiry. If this topic is covered in other files, please upload them to the document library.',
        citations: [],
        retrievedPassages: [],
      });
      return;
    }

    const contextPassagesText = retrieved
      .map(
        (r, idx) =>
          `[PASSAGE P${idx + 1}]\nDocument: "${r.chunk.docName}"\nSection: "${r.chunk.section}"\nChunk ID: "${r.chunk.chunkId}"\nContent:\n${r.chunk.text}\n`
      )
      .join('\n---\n');

    const systemPrompt = `You are a Source-Grounded Document Q&A Assistant.
Your goal is to answer questions using ONLY the provided document passages.

STRICT INSTRUCTIONS:
1. SOURCE GROUNDING: Answer strictly and exclusively from the facts explicitly stated in the provided passages. Do NOT extrapolate, speculate, or introduce external knowledge.
2. CITATIONS: Every claim or fact in your answer MUST have an inline passage citation in brackets, e.g. [P1] or [P2].
3. REFUSAL WHEN NOT FOUND: If the provided passages do NOT contain sufficient information to answer the question, or if the question asks about something not addressed in the material, you MUST set isFound to false and clearly state in your answer: "The provided documents do not contain information to answer this question." Explain what specific information is missing from the texts.
4. QUOTES: In the citations array, provide verbatim quotes from the text that support your answer.

Respond ONLY with a valid JSON object matching this structure:
{
  "isFound": boolean,
  "confidence": "high" | "medium" | "low" | "not_found",
  "refusalReason": string or null,
  "answer": "Detailed answer formatted with Markdown, including inline [P1], [P2] citations where appropriate.",
  "citations": [
    {
      "citationId": "P1",
      "docName": "string",
      "section": "string",
      "chunkId": "string",
      "quote": "verbatim text excerpt from passage"
    }
  ]
}`;

    const userPrompt = `USER QUESTION: ${query}

SUPPLIED DOCUMENT PASSAGES:
${contextPassagesText}

Remember: If the answer is not in these passages, state that it cannot be found and set isFound to false. Output JSON only.`;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const responseText = response.text || '{}';
      let parsedData: any;
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        parsedData = {
          isFound: true,
          confidence: 'medium',
          answer: responseText,
          citations: [],
        };
      }

      const finalResult: QueryResponse = {
        query,
        timestamp: new Date().toISOString(),
        isFound: parsedData.isFound ?? true,
        confidence: parsedData.confidence ?? (parsedData.isFound ? 'high' : 'not_found'),
        refusalReason: parsedData.refusalReason || undefined,
        answer: parsedData.answer || 'No response generated.',
        citations: Array.isArray(parsedData.citations) ? parsedData.citations : [],
        retrievedPassages: retrieved.map((r) => ({
          chunkId: r.chunk.chunkId,
          docName: r.chunk.docName,
          section: r.chunk.section,
          text: r.chunk.text,
          score: Number(r.score.toFixed(3)),
        })),
      };

      res.json(finalResult);
      return;
    } catch (apiErr: any) {
      console.warn('Gemini API temporary spike/error, falling back to local deterministic grounded synthesis:', apiErr?.message || apiErr);
      const fallbackResult = synthesizeLocalGroundedAnswer(query, retrieved);
      res.json(fallbackResult);
      return;
    }
  } catch (error: any) {
    console.error('Error processing query:', error);
    res.status(500).json({
      error: 'Failed to process document query',
      details: error?.message || String(error),
    });
  }
});

// API: Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Vite Middleware for Development / Static Serve for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Document Assistant Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
