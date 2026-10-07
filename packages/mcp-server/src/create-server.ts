import {
  formatContextSnippets,
  listNamespaces,
  searchKnowledge,
  type RagConfig,
} from '@avril/rag-core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

const namespaceEnum = z.enum([
  'current-state',
  'canonical',
  'product',
  'architecture',
  'research',
  'decisions',
  'sources',
  'glossary',
]);

const MAX_TOOL_TEXT_CHARS = 6000;

function truncateText(text: string): string {
  if (text.length <= MAX_TOOL_TEXT_CHARS) return text;
  return `${text.slice(0, MAX_TOOL_TEXT_CHARS)}\n\n[truncated — use a lower limit or a more specific namespace]`;
}

function textResult(text: string) {
  return {
    content: [{ type: 'text' as const, text: truncateText(text) }],
  };
}

export function createAvrilKnowledgeServer(config: RagConfig): McpServer {
  const server = new McpServer({
    name: 'avril-knowledge',
    version: '0.1.0',
  });

  server.registerTool(
    'search_knowledge',
    {
      title: 'Search Avril knowledge',
      description:
        'Semantic search over Avril Systems company docs: current state, product, architecture, thesis, decisions, and research. Never invent beyond returned snippets. Prefer current-state for what exists today.',
      inputSchema: {
        query: z.string().describe('Natural language query'),
        namespace: namespaceEnum.optional().describe('Optional namespace filter'),
        limit: z.number().int().min(1).max(8).optional().default(4),
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    async ({ query, namespace, limit }) => {
      try {
        const results = await searchKnowledge(config, {
          query,
          namespace: namespace ?? null,
          limit: limit ?? 4,
        });

        if (results.length === 0) {
          return textResult(
            `No results for "${query}"${namespace ? ` in namespace ${namespace}` : ''}. Try another namespace or rephrase.`
          );
        }

        const snippets = formatContextSnippets(results);
        const sources = results.map((r) => ({
          title: r.title,
          namespace: r.namespace,
          sourcePath: r.sourcePath,
          similarity: r.similarity,
        }));

        return textResult(
          `Verified Avril context (do not invent beyond this):\n\n${snippets.join('\n---\n')}\n\nSources: ${JSON.stringify(sources)}`
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return textResult(`RAG search error: ${message}`);
      }
    }
  );

  server.registerTool(
    'list_namespaces',
    {
      title: 'List knowledge namespaces',
      description: 'Returns indexed namespaces and document counts.',
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
      },
    },
    async () => {
      try {
        const namespaces = await listNamespaces(config);
        return textResult(JSON.stringify({ namespaces }, null, 2));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return textResult(`Error listing namespaces: ${message}`);
      }
    }
  );

  server.registerTool(
    'get_current_state',
    {
      title: 'Get Avril current state',
      description:
        'Retrieve authoritative CURRENT-STATE context for what exists in production today. Prefer this over thesis docs for implementation questions.',
      inputSchema: {
        topic: z.string().optional().describe('Optional focus topic'),
        limit: z.number().int().min(1).max(6).optional().default(4),
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    async ({ topic, limit }) => {
      try {
        const query =
          topic?.trim() ||
          'Avril current commercial product launcher dashboard LaunchOpenClaw built status';
        const results = await searchKnowledge(config, {
          query,
          namespace: 'current-state',
          limit: limit ?? 4,
        });

        if (results.length === 0) {
          return textResult(
            'No current-state chunks indexed. Run ingest, or use search_knowledge with namespace current-state.'
          );
        }

        return textResult(
          `Avril CURRENT-STATE (authoritative for "what exists now"):\n\n${formatContextSnippets(results).join('\n---\n')}`
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return textResult(`Error getting current state: ${message}`);
      }
    }
  );

  server.registerTool(
    'get_decision',
    {
      title: 'Get Avril decision / ADR',
      description: 'Retrieve founder ADRs and explicit decisions.',
      inputSchema: {
        topic: z.string().optional().describe('Optional decision topic'),
        limit: z.number().int().min(1).max(6).optional().default(3),
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    async ({ topic, limit }) => {
      try {
        const query = topic?.trim() || 'Avril launcher company OS decision ADR';
        const results = await searchKnowledge(config, {
          query,
          namespace: 'decisions',
          limit: limit ?? 3,
        });

        if (results.length === 0) {
          return textResult('No decision chunks indexed for that topic.');
        }

        return textResult(
          `Avril decisions / ADRs:\n\n${formatContextSnippets(results).join('\n---\n')}`
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return textResult(`Error getting decision: ${message}`);
      }
    }
  );

  return server;
}
