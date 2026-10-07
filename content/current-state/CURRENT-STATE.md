# Avril Current State

**Status:** CURRENT  
**Last verified:** 2026-10-02  
**Repositories audited:** `Avril-Agentes-Landing`, `Avril-Dashboard`, `LaunchOpenClaw`

## Current product hierarchy

- **CURRENT product:** Agent Launcher / Avril Lab
- **CURRENT infrastructure:** LaunchOpenClaw
- **EXPERIMENTAL implementation:** Avril Dashboard / Company OS prototype
- **THESIS:** human-owned agentic companies and Agentic Company OS

## Avril Agent Launcher / Lab

Implemented across `Avril-Agentes-Landing` + `LaunchOpenClaw`.

Intended flow:

landing → rent / checkout → Stripe webhook → LaunchOpenClaw → isolated OpenClaw deployment → Control UI

The code path exists. Production proof of a complete real-money `pay → ready` flow is still **UNKNOWN**.

## Avril Dashboard / Company OS prototype

The Dashboard implements parts of:

- founder onboarding / interview
- opportunity / blueprint / ignition state
- spawn / handoff
- Agent Office
- agent / orchestration data models

It should be classified as a **functional prototype**, not a shipped Company OS.

Its runtime path currently uses an OpenClaw bridge and is not the same deployment path as the Lab.

## LaunchOpenClaw

Core provisioning flow:

request → deployment record → capacity scheduling → Docker provisioning → health check → ready status → Control UI URL

Core provisioning is implemented, but reliability depends on VPS capacity, networking, SSH, Caddy, and operational configuration.

## Claims we can make today

- Avril has a Lab product surface for renting a hosted OpenClaw environment.
- Avril has code for Stripe checkout and webhook-triggered launch.
- LaunchOpenClaw can provision isolated OpenClaw seats.
- Avril has a functional Company OS prototype in a separate Dashboard.

## Claims we should not make yet

- verified production reliability of `payment → ready agent`
- a completed commercial Agentic Company OS
- one unified runtime connecting Lab and Dashboard
- production-ready MCP / skills / governance bundles as part of the Lab offer
- a fully secure multi-tenant launcher API

## Current runtime split

### Lab
`Avril-Agentes-Landing` → `LaunchOpenClaw` → isolated OpenClaw seat

### Dashboard
`Avril-Dashboard` → OpenClaw bridge / deployer path → Agent Office

These are currently separate runtime paths.

## Current stage

Avril is still in **Stage 1: Deploy an agent**.

Stage 1 is complete only when there is evidence of:

- real payment
- real provisioning
- ready persistent agent
- actual user usage
- repeat usage
- acceptable operational reliability

## Immediate blockers

1. Close production evidence for real `pay → ready`.
2. Address the launcher API authentication gap.
3. Improve fragile Lab persistence / owner-to-agent mapping.
4. Keep Dashboard runtime convergence as an open architecture decision.
5. Do not commercialize Company OS-shaped functionality before Stage 1 evidence exists.
