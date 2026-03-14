# dniskav.com — Site Context

Context document for AI assistants and future reference. Describes the full stack and infrastructure of the site.

## Identity

- **Owner:** Daniel Silva (dniskav / Dani)
- **Role:** Senior Frontend Engineer
- **Based in:** Tarragona, Spain (originally from Colombia)
- **Website:** https://dniskav.com

## Frontend Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, Lenis (smooth scroll) |
| 3D / WebGL | Three.js, React Three Fiber, React Three Drei, postprocessing |
| i18n | next-intl (English + Spanish) |
| Blog/Content | MDX via next-mdx-remote, Shiki + rehype-pretty-code |
| AI chatbot | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Custom npm pkg | `@dniskav/hero-terminal` (built by Dani, published on npm) |

## Infrastructure

| Layer | Technology |
|---|---|
| VPS | Hetzner (Ubuntu 24.04, 8GB RAM) |
| Runtime | Bun |
| Reverse proxy | Caddy (Docker container) |
| HTTPS | Let's Encrypt via Cloudflare DNS-01 challenge |
| Domain & CDN | Cloudflare (DNS proxy, DDoS protection, caching) |
| Containerization | Docker |
| CI/CD | GitHub Actions → SSH → VPS → Bun build → systemd restart |
| Process manager | systemd (`dniskav.service`) |

## How Deploys Work

1. Push to `master` branch
2. GitHub Actions connects via SSH to the VPS
3. Runs `git pull`, `bun install --frozen-lockfile`, `bun run build`
4. Restarts the `dniskav` systemd service

## AI Chat

The floating chat widget (`AiChat.tsx`) connects to `/api/chat` (Next.js route).
Uses **Gemini 2.5 Flash** with a system prompt defined in `src/lib/ai-context.ts`.
Rate limiting is handled via Gemini's 429 responses with retry countdown in the UI.

## Key Files

| File | Purpose |
|---|---|
| `src/lib/ai-context.ts` | System prompt for the AI chat |
| `src/components/ui/AiChat.tsx` | Chat widget UI |
| `src/app/api/chat/route.ts` | Chat API endpoint |
| `src/app/[locale]/page.tsx` | Main portfolio page |
| `src/components/3d/` | Three.js / WebGL components |
| `/root/var/www/dniskav/Caddyfile` | Caddy reverse proxy config |
| `.github/workflows/deploy.yml` | CI/CD pipeline |
