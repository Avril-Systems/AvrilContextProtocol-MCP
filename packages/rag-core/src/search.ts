import { createClient } from '@supabase/supabase-js';
import { resolveEmbeddingConfigFromEnv } from './embedding-client.js';
import { embedQuery } from './embed.js';
import type { KnowledgeChunkResult, RagConfig, SearchOptions } from './types.js';

export function createRagClient(config: RagConfig) {
  return createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function loadRagConfigFromEnv(): RagConfig {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  }

  return {
    supabaseUrl,
    supabaseServiceKey,
    ...resolveEmbeddingConfigFromEnv(),
  };
}

export async function searchKnowledge(
  config: RagConfig,
  options: SearchOptions
): Promise<KnowledgeChunkResult[]> {
  const { query, namespace = null, limit = 5 } = options;
  const supabase = createRagClient(config);
  const embedding = await embedQuery(query, config);

  const { data, error } = await supabase.rpc('match_knowledge_chunks', {
    query_embedding: embedding,
    match_count: limit,
    filter_namespace: namespace,
  });

  if (error) throw new Error(`RAG search failed: ${error.message}`);

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    documentId: String(row.document_id),
    content: String(row.content),
    namespace: String(row.namespace),
    sourcePath: String(row.source_path),
    title: String(row.title),
    similarity: Number(row.similarity ?? 0),
  }));
}

export function formatContextSnippets(results: KnowledgeChunkResult[]): string[] {
  return results.map(
    (r) =>
      `[${r.namespace}] ${r.title} (${r.sourcePath}, sim=${r.similarity.toFixed(3)})\n${r.content}`
  );
}

export async function listNamespaces(
  config: RagConfig
): Promise<Array<{ namespace: string; count: number }>> {
  const supabase = createRagClient(config);
  const { data, error } = await supabase.from('knowledge_documents').select('namespace');

  if (error) throw new Error(`listNamespaces failed: ${error.message}`);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const ns = String(row.namespace);
    counts.set(ns, (counts.get(ns) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([namespace, count]) => ({ namespace, count }))
    .sort((a, b) => a.namespace.localeCompare(b.namespace));
}
