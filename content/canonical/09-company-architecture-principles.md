# Company Architecture Principles

**Status:** CURRENT  
**Scope:** Internal product/architecture guidance  
**Last updated:** 2026-10-02

## 1. Compose before inventing

Prefer existing infrastructure where the capability is already becoming commodity.

Likely examples:

- inference providers
- payment rails
- general MCP transport
- basic cloud compute
- commodity storage

Build proprietary infrastructure only where repeated customer usage reveals a missing primitive.

## 2. The launcher is a sensor

Every deployment should help Avril learn:

- what users configure
- what breaks
- what tools they need
- what context they need
- where permissions fail
- what costs dominate
- what requires human intervention
- what agents repeatedly buy
- what customers repeatedly request

## 3. Separate runtime from business logic

Runtime answers:

- where the agent runs
- how it stays alive
- how it connects to providers
- how it is isolated

Business configuration answers:

- what the agent is responsible for
- what tools it can use
- what knowledge it can access
- what constraints it has
- what workflows it follows

The second layer is more strategically valuable over time.

## 4. Human supervision is first-class

Approvals should not be treated as a temporary defect.

They are part of the operating model.

## 5. Keep status explicit

Architecture and documentation should distinguish:

- built
- live
- mocked
- planned
- research
- deprecated

## 6. Do not overfit the future

Avoid locking the Company OS around assumptions that have not been validated by real customer behavior.
