# Avril Knowledge System

**Status:** CURRENT / PLANNED  
**Scope:** Internal knowledge architecture  
**Last updated:** 2026-10-05

## Purpose

Avril's documentation should become a shared context layer for founders, team members, coding agents, research agents, operational agents, RAG, and MCP.

The goal is to reduce context drift.

## Most authoritative current-state document

For questions about what exists today, prefer:

`CURRENT-STATE.md`

## Source priority

1. repository / production state
2. explicit current founder decision
3. `CURRENT-STATE.md`
4. current canonical documentation
5. implementation notes
6. market research
7. historical context
8. brainstorms

## RAG metadata

```yaml
company: avril
doc_type: current_state | canonical | product | architecture | research | decision
status: current | built | wip | mock | broken | unknown | thesis | planned | research | deprecated | open
product: launcher | dashboard | launchopenclaw | company-os | shared
audience: internal | technical | investor | public
last_verified: YYYY-MM-DD
authority: repo | founder-decision | current-state | canonical | research | historical
```

## Retrieval behavior

Prefer:

- `CURRENT-STATE.md` for what exists now
- `BUILT` for implementation questions
- `CURRENT` for company positioning
- `THESIS` for long-term strategy
- `RESEARCH` for market evidence

Never answer a future-state question as if the feature were already implemented.

## MCP role

The MCP should expose canonical knowledge, not create a second source of truth.

Possible tools:

- `get_company_context`
- `get_current_state`
- `get_product`
- `get_thesis`
- `get_decision`
- `search_research`
- `search_docs`
