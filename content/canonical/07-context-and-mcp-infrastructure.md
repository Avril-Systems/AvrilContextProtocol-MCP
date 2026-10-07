# Context and MCP Infrastructure

**Status:** RESEARCH / THESIS  
**Scope:** Infrastructure opportunities  
**Last updated:** 2026-10-02

## Context is a distinct infrastructure layer

Inference answers:

> Which model will think?

Context answers:

> What should the agent know right now, and where does that information come from?

These are different problems.

## Context infrastructure may include

- retrieval
- memory
- company knowledge
- context packing
- shared state
- permissions
- lineage
- freshness
- entity resolution
- tool output history
- decision memory

## RootRouter as a reference pattern

RootRouter represents a possible context-infrastructure primitive:

- MCP surface
- proxy
- SDK

The important strategic lesson is not that Avril must absorb RootRouter.

It is that useful infrastructure can expose one capability through multiple consumption surfaces.

## MCP

MCP should be treated as a tool/capability transport standard, not as the entire context system.

Potential Avril use cases:

- connect company tools
- expose private capabilities
- permission tool access
- meter premium calls
- provide internal company services
- compose third-party services

## Paid MCP gateway hypothesis

A private or paid MCP gateway is a plausible product hypothesis.

Possible features:

- allowlists
- authentication
- access control
- paid capabilities
- tool-level pricing
- tenant boundaries
- budget limits
- usage logs
- human approvals

## Validation rule

Do not build a general MCP marketplace or gateway solely because the architecture is elegant.

Promote it into a product only if deployed agents repeatedly need it.
