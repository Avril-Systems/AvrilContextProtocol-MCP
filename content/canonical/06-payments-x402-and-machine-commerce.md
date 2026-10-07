# Payments, x402 and Machine Commerce

**Status:** RESEARCH  
**Scope:** Infrastructure strategy  
**Last updated:** 2026-10-02

## Why this matters

Agentic companies may need to purchase capabilities programmatically.

Traditional SaaS assumes:

- human sign-up
- dashboard
- subscription
- API key
- billing portal

Agent-to-agent commerce benefits from a simpler primitive:

request  
→ payment requirement  
→ payment  
→ capability unlocked

## Possible settlement strategy

A plausible default is:

- Base as settlement environment
- stablecoin payments
- x402-style HTTP payments
- machine-readable pricing

This can simplify:

- micropayments
- per-call pricing
- machine procurement
- paywalled APIs
- paywalled MCP capabilities

## Example

A private MCP could expose:

- free tools
- paid tools
- company-only tools
- human-approved tools

A tool call could have a machine-readable price.

Examples:

- context retrieval
- specialized search
- document analysis
- image generation
- human review
- identity verification

## Important constraint

Avril should not assume it must build payment infrastructure.

Payments are likely a supporting layer.

The strategic question is:

> Which capabilities repeatedly create enough value that agents or companies will pay for them?

## Current interpretation

Machine payments are better treated as an enabling rail than as Avril's primary product.

The company should first discover real paid capabilities through actual agent workflows.
