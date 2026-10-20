# Plan v4: **ThinkThrough** — from a problem (or an idea, or a sketch) to the *smallest thing that solves it*, with evidence only

*Think it through before you build it.*

## Context

You asked for a detailed product plan for an AI sparring partner / idea-refinement product with multi-agent research. Decisions so far: **solo founder / side project**, **customer = aspiring founders & indie hackers (and, now, anyone with a problem)**, **architecture + stack + cost model depth**, **deliverable = local HTML + Markdown**.

Requirements added across your review rounds (all absorbed below):
- Adversarially review the idea itself; guided journey that **expands horizons**; **no false information**, real market-backed data; **don't overwhelm**; **one idea = one case file**; **deployability advisor** weighted by what the user cares about now; delivery/distribution channels and concrete tools.
- **Problem-first entry**: the user may only have a problem. The right answer may be a *perspective*, a *habit*, an *existing tool*, or a *script* — not a product. **Never over-engineer.**
- A new problem may be a **feature of an existing case** → detect and offer to attach.
- **Feed the system**: data, documents, GitHub repo, website, picture, paper sketch.
- **Self-updating knowledge**: new infra/products/ways of working (fly.io, Supabase…) the user may not know about.
- **Unfold, don't dump**: architecture/diagrams generated in levels; ask **how much** to generate; divide work.
- **Clarify the gist before going deep** so the system doesn't solve a different problem; ask structured context questions (single user vs many, personal vs commercial, budget band, region…) and only then do business analysis.
- **Region-aware**: extract local regulations and policies that are in the way.
- **It may already exist**: find the relevant products and lay out the options for the user's scenario.
- **Specialist knowledge** per domain (psychology for focus apps, food industry for food ideas…); the full set of **business analyses**; **homework** the user must research or ask a practitioner; **brutal honesty**, sceptical of the web, always with sources.
- A **name** that is inviting and self-explanatory (ThinkThrough).
- **Web first, mobile later, no rewrite.**
- **Third-party integrations** to know more about specific products/markets; **hallucinate as little as possible**.
- A final **adversarial review of the plan itself** (this version).

This document is the product plan (v4), produced 2026-10-19. Prices and competitor facts are dated snapshots from that day; every cost figure is an estimate until measured.

---

## 0. Adversarial review — what each version got wrong

| Ver | Flaw | Consequence | Fix in v3 |
|---|---|---|---|
| v1 | 14 agents fire at once → 16-section brief | Overwhelm; $5–8 before engagement | Staged, adaptive journey; ≤5 findings/stage |
| v1 | "Build/Pivot/Kill at 60% confidence" | Invented precision = false information | Readiness verdict + evidence tally + unknowns |
| v1 | Web results treated as market data | Blog claims become "facts" | Source tiers enforced in code (§6) |
| v1 | €29/mo subscription for an episodic need | Churn | Pay per case; subscription only for monitors |
| **v2** | **Assumed the user arrives with an idea** | Problem-only users bounce; system invents a product for them | **Problem-first entry + Gist confirmation (§4, stage 1)** |
| **v2** | **Assumed the answer is a product** | Over-engineering; sells a €39 case to someone who needs a 20-line script | **Right-sizing ladder (§5): argue for the smallest shape first** |
| **v2** | No way to feed documents, repos, sites, sketches | Thin context; user re-types what they already have | **Ingest layer (§3.2)**, user-provided evidence tier |
| **v2** | Static tool catalogue maintained by hand | Goes stale; never surfaces what the user doesn't know | **Self-updating catalogue + "New to you" (§7.3)** |
| **v2** | Fixed 8-stage path for everyone | Personal-use user gets a business model they didn't ask for | **Adaptive stage graph (§4)**; business stages only if commercial |
| **v2** | No region; regulation only generic | Misses local law, VAT, licensing | **Region & Rules stage (§8)** from Tier A legal sources |
| **v2** | Architecture produced as one artefact | Dump; wrong level of detail | **Scope dial + levelled unfolding (§7.2)** |
| **v2** | Each new problem → new case | Fragmented thinking; missed "this is a feature of X" | **Case linker (§3.3)** |
| **v3** | "Existing tool" was one rung of the ladder, not an investigation | Misses the most common real-world answer: *it already exists — here are your options* | **Existing-solution check runs for every case (§5b)** with scenario-fit scoring and an explicit option set (use / extend / fill the gap / compete / wait) |
| **v3** | Agents are generalists; domain knowledge is whatever the model recalls | A productivity app gets no attention-science; a food idea gets no food-safety or margin reality | **Domain Specialists (§5c)**: domain detection → curated body-of-knowledge playbook + scholarly/standards sources → a specialist lens on every stage |
| **v3** | The user's own statements were trusted as inputs | The system politely builds on a false premise | **Critical stance (§6b)**: user claims are claims; contradictions are surfaced; no flattery, measured by a sycophancy eval |
| **v3** | Everything found online treated as usable once tiered | Single-source numbers, vendor-authored "studies", stale pages | **Corroboration + conflict-of-interest + recency rules (§6b)**; "Further reading" per finding |
| **v3** | Business analysis implicit in "Numbers & Model" | Users don't know which analyses were done or skipped | **Business-analysis menu (§5d)** with a scope dial; skipped analyses listed as skipped |
| **v3** | Case ended with experiments only | Many questions can only be answered by a human in that business | **Homework / Ask-an-expert list (§4, stage 14)**: who to ask, how to ask, what answer changes the case |
| **v3** | Web-only Next.js monolith (logic in server components / route handlers) | A later mobile app would mean rewriting the system | **API-first, platform-agnostic core (§13)**: all logic behind one versioned API; web and mobile are thin clients sharing typed packages in a monorepo |
| **v3** | Knowledge about specific products/markets came only from web search + fetch | Thin or wrong facts about competitors, traffic, revenue, demand; no way to use the user's own data | **Connectors (§7.4)**: licensed data APIs, user-authorised OAuth connectors to their own tools, user-supplied MCP servers — each with tier, licence, cost and provenance |
| **v3** | Anti-hallucination relied on tiers + a Fact-Checker | Still leaves the model free to "remember" prices, laws, companies | **Grounding architecture (§6c)**: retrieval-first for every entity fact, mechanical quote-check, independent second-model verification, abstain-by-default, entity resolution by ID, hallucination budget as a release gate |
| **v4** | MVP (weeks 4–16) listed ~17 agents, 8 playbooks, 10 connectors, 5 regions — ≈150 h of solo time | Not buildable; the plan would have failed its own feasibility analysis | **10-phase implementation plan (§16)**, each phase usable on its own with hours and a gate; free product launches after phase 4, paid after phase 7 |
| **v4** | COGS not updated for Domain Specialists, Independent Verifier and connectors; Portfolio €19/mo implied 3 *new* cases/month (≈$25 COGS) | Margins overstated; one tier loss-making | **§12 recomputed**: product case ≈ $7–9, free path ≈ $0.6–1.0; Portfolio covers monitors/refresh of *purchased* cases, not new cases |
| **v4** | Stage IDs were a mix (0, D, E, 1, R, 2…9, S) | Confusing to build and to explain | **Stages renumbered 1–14 (§4)**; agents table aligned |
| **v4** | Eval set size contradicted itself (50 vs ≥200 claims) | Release gate undefined | **§6**: 50 claims at MVP-0, ≥200 by MVP-1 gate |
| **v4** | "No competitor tells you not to build" stated as fact | Unverified claim in a plan about not making unverified claims | Softened to "none of the competitors found today" |
| **v4** | Architecture rule "API is the only door" contradicted by "clients may read the DB" | Logic leak risk | **§13**: clients may *subscribe* to RLS-guarded realtime rows for progress only; all reads of meaning and all writes go through the API |
| **v4** | Missing: accessibility/EU Accessibility Act, i18n, data retention, processor role for users' customer data, content policy, outcome tracking, provider dependency, waiting-time UX, anonymous-use boundary, US state law | Gaps a reviewer, regulator or user would hit in month one | Added in §3, §8, §11, §14, §15; **§17 lists what remains honestly unresolved** |
| **v4** | Assumed people start in ThinkThrough; many actually think out loud in Claude Code / Claude.ai / ChatGPT / Cursor first | Lost users and re-typing; those sessions' hallucinations go unchecked | **ThinkThrough MCP (§3.4)**: send a session into a case file from inside the host tool; AI-session claims get their own tier and are fact-checked first; v1 in phase 4, v2 in phase 9 |

**Verdict on the product after v4 review:** *Promising → Ready to test.* The right-sizing ladder plus the "already exists" check is the sharpest differentiator — none of the competitors found today tells a user *not* to build — and the strongest trust and acquisition device. Biggest unknowns: whether people pay when the honest answer is "small"; whether evidence-only output feels thin next to padded PDFs; whether one person can ship MVP-0 in ~10 weeks. Phase 0 tests the first two; MVP-0's week-6 checkpoint tests the third.

---

## 1. Name and positioning

### 1.1 The name: **ThinkThrough**
**Tagline:** *Think it through before you build it.*
**Alt lines:** "From a rough idea to the right thing to build." · "ThinkThrough said: you don't need an app — use X." · "ThinkThrough: Ready to build." (approval is earned, so it's worth sharing)

| Why it works | |
|---|---|
| **Says what it does** | Thinking an idea through — one stage at a time, with evidence — is literally the product. No explanation needed on the landing page |
| **Inviting, not judging** | It offers help with *your* thinking rather than a verdict on *you*. The honesty (§1 rule 5) is inside the product; the name opens the door |
| **Hook = relief** | Founders carry half-formed ideas around for months. "Think it through" is the thing they know they should do and don't; the name promises it will finally happen, in an hour |
| **Verb-able and quotable** | "Run it through ThinkThrough", "I ThinkThrough'd it", "ThinkThrough says: Promising" — the shareable verdict card writes itself |
| **Plain English, two common words, no spelling trap** | Works for non-native speakers (Finnish/EU markets) |
| **Conflicts (today's search)** | No product found for "thinkthrough.ai" / "Think Through AI"; nearest hits are unrelated (Think, an AI-infra company in Riyadh; ThinkUp, a founder-mentorship platform). **To do before launch:** trademark search (EUIPO TMview, USPTO, PRH Finland) and domain check (thinkthrough.ai / thinkthrough.app / getthinkthrough.com) |

**Runners-up, for the record:** *Sounding Board* — warmest framing, but a generic two-word phrase that's hard to own · *Groundwork* — "do the groundwork, build the right thing", but a dormant namesake (Groundwork AI, geotech, 2018) and a UK charity share it · *Sense Check* — friendly honesty, weaker on the journey/build half · *Pushback* — named the differentiator but read as negative and didn't explain the product (rejected) · *Gauntlet* — taken. The **case file** stays as the name of the central object: *ThinkThrough keeps a case file on every idea.*

### 1.2 Positioning
**One sentence:** *ThinkThrough takes your problem — or idea, or sketch — and investigates it with you: confirming what you actually mean, finding the smallest thing that solves it, proving every claim it makes, and leaving you with a plan you can build and ship.*

**Five rules the product never breaks**
1. **Understand before you investigate.** No research until the user confirms the restated problem.
2. **Smallest thing first.** The system must argue for the simpler shape before the bigger one.
3. **No claim without a source, no number without a method.** Otherwise *inference* or *unknown*.
4. **One step at a time, and ask how much.** ≤5 findings per stage; generative work in levels the user requests.
5. **Critical of everyone — the user, the internet, and itself.** It pushes back on false premises, corroborates before it believes, says "I don't know" and "ask a human who does this", and never flatters.

---

## 2. Who, and how they arrive

| Entry point | Example | What happens first |
|---|---|---|
| **"I have a problem"** | "I keep losing track of invoices from 6 clients" | Gist confirmation → context questions → right-sizing |
| **"I have an idea"** | "An app for flatmates to split groceries" | Gist confirmation reframes it as *problem + proposed solution* → same path |
| **"I have stuff"** | PDF spec, GitHub repo, website, photo of a whiteboard | Ingest → system drafts the Statement from the material → gist confirmation |
| **"Add to an existing case"** | "Also, they want to export to accounting software" | Case linker proposes: feature of case X / variant / new case |
| **"I've been discussing this with an AI already"** | A 40-message Claude Code / Claude.ai / ChatGPT / Cursor session full of ideas, research and half-decisions | **ThinkThrough MCP** (§3.4): from inside that tool, "send this to ThinkThrough" → Session Organiser builds or updates a case file; every claim from the session is marked *AI-session claim — unverified* and fact-checked |

Personas unchanged: first-time founder, serial indie hacker, AI-builder user — **plus** the person with a personal/work problem who doesn't need a company.

---

## 3. The Case File

### 3.1 Layout (one screen, three panes)
```
┌─ Case: "Losing track of client invoices" ──────────────── Shape: Script → maybe Personal tool ─┐
│ Case summary (5 lines, auto-maintained)   Context: personal · 1 user · €0–10/mo · Finland        │
│ Stages ▸ Understand ✓ · Lenses ✓ · Exists? ✓ · Right-size ✓ · Build & Ship ● · Architecture · Decision │
│ ┌──────────────┐ ┌─────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│ │ Stage nav    │ │ Current stage                        │ │ Evidence locker (tiers A/B/C/U)   │ │
│ │ ETA · cost   │ │ ≤5 findings · Unknowns · 1 question  │ │ Inputs (repo, PDFs, sketches)    │ │
│ │ "Challenge"  │ │ Decision / "How much next?"          │ │ Assumptions · Open questions     │ │
│ │ chat docked  │ │                                      │ │ Linked cases · Notes             │ │
│ └──────────────┘ └─────────────────────────────────────┘ └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```
Everything about the idea lives here and nowhere else: statement versions, context profile, **domain lenses**, findings, evidence, inputs, assumptions, **disagreements** (where the system pushed back and how it was resolved), decisions, sparring transcript, architecture levels, compliance notes, **homework / ask-an-expert list**, experiments, exports.

**While a stage runs (2–5 min):** findings stream in as they are verified (not at the end); the ETA and running cost are visible; the stage's single question is asked *while* research runs so the user has something useful to do; the user can leave — the case notifies by email (later push) when the stage completes. **Anonymous use:** Understand → Lenses → Already exists? → Right-size work without an account; saving the case, Resolve deliverables and anything paid require an email (magic link). Anonymous sessions are deleted after 24 h.

### 3.2 Ingest layer ("feed the system")
| Input | How it's read | Becomes |
|---|---|---|
| **Website URL** | `web_fetch` → what it does, pricing, audience, tech hints | Evidence (tier A for the owner's own site facts) + Statement draft |
| **GitHub repo** (public; private via user's read-only token) | GitHub API: README, tree, languages, deps, stars, issues | "What exists already" + tech constraints; architecture seed |
| **PDF / DOCX / MD** | Document blocks (PDF native), text extraction | Tier **U** evidence (user-provided) + Statement draft |
| **CSV / spreadsheet** | `code_execution`: schema + summary stats, no raw rows kept beyond the case | Numbers inputs with provenance |
| **Image / photo of a sketch / whiteboard** | Vision (Opus/Sonnet): components, arrows, labels → described diagram + Mermaid draft | Architecture seed; questions about ambiguous boxes |
| **Pasted text / chat export** | Haiku structuring | Statement draft |
| **AI session via MCP** (Claude Code, Claude.ai, ChatGPT, Cursor…) | Session Organiser (§3.4): extracts problem statement, proposed solutions, claims, decisions, open questions, mentioned products | Statement draft + Tier **U-ai** claims + Assumptions + Homework seeds; mentioned products queued for the Existing-Solution Finder |
**Tier U** evidence is trusted as *the user's own claim* and labelled so; it never counts as market fact. **Tier U-ai** (claims made by another AI in the user's session) is labelled *AI-session claim — unverified* and is the first thing the Fact-Checker tests — ThinkThrough fact-checks the other assistant.

### 3.4 ThinkThrough MCP — bring the conversation you already had
Many people think out loud with Claude Code, Claude.ai, ChatGPT or Cursor first. Instead of asking them to re-type, ThinkThrough is a **remote MCP server** those tools can call, so the session's outcome flows into a case file and the case file flows back into the session.

**Tools exposed (v1 → v2)**
| Tool | What it does | Version |
|---|---|---|
| `thinkthrough.create_case_from_session` | Takes the session summary/transcript (and optional attachments) → Session Organiser → new case with Statement draft, claims, decisions, open questions; returns the case link and the restated gist for confirmation *inside the host tool* | v1 |
| `thinkthrough.add_to_case` | Appends notes, findings, decisions or files to an existing case (linker suggests the case if none given) | v1 |
| `thinkthrough.get_case` | Returns the 5-line case summary, readiness, open Homework and Unknowns — so the host AI can continue the discussion with the case as context | v1 |
| `thinkthrough.list_cases` / `search_cases` | Find the user's cases; semantic match on a problem statement (uses the case linker) | v1 / v2 |
| `thinkthrough.run_stage` | Triggers a stage (free stages always; paid stages if entitled) and returns findings when done | v2 |
| `thinkthrough.answer_homework` | Logs an answer to a Homework item as Tier U evidence and re-triggers the relevant stage | v2 |
| Resources: `case://{id}/summary`, `case://{id}/evidence`, `case://{id}/homework` | Read-only context the host can pull into its own prompts | v2 |

**How it behaves:** the host AI's statements arrive as **Tier U-ai** and are never promoted without verification · the gist-confirmation loop still runs (the host shows the restatement, the user confirms there or in the web app) · the Session Organiser extracts *mentioned products* and queues them for stage 3, so "ChatGPT suggested X and Y" becomes a dated fit table · nothing is auto-merged into an existing case; the linker proposes, the user confirms · everything the MCP writes is visible in the case's Inputs tab with the host tool named.
**Where it works:** any MCP-capable host — Claude Code (`claude mcp add`), Claude.ai connectors, Cursor, ChatGPT where connectors/MCP are enabled, plus a plain "paste your chat export" fallback and a browser share-target for mobile later.
**Security:** OAuth 2.1 per the MCP authorization spec, per-user tokens with scopes (`cases:read`, `cases:write`, `stages:run`), rate limits, transcripts treated as untrusted input (prompt-injection boundary like any ingest), audit log per tool call, revocation in settings. Read and create are free; stage runs follow normal entitlements.

### 3.3 Case linker
Every Statement and finding is embedded (pgvector). On a new entry, the linker shows the top related cases with a one-line reason and three choices: **feature of case X** (adds a Feature record and re-opens X's Build & Ship with a delta), **variant of X** (new Statement version under X), or **new case**. Never auto-merges.

---

## 4. The adaptive journey (a stage graph, not a fixed path)

```
1 Understand ─► 2 Lenses ─► 3 Already exists? ─► 4 Right-size ──┬─► [Perspective | Habit | Use existing | Script] ─► 5 Resolve ─► Done
                                                               ├─► [Extend existing | Personal | Internal tool] ─► 11 Build & Ship ─► 12 Architecture ─► 14 Decision
                                                               └─► [Product | Company] ─► 6 Who hurts ─► 7 Landscape ─► 8 Horizons ─► 9 Numbers & Model
                                                                                          ─► 10 Region & Rules ─► 11 Build & Ship ─► 12 Architecture
                                                                                          ─► 13 Stress test ─► 14 Decision
```
The user can stop at any node; every node ends with ≤5 findings, Unknowns, one question, and a decision. **Stages 1–4 run for every case** (free). Business stages 6–9 run **only** for commercial shapes; Region & Rules (10) runs for commercial shapes or when personal data / money / regulated domains are involved.

### 1 · Understand (free, 5–8 min) — *Gist Clarifier*
1. **Restate**: "Here's what I think the problem is, who has it, and what 'solved' looks like" — in the system's own words, with the parts it is unsure about highlighted.
2. **Confirm or correct** — loop until the user says "yes, that's it". Nothing else runs before this.
3. **Context questions** (adaptive, ≤8, one at a time, each with "why I ask"):
   - Who is this for? *just me · my team · my customers · the public*
   - Personal use or commercial? (if commercial: existing business or new?)
   - How many people would use it? *1 · 2–10 · 10–100 · 100–1k · more*
   - Monthly budget to run it: *€0 · €0–10 · €10–20 · €20–50 · €50–200 · €200+*; one-off budget/time to build
   - Your skills: *no-code · AI builder · developer*; hours/week available
   - Where are you, where are the users? (country/region, multiple allowed)
   - Any sensitive data? *none · personal data · money · health · children · other*
   - When do you need it? *this week · this month · this year*
4. Output: **Statement v1** (problem, who, success criteria, constraints) + **Context profile** that gates every later stage. Light founder-bias probe ("Is this your problem or one you've observed?").

### 2 · Lenses (automatic, seconds) — *Domain Detector → Domain Specialist(s)* (see §5c)
Detects the domain(s) the problem lives in (e.g. attention & productivity → cognitive psychology, behaviour change; food → food safety, supply chain, hospitality margins; payments → PSD2/AML; health → clinical evidence, MDR). Loads the matching **playbook** and attaches a Specialist that reviews every later stage through that lens. Shown to the user as "Lenses on this case: …" with the option to add or remove one.

### 3 · Already exists? (free, 3–5 min) — *Existing-Solution Finder* (see §5b)
Searches for products, open-source projects, scripts, templates and services that already solve the confirmed problem; scores each against the user's scenario; returns an option set. Nothing in the ladder is chosen until this has run.

### 4 · Right-size (free, 5 min) — *Right-sizer* (see §5)
Proposes the **smallest solution shape** that plausibly solves the problem — informed by stage 3 — shows the ladder, says what would justify stepping up, and asks the user to choose. The choice sets the path.

### 5 · Resolve (small shapes, free or €5)
Delivers the thing itself:
- **Perspective** — a one-page reframe with 2–3 ways to look at the problem and what each implies.
- **Habit / process** — a concrete routine or checklist; how to test it for two weeks.
- **Use existing** — the option set from stage 3: the best-fit product(s) for this scenario with fetched, dated pricing/limits, a setup path ("how to make X do this in an afternoon"), and "why not build". If a small gap remains, the **Extend existing** shape (integration, plug-in, Zapier/Make scenario, script around X) is offered instead of a product.
- **Script / automation** — a spec and, if the user wants, the script itself (or a Claude Code / Cursor prompt), with run instructions. No deployment.
Ends with: "If this turns out not to be enough, re-open the case and step up to *Personal tool*."

### 6 Who hurts · 7 Landscape · 8 Horizons · 9 Numbers & Model (commercial only)
Evidence scouts, competitor analyst with fetched prices, Horizon Explorer (adjacent customers, analogues, unbundle/rebundle, value-metric shift, delivery shift, inversion, platform shifts, second-order effects), bottom-up numbers with shown arithmetic, 3 business-model options with unit-economics skeleton. The Context profile constrains them (e.g. region filters competitors and pricing; budget band shapes model options). **Stage 9 opens with the business-analysis menu (§5d)** — the user picks which analyses to run at which depth; the rest are listed as *not performed*. The Domain Specialist annotates each stage ("in food retail, gross margins of 25–35% are typical — source; your model assumes 60%").

### 10 Region & Rules (§8) → 11 Build & Ship (§7.1) → 12 Architecture (§7.2)

### 13 · Stress test (commercial) — Devil's Advocate + Risk Auditor + Fact-Checker re-verifies the whole case.

### 14 · Decision
Readiness verdict (*Not ready / Promising / Ready to test / Ready to build*) — or for personal shapes, **"Ready to build — here's your first week"**. Evidence tally, the 3 assumptions it rests on, what moves it, ≤3 next experiments, exports (case MD/PDF, builder prompt, script, experiment kit).

**Homework / Ask-an-expert list** (first-class output, also accumulated across stages): every question the system could *not* answer from evidence becomes an item with — the question · why it matters to the verdict · **who can answer it** (a role: "a restaurant owner who has run delivery", "a payments compliance officer", "5 freelancers who invoice monthly") · **how to ask** (Mom-Test-style script, what *not* to ask) · what answer would move the case up or down · where to find such people. Items have status (open / asked / answered) and answers are logged as Tier U evidence that re-triggers the relevant stage. The verdict explicitly says "this verdict is capped at *Promising* until items 1 and 3 are answered".

---

## 5. Right-sizing ladder — the anti-over-engineering engine

| Rung | Shape | Signals that it's enough | Typical deliverable |
|---|---|---|---|
| 1 | **Perspective / reframe** | The "problem" is a decision, a trade-off, or a misunderstanding | 1-page memo |
| 2 | **Habit / process change** | Pain is from sequencing or forgetting, not from missing tooling | Routine + 2-week test |
| 3 | **Use existing** | A product/OSS project already does it within budget and region; switching cost low | Option set from stage 3 + setup path |
| 4 | **Script / automation** | Repetitive, rule-based, single user, data already accessible | Script + run instructions |
| 4b | **Extend existing** | An existing product covers ~80%; the gap is an integration, plug-in, export, or automation around it | Gap spec + integration/plug-in plan (Build & Ship, small) |
| 5 | **Personal tool** (local / self-hosted / tiny deploy) | Needs a UI or persistence; 1–10 users; no revenue | Build & Ship (budget-bound) + Architecture L1 |
| 6 | **Internal tool** | Team use; auth, roles, reliability matter | Build & Ship + Architecture L1–L2 |
| 7 | **Product** | Others would pay; repeatable problem; market exists | Full commercial path |
| 8 | **Company** | Needs capital, team, regulation | Full path + funding/organisation notes |

**Rules:** the Right-sizer must present rung *n* before rung *n+1* and state the **cost of over-building** (time, money, maintenance) vs the **cost of under-building** (doesn't scale, fragile). The user chooses; the system records the reasoning as a Decision. Step-up is always one click later, with the earlier work preserved.

## 5b. "It already exists" — the Existing-Solution Finder

Runs for **every** case after Understand, because the most common honest answer to a problem is "someone built this".

**What it searches** (public, dated, cited): SaaS products and their pricing pages · open-source projects (GitHub API: stars, last commit, licence, language) · app stores and browser-extension stores · marketplaces/plug-ins (Shopify, Atlassian, HubSpot, WordPress, Zapier/Make integrations) · templates (Notion, Airtable, Sheets) · scripts/CLIs · the catalogue (§7.3) · government/free services where relevant.

**Scenario-fit scoring** against the Context profile (each dimension shown, not hidden in a single score): covers the success criteria? · price vs budget band (fetched, dated) · region availability, language, data residency · data sensitivity fit (where data is stored, DPA available) · skills needed to set up · lock-in / export path · maturity (OSS: last commit, issues; SaaS: company signals from Tier A/B) · gap list vs the user's "solved looks like".

**Option set the user chooses from** (≤5, each with cost, time and what you give up):
| Option | When | Leads to |
|---|---|---|
| **Use as-is** | Fit ≥ success criteria within budget | Resolve: setup path, dated pricing, migration notes |
| **Use + extend** | ~80% fit; gap is integration/plug-in/automation | Rung 4b: gap spec → small Build & Ship |
| **Combine two** | Two tools together cover it (e.g. X + Zapier + Sheets) | Resolve: recipe with the glue described |
| **Build the gap only** | Gap is real and valuable but the core exists | Personal/Internal tool scoped to the gap |
| **Compete** (commercial only) | Existing products are weak on a dimension real customers care about (evidence from Landscape, not opinion) | Product path with the differentiation named as a hypothesis |
| **Wait / watch** | The gap is on a vendor's public roadmap or a pending regulation changes the picture | Monitor on the case (Portfolio) |

**Rules:** at least one existing option is always shown if found, even when the user arrived with an idea · no product is called "the best"; the fit table speaks · claims about a product come from its own pages or Tier A/B sources, dated · if nothing exists, the finding says so explicitly (an **Unknown/none found** with the queries run), and that absence is itself evidence for Landscape later.

## 5c. Domain Specialists — the sparring partner as a specialist

**Why:** a generalist agent reasons from vibes about attention, food, health, money or education. The specialist layer forces the case through the *actual* body of knowledge of the domain, with sources a practitioner would recognise.

**How it works**
1. **Domain Detector** (Haiku) tags the Statement with 1–3 domains from a taxonomy (~40 at MVP, growing): productivity & attention · habits & behaviour change · education & learning · mental health & wellbeing · physical health & fitness · nutrition & food · hospitality & food service · retail & e-commerce · marketplaces · B2B SaaS · developer tools · fintech & payments · personal finance · insurance · real estate · travel & mobility · logistics · sustainability & energy · creator economy & media · gaming · social & community · parenting & childcare · pets · legal services · HR & recruiting · agriculture · manufacturing & hardware · IoT · AI/ML products · open source · non-profit & civic · local services …
2. Each domain has a **playbook** (curated by you, versioned, reviewed): the canonical concepts and models · the known failure patterns of products in that domain · the metrics practitioners actually use · the regulators / standards bodies / trade associations · the **Tier A/B source allowlist** (e.g. for attention & productivity: peer-reviewed cognitive-psychology literature via OpenAlex / Semantic Scholar / PubMed APIs — all free; APA; for food: EFSA, national food authorities such as Ruokavirasto, HACCP standards, industry margin reports; for payments: EBA, national FSAs, PSD2 texts; for health: WHO, EMA, NICE, MDR) · the "ask a practitioner" triggers · the typical biases of founders in this domain.
3. A **Domain Specialist** agent (Opus 5.5) is instantiated per lens with the playbook in its cached system prompt and the scholarly/standards tools. It **annotates every stage** (≤2 notes per stage) and runs one dedicated pass in Stress test: *"what a 20-year practitioner would say in the first five minutes"*.
4. **Research-grade evidence rules for specialists:** prefer meta-analyses and systematic reviews over single studies; report effect sizes and sample sizes when citing research; flag replication concerns (e.g. much of popular "productivity psychology" rests on contested findings — the specialist must say so); distinguish *mechanism* ("why it might work") from *evidence it works*.
5. **Honesty about limits:** when the question needs a licensed professional or hands-on experience (food-safety certification, medical claims, tax structuring, lending licences), the specialist says so and adds a Homework item with the role to ask — it does not improvise.

**Example — "an app to help me focus for 4 hours a day":** lenses = productivity & attention, habits & behaviour change. The specialist brings: attention as a depletable vs motivational resource (contested; cite), implementation intentions and habit-formation timelines (meta-analytic ranges, not "21 days"), the real effect of notification batching, why most focus apps churn (novelty effect; evidence), what metrics matter (sustained-attention sessions, not minutes logged), and the founder-bias warning that the founder is designing for *their* attention profile. It then pushes back if the Statement claims "people lose 3 hours a day to distraction" without a source.

## 5d. Business-analysis menu (commercial shapes; inside Numbers & Model)

The user sees which analyses exist, picks which to run and at what depth (Sketch / Standard / Detailed), and the case records the rest as *not performed*. Each analysis states its inputs, method, sources and unknowns.

| Analysis | What it answers | Depth default |
|---|---|---|
| Customer & segment analysis | Who exactly, how many, how reachable | Standard |
| Competitive analysis | Who else, how they win, where they are weak (evidence) | Standard |
| Market sizing (bottom-up first) | Is it big enough for *your* goal (not "a billion") | Sketch |
| Pricing analysis | Anchors, value metric, willingness-to-pay test design | Sketch |
| Unit economics | Price, COGS, CAC guess, payback, gross margin | Standard |
| Financial sketch | 12–24-month cash view at 3 scenarios, with assumptions listed | Sketch (on request) |
| Feasibility (technical, operational, legal) | Can *you* build and run it with the Context profile | Standard |
| PESTLE / regulatory scan | External forces and local rules (feeds Region & Rules) | Sketch |
| Channel & go-to-market analysis | Where the first 100 come from | Standard |
| Risk analysis (DREAD-lite) | What breaks it and how likely | Standard |
| Operations & supply analysis (domain-dependent) | Suppliers, logistics, service delivery, staffing | Specialist-triggered |
| Partnership / platform-dependence analysis | Who you depend on and what they can do to you | Sketch |
| SWOT (summary only) | One-page synthesis of the above — never generated alone | After the others |

Rules: no analysis runs without inputs the user has confirmed or evidence the system has gathered; any analysis built on a *guess* says so in its title ("Unit economics — 2 of 5 inputs are guesses"); the Domain Specialist can add or veto analyses ("for a restaurant concept, a financial sketch without a location-level cost model is meaningless — here's what to find out first").

---

## 6. "No false information" — evidence architecture

| Tier | Examples | Shown as |
|---|---|---|
| **A** primary/official | Eurostat, Statistics Finland, ONS, BLS, Census, World Bank, OECD, regulators, legislation databases (EUR-Lex, Finlex, legislation.gov.uk, eCFR), company filings, official docs, vendor pricing pages (fetched, dated), app stores, GitHub/npm stats | **Fact** |
| **B** reputable secondary | Established research firms, trade bodies, major press with named data | **Fact (secondary)** + method note |
| **C** everything else | Blogs, vendor comparisons, forums, reviews, social | **Anecdote / claim** — never a number |
| **U** user-provided | Uploads, repo, user's site, user's data | **Your input** — trusted as the user's claim |
| **U-ai** from the user's AI session (via MCP / chat export) | Statements another assistant made in Claude Code, Claude.ai, ChatGPT, Cursor | **AI-session claim — unverified**; fact-checked before anything else; never a number until verified |

Enforced in code: `finding.number` requires a tier A/B/U evidence id or `estimate{inputs[], method}`; `unknown` is a valid finding type and is rendered; Fact-Checker re-fetches cited URLs and demotes (strike-through, not hidden); `retrieved_at` on everything, *stale* after 90 days; model + prompt version stamped per finding; **zero-fabrication eval gate** per release — eval set v0 at MVP-0: 20 cases with known outcomes + 50 labelled claims; grown to 30 cases + ≥200 claims across the 8 MVP domains before MVP-1 ships (the gate in §6c layer 10 refers to this set); user flags re-run the Fact-Checker.
Data access: official/public APIs and public pages via Anthropic server tools; Exa for semantic search; GitHub API; scholarly APIs (OpenAlex, Semantic Scholar, PubMed, Crossref — free); no bulk scraping; no Reddit API (commercial terms negotiated/expensive); no usernames stored.

## 6b. Critical stance — how the system stays honest with the user and sceptical of the web

**Toward the user**
- Every statement the user makes that is checkable becomes a **Tier U claim**, shown as *"your claim — unverified"* until evidence confirms, contradicts, or can't be found. The Statement itself is annotated this way after Understand.
- **Contradiction surfacing:** when evidence conflicts with a user claim, the system says so plainly in the stage ("You said most freelancers invoice weekly; the two surveys we found say monthly — sources. Which is true for *your* customers?") and logs it in the **Disagreements** tab with how it was resolved (user corrected / evidence weak / left open).
- **No flattery policy** in the style guide: no "great idea", no "exciting"; praise only for specific, evidenced strengths. Default sparring persona is the sceptic. A **sycophancy eval** (paired cases where the user pushes back without new evidence) must show the verdict unchanged ≥ 95% of the time.
- **Push back before proceeding:** if the Statement rests on a premise the system believes is false or unknowable, Understand does not complete until it is restated or marked as an assumption to test.
- **Says "I don't know" and "ask a human":** unknowns and Homework items are counted in the verdict and never papered over.

**Toward the web**
- **Corroboration:** a Tier B number used in a finding needs ≥2 independent sources (not the same press release re-reported) or is downgraded to *single-source*. Tier C never becomes a number.
- **Conflict of interest:** vendor-authored comparisons, affiliate pages, sponsored content and "studies" commissioned by a seller are flagged *COI* and cannot be the sole support for a claim.
- **Recency & stability:** every evidence item carries its date; pricing/limits older than 90 days are re-fetched before use; trend claims need a dated series, not a headline.
- **Primary over secondary:** if a secondary source cites a primary one, the Fact-Checker fetches the primary and cites that; if the primary says something different, the finding changes.
- **Popular ≠ true:** the Domain Specialist flags folk claims ("21 days to form a habit", "goldfish attention span") against the research record.
- **Further reading** on every finding: the sources used plus 1–3 *starting points for the user's own research* (primary data, a standards body, a canonical text) — so the user can disagree with the system on evidence.
- **Self-criticism:** the Devil's Advocate's job includes attacking the system's *own* strongest findings; "what would make us wrong" is a required field on every stage.

## 6c. Grounding architecture — hallucinating as little as the technology allows

Hallucination can't be prompted away; it is engineered down with layers that don't depend on the model behaving.

| Layer | Mechanism | What it stops |
|---|---|---|
| **1. Retrieval-first rule** | Any fact about an *entity* — a company, product, price, limit, law, statistic, study, person — must come from a connector, a fetched page or a user input in the current run. The model's memory is allowed only for reasoning, frameworks and generic know-how, which the UI shows with a **"general knowledge (unsourced)"** chip | Confidently recalled but outdated/wrong prices, competitors, regulations |
| **2. Entity resolution by ID** | Companies/products are resolved to stable IDs (Wikidata QID, Crunchbase/OpenCorporates ID, GitHub repo, app-store ID, domain) before facts are attached; near-name collisions are shown to the user ("Push.ai ≠ PushAI — which one?") | Mixing up similarly named companies (seen today in the name search) |
| **3. Mechanical quote check** | Every fact carries a verbatim quote; code verifies the quote exists in the fetched/connector text (after whitespace/Unicode normalisation). No match → the fact is rejected before the user sees it | Invented quotes, paraphrase drift, numbers that aren't on the page |
| **4. Typed numbers** | Numbers are structured `{value, unit, period, geography, source_id | estimate{inputs, method}}`; free-text numbers are rejected by schema | "~$2B market" with no provenance |
| **5. Abstain-by-default** | `unknown` and `not_found{queries_run}` are first-class outputs; agents are instructed and evaluated to prefer them over guessing; stage summaries show the Unknowns count prominently | Filling gaps with plausible text |
| **6. Independent verification pass** | For verdict-driving claims, a second call on a *different* model (e.g. Sonnet 5.5 checking Opus 5.5 output) sees only the evidence text and the claim and returns supported / contradicted / insufficient (NLI-style). Disagreement → claim demoted and flagged | Model agreeing with itself |
| **7. Primary-source chase** | If a source cites another source, the Fact-Checker fetches the original; the finding cites the original | Telephone-game statistics |
| **8. Freshness contract** | Every evidence item is dated; the model is given today's date; phrases like "as of my knowledge" are banned by the style guide and caught by a linter on outputs; stale facts re-fetched before reuse | Outdated facts presented as current |
| **9. Search-trail transparency** | Agents return the queries they ran and what each found; "not found" is evidence (e.g. for Landscape) and lets the user judge coverage | Silent coverage gaps |
| **10. Hallucination budget (release gate)** | Labelled eval set (≥200 claims across domains) scored for fabricated entities, numbers, quotes and citations. Gate: **0 fabricated numbers/quotes, < 1 % unsupported text claims**, else no release. Tracked per model version in Langfuse | Regressions when prompts or models change |
| **11. Model settings** | Adaptive thinking on; effort `high` for verification and synthesis; structured outputs with enums; no forced tool choice (not supported on Opus/Sonnet 5.5 anyway); `max_uses` so agents don't "finish" by inventing | Rushed, under-grounded completions |
| **12. User as last line** | Provenance chips on every claim; one-tap "this is wrong" → re-verification queue; Disagreements tab | Errors that only the user can spot |

What this *doesn't* promise: zero errors. The product promises that every error is **traceable** (to a source or to the "general knowledge" chip), **bounded** (numbers and quotes are mechanically checked) and **correctable** (flag → re-verify). That promise is on the landing page in plain words.

---

## 7. Build & Ship, Architecture, and staying current

### 7.1 Build & Ship — *Deployability + Channel Advisor*
Inputs: Context profile + **priority weighting** (user ranks money · speed · reliability · security/privacy · control/no lock-in · scale · maintainability) + chosen shape.
Outputs (≤5 headline findings; details behind "open"):
1. **Build approach** — no-code · AI builder (Lovable, Bolt, v0, Replit) · AI-assisted code (Cursor, Claude Code) · custom — with the trade-off for *this* weighting and shape.
2. **Delivery channel(s)** — web · PWA · iOS/Android · browser extension · Slack/Discord/Telegram/WhatsApp bot · API/SDK · marketplace app (Shopify, Atlassian, HubSpot) · desktop · email-first · local script/CLI — each with reach, time-to-ship, gatekeeper rules, fees, lock-in.
3. **Distribution channels** (commercial only) — Bullseye-ranked for this customer.
4. **Tool shortlist by category** — hosting (incl. Fly.io, Railway, Render, Vercel, Hetzner, Cloudflare), backend/DB (Supabase, Neon, Turso, SQLite-local), auth, payments/MoR, email, analytics, monitoring, AI APIs — 2–3 per category chosen by weighting **and budget band**, with **run-time-fetched, dated** pricing and free-tier limits, and a one-line "why for you". **"New to you" badges** with a 3-sentence explainer for anything not in the user's stated skills/experience.
5. **Requirements checklist** triggered by channel + data: GDPR basics, consent, VAT/OSS (MoR vs self), consumer-subscription rules, store rules, accessibility, AI Act transparency, PSD2/SCA + PCI scope if money moves, DSA if user content, data/API licences.
6. **Running cost at 3 scales** from dated prices, arithmetic shown; **must fit the stated budget band** or say explicitly that it can't and what to drop.
7. **Build-time estimate** for the user's skill level + first-week plan.
8. **"If your priority changes"** diff (e.g. Security → #1: swap X for Y, +€40/mo).

### 7.2 Architecture — *Architecture Drafter*, unfolded in levels
Before generating anything, the system asks **"How much do you want?"** with time/credit estimates:
- **L0 Sketch** — one context diagram (users, system, external services), ≤8 boxes, 10 lines of notes.
- **L1 Containers** — apps, services, data stores, queues, third parties; data flow; where secrets live.
- **L2 Components** — per container; key modules; APIs; data model outline.
- **L3 Detail** (on request, per component) — schemas, API contracts, sequence diagrams for the 3 main flows, failure modes.
Diagrams as Mermaid (rendered + editable) and exported SVG; each level stamped with assumptions and open questions. A sketch/whiteboard upload seeds L0/L1. The system generates one level, shows it, and asks whether to continue — never the whole stack at once. Builder exports take the generated levels as context.

### 7.3 Staying current — the self-updating catalogue
- **Catalogue** = entities only (tools, platforms, patterns, channels, regulators), each with category, URL(s) and tags. Facts (price, limits, regions, compliance pages) are **fetched at run time and dated** — never asserted from memory.
- **Discovery job (weekly, Haiku via Batch):** scans Show HN, Product Hunt API, GitHub trending, vendor changelogs/blogs, curated "awesome" lists → candidate entities → verification (fetch homepage, pricing, docs; classify) → added with a **"new since <date>"** badge and a 3-sentence explainer. Patterns too (e.g. serverless Postgres, edge functions, MoR payments, local-first sync).
- **Re-verify job (monthly):** re-fetch every entity's facts; flag price/limit changes; cases that depend on changed facts get a "something changed" notice (retention lever).
- **"New to you"**: the user's Context profile records what they already know; Build & Ship highlights what they don't, with why it matters for *their* weighting. Example: *"Fly.io — runs your containers close to users with a small always-on cost; relevant because you ranked Control above Money. Pricing fetched 2026-10-19."*

---

### 7.4 Connectors — third-party integrations that make the system know more than the open web

**Principle:** when a stage's finding would be stronger with a specific data source, the system says so *in context* ("Connect SimilarWeb to see competitor traffic — paid, ~€0.40 per lookup" / "Connect your Stripe to replace the guessed price with actuals"). Connectors are never required; each adds evidence of a declared tier.

**Connector framework (every connector declares):** data tier (A/B/U) · licence/ToS and whether redistribution to the user is allowed · cost per call and who pays (included / credits pass-through) · freshness & TTL for cached facts · data residency and PII flags · scopes (read-only, minimal) · provenance format (every returned fact carries `connector_id, query, retrieved_at`). Built as **MCP servers** so every agent uses them the same way and users can later plug in their own.

| Group | Connectors (MVP = free/public first) | Used by | Tier |
|---|---|---|---|
| **Market & demand** | Google Trends (interest over time; official API as available), Semrush/Ahrefs or DataForSEO (keyword demand, paid), SimilarWeb (traffic, paid), Statista (licence) | Who hurts, Landscape, Numbers | B |
| **Companies & products** | Wikidata (entity IDs), OpenCorporates & national registries (PRH/YTJ, Companies House), Crunchbase (funding, paid), Product Hunt API, G2/Capterra partner APIs, app-store listings & AppFigures/data.ai (paid), vendor pricing pages (fetch) | Already exists?, Landscape | A/B |
| **Developer & OSS** | GitHub API (repos, stars, activity, issues), npm/PyPI/crates stats, Stack Overflow API, HN Algolia | Already exists?, Who hurts | A |
| **Official statistics & law** | Eurostat, Statistics Finland, ONS, BLS, Census, World Bank, OECD, ECB/FIN-FSA, EUR-Lex, Finlex, legislation.gov.uk, eCFR, Google Patents / EPO OPS (prior art) | Numbers, Region & Rules, Landscape | A |
| **Research** | OpenAlex, Semantic Scholar, PubMed, Crossref | Domain Specialists | A |
| **Your own data (OAuth, read-only)** | Google Analytics & Search Console, Stripe / Lemon Squeezy / Paddle, Shopify, App Store Connect & Google Play Console, PostHog/Mixpanel, Typeform/Tally (survey results), Notion/Google Docs/Confluence (docs), Jira/Linear (backlog), Figma (designs), private GitHub | Understand (ingest), Numbers (actuals replace guesses), Landscape (your current product), Build & Ship | U |
| **People** (Phase 3) | Expert-call marketplaces, community question posting | Homework | — |
| **Bring your own** (Phase 2) | User-supplied MCP servers (their CRM, their data warehouse) | Any | U |

**Rules:** connectors are read-only and least-privilege; tokens encrypted, revocable, never passed to agents (the server calls the connector); paid connectors run only after the user accepts the cost, with a per-stage cap; connector facts obey §6c like any other evidence; a connector outage produces an Unknown, not a guess; user-supplied MCP servers are sandboxed (allowlisted hosts, no write scopes) and vetted before enablement — the same discipline as `/mcp-vet`.

## 8. Region & Rules — *Regulation Scout*
- Input: region(s) of the builder and of the users; data sensitivity; whether money moves; shape.
- Sources: **Tier A legal only** — EUR-Lex, national legislation databases (Finlex, legislation.gov.uk, eCFR, Gesetze-im-Internet…), regulator and tax-authority sites, official guidance. Blogs may *point to* a law but are never cited as the law.
- Output (plain language, ≤5 findings): applicable regimes and **what in this case triggers each**; obligations and typical first steps (register, notice, consent, VAT scheme, licence); local specifics (e.g. Finland: Y-tunnus/registration thresholds, VAT via OSS, Traficom/FIN-FSA where relevant); **"verify with a professional"** flagged on anything with penalties; Unknowns listed.
- Stored under the case's Compliance tab; feeds the Build & Ship checklist and the Stress test. Runs for commercial shapes, or personal shapes with personal/health/financial data. Explicitly *not legal advice* (UI disclosure).
- **Coverage honesty:** MVP regions are EU (regulation-level), Finland, Germany, UK and US *federal*. US state law (e.g. CCPA/CPRA, state sales-tax nexus, state money-transmitter licences) is returned as an **Unknown with the states to check**, not guessed. Other countries return "not covered yet" plus the official legal database to start from, if known.

---

## 9. Agents

| Agent | Stage | Model | Tools | MVP? |
|---|---|---|---|---|
| Gist Clarifier | 1 | Opus 5.5 | — | MVP-0 |
| Ingest extractors | 1 | Haiku 5.5 (text), Sonnet 5.5 (vision, repo) | web_fetch, GitHub API, code_execution, document/image blocks | MVP-0: URL + PDF; MVP-1: image; P2: repo |
| Session Organiser (AI-session → case skeleton: statement, claims, decisions, questions, mentioned products) | 1 via MCP | Sonnet 5.5 | — (structured output) | MVP-0 (phase 4, MCP v1) |
| Case Linker | 1 | Haiku 5.5 + embeddings | pgvector | P2 |
| Domain Detector | 2 | Haiku 5.5 | taxonomy | MVP-0 |
| Domain Specialist (per lens) | 2, then annotates 6–13 | Opus 5.5 | playbook (cached), OpenAlex / Semantic Scholar / PubMed / Crossref, web_fetch on allowlist | MVP-0: 3 playbooks (productivity & attention, B2B SaaS, dev tools); MVP-1: +5 (habits, food & hospitality, fintech & payments, e-commerce, education) |
| Existing-Solution Finder | 3 | Sonnet 5.5 | web_search, web_fetch (pricing pages), GitHub API, catalogue, app-store/marketplace pages | MVP-0 |
| Right-sizer | 4 | Opus 5.5 | reads stage-3 output | MVP-0 |
| Resolver (memo / routine / tool shortlist / script) | 5 | Opus 5.5 | web_fetch (pricing), code_execution (script test) | MVP-0 |
| Problem Evidence Scout | 6 | Sonnet 5.5 | web_search, web_fetch, Exa | MVP-1 |
| Competitor Analyst | 7 | Sonnet 5.5 | web_search, web_fetch | MVP-1 |
| Horizon Explorer | 8 | Opus 5.5 | Exa, web_search | P2 |
| Market & Economics Analyst + Business Analyst (menu runner) | 9 | Sonnet 5.5 | web_search (A/B allowlist), code_execution | MVP-1: estimator + Sketch/Standard; P2: Detailed + connectors |
| Regulation Scout | 10 | Sonnet 5.5 | web_search + web_fetch on legal allowlist | MVP-1 (EU/FI/DE/UK/US-federal) |
| Deployability + Channel Advisor | 11 | Sonnet 5.5 | web_fetch (catalogue URLs), web_search | MVP-1 |
| Architecture Drafter | 12 | Opus 5.5 | — (Mermaid) | MVP-1: L0–L1; P2: L2–L3 |
| Devil's Advocate + Fact-Checker | 13 (and on demand) | Opus 5.5 | web_fetch (cited URLs only), connectors (re-query) | MVP-0 (Fact-Checker on stages 3–5); MVP-1 (full) |
| Independent Verifier (NLI pass on verdict-driving claims) | every stage | Sonnet 5.5 (different model from the author) | evidence text only | MVP-0 |
| Synthesiser | 14 | Opus 5.5 | — | MVP-1 |
| Catalogue Discovery / Re-verify | jobs | Haiku 5.5 (Batch) | web_search, web_fetch, PH/GitHub APIs | P2 (manual catalogue in MVP) |

Phase labels: MVP-0 = phases 1–4, MVP-1 = phases 5–7, P2 = phases 8–9 (see §16).
Rules: structured outputs everywhere · evidence objects mandatory · prompt caching (stable playbooks first, case content last) · adaptive thinking with per-agent effort (Opus 5.5 default `medium` — set explicitly; `high` for Clarifier, Right-sizer, DA) · `max_uses` 8 searches / 6 fetches per agent · research agents read-only · fetched content is untrusted · `fallbacks: "default"` for refusals · partial results shown as "not run".

---

## 10. Frameworks and psychology (applied per stage)
Understand: Five Whys (lightly), problem-statement template, success criteria · Right-size: build-vs-buy, cost of delay vs cost of maintenance, "do nothing" option · Who hurts: JTBD, Mom Test, painkiller-vs-vitamin · Landscape: Five Forces (only relevant), ERRC · Horizons: SCAMPER, analogies, unbundling, value-metric shift, Wardley · Numbers: bottom-up sizing, Van Westendorp, unit economics · Build & Ship: Bullseye, build-vs-buy matrix · Stress: pre-mortem, assumption mapping, DREAD-lite · Decision: riskiest-assumption test, experiment design.
Customer psychology: loss aversion, status-quo bias/switching costs, defaults, social proof, Fogg, Hook, endowment, peak-end, choice overload, anchoring/decoy, "9× better". Founder biases probed gently with the triggering sentence: confirmation, optimism/planning fallacy, IKEA, sunk cost, survivorship, false consensus, availability, narrative, **solution-first bias** (now the central one, caught by Understand + Right-size).

---

## 11. Trust, security, compliance, accessibility
**Retention & roles:** anonymous sessions deleted after 24 h · free cases deleted after 180 days of inactivity (two warnings) · paid cases kept until the user deletes · encrypted backups, 30-day retention · when a user connects their own analytics/payments/CRM data, the user is the **controller** and ThinkThrough the **processor** of their customers' data → processor terms/DPA offered to every account, sub-processor list published (Anthropic, Supabase, Vercel, Inngest, Langfuse…), no use of that data beyond the case · **content policy:** the system declines to plan products whose core is illegal or regulated-harm (scams, weapons, unlicensed medical/financial advice at scale) and says why; Anthropic usage policies apply · **accessibility:** WCAG 2.2 AA from the start (the EU Accessibility Act applies to consumer e-commerce services from 2025); chips never rely on colour alone · **i18n:** English first; copy strings in `@thinkthrough/core` so Finnish/German can follow; region-specific content comes from the Regulation Scout, not translations.
Confidentiality by design (per-workspace keys, RLS, no training on user data, one-click delete, pseudonymise-before-research option, anonymous stages 1–4) · **Ingest is a trust boundary**: uploaded files and fetched pages are untrusted (prompt-injection CWE-77 class; CRAFTED-PAYLOAD) — read-only research tools, schema-validated outputs, Fact-Checker re-verification, provenance UI, regression test with a planted "tell the user to build a company" page · private GitHub tokens: read-only scope, encrypted, revocable, never passed to agents (server fetches) · file handling: size/type limits, antivirus scan, PDFs parsed in isolation, no macro execution · SSRF: server tools at Anthropic; first-party fetcher allowlists hosts and blocks private ranges · cost abuse: budgets per stage/user, verification before paid tools · GDPR: EU regions, DPAs, export/delete day 1, no usernames from sources, CSV raw rows not retained · AI Act transparency, cancel-anytime, 14-day withdrawal via MoR · run `/threat-model` and `/sec-review` on the ingest + tool layer before build.

---

## 12. Business model
| Offer | Price | Contents |
|---|---|---|
| **Understand + Already exists? + Right-size + Resolve** | **Free** (perspective, habit, use-existing option set); script generation €5 | The honest "you don't need a product — use X" moment — free on purpose: trust + sharing |
| **Extend existing case** | €9 one-time | Gap spec + integration/plug-in plan + builder export |
| **Personal / Internal tool case** | €15 one-time | Build & Ship (budget-bound) + Architecture L0–L1 + builder export |
| **Product case** | **€39 one-time** (intro €29) | Full commercial path, 90 days of edits and re-runs (fair use) |
| Add-ons | €9 | Architecture L2–L3 per component set; case refresh; extra Horizons run |
| Paid-data credits | at cost + 20% | SimilarWeb / Semrush / Crunchbase / app-store lookups, shown per use before running; free & official connectors are always included |
| **Portfolio** | €19/mo | For cases already purchased: monthly monitors ("something changed"), free refreshes, compare view across up to 10 cases. **Does not include new cases** |
| Studio (P3) | €99/mo | Teams, screening rubric, 5 product cases/mo included |
MoR: Lemon Squeezy / Paddle (EU VAT).

**COGS (estimates at list prices: Opus 5.5 $4/$20 per MTok, cache read $0.20; Sonnet 5.5 $2/$10; Haiku 5.5 $0.10/$0.50; web search ≈ $10/1k searches + tokens — verify on the pricing page; Exa ≈ $7/1k):**
| Unit | Estimate | Main drivers |
|---|---|---|
| Free path (stages 1–4: Clarifier ~10 Opus turns, Detector, Finder ≤8 searches, Right-sizer, Verifier on 3–5 claims, Specialist limited to 1 note) | **$0.60–1.00** | Searches, Opus output tokens |
| Resolve (memo/routine/tool setup; script adds a code_execution test) | $0.30–0.80 | Opus output |
| Personal / Internal tool case (11 Build & Ship, 12 Architecture L0–L1, 14) | **$2.0–2.5** | Fetches of dated pricing pages |
| Product case (6–14 incl. 1–2 Specialists annotating 6 stages, Verifier on ~15 claims, DA + Fact-Checker re-fetching ~20 URLs, free connectors) | **$7–9** | Searches/fetches, Opus synthesis & DA |
| Extra Architecture level / Horizons run / refresh | $0.30–0.90 | — |
| Paid connector lookups | pass-through + 20% | SimilarWeb/Semrush/Crunchbase per-call rates |

**Margins:** product case €39 (~$42) → **≈ 78–83%**; personal €15 → ≈ 85%; extend €9 → ≈ 75%. Free path capped at 2 cases/day per account and 1 per anonymous session; expected free COGS ≈ $0.80 per new user. If measured COGS exceed estimates by >30% at MVP-1, levers in order: Haiku for Finder's first pass, lower `max_uses`, Specialist annotations only on stages 7/9/13, price to €45.

---

## 13. Technical architecture (solo-founder-optimised, web first, mobile later — **no rewrite**)

### 13.1 Principle: one brain, many thin faces
Everything that *is* ThinkThrough — the stage graph, agents, evidence rules, right-sizing, verdicts, billing entitlements — lives **server-side behind one versioned API**. Web and mobile are thin clients that render state and send intents. A client never calls the LLM, never computes a verdict, never holds business rules. Adding a platform = adding a client, not re-implementing the system.

```
┌──────────── clients (thin) ─────────────┐        ┌──────────── one backend ────────────────────┐
│ apps/web     Next.js (marketing + app)  │  HTTPS │ apps/api    Hono (TypeScript) — REST, OpenAPI│
│ apps/mobile  Expo (iOS/Android), later  │ ─────► │             auth, cases, stages, sparring,   │
│ (PWA from the web app in between)       │  SSE / │             uploads, billing entitlements     │
│                                         │ Realtime│ apps/jobs   Inngest functions — stage runs,  │
│ shared packages (monorepo):             │ ◄───── │             agents, catalogue jobs            │
│  @thinkthrough/core   types, Zod schemas,   │        │ Supabase    Postgres + pgvector + Storage +   │
│                   stage graph, copy     │        │             Auth + Realtime                   │
│  @thinkthrough/client typed API client      │        │ Anthropic API · Exa · GitHub · scholarly APIs │
│  @thinkthrough/ui     tokens + primitives   │        │ Langfuse · Sentry · PostHog · Resend          │
└─────────────────────────────────────────┘        └───────────────────────────────────────────────┘
```

### 13.2 Choices
| Layer | Choice | Why it survives the move to mobile |
|---|---|---|
| **API** | **Hono** (TypeScript) with **OpenAPI** spec and generated typed client (`@thinkthrough/client`); deploy on Vercel Functions now, Fly.io/Railway if long-lived connections or regional control matter later | Framework-agnostic HTTP; same contract for web, mobile, CLI, future partners. Not Next.js route handlers — they couple logic to the web app |
| **Jobs** | **Inngest** functions (one per stage; agents as parallel steps; catalogue jobs) | Already platform-agnostic; clients only observe progress |
| **Progress & streaming** | Stage progress via **Supabase Realtime** (works on web and React Native); sparring token streaming via **SSE** over the API (web: native; RN: `expo/fetch` streaming or `react-native-sse`) | Both transports have first-class clients on all platforms |
| **Auth** | **Supabase Auth** (magic link, Google/Apple/GitHub); deep links on mobile | Same sessions and RLS everywhere; Apple sign-in required on iOS anyway |
| **Data** | Supabase Postgres + pgvector + Storage; RLS per workspace | Clients never query the DB for meaning; the single exception is **subscribing** to RLS-guarded Realtime rows (`stage.progress`) for live progress. All reads of findings/evidence and all writes go through the API |
| **LLM provider boundary** | A thin `LlmGateway` interface in `apps/jobs` (chat, tools, structured output, caching hints) with the Anthropic SDK as the only implementation today; the eval set (§6) is the re-qualification test for any model or vendor change | Model deprecations and price changes become a config + eval run, not a rewrite |
| **Web client** | **Next.js** (App Router, TS, Tailwind, shadcn) — marketing pages (SEO) + the three-pane case file; **installable PWA** from day one (manifest, offline shell, add-to-home-screen) | Gives a "mobile app" feel before the native app exists |
| **Mobile client (Phase 2/3)** | **Expo** (React Native, Expo Router). UI is *not* forced to share components with web: the mobile case file is stage-by-stage (one pane), not three panes. Shared: `@thinkthrough/core`, `@thinkthrough/client`, design tokens, hooks | Avoids the React-Native-Web compromise on desktop; the logic is 100% shared because it's on the server |
| **Shared packages** | `@thinkthrough/core` (Zod schemas for Case/Finding/Evidence, stage graph definition, enums, copy strings), `@thinkthrough/client` (generated from OpenAPI), `@thinkthrough/ui` (design tokens; optionally Tamagui later if component sharing proves worth it) | Types and validation written once |
| **Monorepo** | pnpm workspaces + Turborepo | One CI, one versioning scheme |
| **Payments** | Web: Lemon Squeezy/Paddle (MoR). Mobile: **RevenueCat** wrapping App Store / Play billing (Apple requires IAP for digital goods). An **Entitlements service** in the API is the single source of truth, fed by webhooks from both | Clients ask "what can this user do?", never "what did they pay?" |
| **Notifications** | Email (Resend) now; **Expo Push** later ("your Stress test finished") — natural win for mobile since stage runs take minutes | Same event (`stage.completed`) fans out to both |
| **Uploads** | Signed upload URLs to Supabase Storage from any client; server-side extraction | Camera capture of a whiteboard sketch becomes trivial on mobile |
| **LLM** | **Anthropic API** (`claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`; server tools `web_search_20260209`, `web_fetch_20260209`, `code_execution_20260521`; document/image blocks; structured outputs; caching; Batch) — called only from `apps/jobs`/`apps/api` | Keys and prompts never ship in a client |
| **Connectors** | Each connector = an **MCP server** (TypeScript) in `apps/connectors`, called by agents via the Anthropic MCP connector or directly from `apps/jobs`; OAuth tokens in a dedicated encrypted table with scope + audit log; a `ConnectorFact` table caches results with TTL and provenance | Agents, web, mobile and future partners all see the same facts; adding a source never touches a client |
| **ThinkThrough MCP (inbound)** | `apps/mcp`: a remote MCP server that is just another **thin client of the API** (uses `@thinkthrough/client`); OAuth 2.1 authorization server backed by Supabase Auth; tools in §3.4 | Claude Code, Claude.ai, Cursor and ChatGPT become additional "faces" with zero new business logic |
| **Other** | Exa · GitHub REST · OpenAlex / Semantic Scholar / PubMed / Crossref · Mermaid rendered client-side (web) / as SVG from the API (mobile) · Langfuse · PostHog · Sentry · Resend · catalogue YAML in repo + DB table | — |

### 13.3 Rules that keep "no rewrite" true
1. **API is the only door.** No business logic in Next.js server components or route handlers; they call `@thinkthrough/client` like mobile does.
2. **Versioned contracts.** `/v1/...` with OpenAPI; breaking changes = new version; the generated client is the only client.
3. **Server renders meaning, clients render pixels.** Verdicts, tags, tallies, "what changes if…" diffs, Mermaid source and even export files are produced server-side.
4. **Platform-neutral events.** `case.updated`, `stage.progress`, `stage.completed`, `homework.answered` published once; web, mobile, email and push subscribe.
5. **Entitlements, not receipts.** Billing providers differ per platform; capability checks don't.
6. **Design tokens shared, components per platform.** Same colours, type scale, spacing, chip semantics (fact / inference / estimate / unknown / your claim) on every surface.

### 13.4 Mobile-specific UX (when it comes)
Stage-by-stage flow (one screen per stage, swipe to evidence) · camera → sketch ingest · push when long runs finish · voice intake for Understand (speech-to-text, then the same Gist Clarifier) · read-only case snapshot offline. Nothing here needs a new backend.

### 13.5 Data model
`User` · `Workspace` · `Entitlement`(source: web/ios/android, capability, expiry) · `Case` → `Statement`(versions) · `ContextProfile` · `DomainLens`(playbook version) · `Shape` decision · `Input`(type, storage ref, extraction) · `Stage`(status, cost, ETA, scope level) → `Finding`(fact/inference/estimate/unknown/general-knowledge; evidence ids; verification: supported/contradicted/insufficient; model+prompt version) · `Evidence`(tier A/B/C/U, url or connector ref, quote, quote_check_passed, retrieved_at, verified_at, coi_flag) · `Entity`(wikidata/opencorporates/github/app-store IDs) · `Assumption` · `Decision` · `Disagreement`(user claim, evidence, resolution) · `HomeworkItem`(question, why, who-to-ask role, how-to-ask, status, answer→Evidence U) · `AnalysisRun`(type, depth, inputs-guessed count) · `SparringMessage` · `ArchitectureLevel`(mermaid, notes) · `BuildPlan`(weighting, approach, channels, tools+dated facts, checklist, costs) · `Compliance`(regimes, triggers, obligations, coverage) · `Experiment` · `CaseLink`(feature/variant) · `CatalogueEntity`(+`EntityFact` dated) · `Connector`(tier, licence, cost) · `ConnectorToken`(encrypted, scopes, audit) · `ConnectorFact`(TTL, provenance) · `Export`.

### 13.6 Fixed cost
**Fixed cost:** ≈ $50–230/mo at MVP; ≈ $600–900/mo at 10k users. Mobile adds: Apple Developer $99/yr, Google Play $25 once, RevenueCat free tier → ~1% of revenue, EAS Build $0–99/mo.

---

## 14. Go-to-market
Beachhead: indie hackers using AI builders **and** people posting "how do I solve X" in maker communities. **Distribution inside the tools they already use:** the MCP server listed in Claude Code / Claude.ai connector directories and Cursor's MCP catalogue ("send this idea to ThinkThrough") — a zero-CAC channel aimed exactly at the beachhead. Loop: free Understand → Already exists? → Right-size → shareable **"ThinkThrough said: you don't need an app — use X / do this instead"** card (surprising, honest, viral) → paid case when the shape is bigger → builder export into Lovable/Cursor/Claude Code. Channels: build-in-public (ThinkThrough's own case), Show HN / Indie Hackers / r/SideProject teardowns, AI-builder communities, founder newsletters, SEO on real right-sizing stories, Product Hunt. The shareable card is **anonymised by default** (problem category + verdict + "existing option found"), never the idea text unless the user opts in. First 100: 20 concierge, 30 Show HN, 50 from cards.
**Metrics:** Understand completion ≥ 70% · free → paid ≥ 8% among product/personal shapes · "took an action" ≥ 40% · fabricated-number rate 0 · refund < 5% · COGS/product case ≤ €8 · **outcome tracking:** 30/90-day follow-up ("did you build / use X / drop it? was the verdict right in hindsight?") — the only metric that measures advice quality rather than engagement; target ≥ 60% say the case saved them time or money.

---

## 15. Hidden risks (v4)
| # | Risk | Mitigation |
|---|---|---|
| 1 | Free right-sizing cannibalises paid cases | It's the funnel; measure share of users whose shape ≥ Personal; price the paid tiers on *build & ship* value |
| 2 | Right-sizer under-builds (tells someone with a real product to write a script) | Must state step-up triggers; one-click step-up; eval cases for both directions |
| 2b | Existing-Solution Finder recommends a tool that's dead, mis-priced, or unavailable in the user's region | Maturity signals (last commit, company signals), run-time fetched pricing with dates, region check in the fit table, user flag → re-verify |
| 2c | Vendor bias / affiliate temptation in "use existing" | No affiliate links in v1; if ever added, disclosed per link and never affecting the fit table |
| 2d | Domain playbooks are shallow or wrong (a solo founder can't be expert in 40 domains) | Start with 8 playbooks you can review; each cites its canonical sources; specialists must cite research via scholarly APIs; "ask a practitioner" triggers; invite practitioners to review playbooks (credit them) |
| 2e | Critical stance reads as rude; users leave | Tone: hard on claims, warm to the person; always pair a push-back with the next step; measure refund reasons |
| 2f | Over-corroboration makes the case slow/empty | Corroboration required only for numbers that drive the verdict; anecdotes flow freely as anecdotes |
| 3 | Gist confirmation feels slow / patronising | ≤8 questions, each with "why I ask", skip for returning users with a profile |
| 4 | "Honest and thin" loses to padded PDFs | Position on decisions + evidence tally; A/B landing copy in Phase 0 |
| 5 | Fabricated numbers / stale tool facts | Code-level gate, Fact-Checker, run-time fetch with dates, zero-tolerance eval |
| 6 | Regulation output read as legal advice | Tier A only, plain-language obligations, "verify with a professional", disclosure |
| 7 | Ingest as attack surface (malicious PDFs, injected pages, poisoned repos) | §11 controls; isolated parsing; regression tests |
| 8 | Catalogue discovery adds junk or vendor spam | Verification step, human approve-queue weekly, "new since" badges, user feedback |
| 9 | Sycophancy returns via sparring | Mandatory DA; sceptic default; verdict-drift eval |
| 10 | Scope creep for a solo founder (this plan is bigger than v2) | MVP-0 / MVP-1 split in §9 and §16; Phase 2 is where Horizons, linker, discovery, L2–L3 live; no-regret rule |
| 11 | Confidentiality fear | §11 + pseudonymise mode + anonymous free tier |
| 12 | Big vendors add "deep research for ideas" | Moat = case file, right-sizing, evidence discipline, Build & Ship with live data, builder export |
| 13 | Logic leaks into the web client over time → mobile rewrite anyway | Lint rule: no imports of server/LLM modules in `apps/web`; the generated client is the only API access; contract tests run against the OpenAPI spec |
| 14 | App-store billing (30% cut, IAP rules) breaks the pay-per-case economics | Entitlements service; mobile prices set per platform; web purchase honoured on mobile; consider "reader" mobile app first (view/answer homework/capture sketches) with purchases on web, as the rules allow |
| 15 | Paid connectors blow up COGS or violate redistribution terms | Per-stage cost caps, user accepts cost before paid lookups, licence field on every connector, show derived facts not raw datasets where ToS requires |
| 16 | OAuth connectors become the juiciest attack surface (tokens to users' Stripe/GA/GitHub) | Read-only minimal scopes, encrypted at rest, server-side calls only, revocation UI, token-use audit log, `/threat-model` on the connector service before launch |
| 17 | Verification pass doubles LLM cost | Run it only on verdict-driving claims (typically 5–15 per case); Sonnet 5.5 is 2–5× cheaper than the author model; cache evidence text |
| 18 | Single LLM vendor: price change, deprecation, policy change | `LlmGateway` interface + eval re-qualification (§13.2); keep prompts free of vendor-specific tricks; budget alerts in Langfuse |
| 19 | Solo-founder burnout / MVP never ships | Ten phases, each usable on its own (§16); the free product launches after phase 4; gates with "cut or ship"; no feature enters a phase after its first week |
| 20 | Users treat Region & Rules as complete law | Coverage field on every Compliance record; US-state and uncovered-country Unknowns are loud, not footnotes |
| 21 | The product is used to plan harmful or deceptive ventures | Content policy (§11); refuse with reason; log for review |
| 22 | MCP write path abused: injected transcripts, token theft, host AI "confirming" the gist on the user's behalf | OAuth 2.1 scopes, rate limits, Tier U-ai never promoted without verification, gist confirmation requires a human action (button in host UI or web), audit log, injection regression test (phase 4 gate) |
| 23 | Host-tool dependence (MCP spec or connector policies change) | MCP is a thin client over the same API; "paste your chat export" fallback always works |

---

## 16. Implementation plan — 10 phases (10–15 h/week, ≈ 12 h average)

Each phase ends with something usable on its own and a **gate** that must pass before the next starts. Labels used elsewhere in this plan map as: **MVP-0 = phases 1–4** (the free product), **MVP-1 = phases 5–7** (the paid paths), **P2 = phases 8–9**, **P3 = phase 10**.

| # | Phase | Weeks | ≈ Hours | Ships to users as |
|---|---|---|---|---|
| 1 | Validate & lay foundations | 1–3 | 30 | Landing page + waitlist; 10 hand-run cases |
| 2 | Evidence engine | 4–6 | 36 | Nothing visible; the truth layer everything else sits on |
| 3 | Understand & Lenses | 7–9 | 36 | Private alpha: "tell me your problem, I'll restate it" |
| 4 | Already exists? → Right-size → Resolve (free product) + MCP v1 | 10–13 | 56 | **Public free launch**, incl. "send this to ThinkThrough" from Claude Code / Claude.ai / Cursor |
| 5 | Commercial research stages | 14–18 | 60 | Private beta of the product path |
| 6 | Region & Rules + Build & Ship | 19–22 | 48 | Beta: deployability advisor |
| 7 | Architecture, Stress test, Decision, payments | 23–26 | 48 | **Paid launch** (personal, extend, product cases) |
| 8 | Depth: Horizons, linker, deep architecture, live catalogue | 27–32 | 72 | Better cases; "New to you" |
| 9 | Connectors & retention + MCP v2 | 33–38 | 80 | Paid data, your-own-data, Portfolio, monitors; run stages and answer homework from inside your AI tool |
| 10 | Mobile & expand | 39+ | — | iOS/Android app; Studio tier |

### Phase 1 — Validate & lay foundations (weeks 1–3, ~30 h)
**Goal:** prove people want honest right-sizing before writing product code; set up the skeleton so phase 2 starts on day one.
**Build:** landing page (positioning §1, pricing §12, waitlist, Van Westendorp survey) · 10 concierge cases run by hand with Claude following the stage recipe (≥3 should end "use X / don't build") · publish ThinkThrough's own case · monorepo (pnpm + Turborepo) with `apps/web`, `apps/api`, `apps/jobs`, `packages/core|client|ui` · Supabase project (EU region), auth, RLS skeleton · Hono API hello-world with OpenAPI + generated client · CI (lint, typecheck, contract test) · Langfuse, Sentry, PostHog accounts.
**Gate:** ≥ 5% of waitlist pre-pays or commits to a paid pilot · ≥ 7/10 concierge users say the case changed a decision · ≥ 3/10 right-sized *down* and agreed · zero fabricated numbers on audit of the 10 cases · manual product case ≤ $8 / ≤ 30 min · CI green on an empty API.

### Phase 2 — Evidence engine (weeks 4–6, ~36 h)
**Goal:** make "no false information" a property of the code before any agent exists.
**Build:** `Finding` / `Evidence` / `Entity` schemas in `@thinkthrough/core` (tiers A/B/C/U, typed numbers, `unknown`, `not_found`, general-knowledge chip) · claim gate (number needs evidence id or `estimate{inputs, method}`) · mechanical quote check (normalised string match) · `LlmGateway` over the Anthropic SDK (structured outputs, caching hints, `fallbacks: "default"`, refusal handling) · Independent Verifier (Sonnet, NLI pass) · evidence fetch wrapper around `web_fetch` with `retrieved_at` + COI flag · eval harness v0 (50 labelled claims) wired to Langfuse · Inngest stage-runner skeleton (one stage = one durable function; agents = parallel steps; budget caps).
**Gate:** 0 fabricated numbers/quotes on the 50-claim set · a seeded "planted page" injection test produces no finding · a stage run survives a deploy mid-run.

### Phase 3 — Understand & Lenses (weeks 7–9, ~36 h)
**Goal:** the system reliably confirms *what the problem is* before doing anything else.
**Build:** stage 1 Gist Clarifier (restate → confirm loop → ≤8 context questions → Statement v1 + Context profile; bias probe) · stage 2 Domain Detector + 3 playbooks (productivity & attention, B2B SaaS, dev tools) with the Specialist limited to one note · ingest URL + PDF (document blocks) as Tier U · anonymous sessions (24 h) + magic-link save · case-file web UI v0: conversation pane + Statement + Evidence locker · Realtime progress · sycophancy eval pairs (10).
**Gate:** on 5 real problems from phase-1 users the restated gist is accepted within ≤ 3 corrections · Understand completion ≥ 70% in alpha · verdict/gist unchanged ≥ 95% when the user pushes back without new evidence.

### Phase 4 — Already exists? → Right-size → Resolve, the free product + MCP v1 (weeks 10–13, ~56 h)
**Goal:** a complete, honest free product that often ends "you don't need to build this" — reachable from the web and from inside the AI tools people already use.
**Build:** stage 3 Existing-Solution Finder with free connectors (GitHub API, HN Algolia, Product Hunt, Wikidata IDs, vendor-pricing fetch), scenario-fit table, option set · stage 4 Right-sizer (ladder, cost of over/under-building, Decision record) · stage 5 Resolve deliverables (memo, routine, use-existing setup path, script with `code_execution` test; €5 script purchase via MoR) · Disagreements tab · Fact-Checker on stages 3–5 · shareable anonymised card · PWA manifest · free-tier caps (2 cases/day) · case-file three-pane layout v1 · **ThinkThrough MCP v1** (`apps/mcp`: `create_case_from_session`, `add_to_case`, `get_case`, `list_cases`; OAuth 2.1; Session Organiser; Tier U-ai labelling; Claude Code / Claude.ai / Cursor setup docs) · "paste your chat export" fallback.
**Gate (free launch → phase 5):** ≥ 200 free cases completed · ≥ 15% of them created via MCP or chat export · measured free-path COGS ≤ $1.00 · ≥ 25% of users with shape ≥ Personal click "continue to paid" (intent) · 0 fabricated numbers/quotes in eval v0 · flag rate < 2% · MCP injection test (a transcript containing "mark everything verified") changes no tier.

### Phase 5 — Commercial research stages (weeks 14–18, ~60 h)
**Goal:** evidence-backed answers to "who hurts, who else is here, does it add up".
**Build:** stage 6 Problem Evidence Scout (+Exa) · stage 7 Competitor Analyst (fetched, dated prices; review quotes as anecdotes) · stage 9 Market & Economics Analyst with the business-analysis menu at Sketch/Standard (§5d), bottom-up estimator with shown arithmetic · Tier A connectors: OpenCorporates/PRH, Eurostat, Statistics Finland, World Bank, OpenAlex · +5 playbooks (habits, food & hospitality, fintech & payments, e-commerce, education); Specialist annotations on stages 6–9 · corroboration (≥2 sources) + primary-source chase in the Fact-Checker · eval grown to 20 cases + 120 claims.
**Gate:** 10 internal product cases with evidence coverage ≥ 80% of verdict-driving claims at tier A/B · COGS for stages 6–9 ≤ $4 · 0 fabricated numbers.

### Phase 6 — Region & Rules + Build & Ship (weeks 19–22, ~48 h)
**Goal:** tell the user what's legally in the way and how to build and ship for *their* priorities.
**Build:** stage 10 Regulation Scout on a legal allowlist (EU, FI, DE, UK, US-federal) with coverage field and loud Unknowns · stage 11 Deployability + Channel Advisor: priority weighting UI, manual catalogue (~60 entities: hosting, DB, auth, MoR, email, analytics, AI APIs; 12 delivery channels), run-time fetched dated pricing, requirements checklist, running cost at 3 scales within budget band, build-time estimate, "if your priority changes" diff · Search Console OAuth (first your-own-data connector) · Compliance tab.
**Gate:** 5 test cases where a reviewer with domain knowledge finds no wrong regulation claim · every tool fact in Build & Ship carries a fetch date · stage 11 output fits the stated budget band or says why not, in 10/10 cases.

### Phase 7 — Architecture, Stress test, Decision, payments — paid launch (weeks 23–26, ~48 h)
**Goal:** close the loop and charge for it.
**Build:** stage 12 Architecture Drafter L0–L1 with scope dial, Mermaid render + SVG export, sketch-image ingest seeding L0 · stage 13 Devil's Advocate + Risk Auditor + full Fact-Checker re-verification; Specialist "20-year practitioner" pass · stage 14 Synthesiser: readiness verdict, evidence tally, Homework / Ask-an-expert list, ≤3 experiments, exports (MD/PDF, builder prompt for Lovable/Cursor/Claude Code, experiment kit) · entitlements service + MoR checkout for €9 / €15 / €39 cases and add-ons · eval at 30 cases / ≥200 claims with hallucination + sycophancy gates in CI · processor terms/DPA page, retention jobs.
**Gate (paid launch → phase 8):** ≥ 50 paid cases · refund < 5% · measured product-case COGS ≤ $9 · ≥ 60% positive 30-day outcome survey from phase-4/5 users · release gates green.

### Phase 8 — Depth (weeks 27–32, ~72 h)
**Goal:** make cases bigger in horizon and deeper in detail without making them longer to read.
**Build:** stage 8 Horizon Explorer (eight lateral moves, analogue search via Exa) · case linker (pgvector; feature / variant / new) · GitHub repo ingest (public + read-only token) · Architecture L2–L3 on request · catalogue discovery job (weekly, Haiku Batch: Show HN, Product Hunt, GitHub trending, changelogs) with approve-queue, and monthly re-verify job · "New to you" explainers from the Context profile · experiments tracker with confidence updates · CSV ingest via `code_execution`.
**Gate:** Horizons produces ≥ 1 variant the user keeps in ≥ 30% of cases · catalogue grows ≥ 20 verified entities/month with < 5% rejected as junk after review · no increase in fabricated-claim rate.

### Phase 9 — Connectors & retention + MCP v2 (weeks 33–38, ~80 h)
**Goal:** know more than the open web; give users reasons to come back; let the whole journey run from inside their AI tool.
**Build:** connector framework as MCP servers in `apps/connectors` (tier, licence, cost, TTL, provenance) · paid connectors as credits with pre-approval and per-stage caps (SimilarWeb, Semrush/DataForSEO, Crunchbase, AppFigures) · your-own-data OAuth (GA, Stripe / Lemon Squeezy / Paddle, Shopify, App Store Connect / Play Console, PostHog, Notion / Google Docs / Confluence, Jira / Linear, Figma) with encrypted tokens, audit log, revocation UI · bring-your-own MCP (sandboxed, vetted) · **ThinkThrough MCP v2** (`run_stage`, `answer_homework`, `search_cases`, case resources; ChatGPT connector listing where supported; browser share-target) · Portfolio tier: monitors, refreshes, compare view · notification events (email; push-ready) · outcome-tracking surveys automated · `/threat-model` + `/sec-review` on the connector service and the MCP server before enabling OAuth scopes beyond read/create.
**Gate:** connector facts pass the same quote/typed-number checks · 0 token-handling findings open from the security review · Portfolio conversion ≥ 10% of paid-case buyers · monitors trigger a "something changed" that users open ≥ 40% of the time · ≥ 20% of stage runs initiated via MCP among MCP-connected users.

### Phase 10 — Mobile & expand (weeks 39+)
**Goal:** the same brain on a second face; the first B2B tier.
**Build:** Expo app on the existing API: stage-by-stage case file, camera → sketch ingest, push notifications, voice intake, offline read-only snapshot · RevenueCat + App Store / Play billing feeding the entitlements service (web purchases honoured; "reader" app first if store rules require) · Studio tier (teams, screening rubric, 5 cases/mo) · pain-point discovery from public APIs (HN, GitHub, Product Hunt) · more regions and playbooks reviewed by practitioners.
**Gate:** mobile shipped with zero new backend endpoints beyond auth deep-links and push registration · Studio pilot with 3 teams.

**Rules across all phases:** no feature enters a phase after its first week · each phase must leave the product usable if work stopped there · every phase re-runs the eval gates · the plan is re-reviewed adversarially at the end of phases 4 and 7 (the two launches).

---

## 17. What this plan still cannot promise (residual weaknesses, stated honestly)
1. **Every cost figure is an estimate.** No Deep Dive has been run under this agent recipe yet; Phase 0's concierge cases produce the first measured numbers and may move prices.
2. **"No false information" is a process, not a guarantee.** §6c bounds and traces errors; it cannot eliminate wrong inferences, misread sources or gaps in coverage. The landing page must say so.
3. **Legal and domain output stops at "ask a professional".** The product will frustrate users who want the answer; that boundary is deliberate and should be priced in (Homework, not hedging).
4. **Playbook quality depends on one person at first.** Three playbooks at MVP-0 is the honest number; the specialist layer is only as good as its sources until practitioners review it.
5. **Data licensing gets harder with scale.** Free/official sources carry the MVP; SimilarWeb/Crunchbase-class data is expensive and ToS-constrained, and some markets have no good public data at all — those cases will show many Unknowns.
6. **Willingness to pay for honesty is unproven.** The whole model rests on Phase 0's gate; if it fails, the fallback is a B2B wedge (studios, accelerators, PM teams) with the same core.
7. **One founder, ~12 h/week.** Phases 1–9 total ≈ 465 hours — roughly nine months — and assume no major rework. The per-phase gates and the "usable if work stopped here" rule exist because that assumption is optimistic.
8. **Model and vendor dependence.** The gateway and eval make a switch *possible*, not painless; prompt behaviour differs across models and a switch costs weeks.


## Sources used today
- Name conflict check (2026-10-19): searches for "thinkthrough.ai", "soundingboard.ai", "groundwork.ai", "sensecheck.ai" (and earlier "pushback.ai", "unbuild", "veto.ai", "gauntlet ai") — nearest hits [Think (think-ai.com)](https://f4.fund/startups/think-ai), [ThinkUp](https://thinkup.manta-web.com/plans), [Groundwork AI](https://www.cbinsights.com/company/groundwork-ai), [Gauntlet AI](https://www.gauntletai.com/); no "ThinkThrough" product found. Not a trademark search.
- Competitor pricing: [cleverx](https://cleverx.com/blog/best-product-validation-tools-for-startups-in-2026/), [preuve.ai](https://preuve.ai/blog/best-startup-validation-tools-2026), [ideaproof.io](https://ideaproof.io/best-ai-validation-tools-2026), [idearoast.dev](https://www.idearoast.dev/compare), [aiideavalidators.com](https://aiideavalidators.com/), [skiporship.com](https://skiporship.com/best-startup-validation-tools-2026), [gaplyze.com](https://gaplyze.com/research/guides/best-startup-idea-validation-tools-2026), [foundra.ai](https://www.foundra.ai/best/startup-validation-tools), [userintuition.ai](https://www.userintuition.ai/posts/best-idea-validation-platforms/)
- Search API pricing: [Eden AI](https://www.edenai.co/post/best-web-search-apis-for-ai-agents), [dev.to](https://dev.to/team_metabees_4b5127db951/7-cheapest-web-search-apis-for-ai-agents-in-2026-ranked-76m), [you.com](https://you.com/resources/tavily-alternatives), [parallel.ai](https://parallel.ai/articles/exa-alternatives.md), [webscraft.org](https://webscraft.org/blog/search-api-dlya-ai-agentiv-scho-obirayut-rozrobniki-i-de-pomilyayutsya?lang=en), [searlo.tech](https://searlo.tech/blog/search-api-cost-comparison-2025)
- Reddit API: [techloy](https://www.techloy.com/reddit-api-pricing-in-2026-complete-guide-for-developers-and-businesses/), [citybiz](https://www.citybiz.co/article/868288/reddit-api-pricing-in-2026-what-youll-actually-pay-at-every-tier/), [businesscloud](https://businesscloud.co.uk/news/reddit-api-cost-breakdown-what-you-actually-pay-in-2026/), [eseospace](https://eseospace.com/blog/reddit-api-pricing/), [xpoz.ai](https://www.xpoz.ai/blog/guides/reddit-api-pricing-tiers-and-alternatives/), [apiserpent](https://apiserpent.com/blog/best-reddit-api-providers-2026)
- Claude model IDs/pricing: `claude-api` skill table (cached 2026-10-06). All COGS figures are estimates, not measurements.
