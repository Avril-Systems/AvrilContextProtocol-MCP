#!/usr/bin/env node
import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRagConfigFromEnv, loadRagEnv, type RagConfig } from '@avril/rag-core';
import { createAvrilKnowledgeServer } from '@avril/mcp-server/create-server';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createApiKeyMiddleware, resolveMcpAuthMode } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

loadRagEnv(repoRoot);

const config = loadRagConfigFromEnv();
const port = Number(process.env.MCP_PORT ?? 3012);
const host = process.env.MCP_HOST ?? '0.0.0.0';
const apiKey = process.env.MCP_API_KEY?.trim() || undefined;
const authMode = resolveMcpAuthMode(apiKey);
const allowedHosts = process.env.MCP_ALLOWED_HOSTS?.split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const app = createMcpExpressApp({
  host,
  ...(allowedHosts?.length ? { allowedHosts } : {}),
});

const transports = new Map<string, StreamableHTTPServerTransport>();

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'avril-knowledge-mcp',
    version: '0.1.0',
    auth: authMode,
  });
});

const mcpAuth = createApiKeyMiddleware(apiKey, authMode);

async function handleStatelessMcp(req: Request, res: Response, ragConfig: RagConfig): Promise<void> {
  const server = createAvrilKnowledgeServer(ragConfig);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);

  res.on('close', () => {
    transport.close().catch(() => undefined);
    server.close().catch(() => undefined);
  });
}

app.all('/mcp', mcpAuth, async (req, res) => {
  try {
    const sessionIdHeader = req.headers['mcp-session-id'];
    const sessionId = typeof sessionIdHeader === 'string' ? sessionIdHeader : undefined;
    let transport: StreamableHTTPServerTransport | undefined;

    if (sessionId && transports.has(sessionId)) {
      transport = transports.get(sessionId);
    } else if (sessionId && req.method === 'POST' && req.body?.method) {
      await handleStatelessMcp(req, res, config);
      return;
    } else if (!sessionId && req.method === 'POST' && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
        onsessioninitialized: (newSessionId) => {
          if (transport) {
            transports.set(newSessionId, transport);
          }
        },
      });

      transport.onclose = () => {
        const sid = transport?.sessionId;
        if (sid) {
          transports.delete(sid);
        }
      };

      const server = createAvrilKnowledgeServer(config);
      await server.connect(transport);
    } else if (req.method === 'POST' && req.body?.method) {
      await handleStatelessMcp(req, res, config);
      return;
    } else {
      res.status(sessionId ? 404 : 400).json({
        jsonrpc: '2.0',
        error: {
          code: sessionId ? -32001 : -32000,
          message: sessionId
            ? 'Session not found'
            : 'Bad Request: expected initialize POST or valid session',
        },
        id: null,
      });
      return;
    }

    if (!transport) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);

    if (transport.sessionId && !transports.has(transport.sessionId)) {
      transports.set(transport.sessionId, transport);
    }
  } catch (error) {
    console.error('[mcp-http] request error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

app.listen(port, host, () => {
  console.log(`[mcp-http] listening on http://${host}:${port}/mcp`);
  console.log(`[mcp-http] health: http://${host}:${port}/health`);
  console.log(`[mcp-http] auth mode: ${authMode}`);
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
