# Nibras English — Claude AI Handoff Document

## Project Overview

**Nibras English** is an interactive English learning web portal for native Jordanian Arabic speakers. Built with Next.js 15 (App Router), Tailwind CSS 4, and shadcn/ui components.

### Content Constraints (CRITICAL — must follow in ALL edits)
- **Jordanian cultural context**: Use references to Amman, Irbid, Aqaba, Jerash, Karak, mansaf, kunafa, etc.
- **Islamic values**: NO references to alcohol, dating, gambling, or inappropriate content
- **Pro-Palestinian stance**: Acknowledge Palestinian rights, Sumud (steadfastness), heritage
- **Practical pedagogy**: No formal grammar teaching. Focus on real-world usage
- **CEFR-aligned**: Content should target levels A1 through C2
- **No Arabic equivalents** in vocabulary lists (removed per user request)

### Tech Stack
- Next.js 15 with App Router (React 19)
- Tailwind CSS 4 with custom color palette
- shadcn/ui components (Sheet, ScrollArea, Button, Card, Badge, Separator)
- TypeScript
- Bun as package manager
- z-ai-web-dev-sdk for AI chatbot

### Custom Color Palette (Tailwind classes)
- `petra` = #C67A7B (rose/coral), `petra-dark` = #a55d5e
- `olive` = #6B8E23 (green), `olive-dark` = #5a7819
- `aqaba` = #005B96 (blue), `aqaba-dark` = #004a7c
- `sand` = #F4F1EA (cream/beige)

---

## Project File Structure

```
nibras-english/
├── src/
│   ├── app/
│   │   ├── page.tsx          ← MAIN FILE (1571 lines) — ALL components + data
│   │   ├── layout.tsx        ← Root layout with Inter font, metadata
│   │   ├── globals.css       ← Tailwind config, custom colors, CSS variables
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts  ← Chatbot API endpoint
│   ├── components/
│   │   └── ui/               ← shadcn/ui components
│   │       ├── sheet.tsx
│   │       ├── scroll-area.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── separator.tsx
│   │       └── toaster.tsx
│   └── lib/
│       └── utils.ts          ← cn() utility
├── next.config.ts            ← CORS headers, allowedDevOrigins
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

**The main file is `src/app/page.tsx` — it contains ALL components and ALL data inline.**

---

## How to Run

```bash
bun install
bun run dev
# Server runs on port 3000
```

---

## Architecture of page.tsx

The file is organized into these sections:

1. **TYPES** (lines 35-79) — Interfaces: VocabItem, Passage, InterestCategory, QuizQuestion, Idiom, GrammarLesson
2. **PLACEMENT TEST DATA** (lines 81-209) — `placementQuestions` array (15 questions, 5 each for A1, B1, C1)
3. **IDIOMS DATA** (lines 211-228) — `allIdioms` array (12 idioms for rotation)
4. **GRAMMAR LESSONS DATA** (lines 230-283) — `grammarLessons` array (3 lessons: B1, B2, A2)
5. **INTEREST CATEGORIES** (lines 285-434) — `interests` array (4 categories, each with vocab + 2 passages)
6. **HELPER FUNCTIONS** (lines 436-490) — boldPassageWords, getRandomItems, getPlacementLevel
7. **SUB-COMPONENTS** (lines 492-607) — VocabCard, InterestSheetContent
8. **PlacementTest** component (lines 609-788)
9. **GrammarSheet** component (lines 790-880)
10. **ChatBot** component (lines 882-1047)
11. **FeatureExplorer** dropdown (lines 1049-1107)
12. **DailyDropSheet** component (lines 1109-1153)
13. **IdiomSheet** component (lines 1155-1206)
14. **WordOfDaySheet** component (lines 1208-1271)
15. **Home** main page component (lines 1273-1571)

---

## Key Data Arrays (for editing)

### allIdioms (CURRENT — 12 idioms)

```typescript
const allIdioms: Idiom[] = [
  { idiom: "Break the ice", definition: "To make people feel more comfortable in a new situation.", example: "Serving Arabic coffee is a great way to break the ice before a meeting." },
  { idiom: "Hit the books", definition: "To study hard, especially for an exam.", example: "Finals are next week, so Layla has been hitting the books every evening." },
  { idiom: "A piece of cake", definition: "Something that is very easy to do.", example: "After weeks of practice, that grammar exercise was a piece of cake for Ahmad." },
  { idiom: "Under the weather", definition: "Feeling slightly ill or not at your best.", example: "Omar could not come to the gym today because he is feeling under the weather." },
  { idiom: "Keep in touch", definition: "To continue communicating with someone.", example: "After graduating from the University of Jordan, the classmates promised to keep in touch." },
  { idiom: "Call it a day", definition: "To stop working on something for the rest of the day.", example: "We have been coding for six hours. Let us call it a day and continue tomorrow." },
  { idiom: "On the same page", definition: "To have a shared understanding about something.", example: "Before the team meeting, the manager made sure everyone was on the same page." },
  { idiom: "Go the extra mile", definition: "To put in more effort than is expected.", example: "Miss Fatima always goes the extra mile for her students at the language center." },
  { idiom: "Think outside the box", definition: "To think creatively and find unusual solutions.", example: "The startup founders in Jabal Amman had to think outside the box to solve their funding problem." },
  { idiom: "A blessing in disguise", definition: "Something that seems bad at first but turns out to be good.", example: "Missing that bus was a blessing in disguise because I met an old friend while waiting for the next one." },
  { idiom: "The ball is in your court", definition: "It is your turn to make a decision or take action.", example: "I have sent my application to the university. The ball is in their court now." },
  { idiom: "Once in a blue moon", definition: "Something that happens very rarely.", example: "Snow in Aqaba happens once in a blue moon, but when it does, it is magical." },
];
```

### Idiom Interface

```typescript
interface Idiom {
  idiom: string;
  definition: string;
  example: string;
}
```

### How Idioms Are Displayed
- **Homepage**: Shows 4 random idioms from the pool, with a shuffle button
- **IdiomSheet**: Shows 5 random idioms with a Shuffle button
- Both use `getRandomItems(allIdioms, count)` which shuffles and slices

### How to Add New Idioms
Simply add new objects to the `allIdioms` array. Each idiom needs:
- `idiom`: The English expression
- `definition`: What it means
- `example`: A sentence using the idiom — **must use Jordanian/Arab cultural references** (cities, food, names, Islamic practices, Palestinian heritage)

---

## placementQuestions Structure

```typescript
interface QuizQuestion {
  id: number;
  level: string;        // "A1", "B1", or "C1"
  question: string;
  options: string[];    // 4 options, index 0 is always correct
  correct: number;      // Always 0 (first option is correct)
  explanation: string;
}
```

Currently: 15 questions (5 × A1, 5 × B1, 5 × C1)

---

## Interest Categories Structure

```typescript
interface InterestCategory {
  emoji: string;
  title: string;
  description: string;
  level: string;
  vocab: VocabItem[];    // { word: string; example: string; }[]
  passages: Passage[];   // { title: string; body: string[]; boldWords: string[]; }[]
}
```

Currently 4 categories:
1. Automotive & Tech (B2) — 8 vocab words, 2 passages
2. Gym & Fitness (A2) — 8 vocab words, 2 passages
3. History & Heritage (B1-C1) — 8 vocab words, 2 passages (pro-Palestinian)
4. Business in Amman (B1-B2) — 8 vocab words, 2 passages

---

## Chatbot API (route.ts)

Uses `z-ai-web-dev-sdk` (NOT OpenAI directly). System prompt requires:
- Warm, culturally aware personality ("Nibras")
- Jordanian cultural references
- Islamic values respected
- Pro-Palestinian stance
- Practical (not formal grammar) teaching approach
- CEFR-appropriate responses

---

## Design Patterns

### Sheet Components (Slide-in Panels)
- `Sheet` from shadcn/ui with `side="right"`
- Gradient headers (from-aqaba, from-olive, from-petra, from-amber-500)
- `ScrollArea` for scrollable content
- `Separator` between sections

### Card Colors
- Aqaba (blue) = Reading passages
- Petra (coral) = Word of Day, Placement Test button
- Olive (green) = Grammar, Vocabulary, Explore Features button
- Amber = Idioms

### State Management
All state is local `useState` — no global store, no database. Everything is client-side.

---

## next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "https://preview-chat-30830f16-ef2a-4e52-8277-3d77d4f9d4fa.space-z.ai",
    "https://space.chatglm.site",
  ],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
```

---

## Known Issues
1. Chatbot depends on z-ai-web-dev-sdk — will not work if deployed without the SDK credentials
2. Daily Drop and Word of Day are hardcoded (not actually daily-rotating)
3. No user authentication or progress tracking
4. No responsive mobile hamburger menu for navigation

---

## Suggestions for Claude

When Claude asks what to edit, suggest these improvements:
1. **Add more idioms** to the `allIdioms` array with Ramadan/iftar/Maghrib/Friday mansaf themes
2. **Add more passages** to each interest category (currently 2 each)
3. **Make Daily Drop and Word of Day truly rotate** using date-based selection
4. **Add more placement test questions** (currently 15)
5. **Add a progress tracker** (streak counter is hardcoded)
6. **Add dark mode** support
7. **Add more grammar lessons** (currently 3)
8. **Create a mobile hamburger menu** for navigation
9. **Add pronunciation practice** section
10. **Add listening comprehension** section
