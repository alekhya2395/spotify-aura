# Spotify Aura — Phase-Wise Implementation Guide

The hands-on developer playbook for building Spotify Aura from zero to deployed MVP.

This document translates the architecture in [`architecture.md`](./architecture.md) into **exact steps, commands, code patterns, and acceptance criteria** that a developer can follow linearly. Each phase ends with a verifiable checkpoint before the next begins.

> **Prerequisite reading:** [`problemstatement.md`](./problemstatement.md) (product spec) and [`architecture.md`](./architecture.md) (system design).

---

## Table of Contents

- [Phase 0 — Foundation & Project Setup](#phase-0--foundation--project-setup)
- [Phase 1 — UI Shell & Design System](#phase-1--ui-shell--design-system)
- [Phase 2 — Spotify API Integration](#phase-2--spotify-api-integration)
- [Phase 3 — Context Capture Layer](#phase-3--context-capture-layer)
- [Phase 4 — AI Brain (Text Discovery)](#phase-4--ai-brain-text-discovery)
- [Phase 5 — Recommendation Engine](#phase-5--recommendation-engine)
- [Phase 6 — Explainability Layer](#phase-6--explainability-layer)
- [Phase 7 — Voice Discovery](#phase-7--voice-discovery)
- [Phase 8 — Feedback & Adaptation Loop](#phase-8--feedback--adaptation-loop)
- [Phase 9 — Evaluation & Telemetry](#phase-9--evaluation--telemetry)
- [Phase 10 — Polish, Deploy, Launch](#phase-10--polish-deploy-launch)

---

## Phase 0 — Foundation & Project Setup

**Objective:** A clean, deployable Next.js skeleton with all tooling configured. Zero UI, zero features — just verified rails.

---

### Step 0.1 — Scaffold the project

```bash
npx create-next-app@latest spotify-aura \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

This creates the project with App Router, TypeScript, Tailwind, and ESLint pre-configured.

---

### Step 0.2 — Install core dependencies

```bash
cd spotify-aura

# AI & validation
npm install openai zod

# State management
npm install zustand

# Utilities
npm install clsx tailwind-merge

# Dev tooling
npm install -D prettier eslint-config-prettier @types/node
```

**Package purpose map:**

| Package | Why |
|---|---|
| `openai` | Official OpenAI SDK for GPT-4o + Whisper |
| `zod` | Runtime schema validation for AI structured outputs |
| `zustand` | Lightweight state management with sessionStorage persistence |
| `clsx` + `tailwind-merge` | Conditional class merging without conflicts |
| `prettier` | Consistent formatting |

---

### Step 0.3 — Configure environment variables

Create `.env.local.example` at root:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Spotify (https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Vercel KV for evaluation logs
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

Copy to `.env.local` and fill in real values:

```bash
cp .env.local.example .env.local
```

Add `.env.local` to `.gitignore` (Next.js does this by default).

---

### Step 0.4 — Create folder skeleton

```bash
mkdir -p app/api/health
mkdir -p app/api/spotify
mkdir -p app/api/discover
mkdir -p app/api/explain
mkdir -p app/api/feedback
mkdir -p app/api/voice/transcribe
mkdir -p app/api/eval
mkdir -p "app/(discovery)/conversation"
mkdir -p "app/(discovery)/context"
mkdir -p "app/(discovery)/results"
mkdir -p "app/(discovery)/why/[trackId]"
mkdir -p "app/(discovery)/feedback"
mkdir -p components/ui
mkdir -p components/discovery
mkdir -p components/layout
mkdir -p lib/ai/prompts
mkdir -p lib/ai/schemas
mkdir -p lib/spotify
mkdir -p lib/state
mkdir -p lib/eval
mkdir -p lib/utils
mkdir -p styles
mkdir -p public
mkdir -p scripts/eval
```

---

### Step 0.5 — Health check route

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  });
}
```

---

### Step 0.6 — Tailwind configuration

Update `tailwind.config.ts` to extend with Spotify design tokens:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: "#121212",
          surface: "#181818",
          elevated: "#282828",
          green: "#1DB954",
          "green-light": "#1ED760",
          white: "#FFFFFF",
          "text-primary": "#FFFFFF",
          "text-secondary": "#B3B3B3",
          "text-subdued": "#6A6A6A",
        },
        aura: {
          purple: "#8B5CF6",
          blue: "#3B82F6",
          pink: "#EC4899",
          gradient: {
            from: "#8B5CF6",
            to: "#3B82F6",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### Step 0.7 — Utility helper

Create `lib/utils/cn.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### Step 0.8 — Prettier configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 90
}
```

---

### Step 0.9 — Verify & deploy

```bash
npm run dev          # Should start on localhost:3000
npm run build        # Should complete without errors
npm run lint         # Should pass
```

Verify: `GET http://localhost:3000/api/health` → `{ "ok": true, ... }`

Deploy to Vercel:

```bash
npx vercel --prod
```

---

### Phase 0 Checkpoint

| Check | Expected |
|---|---|
| `npm run dev` starts | Yes |
| `npm run build` passes | Yes |
| `/api/health` returns JSON | Yes |
| Vercel preview URL works | Yes |
| `.env.local.example` committed | Yes |
| `.env.local` in `.gitignore` | Yes |

---

## Phase 1 — UI Shell & Design System

**Objective:** A fully navigable mobile-first UI with Spotify-like visual identity. All data is mocked — no API calls yet.

---

### Step 1.1 — Global styles & tokens

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-spotify-black: #121212;
    --color-spotify-surface: #181818;
    --color-spotify-elevated: #282828;
    --color-spotify-green: #1DB954;
    --color-aura-purple: #8B5CF6;
    --color-aura-blue: #3B82F6;
    --radius-pill: 9999px;
  }

  body {
    @apply bg-spotify-black text-spotify-text-primary font-sans antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  * {
    @apply border-spotify-elevated;
  }
}

@layer utilities {
  .aura-gradient {
    background: linear-gradient(135deg, var(--color-aura-purple), var(--color-aura-blue));
  }

  .aura-gradient-text {
    background: linear-gradient(135deg, var(--color-aura-purple), var(--color-aura-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 16px);
  }
}
```

---

### Step 1.2 — UI Primitives

Build the following reusable components in `components/ui/`:

**`components/ui/Button.tsx`**

```tsx
"use client";

import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "aura";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-spotify-green text-black hover:bg-spotify-green-light",
  secondary: "bg-spotify-elevated text-white hover:bg-spotify-elevated/80",
  ghost: "bg-transparent text-spotify-text-secondary hover:text-white",
  aura: "aura-gradient text-white hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-pill font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**`components/ui/Pill.tsx`**

```tsx
"use client";

import { cn } from "@/lib/utils/cn";

interface PillProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function Pill({ label, selected, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200",
        selected
          ? "aura-gradient text-white"
          : "bg-spotify-elevated text-spotify-text-secondary hover:text-white hover:bg-spotify-elevated/80"
      )}
    >
      {label}
    </button>
  );
}
```

**`components/ui/Card.tsx`**

```tsx
import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4",
        elevated ? "bg-spotify-elevated" : "bg-spotify-surface",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

**`components/ui/Slider.tsx`**

```tsx
"use client";

import { cn } from "@/lib/utils/cn";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  label,
  leftLabel,
  rightLabel,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-spotify-text-secondary">
          {label}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer accent-aura-purple"
        style={{
          background: `linear-gradient(to right, #8B5CF6 0%, #3B82F6 ${percentage}%, #282828 ${percentage}%)`,
        }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-spotify-text-subdued">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
```

**`components/ui/Skeleton.tsx`**

```tsx
import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-spotify-elevated",
        className
      )}
    />
  );
}
```

---

### Step 1.3 — Layout components

**`components/layout/AuraHeader.tsx`**

```tsx
export function AuraHeader() {
  return (
    <header className="sticky top-0 z-50 bg-spotify-black/90 backdrop-blur-md border-b border-spotify-elevated px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold aura-gradient-text">Aura</h1>
        <span className="text-xs text-spotify-text-subdued">by Spotify</span>
      </div>
    </header>
  );
}
```

**`components/layout/BottomNav.tsx`**

```tsx
"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Discover", icon: "✦" },
  { href: "/conversation", label: "Chat", icon: "💬" },
  { href: "/results", label: "Results", icon: "🎵" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-spotify-black/95 backdrop-blur-md border-t border-spotify-elevated safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors",
                isActive
                  ? "text-white"
                  : "text-spotify-text-subdued hover:text-spotify-text-secondary"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

### Step 1.4 — Root layout

Update `app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuraHeader } from "@/components/layout/AuraHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Aura — AI Discovery",
  description: "Discover music beyond your listening history",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuraHeader />
        <main className="max-w-md mx-auto px-4 pb-20 pt-4 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
```

---

### Step 1.5 — Screen skeletons (mocked)

**`app/(discovery)/page.tsx` — Discovery Home (Screen 1)**

```tsx
import { Pill } from "@/components/ui/Pill";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const moods = ["Chill", "Energetic", "Melancholic", "Focused", "Euphoric", "Nostalgic"];
const activities = ["Studying", "Working Out", "Driving", "Cooking", "Walking", "Sleeping"];

export default function DiscoveryHome() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-2 pt-4">
        <h2 className="text-2xl font-bold">What's your vibe?</h2>
        <p className="text-sm text-spotify-text-secondary">
          Tell Aura what you're feeling — discover music that matches your moment.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-spotify-text-subdued">
          Mood
        </h3>
        <div className="flex flex-wrap gap-2">
          {moods.map((mood) => (
            <Pill key={mood} label={mood} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-spotify-text-subdued">
          Activity
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {activities.map((activity) => (
            <Card key={activity} className="text-center py-4">
              <span className="text-sm">{activity}</span>
            </Card>
          ))}
        </div>
      </section>

      <div className="pt-4 space-y-3">
        <Link href="/conversation">
          <Button variant="aura" fullWidth size="lg">
            Start Discovery
          </Button>
        </Link>
        <Link href="/context">
          <Button variant="secondary" fullWidth size="md">
            Fine-tune Context
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

**`app/(discovery)/conversation/page.tsx` — AI Conversation (Screen 2)**

```tsx
export default function ConversationPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        <div className="flex justify-start">
          <div className="bg-spotify-elevated rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
            <p className="text-sm">
              Hey! I'm Aura. Tell me what you're in the mood for — or just describe your
              moment. I'll find music that fits.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-spotify-elevated pt-3 pb-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Describe your vibe..."
            className="flex-1 bg-spotify-elevated rounded-pill px-4 py-3 text-sm text-white placeholder:text-spotify-text-subdued focus:outline-none focus:ring-1 focus:ring-aura-purple"
          />
          <button className="w-10 h-10 rounded-full aura-gradient flex items-center justify-center">
            <span className="text-white text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

**`app/(discovery)/context/page.tsx` — Context Capture (Screen 3)**

```tsx
export default function ContextPage() {
  return (
    <div className="space-y-6 py-4">
      <section className="text-center space-y-1">
        <h2 className="text-xl font-bold">Fine-tune your discovery</h2>
        <p className="text-xs text-spotify-text-secondary">
          Help Aura understand exactly what you want.
        </p>
      </section>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-spotify-text-secondary">
            Energy Level
          </label>
          <div className="h-1 bg-spotify-elevated rounded-full">
            <div className="h-full w-1/2 aura-gradient rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-spotify-text-subdued">
            <span>Low & chill</span>
            <span>High & intense</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-spotify-text-secondary">
            Exploration Level
          </label>
          <div className="h-1 bg-spotify-elevated rounded-full">
            <div className="h-full w-3/4 aura-gradient rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-spotify-text-subdued">
            <span>Stay close</span>
            <span>Surprise me</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-spotify-text-secondary">
            Artists to avoid
          </label>
          <input
            type="text"
            placeholder="Search artists to exclude..."
            className="w-full bg-spotify-elevated rounded-lg px-4 py-3 text-sm text-white placeholder:text-spotify-text-subdued focus:outline-none focus:ring-1 focus:ring-aura-purple"
          />
        </div>
      </div>
    </div>
  );
}
```

**`app/(discovery)/results/page.tsx` — AI Recommendations (Screen 4)**

```tsx
import { Card } from "@/components/ui/Card";

const mockTracks = [
  { title: "Midnight City", artist: "M83", hook: "Dreamy synths for your late-night drive" },
  { title: "Breathe", artist: "Télépopmusik", hook: "Ethereal downtempo to match your calm" },
  { title: "Intro", artist: "The xx", hook: "Minimal, haunting — a mood setter" },
];

export default function ResultsPage() {
  return (
    <div className="space-y-4 py-4">
      <section className="space-y-1">
        <h2 className="text-xl font-bold">Discovered for you</h2>
        <p className="text-xs text-spotify-text-secondary">
          Based on your mood: melancholic · driving · high exploration
        </p>
      </section>

      <div className="space-y-3">
        {mockTracks.map((track, i) => (
          <Card key={i} elevated className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-spotify-surface flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-xs text-spotify-text-secondary truncate">
                {track.artist}
              </p>
              <p className="text-xs text-aura-purple mt-0.5">{track.hook}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**`app/(discovery)/why/[trackId]/page.tsx` — Why Recommended (Screen 5)**

```tsx
import { Card } from "@/components/ui/Card";

export default function WhyPage() {
  return (
    <div className="space-y-4 py-4">
      <section className="space-y-1">
        <h2 className="text-xl font-bold">Why this track?</h2>
        <p className="text-xs text-spotify-text-secondary">Midnight City · M83</p>
      </section>

      <div className="space-y-3">
        <Card elevated>
          <h3 className="text-sm font-semibold text-aura-purple mb-1">Mood Match</h3>
          <p className="text-xs text-spotify-text-secondary">
            High energy synths paired with a nostalgic undertone perfectly match your
            "melancholic but energized" vibe.
          </p>
        </Card>

        <Card elevated>
          <h3 className="text-sm font-semibold text-aura-blue mb-1">Context Match</h3>
          <p className="text-xs text-spotify-text-secondary">
            Driving-tempo (105 BPM) with building layers — ideal for late-night drives.
          </p>
        </Card>

        <Card elevated>
          <h3 className="text-sm font-semibold text-aura-pink mb-1">Novelty Level</h3>
          <p className="text-xs text-spotify-text-secondary">
            Adjacent — similar sonic space to your history but different artist and era.
          </p>
        </Card>

        <Card elevated>
          <h3 className="text-sm font-semibold text-spotify-text-primary mb-1">
            Discovery Rationale
          </h3>
          <p className="text-xs text-spotify-text-secondary">
            You asked for emotional, atmospheric tracks for driving. This 2011 synth-pop
            anthem delivers cinematic emotion at road-trip tempo — different from your
            usual indie folk picks.
          </p>
        </Card>
      </div>
    </div>
  );
}
```

**`app/(discovery)/feedback/page.tsx` — Discovery Feedback (Screen 6)**

```tsx
import { Button } from "@/components/ui/Button";

export default function FeedbackPage() {
  return (
    <div className="space-y-6 py-4">
      <section className="text-center space-y-1">
        <h2 className="text-xl font-bold">How was this?</h2>
        <p className="text-xs text-spotify-text-secondary">
          Help Aura refine your next discovery.
        </p>
      </section>

      <div className="space-y-3">
        <Button variant="secondary" fullWidth>❤️ More like this</Button>
        <Button variant="secondary" fullWidth>🔀 More adventurous</Button>
        <Button variant="secondary" fullWidth>👎 Less similar</Button>
        <Button variant="secondary" fullWidth>🎭 Change my mood</Button>
        <Button variant="aura" fullWidth>✨ Discover again</Button>
      </div>
    </div>
  );
}
```

---

### Step 1.6 — Mock data fixtures

Create `lib/utils/mocks.ts`:

```typescript
export const MOCK_MOODS = [
  "Chill", "Energetic", "Melancholic", "Focused",
  "Euphoric", "Nostalgic", "Angry", "Romantic",
  "Anxious", "Peaceful", "Empowered", "Dreamy",
] as const;

export const MOCK_ACTIVITIES = [
  "Studying", "Working Out", "Driving", "Cooking",
  "Walking", "Sleeping", "Working", "Meditating",
] as const;

export const MOCK_TRACKS = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    albumArt: "",
    hook: "Dreamy synths for your late-night drive",
    previewUrl: null,
  },
  {
    id: "2",
    title: "Breathe",
    artist: "Télépopmusik",
    albumArt: "",
    hook: "Ethereal downtempo to match your calm",
    previewUrl: null,
  },
  {
    id: "3",
    title: "Intro",
    artist: "The xx",
    albumArt: "",
    hook: "Minimal, haunting — a mood setter",
    previewUrl: null,
  },
];
```

---

### Phase 1 Checkpoint

| Check | Expected |
|---|---|
| All 6 screens navigable at mobile width (375px) | Yes |
| Navigation works between screens | Yes |
| Visual identity feels Spotify-like (dark, clean, gradient accents) | Yes |
| No TypeScript errors | Yes |
| Lighthouse mobile ≥ 90 | Yes |

---

## Phase 2 — Spotify API Integration

**Objective:** Real data from Spotify's public catalog through a server-side proxy with token caching, retries, and rate-limit handling.

---

### Step 2.1 — Token management

Create `lib/spotify/token.ts`:

```typescript
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Spotify token error: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken;
}
```

---

### Step 2.2 — Spotify HTTP client with retry logic

Create `lib/spotify/client.ts`:

```typescript
import { getSpotifyToken } from "./token";

const SPOTIFY_BASE = "https://api.spotify.com/v1";
const MAX_RETRIES = 3;

export async function spotifyFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const token = await getSpotifyToken();

    const response = await fetch(`${SPOTIFY_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (response.ok) {
      return response.json() as Promise<T>;
    }

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "1");
      await sleep(retryAfter * 1000 * (attempt + 1));
      continue;
    }

    if (response.status === 401) {
      // Token expired mid-request; force refresh on next iteration
      cachedToken = null;
      continue;
    }

    lastError = new Error(`Spotify API ${response.status}: ${response.statusText}`);
  }

  throw lastError || new Error("Spotify API request failed after retries");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let cachedToken: string | null = null;
```

---

### Step 2.3 — Search module

Create `lib/spotify/search.ts`:

```typescript
import { spotifyFetch } from "./client";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: Array<{ url: string; width: number; height: number }>;
    release_date: string;
  };
  preview_url: string | null;
  external_urls: { spotify: string };
  duration_ms: number;
}

interface SearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

export async function searchTracks(
  query: string,
  limit: number = 20
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(limit),
  });

  const data = await spotifyFetch<SearchResponse>(`/search?${params}`);
  return data.tracks.items;
}

export async function searchArtists(
  query: string,
  limit: number = 5
): Promise<Array<{ id: string; name: string; genres: string[] }>> {
  const params = new URLSearchParams({
    q: query,
    type: "artist",
    limit: String(limit),
  });

  const data = await spotifyFetch<any>(`/search?${params}`);
  return data.artists.items.map((a: any) => ({
    id: a.id,
    name: a.name,
    genres: a.genres,
  }));
}
```

---

### Step 2.4 — Recommendations module

Create `lib/spotify/recommendations.ts`:

```typescript
import { spotifyFetch } from "./client";
import { SpotifyTrack } from "./search";

export interface RecommendationParams {
  seedGenres?: string[];
  seedTracks?: string[];
  seedArtists?: string[];
  targetEnergy?: number;
  targetValence?: number;
  targetDanceability?: number;
  targetTempo?: number;
  minEnergy?: number;
  maxEnergy?: number;
  minValence?: number;
  maxValence?: number;
  limit?: number;
}

interface RecommendationsResponse {
  tracks: SpotifyTrack[];
}

export async function getRecommendations(
  params: RecommendationParams
): Promise<SpotifyTrack[]> {
  const searchParams = new URLSearchParams();

  if (params.seedGenres?.length) {
    searchParams.set("seed_genres", params.seedGenres.slice(0, 5).join(","));
  }
  if (params.seedTracks?.length) {
    searchParams.set("seed_tracks", params.seedTracks.slice(0, 5).join(","));
  }
  if (params.seedArtists?.length) {
    searchParams.set("seed_artists", params.seedArtists.slice(0, 5).join(","));
  }
  if (params.targetEnergy !== undefined) {
    searchParams.set("target_energy", String(params.targetEnergy));
  }
  if (params.targetValence !== undefined) {
    searchParams.set("target_valence", String(params.targetValence));
  }
  if (params.targetDanceability !== undefined) {
    searchParams.set("target_danceability", String(params.targetDanceability));
  }
  if (params.targetTempo !== undefined) {
    searchParams.set("target_tempo", String(params.targetTempo));
  }
  if (params.minEnergy !== undefined) {
    searchParams.set("min_energy", String(params.minEnergy));
  }
  if (params.maxEnergy !== undefined) {
    searchParams.set("max_energy", String(params.maxEnergy));
  }
  if (params.minValence !== undefined) {
    searchParams.set("min_valence", String(params.minValence));
  }
  if (params.maxValence !== undefined) {
    searchParams.set("max_valence", String(params.maxValence));
  }

  searchParams.set("limit", String(params.limit || 50));

  const data = await spotifyFetch<RecommendationsResponse>(
    `/recommendations?${searchParams}`
  );
  return data.tracks;
}
```

---

### Step 2.5 — Audio features module

Create `lib/spotify/audio-features.ts`:

```typescript
import { spotifyFetch } from "./client";

export interface AudioFeatures {
  id: string;
  energy: number;
  valence: number;
  danceability: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  loudness: number;
  mode: number;
  key: number;
}

export async function getAudioFeatures(
  trackIds: string[]
): Promise<AudioFeatures[]> {
  const results: AudioFeatures[] = [];

  // Spotify allows max 100 IDs per call
  for (let i = 0; i < trackIds.length; i += 100) {
    const batch = trackIds.slice(i, i + 100);
    const params = new URLSearchParams({ ids: batch.join(",") });
    const data = await spotifyFetch<{ audio_features: AudioFeatures[] }>(
      `/audio-features?${params}`
    );
    results.push(...data.audio_features.filter(Boolean));
  }

  return results;
}
```

---

### Step 2.6 — API route handlers

**`app/api/spotify/search/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { searchTracks, searchArtists } from "@/lib/spotify/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "track";
  const limit = parseInt(searchParams.get("limit") || "20");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    if (type === "artist") {
      const artists = await searchArtists(query, limit);
      return NextResponse.json({ artists });
    }

    const tracks = await searchTracks(query, limit);
    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json(
      { error: "Spotify search failed" },
      { status: 502 }
    );
  }
}
```

**`app/api/spotify/recommendations/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/spotify/recommendations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tracks = await getRecommendations(body);
    return NextResponse.json({ tracks });
  } catch (error) {
    return NextResponse.json(
      { error: "Spotify recommendations failed" },
      { status: 502 }
    );
  }
}
```

**`app/api/spotify/audio-features/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getAudioFeatures } from "@/lib/spotify/audio-features";

export async function POST(request: NextRequest) {
  try {
    const { trackIds } = await request.json();

    if (!Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { error: "trackIds array required" },
        { status: 400 }
      );
    }

    const features = await getAudioFeatures(trackIds);
    return NextResponse.json({ features });
  } catch (error) {
    return NextResponse.json(
      { error: "Audio features fetch failed" },
      { status: 502 }
    );
  }
}
```

---

### Phase 2 Checkpoint

| Check | Expected |
|---|---|
| `/api/spotify/search?q=midnight+city` returns track data | Yes |
| `/api/spotify/recommendations` with seed_genres returns tracks | Yes |
| Audio features batch endpoint works | Yes |
| Token refreshes automatically after ~55 min | Yes |
| 429 errors trigger exponential backoff | Yes |

---

## Phase 3 — Context Capture Layer

**Objective:** Interactive UI that captures the user's current mood, activity, energy, exploration appetite, and avoid-lists — persisted in client state via Zustand.

---

### Step 3.1 — Type definitions

Create `lib/utils/types.ts`:

```typescript
export type DiscoveryContext = {
  mood: string | null;
  activity: string | null;
  energy: number;
  exploration: number;
  avoidArtists: Array<{ id: string; name: string }>;
  avoidGenres: string[];
  freeText: string;
};

export type Utterance = {
  role: "user" | "aura";
  text: string;
  timestamp: number;
};

export type ExtractedIntent = {
  mood: string;
  activity?: string;
  energyTarget: number;
  valenceTarget: number;
  danceabilityTarget?: number;
  tempoRange?: [number, number];
  seedGenres: string[];
  noveltyLevel: "familiar" | "adjacent" | "exploratory" | "left_field";
  avoidArtists: string[];
  avoidGenres: string[];
  rationale: string;
};

export type TrackRecommendation = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  albumArt: string;
  previewUrl: string | null;
  spotifyUrl: string;
  rank: number;
  vibeMatch: string;
  noveltyMatch: string;
  oneLineHook: string;
};

export type TrackExplanation = {
  moodMatch: string;
  contextMatch: string;
  noveltyLevel: string;
  rationale: string;
};

export type FeedbackAction =
  | "more_like_this"
  | "less_similar"
  | "more_adventurous"
  | "change_mood"
  | "more_from_artist";

export type DiscoverySession = {
  context: DiscoveryContext;
  utterances: Utterance[];
  lastIntent: ExtractedIntent | null;
  recommendations: TrackRecommendation[];
  history: string[];
  sessionId: string;
};
```

---

### Step 3.2 — Zustand store with sessionStorage persistence

Create `lib/state/discoveryStore.ts`:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  DiscoveryContext,
  DiscoverySession,
  Utterance,
  ExtractedIntent,
  TrackRecommendation,
  FeedbackAction,
} from "@/lib/utils/types";

function generateSessionId(): string {
  return crypto.randomUUID();
}

const initialContext: DiscoveryContext = {
  mood: null,
  activity: null,
  energy: 0.5,
  exploration: 0.5,
  avoidArtists: [],
  avoidGenres: [],
  freeText: "",
};

interface DiscoveryStore {
  session: DiscoverySession;
  isLoading: boolean;

  // Context actions
  setMood: (mood: string) => void;
  setActivity: (activity: string) => void;
  setEnergy: (energy: number) => void;
  setExploration: (exploration: number) => void;
  addAvoidArtist: (artist: { id: string; name: string }) => void;
  removeAvoidArtist: (artistId: string) => void;
  setFreeText: (text: string) => void;

  // Session actions
  addUtterance: (utterance: Utterance) => void;
  setIntent: (intent: ExtractedIntent) => void;
  setRecommendations: (tracks: TrackRecommendation[]) => void;
  addToHistory: (trackIds: string[]) => void;
  setLoading: (loading: boolean) => void;

  // Feedback
  applyFeedback: (action: FeedbackAction, trackId?: string) => void;

  // Reset
  resetSession: () => void;
  resetContext: () => void;
}

export const useDiscoveryStore = create<DiscoveryStore>()(
  persist(
    (set, get) => ({
      session: {
        context: initialContext,
        utterances: [],
        lastIntent: null,
        recommendations: [],
        history: [],
        sessionId: generateSessionId(),
      },
      isLoading: false,

      setMood: (mood) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, mood },
          },
        })),

      setActivity: (activity) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, activity },
          },
        })),

      setEnergy: (energy) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, energy },
          },
        })),

      setExploration: (exploration) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, exploration },
          },
        })),

      addAvoidArtist: (artist) =>
        set((state) => ({
          session: {
            ...state.session,
            context: {
              ...state.session.context,
              avoidArtists: [...state.session.context.avoidArtists, artist],
            },
          },
        })),

      removeAvoidArtist: (artistId) =>
        set((state) => ({
          session: {
            ...state.session,
            context: {
              ...state.session.context,
              avoidArtists: state.session.context.avoidArtists.filter(
                (a) => a.id !== artistId
              ),
            },
          },
        })),

      setFreeText: (freeText) =>
        set((state) => ({
          session: {
            ...state.session,
            context: { ...state.session.context, freeText },
          },
        })),

      addUtterance: (utterance) =>
        set((state) => ({
          session: {
            ...state.session,
            utterances: [...state.session.utterances.slice(-5), utterance],
          },
        })),

      setIntent: (intent) =>
        set((state) => ({
          session: { ...state.session, lastIntent: intent },
        })),

      setRecommendations: (tracks) =>
        set((state) => ({
          session: { ...state.session, recommendations: tracks },
        })),

      addToHistory: (trackIds) =>
        set((state) => ({
          session: {
            ...state.session,
            history: [...new Set([...state.session.history, ...trackIds])],
          },
        })),

      setLoading: (isLoading) => set({ isLoading }),

      applyFeedback: (action, trackId) => {
        const state = get();
        const track = state.session.recommendations.find(
          (t) => t.id === trackId
        );

        switch (action) {
          case "more_adventurous":
            set((s) => ({
              session: {
                ...s.session,
                context: {
                  ...s.session.context,
                  exploration: Math.min(1, s.session.context.exploration + 0.2),
                },
              },
            }));
            break;
          case "less_similar":
            if (track) {
              set((s) => ({
                session: {
                  ...s.session,
                  context: {
                    ...s.session.context,
                    avoidArtists: [
                      ...s.session.context.avoidArtists,
                      { id: track.artistId, name: track.artist },
                    ],
                  },
                },
              }));
            }
            break;
          case "change_mood":
            set((s) => ({
              session: {
                ...s.session,
                context: { ...s.session.context, mood: null },
                lastIntent: null,
              },
            }));
            break;
          default:
            break;
        }
      },

      resetSession: () =>
        set({
          session: {
            context: initialContext,
            utterances: [],
            lastIntent: null,
            recommendations: [],
            history: [],
            sessionId: generateSessionId(),
          },
          isLoading: false,
        }),

      resetContext: () =>
        set((state) => ({
          session: { ...state.session, context: initialContext },
        })),
    }),
    {
      name: "aura-discovery-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

---

### Step 3.3 — Interactive discovery components

**`components/discovery/MoodPicker.tsx`**

```tsx
"use client";

import { Pill } from "@/components/ui/Pill";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { MOCK_MOODS } from "@/lib/utils/mocks";

export function MoodPicker() {
  const mood = useDiscoveryStore((s) => s.session.context.mood);
  const setMood = useDiscoveryStore((s) => s.setMood);

  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-spotify-text-subdued">
        Mood
      </h3>
      <div className="flex flex-wrap gap-2">
        {MOCK_MOODS.map((m) => (
          <Pill
            key={m}
            label={m}
            selected={mood === m}
            onClick={() => setMood(m)}
          />
        ))}
      </div>
    </section>
  );
}
```

**`components/discovery/ActivitySelector.tsx`**

```tsx
"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import { MOCK_ACTIVITIES } from "@/lib/utils/mocks";

export function ActivitySelector() {
  const activity = useDiscoveryStore((s) => s.session.context.activity);
  const setActivity = useDiscoveryStore((s) => s.setActivity);

  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-spotify-text-subdued">
        Activity
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {MOCK_ACTIVITIES.map((a) => (
          <Card
            key={a}
            className={cn(
              "text-center py-4 cursor-pointer transition-all",
              activity === a
                ? "ring-1 ring-aura-purple bg-spotify-elevated"
                : "hover:bg-spotify-elevated/50"
            )}
            onClick={() => setActivity(a)}
          >
            <span className="text-sm">{a}</span>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

**`components/discovery/EnergySlider.tsx`**

```tsx
"use client";

import { Slider } from "@/components/ui/Slider";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export function EnergySlider() {
  const energy = useDiscoveryStore((s) => s.session.context.energy);
  const setEnergy = useDiscoveryStore((s) => s.setEnergy);

  return (
    <Slider
      value={energy}
      onChange={setEnergy}
      label="Energy Level"
      leftLabel="Low & chill"
      rightLabel="High & intense"
    />
  );
}
```

**`components/discovery/ExplorationSlider.tsx`**

```tsx
"use client";

import { Slider } from "@/components/ui/Slider";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export function ExplorationSlider() {
  const exploration = useDiscoveryStore((s) => s.session.context.exploration);
  const setExploration = useDiscoveryStore((s) => s.setExploration);

  return (
    <Slider
      value={exploration}
      onChange={setExploration}
      label="Exploration Level"
      leftLabel="Stay close"
      rightLabel="Surprise me"
    />
  );
}
```

**`components/discovery/AvoidArtistInput.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useDiscoveryStore } from "@/lib/state/discoveryStore";

export function AvoidArtistInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ id: string; name: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const avoidArtists = useDiscoveryStore((s) => s.session.context.avoidArtists);
  const addAvoidArtist = useDiscoveryStore((s) => s.addAvoidArtist);
  const removeAvoidArtist = useDiscoveryStore((s) => s.removeAvoidArtist);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(value)}&type=artist&limit=5`
      );
      const data = await res.json();
      setResults(data.artists || []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-spotify-text-secondary">
        Artists to avoid
      </label>

      {avoidArtists.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {avoidArtists.map((artist) => (
            <span
              key={artist.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-spotify-elevated rounded-pill text-xs"
            >
              {artist.name}
              <button
                onClick={() => removeAvoidArtist(artist.id)}
                className="text-spotify-text-subdued hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search artists to exclude..."
          className="w-full bg-spotify-elevated rounded-lg px-4 py-3 text-sm text-white placeholder:text-spotify-text-subdued focus:outline-none focus:ring-1 focus:ring-aura-purple"
        />

        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-spotify-elevated rounded-lg overflow-hidden shadow-xl z-10">
            {results.map((artist) => (
              <button
                key={artist.id}
                onClick={() => {
                  addAvoidArtist(artist);
                  setQuery("");
                  setResults([]);
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-spotify-surface transition-colors"
              >
                {artist.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Phase 3 Checkpoint

| Check | Expected |
|---|---|
| Mood selection persists across page navigation | Yes |
| Energy & exploration sliders update store | Yes |
| Avoid-artist typeahead shows real Spotify artists | Yes |
| Store survives page reload (sessionStorage) | Yes |
| Full `DiscoveryContext` object available in DevTools | Yes |

---

## Phase 4 — AI Brain (Text Discovery)

**Objective:** Transform natural language + context into a structured, validated intent object using OpenAI structured outputs.

---

### Step 4.1 — OpenAI client

Create `lib/ai/client.ts`:

```typescript
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
```

---

### Step 4.2 — Intent schema (Zod)

Create `lib/ai/schemas/intent.schema.ts`:

```typescript
import { z } from "zod";

export const IntentSchema = z.object({
  mood: z.string().describe("Canonical mood label (e.g. melancholic, euphoric, focused)"),
  activity: z.string().optional().describe("What the user is doing"),
  energyTarget: z.number().min(0).max(1).describe("0=very low energy, 1=very high energy"),
  valenceTarget: z.number().min(0).max(1).describe("0=sad/dark, 1=happy/bright"),
  danceabilityTarget: z.number().min(0).max(1).optional(),
  tempoRange: z
    .tuple([z.number(), z.number()])
    .optional()
    .describe("BPM range [min, max]"),
  seedGenres: z
    .array(z.string())
    .max(5)
    .describe("Spotify genre seeds, max 5"),
  noveltyLevel: z.enum(["familiar", "adjacent", "exploratory", "left_field"]),
  avoidArtists: z.array(z.string()),
  avoidGenres: z.array(z.string()),
  rationale: z.string().describe("Brief reasoning trace for this interpretation"),
});

export type IntentOutput = z.infer<typeof IntentSchema>;
```

---

### Step 4.3 — Intent extraction prompt

Create `lib/ai/prompts/intent.ts`:

```typescript
import type { DiscoveryContext, Utterance } from "@/lib/utils/types";

export function buildIntentPrompt(
  context: DiscoveryContext,
  utterance: string,
  history: Utterance[]
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const systemPrompt = `You are Aura, Spotify's AI music discovery companion. Your job is to understand what music the user wants to discover RIGHT NOW based on their current mood, activity, energy, and intent.

You must output a structured JSON object that maps the user's request to Spotify-compatible discovery parameters.

## Audio Feature Mappings
- energy: 0 (ambient, calm) to 1 (intense, aggressive)
- valence: 0 (sad, dark, angry) to 1 (happy, cheerful, euphoric)
- danceability: 0 (freeform, irregular) to 1 (strong beat, danceable)
- tempo: BPM range (60-80 chill, 80-110 moderate, 110-140 energetic, 140+ intense)

## Genre Vocabulary (use Spotify seed genres)
Common seeds: acoustic, alt-rock, ambient, blues, classical, club, country, dance, deep-house, disco, drum-and-bass, edm, electronic, folk, funk, garage, gospel, goth, grunge, happy, hip-hop, house, indie, indie-pop, j-pop, jazz, k-pop, latin, lo-fi, metal, minimal-techno, new-wave, opera, piano, pop, punk, r-n-b, reggae, rock, romance, sad, singer-songwriter, ska, sleep, soul, study, synth-pop, techno, trance, trip-hop, world-music

## Novelty Levels
- familiar: Same artists/genres user already knows
- adjacent: Similar styles but new artists
- exploratory: Different sub-genres, unexpected connections
- left_field: Completely different from typical preferences

## Rules
1. Infer audio parameters from mood/activity descriptions
2. Map vague descriptions to specific genre seeds
3. If the user says "surprise me" or wants exploration, set novelty to "exploratory" or "left_field"
4. Always respect avoid lists
5. Use the conversation history to refine understanding
6. Your rationale should explain your interpretation in 1-2 sentences`;

  const contextBlock = `## Current User Context
- Mood: ${context.mood || "not specified"}
- Activity: ${context.activity || "not specified"}
- Energy slider: ${context.energy} (0=low, 1=high)
- Exploration slider: ${context.exploration} (0=familiar, 1=adventurous)
- Avoid artists: ${context.avoidArtists.map((a) => a.name).join(", ") || "none"}
- Avoid genres: ${context.avoidGenres.join(", ") || "none"}`;

  const historyBlock =
    history.length > 0
      ? `## Recent Conversation\n${history.map((u) => `${u.role}: ${u.text}`).join("\n")}`
      : "";

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${contextBlock}\n\n${historyBlock}\n\n## Current Request\n<user_input>${utterance}</user_input>\n\nExtract the discovery intent as JSON.`,
    },
  ];
}
```

---

### Step 4.4 — Orchestrator: intent extraction

Create `lib/ai/orchestrator.ts`:

```typescript
import { openai } from "./client";
import { IntentSchema, type IntentOutput } from "./schemas/intent.schema";
import { buildIntentPrompt } from "./prompts/intent";
import type { DiscoveryContext, Utterance } from "@/lib/utils/types";

export async function extractIntent(
  context: DiscoveryContext,
  utterance: string,
  history: Utterance[]
): Promise<IntentOutput> {
  const messages = buildIntentPrompt(context, utterance, history);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "discovery_intent",
        strict: true,
        schema: {
          type: "object",
          properties: {
            mood: { type: "string" },
            activity: { type: "string" },
            energyTarget: { type: "number" },
            valenceTarget: { type: "number" },
            danceabilityTarget: { type: "number" },
            tempoRange: {
              type: "array",
              items: { type: "number" },
              minItems: 2,
              maxItems: 2,
            },
            seedGenres: {
              type: "array",
              items: { type: "string" },
              maxItems: 5,
            },
            noveltyLevel: {
              type: "string",
              enum: ["familiar", "adjacent", "exploratory", "left_field"],
            },
            avoidArtists: { type: "array", items: { type: "string" } },
            avoidGenres: { type: "array", items: { type: "string" } },
            rationale: { type: "string" },
          },
          required: [
            "mood",
            "energyTarget",
            "valenceTarget",
            "seedGenres",
            "noveltyLevel",
            "avoidArtists",
            "avoidGenres",
            "rationale",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI");

  const parsed = JSON.parse(content);
  return IntentSchema.parse(parsed);
}
```

---

### Step 4.5 — Discovery API route

Create `app/api/discover/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { extractIntent } from "@/lib/ai/orchestrator";
import type { DiscoveryContext, Utterance } from "@/lib/utils/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      context,
      utterance,
      history,
    }: {
      context: DiscoveryContext;
      utterance: string;
      history: Utterance[];
    } = body;

    if (!utterance && !context.mood) {
      return NextResponse.json(
        { error: "Provide an utterance or select a mood" },
        { status: 400 }
      );
    }

    const effectiveUtterance =
      utterance || `I'm feeling ${context.mood} and want to discover music`;

    const intent = await extractIntent(context, effectiveUtterance, history || []);

    return NextResponse.json({ intent });
  } catch (error: any) {
    console.error("Discovery error:", error);
    return NextResponse.json(
      { error: error.message || "Intent extraction failed" },
      { status: 500 }
    );
  }
}
```

---

### Phase 4 Checkpoint

| Check | Expected |
|---|---|
| POST `/api/discover` with utterance returns valid intent JSON | Yes |
| Zod validation passes on all outputs | Yes |
| Intent includes correct mood, genres, energy mappings | Yes |
| Avoid lists are respected in output | Yes |
| Response time < 2s for typical utterances | Yes |

---

## Phase 5 — Recommendation Engine

**Objective:** Combine AI intent with Spotify catalog to produce ranked, non-hallucinated track recommendations via a two-stage pipeline.

---

### Step 5.1 — Ranking schema

Create `lib/ai/schemas/ranking.schema.ts`:

```typescript
import { z } from "zod";

export const RankedTrackSchema = z.object({
  trackId: z.string(),
  rank: z.number().int().min(1).max(10),
  vibeMatch: z.string().describe("Why this track matches the vibe"),
  noveltyMatch: z.string().describe("How novel this is relative to user's zone"),
  oneLineHook: z.string().describe("One engaging line to pitch this track"),
});

export const RankingOutputSchema = z.object({
  rankedTracks: z.array(RankedTrackSchema).min(1).max(10),
});

export type RankingOutput = z.infer<typeof RankingOutputSchema>;
```

---

### Step 5.2 — Ranking prompt

Create `lib/ai/prompts/rank.ts`:

```typescript
import type { IntentOutput } from "@/lib/ai/schemas/intent.schema";

interface CandidateTrack {
  id: string;
  title: string;
  artist: string;
  genres: string[];
  year: string;
  energy: number;
  valence: number;
  danceability: number;
  tempo: number;
}

export function buildRankPrompt(
  intent: IntentOutput,
  candidates: CandidateTrack[]
): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = `You are Aura's ranking engine. Given a user's discovery intent and a list of candidate tracks (with metadata), select and rank the top 8 tracks that best deliver on the user's request.

## Ranking Criteria
1. Vibe match: Does the track's mood/energy/feel align with what the user asked for?
2. Novelty: Does it match the requested novelty level? (familiar → same zone; left_field → completely different)
3. Diversity: Ensure variety — no more than 2 tracks from the same artist. Mix sub-styles.
4. Hook: Can you describe in one line why this specific track is a great discovery?

## Rules
- ONLY use track IDs from the provided candidate list. Never invent tracks.
- Return exactly 8 tracks ranked 1-8 (or fewer if candidates are insufficient).
- If a track doesn't genuinely match, exclude it even if that means fewer than 8.`;

  const candidateList = candidates
    .map(
      (t) =>
        `- ID:${t.id} | "${t.title}" by ${t.artist} | ${t.genres.join(", ")} | ${t.year} | E:${t.energy.toFixed(2)} V:${t.valence.toFixed(2)} D:${t.danceability.toFixed(2)} T:${t.tempo}bpm`
    )
    .join("\n");

  const intentSummary = `## User Intent
- Mood: ${intent.mood}
- Activity: ${intent.activity || "unspecified"}
- Energy target: ${intent.energyTarget}
- Valence target: ${intent.valenceTarget}
- Genres requested: ${intent.seedGenres.join(", ")}
- Novelty level: ${intent.noveltyLevel}
- Rationale: ${intent.rationale}`;

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${intentSummary}\n\n## Candidate Tracks (${candidates.length} total)\n${candidateList}\n\nRank the best 8 tracks as JSON.`,
    },
  ];
}
```

---

### Step 5.3 — Full discovery pipeline

Extend `lib/ai/orchestrator.ts` — add the recommendation pipeline:

```typescript
import { getRecommendations } from "@/lib/spotify/recommendations";
import { getAudioFeatures } from "@/lib/spotify/audio-features";
import { buildRankPrompt } from "./prompts/rank";
import { RankingOutputSchema, type RankingOutput } from "./schemas/ranking.schema";
import type { TrackRecommendation } from "@/lib/utils/types";
import type { SpotifyTrack } from "@/lib/spotify/search";

export async function discoverTracks(
  intent: IntentOutput,
  historyIds: string[]
): Promise<TrackRecommendation[]> {
  // Stage 1: Candidate generation from Spotify
  const candidates = await getRecommendations({
    seedGenres: intent.seedGenres,
    targetEnergy: intent.energyTarget,
    targetValence: intent.valenceTarget,
    targetDanceability: intent.danceabilityTarget,
    targetTempo: intent.tempoRange ? (intent.tempoRange[0] + intent.tempoRange[1]) / 2 : undefined,
    limit: 50,
  });

  // Filter out avoided artists, genres, and already-shown tracks
  const avoidArtistNames = new Set(intent.avoidArtists.map((a) => a.toLowerCase()));
  const historySet = new Set(historyIds);

  const filtered = candidates.filter((track) => {
    if (historySet.has(track.id)) return false;
    if (track.artists.some((a) => avoidArtistNames.has(a.name.toLowerCase())))
      return false;
    return true;
  });

  if (filtered.length === 0) {
    return [];
  }

  // Fetch audio features for filtered candidates
  const top20 = filtered.slice(0, 20);
  const features = await getAudioFeatures(top20.map((t) => t.id));
  const featureMap = new Map(features.map((f) => [f.id, f]));

  // Build candidate objects for LLM
  const candidatesForLLM = top20.map((track) => {
    const af = featureMap.get(track.id);
    return {
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name || "Unknown",
      genres: intent.seedGenres,
      year: track.album.release_date?.slice(0, 4) || "Unknown",
      energy: af?.energy || 0.5,
      valence: af?.valence || 0.5,
      danceability: af?.danceability || 0.5,
      tempo: af?.tempo || 120,
    };
  });

  // Stage 2: LLM re-ranking
  const rankMessages = buildRankPrompt(intent, candidatesForLLM);

  const rankResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: rankMessages,
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 1000,
  });

  const rankContent = rankResponse.choices[0].message.content;
  if (!rankContent) throw new Error("Empty ranking response");

  const rankParsed = JSON.parse(rankContent);
  const ranking = RankingOutputSchema.parse(rankParsed);

  // Validate: only return tracks whose IDs exist in our candidate set
  const validIds = new Set(top20.map((t) => t.id));
  const trackMap = new Map<string, SpotifyTrack>(top20.map((t) => [t.id, t]));

  const recommendations: TrackRecommendation[] = ranking.rankedTracks
    .filter((r) => validIds.has(r.trackId))
    .map((ranked) => {
      const track = trackMap.get(ranked.trackId)!;
      return {
        id: track.id,
        title: track.name,
        artist: track.artists[0]?.name || "Unknown",
        artistId: track.artists[0]?.id || "",
        albumArt: track.album.images[0]?.url || "",
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        rank: ranked.rank,
        vibeMatch: ranked.vibeMatch,
        noveltyMatch: ranked.noveltyMatch,
        oneLineHook: ranked.oneLineHook,
      };
    });

  return recommendations;
}
```

---

### Step 5.4 — Update the discover route to include tracks

Update `app/api/discover/route.ts` to call the full pipeline:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { extractIntent, discoverTracks } from "@/lib/ai/orchestrator";
import type { DiscoveryContext, Utterance } from "@/lib/utils/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context, utterance, history, historyIds } = body as {
      context: DiscoveryContext;
      utterance: string;
      history: Utterance[];
      historyIds: string[];
    };

    if (!utterance && !context.mood) {
      return NextResponse.json(
        { error: "Provide an utterance or select a mood" },
        { status: 400 }
      );
    }

    const effectiveUtterance =
      utterance || `I'm feeling ${context.mood} and want to discover music`;

    // Stage 1: Extract intent
    const intent = await extractIntent(context, effectiveUtterance, history || []);

    // Stage 2: Get ranked recommendations
    const recommendations = await discoverTracks(intent, historyIds || []);

    return NextResponse.json({ intent, recommendations });
  } catch (error: any) {
    console.error("Discovery error:", error);
    return NextResponse.json(
      { error: error.message || "Discovery pipeline failed" },
      { status: 500 }
    );
  }
}
```

---

### Phase 5 Checkpoint

| Check | Expected |
|---|---|
| Full pipeline: utterance → intent → Spotify candidates → ranked tracks | Yes |
| Returns 8 tracks (or fewer if insufficient candidates) | Yes |
| Every returned track ID exists in Spotify (no hallucinations) | Yes |
| Max 2 tracks per artist in results | Yes |
| Avoided artists excluded from results | Yes |
| End-to-end latency < 5s | Yes |

---

## Phase 6 — Explainability Layer

**Objective:** Generate per-track explanations on demand — mood match, context match, novelty level, and discovery rationale — grounded in factual audio-feature data.

---

### Step 6.1 — Explanation schema

Create `lib/ai/schemas/explanation.schema.ts`:

```typescript
import { z } from "zod";

export const ExplanationSchema = z.object({
  moodMatch: z.string().describe("Why this track fits the user's current mood"),
  contextMatch: z.string().describe("How it serves the activity/time/energy context"),
  noveltyLevel: z.string().describe("How far from the user's familiar zone"),
  rationale: z.string().describe("One-paragraph narrative tying it all together"),
});

export type ExplanationOutput = z.infer<typeof ExplanationSchema>;
```

---

### Step 6.2 — Explanation prompt

Create `lib/ai/prompts/explain.ts`:

```typescript
import type { IntentOutput } from "@/lib/ai/schemas/intent.schema";
import type { AudioFeatures } from "@/lib/spotify/audio-features";

interface TrackInfo {
  title: string;
  artist: string;
  genres: string[];
  year: string;
  audioFeatures: AudioFeatures;
}

export function buildExplainPrompt(
  intent: IntentOutput,
  track: TrackInfo
): Array<{ role: "system" | "user"; content: string }> {
  const systemPrompt = `You are Aura's explanation engine. Given a user's discovery intent and a specific track's factual metadata, explain WHY this track was recommended.

## Output Structure
- moodMatch: 1-2 sentences on how the track's sonic qualities match the user's mood
- contextMatch: 1-2 sentences on how it serves their activity/energy needs
- noveltyLevel: 1 sentence on how different this is from their usual zone
- rationale: A short paragraph (3-4 sentences) tying the recommendation together as a narrative

## Rules
- ONLY reference factual data provided (audio features, genres, artist, year)
- Do NOT mention artists, albums, or facts not present in the input
- Ground mood claims in specific audio feature values (energy, valence, tempo)
- Be conversational and engaging, not clinical
- Keep each section concise`;

  const af = track.audioFeatures;
  const trackBlock = `## Track Facts
- Title: "${track.title}" by ${track.artist}
- Year: ${track.year}
- Genres: ${track.genres.join(", ")}
- Audio Features:
  - Energy: ${af.energy.toFixed(2)} (0=ambient, 1=intense)
  - Valence: ${af.valence.toFixed(2)} (0=sad/dark, 1=happy/bright)
  - Danceability: ${af.danceability.toFixed(2)}
  - Tempo: ${af.tempo} BPM
  - Acousticness: ${af.acousticness.toFixed(2)}
  - Instrumentalness: ${af.instrumentalness.toFixed(2)}`;

  const intentBlock = `## User's Discovery Intent
- Mood: ${intent.mood}
- Activity: ${intent.activity || "unspecified"}
- Energy target: ${intent.energyTarget}
- Valence target: ${intent.valenceTarget}
- Novelty level: ${intent.noveltyLevel}
- Genres requested: ${intent.seedGenres.join(", ")}`;

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${intentBlock}\n\n${trackBlock}\n\nGenerate the explanation as JSON.`,
    },
  ];
}
```

---

### Step 6.3 — Explain API route

Create `app/api/explain/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/client";
import { buildExplainPrompt } from "@/lib/ai/prompts/explain";
import { ExplanationSchema } from "@/lib/ai/schemas/explanation.schema";
import { getAudioFeatures } from "@/lib/spotify/audio-features";
import { spotifyFetch } from "@/lib/spotify/client";
import type { IntentOutput } from "@/lib/ai/schemas/intent.schema";

export async function POST(request: NextRequest) {
  try {
    const { trackId, intent } = (await request.json()) as {
      trackId: string;
      intent: IntentOutput;
    };

    // Fetch track details from Spotify
    const track = await spotifyFetch<any>(`/tracks/${trackId}`);
    const [features] = await getAudioFeatures([trackId]);

    if (!features) {
      return NextResponse.json(
        { error: "Audio features unavailable" },
        { status: 404 }
      );
    }

    const artistData = await spotifyFetch<any>(`/artists/${track.artists[0].id}`);

    const trackInfo = {
      title: track.name,
      artist: track.artists[0].name,
      genres: artistData.genres || intent.seedGenres,
      year: track.album.release_date?.slice(0, 4) || "Unknown",
      audioFeatures: features,
    };

    const messages = buildExplainPrompt(intent, trackInfo);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty explanation response");

    const explanation = ExplanationSchema.parse(JSON.parse(content));

    return NextResponse.json({ explanation });
  } catch (error: any) {
    console.error("Explanation error:", error);
    return NextResponse.json(
      { error: error.message || "Explanation generation failed" },
      { status: 500 }
    );
  }
}
```

---

### Phase 6 Checkpoint

| Check | Expected |
|---|---|
| `/api/explain` returns 4-part explanation for any track ID | Yes |
| Explanation references actual audio features (verifiable) | Yes |
| No hallucinated facts in output | Yes |
| Response time < 2s | Yes |
| Lazy loading: explanation only fetched when user taps "Why?" | Yes |

---

## Phase 7 — Voice Discovery

**Objective:** Enable natural voice input with Web Speech API (primary) and OpenAI Whisper (fallback).

---

### Step 7.1 — Voice capture hook

Create `lib/utils/voice.ts`:

```typescript
"use client";

import { useState, useRef, useCallback } from "react";

interface VoiceCaptureResult {
  transcript: string;
  isListening: boolean;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

export function useVoiceCapture(): VoiceCaptureResult {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition not supported");
      return;
    }

    setError(null);
    setTranscript("");

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          setConfidence(result[0].confidence);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    transcript,
    isListening,
    confidence,
    error,
    startListening,
    stopListening,
    isSupported,
  };
}
```

---

### Step 7.2 — Whisper transcription fallback route

Create `app/api/voice/transcribe/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
      response_format: "json",
    });

    return NextResponse.json({
      text: transcription.text,
      source: "whisper",
    });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
```

---

### Step 7.3 — Voice button component

Create `components/discovery/VoiceButton.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils/cn";
import { useVoiceCapture } from "@/lib/utils/voice";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceButton({ onTranscript, className }: VoiceButtonProps) {
  const { isListening, transcript, startListening, stopListening, isSupported, error } =
    useVoiceCapture();

  function handlePress() {
    if (isListening) {
      stopListening();
      if (transcript) {
        onTranscript(transcript);
      }
    } else {
      startListening();
    }
  }

  if (!isSupported) return null;

  return (
    <button
      onClick={handlePress}
      className={cn(
        "relative w-12 h-12 rounded-full flex items-center justify-center transition-all",
        isListening
          ? "aura-gradient animate-pulse scale-110"
          : "bg-spotify-elevated hover:bg-spotify-elevated/80",
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-white"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>

      {isListening && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-aura-purple whitespace-nowrap">
          Listening...
        </span>
      )}

      {error && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-red-400 whitespace-nowrap">
          {error}
        </span>
      )}
    </button>
  );
}
```

---

### Phase 7 Checkpoint

| Check | Expected |
|---|---|
| Voice button appears on conversation screen | Yes |
| Web Speech API captures speech in Chrome/Edge | Yes |
| Transcript is sent through the discovery pipeline | Yes |
| Whisper fallback works when Web Speech unavailable | Yes |
| End-to-end: voice → recommendations < 5s | Yes |
| Clear visual state (listening / idle / error) | Yes |

---

## Phase 8 — Feedback & Adaptation Loop

**Objective:** Users can steer recommendations mid-session. Feedback mutates the discovery context so the next request shifts audibly.

---

### Step 8.1 — Feedback bar component

Create `components/discovery/FeedbackBar.tsx`:

```tsx
"use client";

import { useDiscoveryStore } from "@/lib/state/discoveryStore";
import type { FeedbackAction } from "@/lib/utils/types";

interface FeedbackBarProps {
  trackId: string;
  artistId: string;
  artistName: string;
}

const actions: Array<{ action: FeedbackAction; label: string; icon: string }> = [
  { action: "more_like_this", label: "More", icon: "❤️" },
  { action: "less_similar", label: "Less", icon: "👎" },
  { action: "more_adventurous", label: "Wilder", icon: "🔀" },
  { action: "more_from_artist", label: "Artist", icon: "🔁" },
];

export function FeedbackBar({ trackId, artistId, artistName }: FeedbackBarProps) {
  const applyFeedback = useDiscoveryStore((s) => s.applyFeedback);

  return (
    <div className="flex items-center gap-1">
      {actions.map(({ action, label, icon }) => (
        <button
          key={action}
          onClick={() => applyFeedback(action, trackId)}
          className="flex items-center gap-0.5 px-2 py-1 rounded-pill text-[10px] bg-spotify-surface hover:bg-spotify-elevated transition-colors"
          aria-label={label}
        >
          <span>{icon}</span>
          <span className="text-spotify-text-subdued">{label}</span>
        </button>
      ))}
    </div>
  );
}
```

---

### Step 8.2 — Track card with feedback

Create `components/discovery/TrackCard.tsx`:

```tsx
"use client";

import { Card } from "@/components/ui/Card";
import { FeedbackBar } from "./FeedbackBar";
import type { TrackRecommendation } from "@/lib/utils/types";
import Link from "next/link";

interface TrackCardProps {
  track: TrackRecommendation;
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <Card elevated className="space-y-2">
      <div className="flex items-center gap-3">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt={track.title}
            className="w-12 h-12 rounded-md object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-spotify-surface flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{track.title}</p>
          <p className="text-xs text-spotify-text-secondary truncate">{track.artist}</p>
          <p className="text-xs text-aura-purple mt-0.5 line-clamp-1">
            {track.oneLineHook}
          </p>
        </div>

        <Link
          href={`/why/${track.id}`}
          className="text-[10px] text-spotify-text-subdued hover:text-aura-purple transition-colors whitespace-nowrap"
        >
          Why?
        </Link>
      </div>

      <FeedbackBar
        trackId={track.id}
        artistId={track.artistId}
        artistName={track.artist}
      />
    </Card>
  );
}
```

---

### Step 8.3 — Feedback API route (for logging)

Create `app/api/feedback/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, action, trackId, timestamp } = body;

    // In MVP, feedback is handled client-side via Zustand.
    // This route exists for telemetry logging (Phase 9).
    console.log("Feedback:", { sessionId, action, trackId, timestamp });

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
  }
}
```

---

### Phase 8 Checkpoint

| Check | Expected |
|---|---|
| Every track card shows feedback buttons | Yes |
| "More adventurous" visibly increases exploration slider | Yes |
| "Less similar" adds artist to avoid list | Yes |
| Next discovery call produces different results after feedback | Yes |
| "Change mood" resets mood but keeps conversation history | Yes |

---

## Phase 9 — Evaluation & Telemetry

**Objective:** Instrument the five AI evaluation metrics to prove Aura works quantitatively.

---

### Step 9.1 — Evaluation metrics module

Create `lib/eval/metrics.ts`:

```typescript
import type { TrackRecommendation } from "@/lib/utils/types";

export function computeArtistDiversity(tracks: TrackRecommendation[]): number {
  if (tracks.length === 0) return 0;
  const uniqueArtists = new Set(tracks.map((t) => t.artistId));
  return uniqueArtists.size / tracks.length;
}

export function computeGenreEntropy(genres: string[]): number {
  if (genres.length === 0) return 0;
  const counts = new Map<string, number>();
  genres.forEach((g) => counts.set(g, (counts.get(g) || 0) + 1));

  const total = genres.length;
  let entropy = 0;
  counts.forEach((count) => {
    const p = count / total;
    if (p > 0) entropy -= p * Math.log2(p);
  });

  return entropy;
}

export interface EvalEvent {
  sessionId: string;
  phase: "intent" | "rank" | "explain" | "feedback" | "satisfaction";
  latencyMs: number;
  tokenUsage?: { prompt: number; completion: number; total: number };
  outcome: Record<string, any>;
  timestamp: number;
}
```

---

### Step 9.2 — Logger module

Create `lib/eval/logger.ts`:

```typescript
import type { EvalEvent } from "./metrics";

const LOG_ENDPOINT = "/api/eval/log";

export async function logEvalEvent(event: EvalEvent): Promise<void> {
  try {
    await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Non-blocking — evaluation logging should never break the UX
    console.warn("Eval log failed:", event.phase);
  }
}
```

---

### Step 9.3 — Eval log API route

Create `app/api/eval/log/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

const logs: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    logs.push({ ...event, serverTimestamp: Date.now() });

    // In production: write to Vercel KV or Upstash
    // For MVP: in-memory + console
    if (logs.length % 10 === 0) {
      console.log(`[Eval] ${logs.length} events logged`);
    }

    return NextResponse.json({ logged: true });
  } catch {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    totalEvents: logs.length,
    recentEvents: logs.slice(-20),
  });
}
```

---

### Step 9.4 — Offline evaluation harness

Create `scripts/eval/run.ts`:

```typescript
/**
 * Offline eval harness.
 * Run: npx tsx scripts/eval/run.ts
 *
 * Tests the intent extraction pipeline against a labeled dataset.
 */

const TEST_CASES = [
  {
    utterance: "I'm driving late at night and want emotional songs",
    expectedMood: "melancholic",
    expectedEnergy: [0.3, 0.6],
    expectedGenres: ["indie", "alt-rock", "singer-songwriter"],
  },
  {
    utterance: "High energy workout music, something aggressive",
    expectedMood: "energetic",
    expectedEnergy: [0.8, 1.0],
    expectedGenres: ["edm", "hip-hop", "metal", "drum-and-bass"],
  },
  {
    utterance: "Chill lo-fi beats for studying at 2am",
    expectedMood: "focused",
    expectedEnergy: [0.1, 0.4],
    expectedGenres: ["lo-fi", "study", "ambient", "electronic"],
  },
  {
    utterance: "I want to feel nostalgic, 90s vibes",
    expectedMood: "nostalgic",
    expectedEnergy: [0.3, 0.7],
    expectedGenres: ["pop", "alt-rock", "r-n-b", "grunge"],
  },
  {
    utterance: "Surprise me with something I've never heard before",
    expectedMood: "exploratory",
    expectedEnergy: [0.0, 1.0],
    expectedGenres: [],
    expectedNovelty: "left_field",
  },
];

async function runEval() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  let passed = 0;
  let failed = 0;

  console.log("\n🎵 Spotify Aura — Intent Extraction Eval\n");
  console.log("=".repeat(60));

  for (const testCase of TEST_CASES) {
    try {
      const res = await fetch(`${baseUrl}/api/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: {
            mood: null,
            activity: null,
            energy: 0.5,
            exploration: 0.5,
            avoidArtists: [],
            avoidGenres: [],
            freeText: "",
          },
          utterance: testCase.utterance,
          history: [],
          historyIds: [],
        }),
      });

      const data = await res.json();
      const intent = data.intent;

      const energyInRange =
        intent.energyTarget >= testCase.expectedEnergy[0] &&
        intent.energyTarget <= testCase.expectedEnergy[1];

      const genreOverlap = testCase.expectedGenres.length === 0
        ? true
        : intent.seedGenres.some((g: string) =>
            testCase.expectedGenres.includes(g)
          );

      const pass = energyInRange && genreOverlap;

      if (pass) {
        passed++;
        console.log(`✅ PASS: "${testCase.utterance.slice(0, 50)}..."`);
      } else {
        failed++;
        console.log(`❌ FAIL: "${testCase.utterance.slice(0, 50)}..."`);
        console.log(`   Energy: ${intent.energyTarget} (expected ${testCase.expectedEnergy})`);
        console.log(`   Genres: ${intent.seedGenres} (expected overlap with ${testCase.expectedGenres})`);
      }
    } catch (err: any) {
      failed++;
      console.log(`💥 ERROR: "${testCase.utterance.slice(0, 50)}..." - ${err.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`Results: ${passed}/${TEST_CASES.length} passed (${Math.round((passed / TEST_CASES.length) * 100)}%)`);
  console.log(`Target: ≥ 90% (${Math.ceil(TEST_CASES.length * 0.9)}/${TEST_CASES.length})`);

  process.exit(failed > 0 ? 1 : 0);
}

runEval();
```

---

### Phase 9 Checkpoint

| Check | Expected |
|---|---|
| Eval events logged on every AI call | Yes |
| Artist diversity score computed per result set | Yes |
| `GET /api/eval/log` shows recent events | Yes |
| Offline eval harness runs and prints pass/fail | Yes |
| In-app satisfaction micro-survey triggers after discovery | Yes |

---

## Phase 10 — Polish, Deploy, Launch

**Objective:** Production-quality experience — performance, accessibility, edge cases, and public deployment.

---

### Step 10.1 — Loading & error states

Add loading skeletons for every async screen:

```tsx
// components/discovery/TrackCardSkeleton.tsx
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function TrackCardSkeleton() {
  return (
    <Card elevated className="space-y-2">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-6 w-14 rounded-pill" />
        <Skeleton className="h-6 w-14 rounded-pill" />
        <Skeleton className="h-6 w-14 rounded-pill" />
      </div>
    </Card>
  );
}
```

---

### Step 10.2 — Error boundary

```tsx
// components/ui/ErrorState.tsx
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-spotify-elevated flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-sm text-spotify-text-secondary text-center">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
```

---

### Step 10.3 — Performance optimizations

**`next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["zustand"],
  },
};

export default nextConfig;
```

**Runtime selection for API routes:**

```typescript
// app/api/spotify/search/route.ts (add at top)
export const runtime = "edge";

// app/api/discover/route.ts (add at top — needs Node for OpenAI SDK)
export const runtime = "nodejs";
export const maxDuration = 30;
```

---

### Step 10.4 — PWA manifest & metadata

Create `public/manifest.json`:

```json
{
  "name": "Spotify Aura",
  "short_name": "Aura",
  "description": "AI-powered contextual music discovery",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#121212",
  "theme_color": "#121212",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### Step 10.5 — Accessibility checklist

| Requirement | Implementation |
|---|---|
| WCAG AA contrast | All text ≥ 4.5:1 against backgrounds (verified with tokens) |
| Focus indicators | Ring on all interactive elements (Tailwind `focus-visible:ring-2`) |
| Screen reader | ARIA labels on icon buttons, live regions for async content |
| Touch targets | Minimum 44×44px on all tappable elements |
| Reduced motion | `motion-safe:` prefix on all animations |
| Keyboard navigation | All flows completable without touch |

---

### Step 10.6 — Deployment

```bash
# Ensure production build passes
npm run build

# Deploy to Vercel
npx vercel --prod

# Set environment variables in Vercel dashboard:
# OPENAI_API_KEY
# SPOTIFY_CLIENT_ID
# SPOTIFY_CLIENT_SECRET
# NEXT_PUBLIC_APP_URL (production URL)
```

---

### Step 10.7 — Demo walkthrough script

A reproducible demo path for stakeholder reviews:

1. **Open app** → Discovery Home loads instantly
2. **Select mood** → "Melancholic" pill
3. **Select activity** → "Driving"
4. **Adjust sliders** → Energy 0.4, Exploration 0.8
5. **Start Discovery** → Conversation screen
6. **Type or speak** → "I'm driving late at night and want emotional, cinematic songs — nothing too mainstream"
7. **Wait 3-4s** → Recommendations appear with 8 tracks + one-line hooks
8. **Tap "Why?"** → Explanation screen shows mood match, context match, novelty, rationale
9. **Tap "More adventurous"** → New results shift toward less familiar territory
10. **End session** → Satisfaction micro-survey

---

### Phase 10 Checkpoint

| Check | Expected |
|---|---|
| Public URL accessible on mobile phone | Yes |
| Full demo walkthrough completable in < 2 min | Yes |
| No console errors in production | Yes |
| Lighthouse Performance ≥ 90 | Yes |
| Lighthouse Accessibility ≥ 95 | Yes |
| All loading/error/empty states handled | Yes |
| Manifest allows "Add to Home Screen" | Yes |

---

## Summary: Phase Dependency Graph

```
Phase 0 (Foundation)
    │
    ▼
Phase 1 (UI Shell)
    │
    ├──────────────┐
    ▼              ▼
Phase 2          Phase 3
(Spotify API)    (Context Capture)
    │              │
    └──────┬───────┘
           ▼
    Phase 4 (AI Brain)
           │
           ▼
    Phase 5 (Recommendations)
           │
           ▼
    Phase 6 (Explainability)
           │
    ┌──────┴──────┐
    ▼             ▼
Phase 7         Phase 8
(Voice)         (Feedback)
    │             │
    └──────┬──────┘
           ▼
    Phase 9 (Evaluation)
           │
           ▼
    Phase 10 (Polish + Deploy)
```

**Total estimated implementation time:** 40–60 hours for a single developer, working full-time.

---

## Related Documents

- [`problemstatement.md`](./problemstatement.md) — Product spec, user research, MVP scope
- [`architecture.md`](./architecture.md) — System design, diagrams, risk analysis
