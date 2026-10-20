# ThinkThrough

*Think it through before you build it.* From a problem (or an idea, or a sketch) to the smallest thing that solves it, with evidence only.

The product plan is the canonical brief: [`docs/product-plan-v4.md`](docs/product-plan-v4.md). Read it as requirements. Section 13 is the architecture, section 16 the phased implementation plan. Work happens in small pull requests, one concern each.

## Status

Phase 1 (foundations) in progress. Nothing here is deployed yet.

## Layout (target, per plan section 13)

    apps/web        Next.js web client (marketing + case file), installable PWA
    apps/api        Hono API with OpenAPI spec and generated client
    apps/jobs       Inngest functions (stage runs, agents, catalogue jobs)
    packages/core   Zod schemas, stage graph, enums, copy strings
    packages/client generated typed API client
    packages/ui     design tokens + primitives

pnpm workspaces + Turborepo. Node 24, pnpm via corepack.

## Working agreements

- The API is the only door; clients render pixels, the server renders meaning (plan section 13.3).
- No business logic in Next.js server components or route handlers.
- Every number in product output needs an evidence id or an explicit estimate (plan section 6). The same honesty applies to this repo's docs.
- Changes arrive as pull requests from the `masterspark-hamad` fork. Only the owner merges. `.github/`, `CODEOWNERS` and `.claude/` are owner-only.
- No secrets in this repository, ever. Local dev uses `.env.local` files that are git-ignored.
