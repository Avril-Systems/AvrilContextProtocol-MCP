import path from 'node:path';
import type { KnowledgeNamespace } from './types.js';

const SKIP_FILES = new Set(['_TEMPLATE.md', 'README.md', 'SUMMARY.md', 'manifest.json']);

export function shouldSkipFile(relativePath: string): boolean {
  const base = path.basename(relativePath);
  if (SKIP_FILES.has(base)) return true;
  if (!base.endsWith('.md')) return true;
  return false;
}

export function inferNamespace(relativePath: string): KnowledgeNamespace {
  const norm = relativePath.replace(/\\/g, '/');
  const base = path.basename(norm);

  if (norm.startsWith('current-state/') || base === 'CURRENT-STATE.md') return 'current-state';
  if (norm.startsWith('decisions/') || base.startsWith('ADR-')) return 'decisions';
  if (norm.startsWith('sources/')) return 'sources';

  if (base.startsWith('02-') || base.startsWith('03-')) return 'product';
  if (base.startsWith('07-') || base.startsWith('09-') || base.startsWith('10-')) {
    return 'architecture';
  }
  if (
    base.startsWith('08-') ||
    base.startsWith('12-') ||
    base.startsWith('13-') ||
    base.startsWith('15-')
  ) {
    return 'research';
  }
  if (base.startsWith('11-')) return 'glossary';

  return 'canonical';
}

export function inferLanguage(_relativePath: string): 'es' | 'en' {
  return 'en';
}

export function inferAuthority(relativePath: string): string {
  const ns = inferNamespace(relativePath);
  switch (ns) {
    case 'current-state':
      return 'current-state';
    case 'decisions':
      return 'founder-decision';
    case 'sources':
      return 'repo';
    case 'research':
      return 'research';
    default:
      return 'canonical';
  }
}
