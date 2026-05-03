# Nibras English — Complete Project Handoff Document

## 1. Project Overview

**Nibras English** is an ESL (English as a Second Language) learning web portal built for native Arabic speakers in Jordan. The platform provides daily reading passages, practical vocabulary lists, interactive grammar lessons, a placement test, an AI chatbot tutor, and idiom practice — all culturally contextualized for Jordanian learners.

**Brand:** "Master English. Stay Rooted."

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| Icons | Lucide React | 0.525+ |
| AI Chat | z-ai-web-dev-sdk | 0.0.17 |
| Font | Inter (Google Fonts) | — |
| Package Manager | Bun / npm | — |

---

## 3. Design System

### Custom Color Palette

| Name | Hex | Tailwind Class | Usage |
|------|-----|---------------|-------|
| Petra | `#C67A7B` | `text-petra`, `bg-petra` | Word of the Day, accents |
| Petra Dark | `#a55d5e` | `text-petra-dark`, `bg-petra-dark` | Hover states |
| Olive | `#6B8E23` | `text-olive`, `bg-olive` | Grammar, Feature Explorer |
| Olive Dark | `#5a7819` | `text-olive-dark`, `bg-olive-dark` | Hover states |
| Aqaba | `#005B96` | `text-aqaba`, `bg-aqaba` | Primary brand, Placement Test |
| Aqaba Dark | `#004a7c` | `text-aqaba-dark`, `bg-aqaba-dark` | Hover states |
| Sand | `#F4F1EA` | `text-sand`, `bg-sand` | Page background |

### Background & Surfaces
- Page background: `#F4F1EA` (sand)
- Cards: `#ffffff` (white)
- Text primary: `#1a1a1a`
- Text muted: `#6b7280`
- Borders: `#e5e0d8`

### Typography
- Font: Inter (loaded via `next/font/google`)
- CSS variable: `--font-geist-sans`
- Heading font weight: bold (700)
- Body line height: relaxed

---

## 4. Project File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          ← AI chatbot API endpoint
│   │   └── route.ts              ← Existing API route (unused)
│   ├── globals.css                ← Tailwind config + custom colors
│   ├── layout.tsx                 ← Root layout (Inter font, metadata)
│   └── page.tsx                   ← MAIN PAGE (~1300 lines, all features)
├── components/
│   └── ui/                        ← shadcn/ui components (50+ files)
│       ├── sheet.tsx
│       ├── scroll-area.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── separator.tsx
│       ├── dialog.tsx
│       └── ... (many more)
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.ts
└── lib/
    ├── db.ts
    └── utils.ts                   ← cn() utility for Tailwind class merging
```

**Critical files:**
- `src/app/page.tsx` — Contains ALL components, data, and logic (~1300 lines)
- `src/app/api/chat/route.ts` — AI chatbot backend
- `src/app/globals.css` — Design system colors and theme
- `src/app/layout.tsx` — Root layout with font and metadata

---

## 5. Features Implemented

### 5.1 Placement Test (Interactive Quiz)
- 15 multiple-choice questions across 3 CEFR levels (A1, B2, C1)
- 5 questions per level
- Progress bar, previous/next navigation
- Answer selection with visual highlighting
- Results page with score, CEFR level recommendation, and detailed answer review
- Explanations for each answer
- "Retake" option

### 5.2 AI Chatbot (Nibras Tutor)
- Floating chat widget (blue circle, bottom-right corner)
- Backend: `/api/chat` route using `z-ai-web-dev-sdk`
- System prompt: Jordanian ESL tutor personality
- Features: vocabulary help, grammar tips, pronunciation advice, writing help
- Quick suggestion buttons for first-time users
- Typing indicator animation
- 25-second client-side timeout with AbortController
- Error messages for timeout and connection failures

### 5.3 Feature Explorer Dropdown
- Green "Explore Features" button in navigation
- Dropdown with 5 navigation options:
  - Placement Test
  - Reading Passages
  - Vocabulary Lists
  - Grammar Lessons
  - Idiom Practice
- Each option opens the relevant Sheet panel

### 5.4 Daily Drop (Reading Passage)
- Main card (2-column span) with today's reading passage
- Clickable → opens full 3-paragraph passage in Sheet
- Key vocabulary badges at the end
- Level badge (B1)

### 5.5 Word of the Day
- Sidebar card with word, part of speech, phonetic transcription
- Clickable → opens detailed Sheet with:
  - Full definition
  - Example sentence
  - Related words (5 synonyms)
  - Cultural context paragraph

### 5.6 Multiple Idioms (Renewable)
- Pool of 12 idioms with definitions and examples
- 4 displayed on homepage with shuffle/refresh button
- Clickable → opens Idiom Practice Sheet showing 5 at a time
- Shuffle button to get different idioms

### 5.7 Explore by Interest (4 Categories)
Each category has:
- 8 vocabulary words with examples
- 2 reading passages (renewable with "New Passage" button)
- Bold keyword highlighting in passages
- Key words badge section

Categories:
1. 🚗 Automotive & Tech (B2)
2. 💪 Gym & Fitness (A2)
3. 🏛️ History & Heritage (B1–C1)
4. 💼 Business in Amman (B1–B2)

### 5.8 Grammar Lessons (3 Lessons)
- List view with 3 clickable lesson cards
- Detail view with lesson content and practical tips
- Lessons:
  1. Present Perfect Continuous (B1)
  2. Hamburger Essay Transitions (B2)
  3. P vs B Pronunciation (A2)

### 5.9 Quick Practice Section
- 3 action cards at the bottom of the page
- Placement Test, Grammar Lessons, Idiom Practice
- Each card is clickable and opens the relevant feature

---

## 6. Identity & Content Constraints (CRITICAL)

All content MUST adhere to these rules:

### Jordanian Context
- Use Jordanian cities: Amman, Irbid, Aqaba, Jerash, Karak, Mafraq, Salt, Ajloun
- Use Jordanian foods: mansaf, kunafa, falafel, maqloubeh, labneh, za'atar
- Use Jordanian locations: Airport Road, Jabal Amman, 7th Circle, Shmeisani, Abdali, Sweifieh
- Use Jordanian universities: University of Jordan, JUST, Al al-Bayt University
- Reference Islamic practices: Fajr prayer, Ramadan, Friday gatherings

### Islamic Values (NEVER violate)
- NO alcohol, drinking, bars, pubs
- NO dating, romance, girlfriends/boyfriends
- NO gambling, betting, casinos
- NO inappropriate content of any kind
- Respect for family, elders, modesty

### Pro-Palestinian Stance
- Acknowledge Palestinian rights and heritage
- Use "Sumud" (steadfastness) as a positive concept
- Reference olive trees as symbols of heritage
- Mention Palestinian cities: Nablus, Jerusalem, Gaza, West Bank
- Support Palestinian resilience narratives
- References to occupation and displacement are appropriate

### Pedagogical Approach
- NO formal grammar instruction or syntax trees
- Practical, communicative approach
- Focus on real-world usage
- Encouraging, warm tone
- CEFR-aligned content (A1–C2)

---

## 7. Component Architecture

All components live in `page.tsx`. Here's the component hierarchy:

```
Home (default export)
├── Nav (sticky top bar)
│   ├── Logo: "Nibras English"
│   ├── Streak Badge
│   ├── FeatureExplorer (dropdown)
│   └── Placement Test button
├── Hero Section
│   ├── H1: "Master English. Stay Rooted."
│   └── Subtitle
├── Main Content Grid
│   ├── DailyDrop (2-col card → DailyDropSheet)
│   └── Sidebar
│       ├── WordOfDay (card → WordOfDaySheet)
│       └── IdiomSection (4 idioms + refresh → IdiomSheet)
├── Explore by Interest (4 cards)
│   └── Each → InterestSheet (vocab + passage)
├── Quick Practice (3 cards)
│   ├── Placement Test → PlacementTest sheet
│   ├── Grammar Lessons → GrammarSheet list
│   └── Idiom Practice → IdiomSheet
├── Footer
├── PlacementTest (Sheet component)
├── GrammarSheet (2 Sheets: list + detail)
├── DailyDropSheet
├── WordOfDaySheet
├── IdiomSheet
├── InterestSheet
└── ChatBot (floating widget + chat panel)
```

### State Management
- All state is local (`useState`) within `Home` component
- No global state management (no Zustand/Redux used for main features)
- Key states: `selectedInterest`, `sheetOpen`, `placementOpen`, `grammarListOpen`, `dailyDropOpen`, `wordOfDayOpen`, `idiomSheetOpen`, `displayedIdioms`

### Sheet Pattern
- All slide-in panels use shadcn/ui `<Sheet>` component
- Sheets slide in from the right side
- Content wrapped in `<ScrollArea>` for overflow scrolling

---

## 8. API Routes

### POST /api/chat
**Purpose:** AI chatbot endpoint

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What does break the ice mean?" }
  ]
}
```

**Response (success):**
```json
{
  "reply": "Break the ice means to make people feel comfortable..."
}
```

**Response (error):**
```json
{
  "reply": "I'm sorry, something went wrong on my end. Please try asking again!"
}
```

**AI Configuration:**
- Uses `z-ai-web-dev-sdk` with `ZAI.create()`
- Temperature: 0.7
- Max tokens: 800
- System prompt: ~30 lines defining Nibras persona (see route.ts)

---

## 9. Data Structures

### VocabItem
```typescript
{ word: string; example: string; }
```

### Passage
```typescript
{ title: string; body: string[]; boldWords: string[]; }
```

### InterestCategory
```typescript
{
  emoji: string;
  title: string;
  description: string;
  level: string;
  vocab: VocabItem[];
  passages: Passage[];  // 2 passages per category
}
```

### QuizQuestion
```typescript
{
  id: number;
  level: string;      // "A1" | "B1" | "C1"
  question: string;
  options: string[];  // 4 options
  correct: number;    // index of correct option
  explanation: string;
}
```

### Idiom
```typescript
{ idiom: string; definition: string; example: string; }
```

### GrammarLesson
```typescript
{ title: string; level: string; content: string[]; tips: string[]; }
```

---

## 10. Configuration Files

### next.config.ts
```typescript
{
  output: "standalone",
  allowedDevOrigins: ["preview domain", "space.chatglm.site"],
  headers: [CORS headers for /api/* routes],
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false
}
```

### tsconfig.json
- Target: ES2017
- Module: esnext with bundler resolution
- Path alias: `@/*` → `./src/*`
- Strict mode enabled, noEmit: true

### Key dependencies
- `next@^16.1.1` — Framework
- `react@^19.0.0` — UI library
- `tailwindcss@^4` — Styling
- `z-ai-web-dev-sdk@^0.0.17` — AI integration
- `lucide-react@^0.525.0` — Icons
- `@radix-ui/*` — UI primitives (via shadcn/ui)
- `framer-motion@^12.23.2` — Animations
- `class-variance-authority` + `clsx` + `tailwind-merge` — Class utilities

---

## 11. Key Utility Functions

### boldPassageWords(text, boldWords)
- Highlights specific keywords in reading passages
- Returns React nodes with `<strong>` tags for matched words
- Color: `text-aqaba`

### getRandomItems(arr, count)
- Shuffles array and returns N items
- Used for idiom rotation

### getPlacementLevel(score)
- Maps quiz score (0-15) to CEFR level
- Returns `{ level: string, description: string }`
- Logic considers per-level correct counts

---

## 12. Known Issues & Notes

1. **Server stability**: The Next.js dev server occasionally crashes due to memory constraints when running alongside Chrome-based tools. In production, this is not an issue.

2. **CORS**: The `allowedDevOrigins` in `next.config.ts` needs to include whatever domain the site is accessed from. Update this when deploying to a new domain.

3. **Arabic equivalents removed**: A previous version had Arabic translations in vocabulary entries. These were removed per user request. The current vocabulary items are English-only.

4. **No database**: All content is currently hardcoded in `page.tsx`. For a production version, consider moving content to a database (Prisma is already in package.json).

5. **No authentication**: The site is fully public with no login required.

6. **DOCX generation scripts**: There are standalone scripts (`generate.js`, `generate_grammar.js`, `generate_readings.js`, `generate_vocab.js`) in the project root that were used to create downloadable DOCX files. These are NOT part of the Next.js app.

---

## 13. Deployment Notes

### Build Command
```bash
npx next build
```

### Start Production Server
```bash
NODE_ENV=production bun .next/standalone/server.js
```

### Dev Server
```bash
npx next dev -p 3000
# or
bun run dev
```

### Port
- Dev: 3000
- Caddy proxy: 81 (reverse proxy to localhost:3000)

### Environment Variables
- `DATABASE_URL` — Currently set to SQLite file (unused by main features)
- No other env vars required for core functionality
- `z-ai-web-dev-sdk` handles its own API key configuration internally

---

## 14. Content Inventory

| Content Type | Count | Location |
|-------------|-------|----------|
| Placement questions | 15 | `placementQuestions` array |
| Idioms | 12 | `allIdioms` array |
| Grammar lessons | 3 | `grammarLessons` array |
| Interest categories | 4 | `interests` array |
| Vocab per category | 8 each (32 total) | Inside each interest object |
| Passages per category | 2 each (8 total) | Inside each interest object |
| Word of the Day | 1 | `wordOfDay` object |
| Daily Drop passage | 1 (3 paragraphs) | `dailyDrop` object |

---

## 15. Possible Next Steps / Feature Ideas

- Add user authentication and progress tracking
- Move content to database for dynamic updates
- Add listening/pronunciation exercises with audio
- Add a "Streak" system that persists
- Add more placement test questions for accuracy
- Implement spaced repetition for vocabulary review
- Add downloadable PDF worksheets
- Add a "Teacher Dashboard" for educators
- Implement internationalization (Arabic/English toggle)
- Add dark mode support
- Deploy to Vercel or similar hosting
