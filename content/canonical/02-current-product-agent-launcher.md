# Current Product — Avril Agent Launcher

**Status:** CURRENT / WIP  
**Scope:** Product  
**Last updated:** 2026-10-05

## Product role

The Agent Launcher is Avril's current commercial wedge into the agentic economy.

## Core job

> Deploy a persistent AI agent without requiring the user to manually operate the underlying server infrastructure.

## Current code reality

### `Avril-Agentes-Landing`

Owns public Lab marketing, rental flow, Stripe checkout, Stripe webhook, rental status, and user-facing access to provisioned agents.

### `LaunchOpenClaw`

Owns deployment requests, capacity scheduling, Docker provisioning, health checks, OpenClaw seat lifecycle, and Control UI URL generation.

## Current end-to-end flow

landing → wallet/sign-in where required → `/renta` → Stripe checkout → Stripe webhook → LaunchOpenClaw → Dockerized OpenClaw seat → health check → ready status → Control UI

This path is **implemented in code**.

Production proof that a real payment reliably results in a ready agent is still **UNKNOWN**.

## Current implementation status

### BUILT

- Lab marketing / rental surface
- Stripe checkout code path
- Stripe webhook launch path
- hosted OpenClaw provisioning
- deployment status API
- Control UI URL pattern

### WIP

- verified production `pay → ready`
- owner-to-agent persistence
- operational reliability under capacity / VPS failure
- BYOK as a polished provisioning experience

### MOCK / NOT SHIPPED

- developer sandbox API
- broader template / Connected phase
- some fallback checkout paths

## Commercial boundary

The simplest current offer remains:

> Avril deploys and hosts the persistent agent runtime.

Avril does not need to guarantee the business outcome produced by the agent in the first version.

## Main risk

A pure hosted-OpenClaw offer can commoditize. Durable value may move upward into configuration, context, tools, permissions, skills, templates, governance, and multi-agent operations.

Those should be learned from usage rather than prebuilt as assumptions.
