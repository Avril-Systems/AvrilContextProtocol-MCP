import { createEmbeddingClient } from './embedding-client.js';
import type { RagConfig } from './types.js';

export async function embedTexts(
  texts: string[],
  config: Pick<RagConfig, 'embeddingApiKey' | 'embeddingBaseUrl' | 'embeddingModel'>
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const client = createEmbeddingClient(config);
  const model = config.embeddingModel ?? 'text-embedding-bge-m3';

  const response = await client.embeddings.create({
    model,
    input: texts,
  });

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export async function embedQuery(
  query: string,
  config: Pick<RagConfig, 'embeddingApiKey' | 'embeddingBaseUrl' | 'embeddingModel'>
): Promise<number[]> {
  const [embedding] = await embedTexts([query], config);
  return embedding;
}
