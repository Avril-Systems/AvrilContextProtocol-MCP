# ADR-002 — Runtime Convergence Remains Open

**Status:** OPEN  
**Date:** 2026-10-05  
**Decision type:** Architecture

## Current state

### Lab
`Avril-Agentes-Landing` → `LaunchOpenClaw` → isolated OpenClaw seat

### Dashboard
`Avril-Dashboard` → OpenClaw bridge / deployer path → Agent Office

## Question

Should the future Agentic Company OS provision and manage its agents through LaunchOpenClaw?

## Decision

No architecture decision has been made yet.

The two paths should not be unified only for conceptual cleanliness.

## Evidence required

Revisit when:

- the Launcher has real production users
- repeated Company OS requirements appear
- there is a clear need for per-company isolated runtimes
- maintaining two runtime paths creates measurable cost or product friction
