# Agent Stack, Workflows, Pricing, and Positioning

**Research date:** 2026-10-07  
**Scope:** Avril's current commercial product is a hosted Agent Launcher / Avril Lab that provisions OpenClaw. It is **not** a finished Company OS. Prices are public list prices where a primary source exposes them; otherwise they are **UNKNOWN / quote-only**. Vendor pages demonstrate an offered capability, not independent proof of adoption or ROI.

## Executive read

1. **The runtime alone is becoming a feature.** OpenClaw is MIT, self-hosted, and has no paid tier; hyperscalers and LangChain all sell managed runtimes. The paid wedge is reliable deployment, configuration, credentials, upgrades, observability, recovery, and a support boundary—not “an LLM in a container.” [OpenClaw](https://docs.openclaw.ai/), [AWS AgentCore](https://aws.amazon.com/bedrock/agentcore/faqs/), [Google Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime), [LangSmith Deployment](https://docs.langchain.com/langsmith/billing)
2. **Customers already buy three things:** productive seats, metered digital work/outcomes, and enterprise risk reduction. Public examples span $20–$125/user-month seats, $0.10 per Salesforce action, $0.99 per Intercom support outcome, and runtime/model consumption. They do not establish a universal “per agent” price. [OpenAI](https://openai.com/business/pricing/), [Salesforce](https://www.salesforce.com/agentforce/pricing/), [Intercom](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)
3. **Enterprise willingness to pay concentrates around identity, data boundaries, auditability, evaluations, approvals, and uptime.** Those remain difficult because an agent’s authority spans many systems and acts asynchronously. Managed identity, memory, and observability are separately monetized by AWS, Datadog, and enterprise plans. [AWS AgentCore](https://aws.amazon.com/bedrock/agentcore/faqs/), [Datadog](https://www.datadoghq.com/products/ai/agent-observability/), [Cursor Enterprise](https://cursor.com/help/account-and-billing/enterprise)
4. **For Avril now:** make “persistent OpenClaw, deployed safely and kept healthy” the truthful offer. Instrument pay→ready, use, retention, cost, incidents, and support effort before moving upmarket into templates, deployment management, or a control plane. Current code evidence is deployment flow; production pay→ready and repeat use remain UNKNOWN (`02-current-product-agent-launcher.md`).

## 1. Agent-stack map

| Layer | Leading providers / OSS | Public price evidence | Commodity / switching cost | Unsolved problems and what customers pay for | Avril now |
|---|---|---|---|---|---|
| Human / company | Microsoft Copilot Studio, Salesforce Agentforce, ServiceNow, UiPath; OSS workflow engines | Copilot Studio: $200/month for 25,000 credits (annual); Salesforce $500/100k Flex Credits; ServiceNow exact price quote-only. | Product UI is commoditizing; change-management and process embedding are high-switching-cost. | Process definition, owner accountability, escalation, measurable outcomes. Buyers pay for integration into existing work and less labor/risk. | **Ignore as a platform claim.** Collect workflow demand and offer human escalation/ownership in operations. |
| Agent / runtime | OpenClaw; OpenAI Agents API; LangGraph/LangSmith Deployment; AWS AgentCore; Google ADK/Agent Runtime; Microsoft | OpenClaw has no paid tier. LangSmith $39/seat/month plus resource usage; Google Agent Runtime $0.085/vCPU-hour + $0.009/GiB-hour; AWS consumption pricing. | Basic loop/runtime: high commodity. Deployment definition, state migration, reliability, and operator playbooks: medium/high switching cost. | Long-lived sessions, restart safety, scheduling, isolation, idempotency, state migration, recovery. Customers pay to avoid “works on my laptop” operations. | **Build:** OpenClaw provisioning, health checks, status, backup/recovery, upgrades, cost caps. **Integrate:** model APIs and commodity compute. |
| Models / inference | OpenAI, Anthropic, Google, AWS Bedrock, open-weight providers | OpenAI API is token/tool/container usage; Anthropic standard public token pricing; Google lists model token pricing. | Model selection is increasingly portable; vendor contracts, eval corpus, prompt/tool tuning create medium switching costs. | Quality/cost/latency routing, regressions, long-context cost, model availability. Buyers pay for predictable spend and quality. | **Integrate, do not train.** BYOK and provider choice; expose usage/cost. |
| Context / memory | OpenAI sessions/file search, Anthropic prompt caching/MCP, AWS AgentCore Memory, vector DBs (pgvector, Pinecone, Weaviate), OpenClaw files/sessions | OpenAI file search storage $0.10/GB-day and $2.50/1k calls; AWS Memory has event/storage/retrieval metering. | Embeddings/vector store are commodity; curated company knowledge, provenance, retention and access policy are sticky. | Correct retrieval, freshness, provenance, deletion, permission-aware retrieval, compaction, cost. Customers pay for trustworthy answers grounded in private data. | **Build later only after usage evidence.** Now provide portable config/volumes and make data ownership/export explicit. |
| Tools / MCP | MCP open protocol; Anthropic MCP connector; Zapier MCP; cloud/vendor APIs | Zapier MCP: two tasks/successful tool call, no separate fee. Anthropic bills model tokens; tool-only MCP support has constraints. | Protocol/server plumbing rapidly commoditizes; trusted tool catalog, OAuth and policy are sticky. | Tool schema quality, auth refresh, destructive actions, retries, audit trail, rate limits, semantic reliability. | **Integrate:** curated OpenClaw/MCP onboarding and allowlists. **Do not build:** generic integration marketplace now. |
| Browser / computer use | OpenAI tools/containers, Anthropic computer use, Browserbase, AWS AgentCore Browser; Playwright | OpenAI hosted containers: $0.03–$1.92 per 20-minute session by memory. AWS has separately metered AgentCore services. | Browser execution is commodity; reliable, compliant task completion is not. | CAPTCHA/MFA, DOM changes, secrets, downloads, data exfiltration, human handoff, reproducible sessions. | **Ignore as core initially.** Support carefully selected tools only; no broad claim of autonomous browser reliability. |
| Identity / permissions | Okta/Entra/Cognito; OAuth; AWS AgentCore Identity; Vaults; enterprise IdPs | AWS Identity is free through Runtime/Gateway, otherwise $0.01/1k requests; most enterprise IdP pricing varies. | High switching cost and high risk once policy/audit become embedded. | Delegation, least privilege, token lifecycle, agent vs user identity, scoped background authority. | **Integrate early:** per-seat secrets, BYOK, least privilege, rotation/revocation path. **Do not invent identity system.** |
| Observability / evaluation | Datadog Agent Observability, LangSmith, Arize/Phoenix, OpenTelemetry, CloudWatch | Datadog free to 40k LLM spans/month; Pro $160/month for 100k spans. LangSmith plans from $39/seat/month. | Trace format is portable; historical eval data, alerts and runbooks create medium switching costs. | End-to-end trace correlation, cost attribution, prompt/tool regression, PII-safe logs, outcome evaluation. | **Build baseline:** deployment health, lifecycle, logs, model/cost metrics. **Integrate** full tracing/evals when customers need it. |
| Security / governance | ServiceNow AI Control Tower, Salesforce, Microsoft, AWS; OPA; guardrail vendors | Enterprise pricing usually custom. Cursor Enterprise includes SCIM, audit, managed hooks, MCP controls; quote-only. | High switching cost when audits, policy, and regulated workflows are in scope. | Approval policy, evidence, data residency, audit, red-teaming, policy drift, third-party MCP trust. | **Integrate / defer.** Start with tenant isolation, audit events, secrets hygiene, backup and incident response; do not sell “enterprise governance” yet. |
| Payments | Stripe, billing meters (Salesforce/Microsoft); x402 remains emerging | Existing Stripe integration in Avril code; public Stripe fees vary by region/product and are not asserted here. | Payment collection is commodity; usage-meter accuracy, entitlement and reconciliation are sticky. | Pay→provision atomicity, refunds, taxes, entitlements, failed webhook recovery, cost pass-through. | **Build:** idempotent webhook/entitlement/provisioning reconciliation and an operator queue. This is a direct current risk. |
| External services / humans | Slack, email, CRM, helpdesk, GitHub, ERP, BPO; HumanLayer-style approval patterns | HumanLayer offers $100/user/month Pro BYOK and enterprise quote; Intercom charges $0.99 per outcome. | APIs are commodity; embedded workflow, data mappings and human operations are sticky. | Reconciliation, exceptions, approvals, SLAs, user trust, handoff context. | **Integrate:** channels and a minimal approval/escalation path. **Do not promise end-to-end outcome automation** without workflow proof. |

### Important implementation implications

- **OpenClaw:** a self-hosted gateway connecting chat channels to agent runtime, with sessions, memory, tool use, and multi-agent routing. It requires a model-provider credential; it is not a hosted SaaS that Avril can resell as a paid OpenClaw license. [Docs](https://docs.openclaw.ai/)
- **MCP:** makes connecting tools easier but does not solve authorization, correct tool choice, retries, or approval. Anthropic’s connector currently requires publicly exposed HTTP MCP servers and supports tool calls, not the full specification. [Docs](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector)
- **Hosted runtime:** customers can buy managed execution from hyperscalers or LangChain. The differentiated promise has to be simpler launch and dependable ongoing operation for a defined OpenClaw deployment, not proprietary compute.
- **Multi-agent:** frameworks make delegation easy (for example, Google ADK supports multi-agent compositions), but accountability, shared state, budgets, conflict resolution and evaluation remain operational design problems. Treat multi-agent as a later operational capability, not a first product feature. [ADK](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-development-kit/quickstart)

### Repeatedly required, but not reliably self-provided, capabilities

1. durable identity/permission delegation and revocation; 2. clean, current, permission-filtered context; 3. deterministic approval and resumable long-running work; 4. idempotent actions/reconciliation; 5. evaluation and monitoring against business outcomes; 6. incident recovery and state repair; 7. budgets/cost attribution; 8. audit-ready provenance; 9. exception handling with a responsible human; 10. integration lifecycle management.

## 2. Real workflow landscape

The companion CSV, [`agent-workflows-2026.csv`](agent-workflows-2026.csv), contains 32 workflow rows and all requested fields. It uses primary vendor sources as evidence that the category is currently offered in product documentation. “Known pricing” is deliberately **UNKNOWN** unless the cited source lists a relevant public price.

Cross-cutting finding: the durable work is not “answer a prompt.” It is obtaining context from systems of record, performing bounded actions, recording what happened, and handing edge cases to a human. The visible categories below are offered now by customer-support, CRM, ITSM, workflow, RPA, and coding-agent vendors:

- **Support & revenue:** Intercom Fin supports answering, procedures/handoffs, routing and qualification; Salesforce sells customer/employee agents and action-based pricing. [Intercom outcomes](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes), [Agentforce](https://www.salesforce.com/agentforce/pricing/)
- **Knowledge & Microsoft work:** Copilot Studio prices generative answers, graph grounding, agent actions and flow actions in credits. [Rates](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)
- **IT & back office:** ServiceNow packages IT workflows and agents; UiPath sells agent/robot/human orchestration and document automation. [ServiceNow](https://www.servicenow.com/products/itsm/pricing.html), [UiPath](https://www.uipath.com/pricing)
- **Engineering:** Cursor Cloud Agents run isolated cloud VMs; GitHub coding agents consume AI credits and Actions minutes. [Cursor](https://cursor.com/docs/cloud-agent), [GitHub](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/about-third-party-coding-agents)
- **Cross-app automation:** Zapier MCP exposes 9,000-app integration coverage and charges successful tool calls as tasks. [Zapier MCP](https://zapier.com/mcp)

## 3. Pricing landscape

### Evidence-backed comparables

| Commercial unit | Comparable and public evidence | What it means |
|---|---|---|
| Per-seat productivity | OpenAI Business $20/user-month annual or $25 monthly; Cursor Pro $20/month; Cursor Teams Standard $40/user-month; GitHub Copilot Business $19/seat/month; HumanLayer Pro $100/user/month BYOK. | Best when a named employee gets recurring interactive value. It becomes less aligned with unattended workloads. |
| Outcome / conversation / action | Intercom Fin $0.99 per standard outcome (and $9.99 for qualification); Salesforce Flex Credits $500/100k, 20 credits/$0.10 per action; Salesforce’s external conversation pricing is published separately. | Most intuitive when outcome definition is controllable and dispute-resistant; hard when “success” is subjective or multi-system. |
| Usage / tokens / tools | OpenAI bills selected model plus tools (web search $10/1k calls; containers by session); Anthropic uses token prices and lists a $0.08/session-hour managed-agent runtime fee in its Aug. 2026 rate card; Zapier MCP consumes two tasks/successful call. | Natural cost pass-through, but end users cannot forecast it without budgets and measurement. |
| Hosted runtime resource time | Google Agent Runtime $0.085/vCPU-hour and $0.009/GiB-hour; LangSmith Deployment resource-metered; AWS Runtime consumption-priced for CPU/memory. | Suitable for platform buyers; customers need idle/scale-to-zero and cost controls. |
| Observability | Datadog has free 40k LLM spans/month, then $160/month for 100k spans. | Demonstrates that traces/evals are an independently purchasable operational layer. |
| Platform consumption / enterprise commitment | Microsoft Copilot Studio $200/month annual for 25k credits; ServiceNow quote-based assists; UiPath Basic from $25/month while Standard/Enterprise quote-only. | Enterprises accept pooled capacity and commitment for procurement predictability, governance and support. |
| Implementation / managed service | Public list prices are generally **UNKNOWN**; enterprise offerings commonly require sales engagement. | Do not pretend implementation is included in software margin. Scope it, price it separately, and measure support load. |

### Avril pricing experiments — hypotheses, not market facts

These experiments should start **only after** a verified production pay→ready flow and cost telemetry exist.

1. **Simple hosted seat:** monthly per persistent OpenClaw deployment, with published included infrastructure/support boundary and **BYOK** model credentials. Hypothesis: reduces onboarding friction and maps to the current delivered unit.
2. **Managed deployment setup + subscription:** one-time installation/configuration for channels, credentials and safe defaults; recurring fee for monitoring, upgrades and incident response. Hypothesis: captures real operational work instead of hiding it in a low subscription.
3. **Usage pass-through with cap:** model/tool spend billed directly by customer where possible, otherwise at cost plus a transparent operator fee; hard monthly cap and alerts. Hypothesis: avoids margin loss from unpredictable agent loops.
4. **Team plan only when earned:** tenant access controls, audit/history, alerts, backup/recovery and response SLA. Hypothesis: customers pay for operational assurance before broad “Company OS” features.
5. **No outcome pricing yet:** Avril cannot currently control or verify downstream business outcomes across arbitrary OpenClaw configurations; outcome prices would create disputes and hidden services burden.

## 4. Positioning inputs for Avril

Scales use: Low / Medium / High relative to the other paths. “Evidence Avril has” is limited to documented local product reality, not assumed customer traction.

| Path | Buyer / WTP | Sales cycle / margin / services burden | Difficulty / competition / moat | Speed to revenue / venture-scale path | Evidence Avril has / missing evidence |
|---|---|---|---|---|---|
| A. Hosted runtime / Launcher | Developer, founder, ops lead wanting persistent agent without server work; WTP initially modest unless reliability matters. | Self-serve possible; software margin can be good with BYOK, but support/infra failures erode it. | Medium difficulty; high competition/commodity. Moat only from excellent setup, reliability, distribution and accumulated configs. | Fastest to revenue; venture scale requires expansion beyond hosting. | **Has:** Landing, checkout code, webhook launch, Docker/OpenClaw provisioner, health/status flow. **Missing:** verified pay→ready, conversion, retention, unit economics, reliability. |
| B. Managed deployment | Teams that want an agent configured into their tools/channels and kept running. Higher WTP for reduced operations. | Sales-assisted; gross margin mixed; high early services burden. | Medium difficulty; fragmented competition. Moat can become templates/runbooks/integration know-how. | Fast revenue if narrowly scoped; needs repeatable package to scale. | **Has:** deployer primitives. **Missing:** ICP, standard onboarding, support/error data, permission/security posture. |
| C. Vertical agents | Functional leader with an urgent measurable workflow, e.g., support/IT/sales. High WTP when ROI is proven. | Medium/long cycle; outcome/seat margin can be strong but domain operations are heavy. | High difficulty; intense specialized competition (Intercom, Salesforce, ServiceNow, UiPath). Moat is proprietary workflow/data/distribution. | Revenue can be fast for one narrow workflow; venture-scale if repeatable in a large category. | **Has:** none documented as commercial vertical validation. **Missing:** chosen vertical, outcome baseline, integrations, buyer discovery, compliance. |
| D. Agent infrastructure | Developers/platform teams value runtime, identity, memory, observability. WTP can be material at scale. | Developer-led to enterprise; usage margin depends on hosting. | Very high difficulty and hyperscaler/framework competition. Moat needs technical depth, ecosystem, data/network effects. | Slower; potentially large only with distinctive layer. | **Has:** runtime-deployment experience only. **Missing:** differentiated primitives, developer adoption, OSS/community proof. |
| E. Multi-agent control plane | Platform/operations leaders managing many agent deployments. WTP grows with complexity/risk. | Enterprise cycle; good software margin if standard product; implementation burden medium/high. | High difficulty; control plane/observability/governance incumbents. Moat is cross-agent data, policy and operational workflow. | Later expansion after multiple real agents exist. | **Has:** dashboard prototypes only. **Missing:** customers operating multiple agents, concrete pain, shared-state/permission requirements. |
| F. Company OS | Executive/operations buyer seeking end-to-end operating model. Theoretical WTP high. | Longest cycle, highest change-management and services burden. | Extremely high difficulty; broad suite competition and unclear category boundary. Moat unproven. | Slowest; venture-scale thesis, not present product. | **Has:** long-term thesis and prototypes. **Missing:** coherent commercial product, validated buyer/problem, deployment/risk evidence. |

### Recommended near-term positioning

Use: **“Avril deploys and operates a persistent OpenClaw agent so you do not have to run the server.”**  
Add only capabilities that make this statement reliably true: ready-state verification, owner binding, credentials/BYOK, health/restart, lifecycle logs, cost limits, channel/tool configuration, and support runbooks.

Do not use as current claims: “Company OS,” autonomous business outcomes, enterprise governance, multi-agent control plane, or reliable arbitrary workflow automation. Each needs direct product and customer evidence.

## Source register

Primary sources used above and in the CSV:

- OpenClaw docs: https://docs.openclaw.ai/
- OpenAI pricing / Agents: https://developers.openai.com/api/docs/pricing and https://developers.openai.com/api/docs/guides/agents-api/overview
- Anthropic pricing / MCP: https://docs.anthropic.com/en/about-claude/pricing and https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector
- Cursor cloud agents / pricing: https://cursor.com/docs/cloud-agent and https://cursor.com/docs/account/pricing
- GitHub Copilot plans: https://docs.github.com/en/copilot/get-started/plans
- Microsoft Copilot Studio billing: https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management
- Salesforce Agentforce: https://www.salesforce.com/agentforce/pricing/
- Intercom Fin: https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes
- Zapier MCP: https://zapier.com/mcp
- UiPath pricing: https://www.uipath.com/pricing
- ServiceNow AI Agents: https://www.servicenow.com/community/servicenow-otto-articles/ai-agents-faq-and-troubleshooting/ta-p/3200454
- Google Agent Platform: https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing
- AWS AgentCore: https://aws.amazon.com/bedrock/agentcore/pricing/
- LangSmith: https://www.langchain.com/pricing
- Datadog Agent Observability: https://www.datadoghq.com/products/ai/agent-observability/
