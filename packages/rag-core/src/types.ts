export type KnowledgeNamespace =
  | 'current-state'
  | 'canonical'
  | 'product'
  | 'architecture'
  | 'research'
  | 'decisions'
  | 'sources'
  | 'glossary';

export interface KnowledgeChunkResult {
  id: string;
  documentId: string;
  content: string;
  namespace: string;
  sourcePath: string;
  title: string;
  similarity: number;
}

export interface SearchOptions {
  query: string;
  namespace?: string | null;
  limit?: number;
}

export interface IngestOptions {
  contentRoot: string;
  dryRun?: boolean;
}

export interface RagConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
  embeddingApiKey: string;
  embeddingBaseUrl?: string;
  embeddingModel?: string;
}
