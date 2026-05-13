You are helping me build a Next.js 16 marketing AI agent system called "mktgsquad".

## Project Stack
- Next.js 14 (App Router, TypeScript, NO Tailwind)
- MongoDB + Mongoose (database)
- Anthropic SDK (claude-sonnet-4-20250514)
- NextAuth (authentication)
- CSS Modules for styling

## Project Overview
A multi-agent AI chat system for a marketing team with 6 specialized AI agents:
- APEX — Performance Marketing Manager
- BOLT — Google Ads / SEM Specialist
- PIXEL — MarTech / GTM / Tracking Specialist
- RANK — SEO Specialist
- PULSE — Email Marketing / CRM Specialist
- FORGE — Web / Landing Page Developer

## File Structure to Generate
mktgsquad/
├── .env.local
├── next.config.ts
├── middleware.ts
├── types/
│   ├── index.ts
│   └── next-auth.d.ts
├── lib/
│   ├── mongodb.ts
│   ├── anthropic.ts
│   ├── auth.ts
│   ├── context.ts
│   ├── summarize.ts
│   └── utils.ts
├── models/
│   ├── User.ts
│   ├── Agent.ts
│   ├── Conversation.ts
│   ├── BroadcastSession.ts
│   └── UsageStat.ts
├── agents/
│   ├── index.ts
│   ├── types.ts
│   ├── apex.ts
│   ├── bolt.ts
│   ├── pixel.ts
│   ├── rank.ts
│   ├── pulse.ts
│   └── forge.ts
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── chat/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/page.tsx
│   │   ├── team/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── chat/route.ts
│       ├── conversations/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   ├── [id]/messages/route.ts
│       │   └── [id]/summarize/route.ts
│       ├── agents/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── broadcast/route.ts
│       └── usage/route.ts
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── BroadcastBar.tsx
│   │   ├── ConversationList.tsx
│   │   └── SummaryBanner.tsx
│   ├── agents/
│   │   ├── AgentSidebar.tsx
│   │   ├── AgentCard.tsx
│   │   ├── AgentHeader.tsx
│   │   └── TeamOverview.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Toggle.tsx
│       ├── Topbar.tsx
│       ├── Spinner.tsx
│       └── Toast.tsx
├── hooks/
│   ├── useChat.ts
│   ├── useAgents.ts
│   ├── useBroadcast.ts
│   ├── useConversations.ts
│   └── useUsageStats.ts
└── scripts/
    ├── seed.ts
    └── reset.ts

## Key Requirements

### MongoDB / Mongoose
- Conversation model must EMBED messages array (not a separate collection)
- Each message has: role, content, tokensUsed, model, isArchived, createdAt
- Conversation has: userId, agentId, title, messages[], summary, summarizedAt, totalTokens

### Long Conversation Handling
- lib/context.ts: sliding window — always send only last 20 messages to Anthropic API
- lib/summarize.ts: when totalTokens > 50000, summarize old messages using claude-haiku-4-5-20251001, set isArchived=true on old messages
- Summarize endpoint: POST /api/conversations/[id]/summarize

### Anthropic Streaming
- api/chat/route.ts must use streaming (ReadableStream)
- Use claude-sonnet-4-20250514 for all 6 agents
- Each agent has its own system prompt defined in agents/*.ts

### Styling
- Use CSS Modules (.module.css) — NO Tailwind
- Dark theme: background #0b0b18, text #dcdcec
- Each agent has its own color (apex:#E8445A, bolt:#4285F4, pixel:#FF6D00, rank:#00C853, pulse:#AA00FF, forge:#00BCD4)

### Auth
- NextAuth with Credentials provider
- Protect all /dashboard routes via middleware.ts

## Instructions
1. Generate ALL files completely — no placeholders, no "// TODO"
2. Every file must be production-ready with proper TypeScript types
3. Start with: lib/mongodb.ts → models/ → agents/ → lib/ → api/ → components/ → app/
4. After each file, confirm filename and move to the next