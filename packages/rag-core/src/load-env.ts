import path from 'node:path';
import { config as loadEnv } from 'dotenv';

export function loadRagEnv(repoRoot: string): void {
  loadEnv({ path: path.join(repoRoot, '.env') });
  loadEnv({ path: path.join(repoRoot, '.env.local'), override: true });
  loadEnv({ path: path.join(repoRoot, 'deploy', '.env'), override: true });
}
