---
title: Avril Market Research Changelog — 2026-10-07
status: RESEARCH
doc_type: research
last_verified: 2026-10-07
---

# Avril Market Research Changelog

**Date:** 2026-10-07  
**Trigger:** Decision-grade agentic-market research for Stage-1 Avril (Launcher / LaunchOpenClaw).  
**Method:** Parallel research subagents + synthesis. Primary sources preferred; UNKNOWN used when unverified.

## Files created

### MCP-Avril (primary for future ingest)

| Path | Notes |
|------|-------|
| `research/STATE_OF_AGENTIC_COMPANIES_LATAM_2026.md` | Main decision doc (sections 1–12) |
| `research/AVRIL_MARKET_RESEARCH_CHANGELOG.md` | This file |
| `research/16-agent-stack-workflows-pricing-2026-10.md` | Stack / pricing deep dive |
| `research/data/agent-companies-2026.csv` | 55 companies |
| `research/data/agent-investors-2026.csv` | 19 funds/programs |
| `research/data/agent-workflows-2026.csv` | 32 workflows |
| `research/data/agent-capital-opportunities-2026.csv` | 16 capital opportunities |

### Docs mirror (`avril-docs-v0.2/research/`)

Same tree mirrored for the documentation repository.  
**Not modified:** `CURRENT-STATE.md`, ADRs, canonical product claims (`00`–`15` except as research companions).

## Sources consulted (selected)

- SAP Mexico / LATAM AI corporate reports (Jun 2025)
- WEF Latin America Intelligent Age (2025)
- NTT DATA / MIT Technology Review LATAM GenAI (2025)
- Cisco AI Readiness Index Mexico (2024)
- Company / funding primaries: Anthropic, Harvey, Glean, Sierra (Reuters), Decagon, LangChain, Noma, Browserbase, Mem0, Jelou, Vambe, Contxto, LatamList, LAVCA, Reuters (Primero), Cinco Días (Tenoro), OpenClaw docs, Intercom Fin, Salesforce Agentforce, Microsoft Copilot Studio, AWS/GCP/Azure/Cloudflare/NVIDIA startup pages, Kaszek / Latitud / Dalus / Conviction sites
- Full URLs embedded inline in the STATE doc and CSVs

## Major findings

1. Mexico/LATAM AI value capture is early; WhatsApp/CX/ops is the local demand cluster.  
2. Global capital concentrates in vertical agents + production infra (orchestration, memory, browser, security).  
3. Mexico already has funded OS/ops players: Primero, Handle, Tenoro.  
4. Generic OpenClaw hosting has low structural moat; ops + packaging matter.  
5. Avril’s evidence-based Stage-1 wedge is hosted + managed OpenClaw (paths A/B), not Company OS (F).  
6. Best near-term capital: customer pilots + cloud credits; then Latitud/Dalus/Kaszek-class pre-seed after proof.

## Contradictions / tensions with existing Avril docs

| Existing doc | Tension | Resolution |
|--------------|---------|------------|
| Thesis / Company OS narrative (`01`, `14`) | Market evidence does **not** support selling Company OS as current product | Keep as THESIS; do not promote as CURRENT (already aligned with CURRENT-STATE / ADR-001) |
| `08-market-and-fundraising-bedrock.md` | Likely thinner / older vs this research | Suggest refresh after founder review |
| `13-research-backlog.md` | Several backlog items now partially answered | Mark answered items; keep gaps listed in STATE §12 |
| `06-payments-x402` | Machine payments are early; Stage-1 buyers unlikely to need them first | Keep as research/hypothesis, not Stage-1 GTM |

No automatic strategy change made.

## Questions requiring founder decision

1. Primary ICP for next 90 days: founders vs agencies vs mid-market ops?  
2. Price experiment: seat-only vs setup+subscription?  
3. Is OpenClaw branding/legal acceptable for commercial packaging?  
4. When (if ever) to engage Primero/Tenoro as partners vs competitors?  
5. Fundraising now vs after N paid deployments — what is N?  
6. Should research be ingested into MCP `research` namespace immediately?

## Suggested docs to update after review

- `08-market-and-fundraising-bedrock.md` — replace with pointers to STATE + data CSVs  
- `13-research-backlog.md` — close completed items; add new gaps  
- `12-open-questions.md` — add ICP / WTP / pay-loop questions  
- Optional public summary for team (Spanish) pointing to MCP search  

## Next step (ops)

- Ingest `research/` into Avril Knowledge MCP (`npm run ingest`) after founder skim.  
- Do **not** treat CSV rows as production claims in CURRENT-STATE.
