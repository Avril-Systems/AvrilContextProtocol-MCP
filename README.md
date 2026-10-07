# Avril Knowledge MCP

Contexto canónico de **Avril Systems** para cualquier cliente MCP. Un corpus RAG (Supabase pgvector / **RAG-DB**) con docs de empresa, estado actual, ADRs y auditorías — expuesto como tools MCP para que los agentes dejen de inventar Avril.

**Endpoint en vivo:** [`https://mcp.avril.life/mcp`](https://mcp.avril.life/mcp)  
**Health:** [`https://mcp.avril.life/health`](https://mcp.avril.life/health)

**Tools:** `search_knowledge` · `list_namespaces` · `get_current_state` · `get_decision`

Patrón hermano de [MotusContextProtocol-MCP](https://github.com/Motus-DAO/MotusContextProtocol-MCP).

> Los docs fuente están en inglés; puedes preguntar en **español**. El agente debe recuperar el contexto con las tools y responderte en el idioma en que preguntaste.

---

## Para el equipo (sin deploy)

Solo necesitas la URL. No hace falta clonar, hacer ingest ni Docker.

| Cliente | Cómo |
|---------|------|
| **ChatGPT** (Developer mode) | App / conector custom → URL `https://mcp.avril.life/mcp` · Auth: **No authentication** |
| **Claude.ai / Claude Desktop** | Settings → Connectors → custom connector → misma URL |
| **Cursor** | MCP remoto o `mcp-remote` (abajo) |
| **Codex / OpenAI API** | Streamable HTTP MCP URL |
| **Agentes / bots propios** | `POST https://mcp.avril.life/mcp` |

Auth en producción: **`none`** (tools de solo lectura; compatible con ChatGPT).

### ChatGPT (paso a paso)

1. Activa **Developer mode**: ChatGPT → **Settings → Security and login → Developer mode**.
2. Crea una app: **Settings → Apps / Connectors** → **Create** / **Add custom MCP**.
3. Completa:
   - **Name:** `Avril Knowledge`
   - **Description:** Buscar estado actual, producto, arquitectura, decisiones e investigación de Avril Systems.
   - **MCP server URL:** `https://mcp.avril.life/mcp`
   - **Authentication:** **No authentication**
4. Guarda. Deberías ver: `search_knowledge`, `list_namespaces`, `get_current_state`, `get_decision`.
5. En un **chat nuevo**, activa la app Avril y prueba con los prompts de abajo.

### Cursor (remoto — recomendado para el equipo)

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

O pega `https://mcp.avril.life/mcp` en Cursor Settings → MCP si tu build acepta URL HTTP directa.

### Claude

**Settings → Connectors → Add custom connector** → URL `https://mcp.avril.life/mcp`.

---

## Prompts de smoke-test (español)

Copia/pega en ChatGPT, Claude o Cursor con el MCP activo. Si la respuesta inventa sin citar tools / CURRENT-STATE, algo está mal.

1. **Producto comercial actual**  
   `Usa get_current_state. ¿Cuál es el producto comercial actual de Avril y qué se está vendiendo hoy?`

2. **Qué existe vs tesis**  
   `Usa get_current_state. Distingue claramente: qué está BUILT/CURRENT hoy, qué es prototipo (Dashboard), y qué es solo THESIS (Company OS). Responde en español.`

3. **Decisión fundadora**  
   `Usa get_decision. ¿Qué decide el ADR-001 sobre el Launcher vs el Company OS?`

4. **Búsqueda dirigida**  
   `Usa search_knowledge con namespace product. ¿Qué es Avril Lab / Agent Launcher y cuál es el flujo Avril Lab → Stripe → LaunchOpenClaw?`

5. **Anti-alucinación**  
   `Usa get_current_state. ¿Ya está demostrado en producción el loop completo pago real → provisioning → agente persistente listo → uso repetido? Si es UNKNOWN, dilo explícitamente.`

### Respuesta esperada (referencia rápida)

- Producto comercial actual: **Agent Launcher / Avril Lab**
- Infra: **LaunchOpenClaw**
- Dashboard / Company OS: **prototipo experimental**, no el foco comercial
- Company OS / empresas agenticas: **tesis de largo plazo**
- Loop completo de producción: aún **UNKNOWN** según el audit

---

## Status

| Área | Estado |
|------|--------|
| Corpus | Docs Avril v0.2 en `content/` |
| RAG | `packages/rag-core` |
| MCP stdio (local) | `packages/mcp-server` |
| MCP HTTP (remoto) | `https://mcp.avril.life/mcp` |
| Supabase | Proyecto **RAG-DB** |

## Namespaces

| Namespace | Uso |
|-----------|-----|
| `current-state` | Qué existe hoy (`CURRENT-STATE.md`) |
| `product` | Launcher / evolución de producto |
| `architecture` | MCP, arquitectura, sistema de conocimiento |
| `canonical` | Tesis / overview de la compañía |
| `research` | Mercado, open questions, backlog |
| `decisions` | ADRs |
| `sources` | Auditorías / reality checks |
| `glossary` | Glosario |

## Regla de retrieval

Nunca mezclar tesis e implementación como si fueran lo mismo. Para “qué existe ahora”, preferir `get_current_state` / namespace `current-state`.

---

## Setup local (maintainers)

```bash
cp .env.example .env
# llenar SUPABASE_SERVICE_ROLE_KEY + VENICE_INFERENCE_KEY

npm install
npm run ingest
npm run mcp          # stdio
npm run mcp:http     # http://localhost:3012/mcp
```

### Cursor (stdio, clone local)

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

## Deploy VPS

```bash
cd ~/MCP-Avril/deploy
cp .env.example .env   # secrets — nunca commitear este archivo
docker compose up -d --build
curl http://127.0.0.1:3012/health
```

Caddy:

```caddy
mcp.avril.life {
  reverse_proxy host.docker.internal:3012
}
```

Motus sigue en `mcp.motusdao.org` → `:3011`. Avril usa `:3012`.
