import OpenAI from 'openai';
import type { RagConfig } from './types.js';

export type EmbeddingProvider = 'openai' | 'venice';

const VENICE_DEFAULT_MODEL = 'text-embedding-bge-m3';
const OPENAI_DEFAULT_MODEL = 'text-embedding-3-small';

const OPENAI_NATIVE_EMBEDDING_MODELS = new Set([
  'text-embedding-3-small',
  'text-embedding-3-large',
  'text-embedding-ada-002',
]);

function resolveVeniceEmbeddingModel(): string {
  const requested = process.env.EMBEDDING_MODEL?.trim();
  if (!requested || OPENAI_NATIVE_EMBEDDING_MODELS.has(requested)) {
    return VENICE_DEFAULT_MODEL;
  }
  return requested;
}

export function getEmbeddingProvider(): EmbeddingProvider {
  const explicit = (
    process.env.EMBEDDING_PROVIDER ??
    process.env.AI_PROVIDER ??
    ''
  ).toLowerCase();

  if (explicit === 'venice') return 'venice';
  if (explicit === 'openai') return 'openai';
  if (process.env.VENICE_INFERENCE_KEY || process.env.VENICE_API_KEY) return 'venice';
  return 'openai';
}

export function resolveEmbeddingConfigFromEnv(): Pick<
  RagConfig,
  'embeddingApiKey' | 'embeddingBaseUrl' | 'embeddingModel'
> {
  if (getEmbeddingProvider() === 'venice') {
    const apiKey = process.env.VENICE_INFERENCE_KEY || process.env.VENICE_API_KEY;
    if (!apiKey) {
      throw new Error('Missing VENICE_INFERENCE_KEY or VENICE_API_KEY');
    }

    return {
      embeddingApiKey: apiKey,
      embeddingBaseUrl: process.env.VENICE_API_BASE_URL || 'https://api.venice.ai/api/v1',
      embeddingModel: resolveVeniceEmbeddingModel(),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

  return {
    embeddingApiKey: apiKey,
    embeddingBaseUrl: process.env.OPENAI_API_BASE_URL,
    embeddingModel: process.env.EMBEDDING_MODEL || OPENAI_DEFAULT_MODEL,
  };
}

export function createEmbeddingClient(
  config: Pick<RagConfig, 'embeddingApiKey' | 'embeddingBaseUrl'>
): OpenAI {
  return new OpenAI({
    apiKey: config.embeddingApiKey,
    ...(config.embeddingBaseUrl ? { baseURL: config.embeddingBaseUrl } : {}),
  });
}
