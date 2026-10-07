# Avril Current State

Reality check from code in three repos (2026-10-02).\
**Intention baseline (not product evidence):** this package `avril-docs-v0.1`, especially `00`–`03`. Code wins when they conflict (per README hierarchy).

---

## 1. Repo map

### Avril-Agentes-Landing

- **What:** Public Lab marketing + rent checkout (`agentes.avril.life` surface).
- **Main job:** Sell Lab Trial → call LaunchOpenClaw after Stripe pay → show status / Mis agentes.
- **Contains:** Next.js app (`app/renta`, `app/mis-agentes`, `app/api/billing/*`, `app/api/webhooks/stripe`), `lib/launcher.ts`, `lib/wizard.ts`, wallet sign-in, Lab copy (`lib/landing-copy.ts`), docs (guides/specs/pricing).



### Avril-Dashboard

- **What:** “Vibe Founding OS” / founder control plane + Agent Office UI (`app.avril.life` surface).
- **Main job:** Interview/wizard → blueprint/ignition → spawn orchestration session → Agent Office.
- **Contains:** Next.js + Convex (`convex/schema.ts`: ideas, blueprints, orchestration\*), Venice/chat APIs, billing checkout (no webhook), OpenClaw **bridge** client (`src/lib/runOpenClawSpawn.ts`), local bridge (`bridge/openclaw-bridge.mjs`), ERC-8004/startup-agent extras.



### LaunchOpenClaw

- **What:** Master provisioning service for dockerized OpenClaw seats on VPS.
- **Main job:** Accept company contract → schedule capacity → Docker up → health → Control UI URL.
- **Contains:** Express `src/server.ts` (`POST /api/companies`, `GET /api/companies/:id`, `POST /iniciar/:uuid`), Contabo auto-VPS, composer/DNA injection, deployment store on disk.

---



## 2. What is actually built

| Capability                                              | Status                          | Evidence                                                                                                                                                                                                     |
| ------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lab marketing + `/renta` form (wallet + company/idea)   | **BUILT**                       | `components/rent-*.tsx`, `app/renta/page.tsx`, Lab copy in `lib/landing-copy.ts`                                                                                                                             |
| Stripe Lab Trial checkout ($15 / 7d default)            | **BUILT** (env-gated)           | `lib/rent-plan.ts`, `app/api/billing/checkout/route.ts`, `lib/stripe.ts` (`CHECKOUT_MODE=stripe`)                                                                                                            |
| Stripe webhook → launch                                 | **BUILT** (code path)           | `app/api/webhooks/stripe/route.ts` → `launchCompany`                                                                                                                                                         |
| Pay → provision → Control UI poll                       | **WIP**                         | `app/api/rentals/route.ts`; specs board still **S1 next** (`docs/specs/hosted-lab-sandbox.md`)                                                                                                               |
| Owner ↔ agent index                                     | **WIP**                         | File store `lib/owner-agents.ts` → `data/owner-agents.json` (fragile on ephemeral hosts)                                                                                                                     |
| Hosted OpenClaw seat (Docker + health + `*.avril.life`) | **BUILT**                       | `LaunchOpenClaw/src/server.ts` `provisionCompany`, Caddy hook                                                                                                                                                |
| Contabo capacity / auto-VPS                             | **BUILT** (ops-dependent)       | `contabo-provisioner.ts`, `capacity-guard.ts`                                                                                                                                                                |
| Sandbox API for developers                              | **MOCK** / not shipped          | Spec Path B / S5; guides exist, no public `/v1/sandboxes` in Landing                                                                                                                                         |
| Dashboard Venice interview → ignition draft             | **BUILT**                       | `app/api/chat/*`, `convex/serverChatIgnition.ts`                                                                                                                                                             |
| Dashboard form/RAG → spawn → Agent Office               | **BUILT** (runtime via bridge)  | `spawn-from-opportunity`, `handoff-openclaw`, `app/(app)/agents/office/page.tsx`                                                                                                                             |
| Dashboard pay-gated deploy (1 company = 1 payment)      | **MOCK** / incomplete           | `TODO(billing)` in handoff + spawn; checkout `DEMO ONLY` cookie (`app/api/billing/checkout/route.ts`); **no** Stripe webhook under Dashboard                                                                 |
| Dashboard → LaunchOpenClaw                              | **UNKNOWN** / not the live path | Spawn uses `OPENCLAW_BRIDGE_URL` (default Motus allow-list). Founder deploy uses `OPENCLAW_DEPLOYER_URL` or `OPENCLAW_DEPLOY_MOCK` (`convex/deployments.ts`) — different contract than `ContratoAvrilSchema` |
| Agentic Company OS (supervised multi-company product)   | **WIP** thesis                  | Dashboard UI + Convex model; not a closed commercial product                                                                                                                                                 |
| Launcher API auth (`LAUNCHER_TOKEN`)                    | **BROKEN** / unused server-side | Landing sends Bearer (`lib/launcher.ts`); LaunchOpenClaw `POST /api/companies` does not validate it                                                                                                          |

---



## 3. Real user flows



### Agent Launcher (Landing)

`landing` → sign-in wallet → `/renta` → `POST /api/billing/checkout` → Stripe → success `/renta/exito` → poll `/api/rentals?session_id=` → open Control UI.

- **Works in code when:** Stripe keys + webhook + `LAUNCHER_URL` + healthy LaunchOpenClaw + VPS capacity.
- **Breaks / soft-fails:** no launcher → `launcher_not_configured` / `paid_waiting_infra` (`rentals/route.ts`); checkout without Stripe → `mode: mock` (no launch).
- **Mocks:** fake checkout mode; wizard pads defaults into `avril_wizard_v1` (`lib/wizard.ts`).



### Dashboard

`/start` or `/start/idea` → form or Venice chat → opportunity/blueprint/ignition → DeployGate checkout (**often mock**) → `spawn-from-opportunity` / `handoff-openclaw` → `/agents/office?sessionId=`.

- **Spawn does not require paid&#x20;**`deploymentIntent` (explicit TODO).
- **Runtime path:** HTTP bridge to preconfigured OpenClaw gateway (Motus default), **not** Landing’s LaunchOpenClaw seat.
- **Founder control-plane deploy:** can return pure mock runtime (`OPENCLAW_DEPLOY_MOCK=true`).
- **Breaks:** missing bridge token/URL; billing not wired to spawn; no Stripe webhook to persist paid intents.



### LaunchOpenClaw

`POST /api/companies` (or `/iniciar/:uuid` RAG) → 202 + `deploymentId` → background Docker → `ready` + tokenized Control UI URL → `GET /api/companies/:id`.

- **Breaks:** `NO_CAPACITY` 503; health timeout → `failed`; remote SSH/Caddy failures.
- **Mocks:** none for core path; local master always injectable as fallback server.

---



## 4. What can a real user do today?

- **Use:** Browse Lab landing; (if configured) rent flow UI; Dashboard interview/Office demos against a bridge OpenClaw.
- **Pay:** Lab Trial path exists in Landing code; Dashboard plans ($99 / $999 / $199) exist but default env is mock and spawn is not payment-enforced. Live chargeability = **UNKNOWN** without prod env audit.
- **Deploy for real:** LaunchOpenClaw can stand up an isolated OpenClaw container. Landing is the product meant to trigger that after pay. Dashboard spawn talks to a **shared bridge**, not per-tenant LaunchOpenClaw.
- **Persist:** LaunchOpenClaw deployment records on disk; Landing owner map in JSON file; Dashboard state in Convex.
- **Still demo/WIP:** Company OS narrative, payment entitlements, sandbox API, Connected/templates phase, monthly convert (S4), reliable Mis agentes across hosts (S2).

---



## 5. Product boundaries

| Surface                    | Code reality                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent Launcher / Lab**   | Landing + LaunchOpenClaw. Matches `00`/`02` CURRENT wedge: hosted OpenClaw seat.                                                                          |
| **Dashboard / Company OS** | Separate app. UI/schema for Stage 3–4 concepts; runtime via Motus-style **bridge**, not Lab launcher. Per `00`/`03` this is THESIS — not CURRENT product. |
| **LaunchOpenClaw**         | Infra for Lab seats (and theoretically Flujo A contracts). Dashboard spawn path does not call it today.                                                   |

**Overlap:** Both surfaces talk “deploy company/agents.” Docs say Lab is the wedge; code still runs a parallel Dashboard OS prototype.

---



## 6. Claims we can make today

- Avril has a **Lab rent product surface** (checkout + webhook + launcher client) aimed at hosted OpenClaw.
- LaunchOpenClaw can **provision dockerized OpenClaw** with status API and Control UI URL pattern.
- Dashboard can run a **founder interview → handoff → Agent Office** loop against an OpenClaw bridge.
- Canonical docs (`00`/`02`) correctly name **Lab as CURRENT** and **Company OS as THESIS**.

---



## 7. Claims we should NOT make yet

- “Pay → agent ready” as verified production proof (`03` Stage 1 proof incomplete).
- “Agentic Company OS” as CURRENT/BUILT product (`00`/`01` = THESIS; Dashboard ≠ shipped OS).
- Skills/MCP/templates/governance as included Lab offer (`02` “over time” — mostly not in Lab path).
- Dashboard and Lab as one continuous paid funnel.
- Multi-tenant secure launcher API (token unused; Motus bridge ≠ private seat).
- Stage 2–4 capabilities as sold or proven (`03` constraint: promote only after evidence).

---



## 8. Top blockers

1. **Stage 1 proof open (**`03`**):** no closed evidence paid Stripe → `ready` Control UI in prod.
2. **Two runtimes:** Lab → LaunchOpenClaw seats vs Dashboard → Motus bridge — conflicts with “launcher = market sensor” (`00`).
3. **Dashboard ahead of docs:** ships OS-shaped flows while `00`/`03` say do not build OS first.
4. **Fragile Lab persistence / capacity:** owner-agents JSON; \~3 seats/VPS; Contabo ops.
5. **Launcher auth gap:** `LAUNCHER_TOKEN` not enforced on LaunchOpenClaw API.

---



## 9. Intention vs reality (`00`–`03`)



### `00` Company overview — CURRENT framing

| Doc claim                                                          | Code reality                                                                                        | Verdict                                   |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Current product = Agent Launcher / Lab                             | Landing + LaunchOpenClaw implement rent → provision OpenClaw                                        | **Aligned**                               |
| Long-term = Agentic Company OS (discover via deploys)              | Dashboard already builds opportunity/blueprint/Office/approvals-shaped UI                           | **Misaligned** — OS UI ahead of Lab proof |
| Wedge: persistent agent, no server setup, isolated runtime, BYOK   | LaunchOpenClaw does isolation + Control UI; BYOK is copy/Control UI, not a Lab provisioning feature | **Mostly aligned** (BYOK = WIP/ops)       |
| Do not build the OS in advance; launcher = product + market sensor | Parallel Dashboard “Vibe Founding OS” + Motus bridge bypasses Lab seats                             | **Misaligned**                            |
| Not a chatbot / not mere VPS reseller                              | Lab markets hosted runtime; Dashboard interview is chat-heavy                                       | Lab **OK**; Dashboard leans chat          |



### `01` Agentic company thesis — THESIS only

| Doc claim                                                | Code reality                                                                                   | Verdict                         |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| Unit of design = organization (owner → company → agents) | Dashboard models orgs/sessions/agents in Convex; Lab sells a seat, not an owned company system | Thesis **not BUILT** as product |
| Human-owned, supervised agents                           | Dashboard has Office / approvals tables; Lab has little governance                             | **WIP** / prototype only        |
| Not “autonomy as final objective”                        | Neither repo ships full autonomy claims in Lab path                                            | **OK** if we don’t overclaim    |

Treat `01` as worldview, not feature list. Do not mark any of it BUILT from Dashboard screens alone.

### `02` Agent Launcher — CURRENT / WIP

| Doc claim                                                           | Code reality                                                         | Verdict                                         |
| ------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Core job: deploy persistent agent without user operating infra      | Landing webhook → LaunchOpenClaw Docker seat                         | **BUILT in code**; prod reliability **UNKNOWN** |
| Isolated hosted OpenClaw + control UI + rental                      | Present in Landing plan + launcher                                   | **Aligned**                                     |
| Customer buys ready environment, not Docker/VPS                     | True if pay→ready works; else customer hits infra failure modes      | **WIP**                                         |
| Commercial boundary: host runtime, don’t guarantee business outcome | Landing Lab copy matches; Dashboard sells company/blueprint outcomes | Landing **aligned**; Dashboard **overshoots**   |
| Upward value (context, tools, templates, governance) later          | Mostly absent from Lab path; some appear as Dashboard prototypes     | **THESIS**, not Lab BUILT                       |



### `03` Product evolution — THESIS / PLANNED

| Stage                           | Doc primary proof                                   | Code reality                                             | Verdict                            |
| ------------------------------- | --------------------------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| **1** Deploy an agent           | users pay, deploy, stay active, infra reliable      | Pay→ready path exists; proof gate open                   | **Current stage; incomplete**      |
| **2** Agent with a job          | business-ready configs (sales/ops/…)                | No Lab template SKU; Dashboard blueprints ≠ sold configs | **Not started as product**         |
| **3** Multi-agent control plane | shared context, permissions, budgets, orchestration | Dashboard Office/orchestration prototype; not Lab        | **Premature build vs docs**        |
| **4** Company OS                | Opportunity→Blueprint→Deploy→Operate…               | Dashboard marketing + flows sketch this                  | **THESIS UI, not Stage 4 product** |

`03` constraint (“promote THESIS→PLANNED only after evidence”) is **violated in practice** by Dashboard OS framing while Stage 1 proof is still open.

### Net: docs vs code

- **Docs are right** about hierarchy: Lab CURRENT, OS THESIS.
- **Code partially follows** Lab (Landing + LaunchOpenClaw).
- **Biggest gap:** Dashboard behaves like Stage 3–4 while Stage 1 proof (`03`) is not closed — and it doesn’t even use the Lab launcher as the sensor `00` describes.

---



## Direct answers

1. **¿Pago → agente provisionado?** En código, sí (Landing → LaunchOpenClaw). Como proof Stage 1 (`03`): **UNKNOWN**. Sin `LAUNCHER_URL`, pago sin agente.
2. **¿Dashboard = Company OS?** No como CURRENT/BUILT. Es **prototipo Stage 3–4** frente a docs que lo marcan THESIS.
3. **¿Separación clara?** En `00`–`03`, sí. En código, **parcial**: Lab path exists, pero un segundo pipeline (Dashboard + Motus bridge) solapa y adelanta la tesis.
