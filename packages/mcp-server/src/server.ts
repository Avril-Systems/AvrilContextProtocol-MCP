#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRagConfigFromEnv, loadRagEnv } from '@avril/rag-core';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createAvrilKnowledgeServer } from './create-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

loadRagEnv(repoRoot);

const config = loadRagConfigFromEnv();
const server = createAvrilKnowledgeServer(config);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
