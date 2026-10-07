import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chunkMarkdown } from './chunk.js';
import { embedTexts } from './embed.js';
import {
  inferAuthority,
  inferLanguage,
  inferNamespace,
  shouldSkipFile,
} from './namespaces.js';
import { createRagClient } from './search.js';
import type { IngestOptions, RagConfig } from './types.js';

async function walkMarkdown(root: string, dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdown(root, full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }

  return files;
}

export async function ingestContent(
  config: RagConfig,
  options: IngestOptions
): Promise<{ documents: number; chunks: number }> {
  const supabase = createRagClient(config);
  const files = await walkMarkdown(options.contentRoot, options.contentRoot);

  let documentCount = 0;
  let chunkCount = 0;

  for (const filePath of files) {
    const relativePath = path.relative(options.contentRoot, filePath).replace(/\\/g, '/');
    if (shouldSkipFile(relativePath)) continue;

    const text = await fs.readFile(filePath, 'utf8');
    const contentHash = createHash('sha256').update(text).digest('hex');
    const namespace = inferNamespace(relativePath);
    const language = inferLanguage(relativePath);
    const title = path.basename(filePath, '.md');

    const { data: existing } = await supabase
      .from('knowledge_documents')
      .select('id, content_hash')
      .eq('source_path', relativePath)
      .maybeSingle();

    if (existing?.content_hash === contentHash) {
      console.log(`  skip (unchanged): ${relativePath}`);
      continue;
    }

    if (options.dryRun) {
      console.log(`  would ingest: ${relativePath} [${namespace}]`);
      documentCount += 1;
      chunkCount += chunkMarkdown(text).length;
      continue;
    }

    if (existing?.id) {
      await supabase.from('knowledge_chunks').delete().eq('document_id', existing.id);
      await supabase.from('knowledge_documents').delete().eq('id', existing.id);
    }

    const { data: doc, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        title,
        source_path: relativePath,
        namespace,
        language,
        content_hash: contentHash,
        metadata: {
          company: 'avril',
          authority: inferAuthority(relativePath),
          doc_type: namespace,
        },
      })
      .select('id')
      .single();

    if (docError || !doc) {
      throw new Error(`Document insert failed for ${relativePath}: ${docError?.message}`);
    }

    const chunks = chunkMarkdown(text);
    const embeddings = await embedTexts(chunks, config);

    const rows = chunks.map((content, index) => ({
      document_id: doc.id,
      content,
      embedding: embeddings[index],
      chunk_index: index,
      metadata: { heading: content.split('\n')[0]?.slice(0, 120) ?? null },
    }));

    const batchSize = 50;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error: chunkError } = await supabase.from('knowledge_chunks').insert(batch);
      if (chunkError) {
        throw new Error(`Chunk insert failed for ${relativePath}: ${chunkError.message}`);
      }
    }

    documentCount += 1;
    chunkCount += chunks.length;
    console.log(`  ✓ ${relativePath} → ${chunks.length} chunks [${namespace}]`);
  }

  return { documents: documentCount, chunks: chunkCount };
}
