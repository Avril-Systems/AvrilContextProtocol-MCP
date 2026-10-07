# Avril Knowledge MCP

Grounded Avril Systems company knowledge for **any MCP client**. One RAG corpus (Supabase pgvector / **RAG-DB**) over canonical docs, current state, ADRs, and source audits — exposed as MCP tools so agents stop inventing Avril.

**Live remote endpoint:** [`https://mcp.avril.life/mcp`](https://mcp.avril.life/mcp)  
**Health:** [`https://mcp.avril.life/health`](https://mcp.avril.life/health)

**Tools:** `search_knowledge` · `list_namespaces` · `get_current_state` · `get_decision`

Pattern sibling of [MotusContextProtocol-MCP](https://github.com/Motus-DAO/MotusContextProtocol-MCP).

---

## Team: connect without deploying

If the gateway is already up, you only need the URL. No clone, ingest, or Docker required.

| Client | How |
|--------|-----|
| **ChatGPT** (Developer mode) | Custom app / connector → URL `https://mcp.avril.life/mcp` · Auth: **No authentication** |
| **Claude.ai / Claude Desktop** | Settings → Connectors → custom connector → same URL |
| **Cursor** | MCP → remote URL or `mcp-remote` (see below) |
| **Codex / OpenAI API** | Streamable HTTP MCP URL |
| **Custom agents / bots** | `POST https://mcp.avril.life/mcp` (optional Bearer `MCP_API_KEY` if you lock auth later) |

Auth mode in production is **`mixed`**: discovery + read-only `tools/call` work without a key (ChatGPT-friendly).

### ChatGPT (step by step)

1. Enable **Developer mode**: ChatGPT → **Settings → Security and login → Developer mode**.
2. Create an app: **Settings → Apps / Connectors** (or Plugins, depending on UI) → **Create**.
3. Fill in:
   - **Name:** `Avril Knowledge`
   - **Description:** Search Avril Systems current state, product, architecture, decisions, and research docs.
   - **MCP server URL:** `https://mcp.avril.life/mcp`
   - **Authentication:** **No authentication**
4. Save. You should see tools: `search_knowledge`, `list_namespaces`, `get_current_state`, `get_decision`.
5. In a **new chat**, enable the Avril app, then ask e.g.:
   - *What is Avril’s current commercial product?*
   - *Use get_current_state — what exists in production today?*
   - *What does ADR-001 decide about the Launcher vs Company OS?*

### Cursor (remote — recommended for the team)

```json
{
  "mcpServers": {
    "avril-knowledge": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.avril.life/mcp"]
    }
  }
}
```

Or paste `https://mcp.avril.life/mcp` in Cursor Settings → MCP if your build supports HTTP MCP URLs directly.

### Claude

**Settings → Connectors → Add custom connector** → URL `https://mcp.avril.life/mcp`.

---

## Status

| Area | Status |
|------|--------|
| Knowledge corpus | Avril docs v0.2 under `content/` |
| RAG engine | `packages/rag-core` |
| MCP stdio (local) | `packages/mcp-server` |
| MCP HTTP (remote) | `https://mcp.avril.life/mcp` |
| Supabase | Project **RAG-DB** |

## Namespaces

| Namespace | Use |
|-----------|-----|
| `current-state` | What exists today (`CURRENT-STATE.md`) |
| `product` | Launcher / product evolution |
| `architecture` | MCP, company architecture, knowledge system |
| `canonical` | Company thesis / overview |
| `research` | Market, open questions, backlog |
| `decisions` | ADRs |
| `sources` | Reality audits |
| `glossary` | Glossary |

## Retrieval rule

Never flatten thesis and implementation state. Prefer `get_current_state` / namespace `current-state` for “what exists now”.

## Local setup (maintainers)

```bash
cp .env.example .env
# fill SUPABASE_SERVICE_ROLE_KEY + VENICE_INFERENCE_KEY

npm install
npm run ingest
npm run mcp          # stdio
npm run mcp:http     # http://localhost:3012/mcp
```

### Cursor (stdio, local clone)

```json
{
  "mcpServers": {
    "avril-knowledge": {
      "command": "npx",
      "args": ["tsx", "packages/mcp-server/src/server.ts"],
      "cwd": "/ABSOLUTE/PATH/TO/AvrilContextProtocol-MCP"
    }
  }
}
```

## VPS deploy

```bash
cd ~/MCP-Avril/deploy
cp .env.example .env   # fill secrets — never commit this file
docker compose up -d --build
curl http://127.0.0.1:3012/health
```

Caddy:

```caddy
mcp.avril.life {
  reverse_proxy host.docker.internal:3012
}
```

Motus remains on `mcp.motusdao.org` → `:3011`. Avril uses `:3012`.
