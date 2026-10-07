# Product Evolution

**Status:** THESIS / PLANNED  
**Scope:** Product strategy  
**Last updated:** 2026-10-05

## Principle

Do not treat prototype code as evidence that a stage is commercially validated.

## Stage 1 — Deploy an agent

**Current stage.**

Implementation exists for Lab rental, Stripe checkout, webhook-triggered provisioning, LaunchOpenClaw isolated runtime, and ready/status flow.

Proof still required:

- real users pay
- payment reliably triggers provisioning
- agent becomes ready
- user actually uses it
- user returns
- infrastructure remains reliable

## Stage 2 — Deploy an agent with a job

Potential examples: sales, research, operations, content, support, analysis.

This is **not yet a current Lab product**.

## Stage 3 — Operate multiple agents

Possible needs include shared context, permissions, role boundaries, budgets, approvals, orchestration, monitoring, and shared tools.

The Avril Dashboard already explores parts of this stage through Agent Office, orchestration models, and company/agent state.

Treat this as **prototype exploration**, not commercial validation.

## Stage 4 — Agentic Company OS

Potential flow:

Opportunity → Blueprint → Agent architecture → Deploy → Operate → Learn → Reconfigure

The Dashboard already prototypes parts of this flow, but the Company OS remains a **long-term product thesis** until a coherent commercial product and runtime path are validated.

## Open architecture issue

Today:

Lab → LaunchOpenClaw

Dashboard → OpenClaw bridge / separate deployer path

Do not assume they must converge yet.

## Product rule

Prototype freely. Commercialize after evidence.
