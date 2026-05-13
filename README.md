# mktgsquad

A multi-agent AI chat system for marketing teams. Six specialized AI agents — each with a distinct domain — ready to answer questions, review campaigns, and collaborate via broadcast.

## Agents

| Agent | Role | Color |
|-------|------|-------|
| **APEX** | Performance Marketing Manager | `#E8445A` |
| **BOLT** | Google Ads / SEM Specialist | `#4285F4` |
| **PIXEL** | MarTech / GTM / Tracking Specialist | `#FF6D00` |
| **RANK** | SEO Specialist | `#00C853` |
| **PULSE** | Email Marketing / CRM Specialist | `#AA00FF` |
| **FORGE** | Web / Landing Page Developer | `#00BCD4` |

## Stack

- **Next.js 16** (App Router, TypeScript, CSS Modules)
- **MongoDB + Mongoose** — messages embedded in conversations
- **Anthropic SDK** — `claude-sonnet-4-20250514` for chat, `claude-haiku-4-5-20251001` for summarization
- **NextAuth v5** — credentials-based auth with JWT sessions

## Setup

### 1. Environment variables

Copy `.env.local` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/mktgsquad
ANTHROPIC_API_KEY=sk-ant-...
AUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

Ensure a MongoDB instance is running and accessible at your `MONGODB_URI`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Agents are seeded into the database automatically on first dashboard load.

## Usage

1. **Register** at `/register`
2. **Start a chat** — click any agent in the sidebar or visit `/chat?agent=apex`
3. **Broadcast** — open the broadcast bar at the top of the chat view to send one prompt to multiple agents simultaneously
4. **Team overview** — `/team` shows all agents and links to start a conversation with each
5. **Settings** — `/settings` lets you toggle agent availability and view 30-day usage stats

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run seed` | Seed agents + demo user into MongoDB |
| `npm run reset` | Drop all collections (destructive) |

Demo credentials after seeding: `demo@mktgsquad.com` / `password123`

## Project Structure

```
mktgsquad/
├── proxy.ts                  # Auth guard (Next.js 16 middleware)
├── agents/                   # Agent definitions & system prompts
├── app/
│   ├── (auth)/               # Login & register pages
│   ├── (dashboard)/          # Chat, team, settings pages
│   └── api/                  # Route handlers (chat, conversations, broadcast, usage)
├── components/
│   ├── chat/                 # ChatWindow, MessageBubble, BroadcastBar, etc.
│   ├── agents/               # AgentCard, AgentSidebar, TeamOverview
│   └── ui/                   # Badge, Toggle, Topbar, Spinner, Toast
├── hooks/                    # useChat, useAgents, useBroadcast, useConversations
├── lib/                      # mongodb, anthropic, auth, context, summarize, utils
├── models/                   # Mongoose models (User, Agent, Conversation, etc.)
└── types/                    # Shared TypeScript types
```

## Long Conversation Handling

- **Sliding window** — only the last 20 non-archived messages are sent to the API
- **Auto-summarization** — when a conversation exceeds 50,000 tokens, older messages are summarized using Claude Haiku and marked `isArchived: true`; the summary is prepended as context on the next request
- **Manual trigger** — `POST /api/conversations/[id]/summarize`
