import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  formatContextSnippets,
  ingestContent,
  loadRagConfigFromEnv,
  loadRagEnv,
  searchKnowledge,
} from '@avril/rag-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

loadRagEnv(repoRoot);

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const testQuery = args.find((a) => a.startsWith('--test='))?.slice('--test='.length);

  const config = loadRagConfigFromEnv();
  const contentRoot = path.join(repoRoot, 'content');

  if (testQuery) {
    const results = await searchKnowledge(config, { query: testQuery, limit: 5 });
    console.log(formatContextSnippets(results).join('\n---\n'));
    return;
  }

  console.log(`Ingesting from ${contentRoot}${dryRun ? ' (dry-run)' : ''}...`);
  const stats = await ingestContent(config, { contentRoot, dryRun });
  console.log(`Done: ${stats.documents} documents, ${stats.chunks} chunks`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
