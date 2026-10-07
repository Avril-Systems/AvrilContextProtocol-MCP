import type { NextFunction, Request, Response } from 'express';

const DISCOVERY_METHODS = new Set([
  'initialize',
  'notifications/initialized',
  'tools/list',
  'resources/list',
  'prompts/list',
  'ping',
]);

export type McpAuthMode = 'required' | 'mixed' | 'none';

export function resolveMcpAuthMode(apiKey: string | undefined): McpAuthMode {
  const configured = process.env.MCP_AUTH_MODE?.trim().toLowerCase();
  if (configured === 'none' || configured === 'mixed' || configured === 'required') {
    return configured;
  }
  return apiKey ? 'mixed' : 'none';
}

function extractApiKey(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  const headerKey = req.headers['x-api-key'];

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  if (typeof headerKey === 'string') {
    return headerKey;
  }
  return undefined;
}

function isPublicInMixedMode(req: Request): boolean {
  if (req.method === 'GET') return true;
  const method = req.body?.method;
  return typeof method === 'string' && (DISCOVERY_METHODS.has(method) || method === 'tools/call');
}

export function createApiKeyMiddleware(apiKey: string | undefined, mode: McpAuthMode) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (mode === 'none' || !apiKey) {
      next();
      return;
    }

    if (mode === 'mixed' && isPublicInMixedMode(req)) {
      next();
      return;
    }

    if (extractApiKey(req) === apiKey) {
      next();
      return;
    }

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Provide Authorization: Bearer <MCP_API_KEY> or x-api-key header',
    });
  };
}
