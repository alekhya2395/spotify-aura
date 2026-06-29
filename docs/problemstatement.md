# Spotify Aura

**AI-Powered Contextual Music Discovery Companion**

> *Discover music beyond your listening history.*

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Business Context](#business-context)
3. [Problem Statement](#problem-statement)
4. [Target User Segment](#target-user-segment)
5. [Research Foundation](#research-foundation)
6. [Root Cause Analysis](#root-cause-analysis)
7. [Core Hypothesis](#core-hypothesis)
8. [Why Traditional Systems Fail vs. Why AI Wins](#why-traditional-systems-fail-vs-why-ai-wins)
9. [Proposed Solution: Spotify Aura](#proposed-solution-spotify-aura)
10. [MVP Scope](#mvp-scope)
11. [Success & Evaluation Metrics](#success--evaluation-metrics)
12. [Technical Stack](#technical-stack)
13. [Implementation Guardrails](#implementation-guardrails)

---

## Project Overview

This project is part of a **Product Management + AI Systems Design** challenge.

The objective is to design and ship an AI-native MVP for Spotify that solves a *validated* user problem using Artificial Intelligence. The final deliverable is a deployed, functional music discovery experience that demonstrates:

- **Why** traditional recommendation systems fail for modern discovery
- **Why** AI is uniquely positioned to solve this problem
- **How** AI fundamentally changes the music discovery experience

---

## Business Context

Spotify's strategic goal:

> **Increase meaningful music discovery and reduce repetitive listening behavior.**

### The Status Quo

Spotify's recommendation engine is built on four pillars:

| Pillar | Optimizes For |
|---|---|
| Collaborative filtering | Similarity to other users |
| Historical listening | Past behavior patterns |
| Playlist similarity | Track-to-track adjacency |
| Popularity ranking | Mainstream consumption |

While these signals drive engagement and retention, they also produce unintended side effects: **recommendation loops, filter bubbles, artist lock-in, and exploration fatigue**.

### The Consequence

Users increasingly discover music *outside* Spotify — on Instagram Reels, TikTok, YouTube, and through friends and online communities. Spotify is becoming the **playback layer**, not the **discovery layer**. That is both a user problem and a business problem.

---

## Problem Statement

> **Context-driven discovery seekers aged 22–35 struggle to discover meaningful new music because Spotify's recommendation system relies heavily on historical listening behavior, resulting in repetitive recommendation loops and forcing users to discover music through external platforms such as Instagram, YouTube, and social media.**

---

## Target User Segment

### Primary Segment: Context-Driven Discovery Seekers

**Age:** 22–35

**Behavioral profile:**

- Use Spotify daily, but actively seek new music
- Discover most new music *outside* Spotify
- Experience clear recommendation fatigue
- Want recommendations tied to **mood, activity, and context**, not just history
- Explore multiple genres rather than staying loyal to one
- Value meaningful exploration over passive, familiar listening
- Are open — often eager — for AI-powered experiences

### Why This Segment Was Selected

The segment was prioritized using both the **AI Review Analysis Engine** and **primary user interviews**. Four converging signals made it the highest-impact target:

1. **Highest discovery frustration** — repetitive recs, recommendation loops, difficulty finding new artists, over-reliance on playlists.
2. **Strongest external dependence** — most discovery already happens on Instagram, YouTube, TikTok, and through friends, indicating Spotify's discovery layer is under-serving them.
3. **Clearest demand for contextual discovery** — they want recommendations driven by mood, activity, personality, and exploration goals, none of which historical behavior alone can capture.
4. **Highest willingness to adopt AI** — they explicitly asked for AI assistants, mood-based recs, voice discovery, and conversational interfaces.

This segment experiences both halves of Spotify's stated goal — *low meaningful discovery* and *high repetitive listening* — more acutely than any other.

---

## Research Foundation

### Primary Research

Conducted with **16 Spotify users** in the target segment.

| Validated Finding | Respondents |
|---|---:|
| Users struggle to discover new music | 10 / 16 |
| Recommendations become repetitive | 11 / 16 |
| Users depend heavily on playlists | 12 / 16 |
| Users want more control over recommendations | 7 / 16 |
| Users expect AI assistance | 10 / 16 |
| Discovery happens outside Spotify | 9 / 16 |

### Secondary Research

Validated through Spotify Investor Reports, Spotify Newsroom, Deloitte Digital Media Reports, IFPI Music Reports, and academic recommender-systems literature.

Key confirmed insights:

- Recommendation systems demonstrably create filter bubbles
- Recommendation fatigue measurably reduces user satisfaction
- Personalization expectations are rising across all digital media
- Mood is a dominant driver of music consumption
- AI assistants are normalizing as a mainstream interface
- A growing share of music discovery now occurs *off-platform*

---

## Root Cause Analysis

A simple "5 Whys" surfaces the structural issue:

| Step | Question | Answer |
|---|---|---|
| 1 | Why do users struggle to discover music? | Because recommendations become repetitive. |
| 2 | Why do recommendations become repetitive? | Because the system optimizes historical listening behavior. |
| 3 | Why is that problematic? | Because users change continuously — by mood, activity, context, and intent. |
| 4 | Why can't current systems adapt? | Because collaborative filtering can't read contextual or intent signals. |
| 5 | What does that imply? | Discovery needs a system that understands *the person right now*, not just *their past*. |

---

## Core Hypothesis

> **If Spotify uses AI to understand a user's current context — mood, personality, activity, and discovery intent — rather than relying primarily on historical listening behavior, then users will experience more meaningful music discovery and a measurable reduction in repetitive listening.**

---

## Why Traditional Systems Fail vs. Why AI Wins

| Dimension | Traditional Recommenders | AI-Native Discovery |
|---|---|---|
| Primary signals | Listening history, collaborative filtering, popularity | Mood, context, activity, personality, intent, novelty preference |
| Adaptability | Static; lags real-time changes in user state | Dynamic; responds to the user's *current* moment |
| Interaction | Implicit (clicks, skips) | Explicit + conversational (text + voice) |
| Output | A ranked list of similar tracks | Contextual recommendations with explanations |
| Failure mode | Loops, filter bubbles, artist lock-in | Drift correction, diversification, controllable exploration |

### Why Voice AI Specifically

Voice is the lowest-friction way to communicate **mood, activity, and intent** simultaneously. A single utterance like:

> "I'm driving late at night and want emotional songs."

> "I want underrated indie music for studying."

…carries more discovery signal than hours of click data. Voice turns discovery into a **conversation**, not a **query**.

---

## Proposed Solution: Spotify Aura

**Spotify Aura** is an AI-powered contextual discovery companion embedded inside the Spotify experience.

It shifts the discovery question from:

> "What did you listen to before?"

to:

> "What do you want to discover right now?"

### Interaction Modes

| Mode | What the user does | What AI does |
|---|---|---|
| **Text Discovery** | Describes mood, activity, energy, personality, or goals in natural language | Parses intent and generates contextual recommendations |
| **Voice Discovery** | Speaks naturally, conversationally | Captures mood + context in one shot, recommends accordingly |
| **Explainable Discovery** | Asks *why* a track was recommended | Surfaces signals used, mood match, novelty level, and how it differs from past listening |

---

## MVP Scope

### Form Factor

A **mobile-first web application** that looks and feels like a real, shippable Spotify feature — not a dashboard, not an admin tool. Responsive design, deployable on Vercel.

### Screen Flow

| # | Screen | Purpose |
|---|---|---|
| 1 | **Discovery Home** | User picks mood, activity, or discovery mode |
| 2 | **AI Discovery Conversation** | Text + voice interaction with the AI companion |
| 3 | **Context Capture** | Collects mood, activity, energy, exploration level, artists to avoid |
| 4 | **AI Recommendations** | Songs, artists, playlists, and inline explanations |
| 5 | **Why Recommended** | Mood match, context match, novelty level, discovery rationale |
| 6 | **Discovery Feedback** | Explore more, reduce similarity, change mood, adjust preferences |

---

## Success & Evaluation Metrics

### Business Metrics

- Increase in **meaningful discovery** events
- Reduction in **repetitive listening** behavior
- Increase in **artist exploration** breadth
- Improvement in **retention** for the target segment

### Product Metrics

- Discovery sessions per user
- Recommendation acceptance rate
- Artist diversity score
- Self-reported recommendation satisfaction
- Exploration rate (new vs. familiar tracks)

### AI Evaluation Metrics

| Metric | What It Measures | Target |
|---|---|---:|
| **Context Understanding Accuracy** | AI correctly interprets mood, activity, personality, intent, and listening context | ≥ 90% |
| **Recommendation Relevance** | Recommendations match user-stated intent | ≥ 80% |
| **Recommendation Diversity** | AI avoids loops and surfaces variety | High diversity score |
| **Explanation Quality** | Users understand *why* a track was recommended | ≥ 85% |
| **Discovery Satisfaction** | Users feel they discovered meaningful new music | ≥ 75% |

---

## Technical Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, TailwindCSS |
| Backend | Next.js API Routes |
| AI | OpenAI API |
| Music Data | Spotify API |
| Deployment | Vercel |

---

## Implementation Guardrails

**Spotify Aura is NOT:**

- A dashboard
- An admin or internal tool
- An analytics platform

**Spotify Aura IS:**

- A consumer-facing Spotify feature
- A mobile-first AI experience
- A conversational music discovery companion

The UI must closely resemble Spotify's existing design language — dark theme, type system, motion, and component patterns — while introducing **AI-native interactions** (conversation, voice, context capture, explanations) as a natural extension of the product, not a separate surface.
