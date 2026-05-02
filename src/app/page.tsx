"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ArrowRight,
  MessageCircle,
  Compass,
  RefreshCw,
  Send,
  X,
  CheckCircle,
  XCircle,
  Trophy,
  GraduationCap,
  BookText,
  Languages,
  HelpCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface VocabItem {
  word: string;
  example: string;
}

interface Passage {
  title: string;
  body: string[];
  boldWords: string[];
}

interface InterestCategory {
  emoji: string;
  title: string;
  description: string;
  level: string;
  vocab: VocabItem[];
  passages: Passage[];
}

interface QuizQuestion {
  id: number;
  level: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Idiom {
  idiom: string;
  definition: string;
  example: string;
}

interface GrammarLesson {
  title: string;
  level: string;
  content: string[];
  tips: string[];
}

/* ═══════════════════════════════════════════════════════════════
   PLACEMENT TEST DATA
   ═══════════════════════════════════════════════════════════════ */

const placementQuestions: QuizQuestion[] = [
  // A1 Level (5 questions)
  {
    id: 1,
    level: "A1",
    question: "Your brother Ahmad just passed his exams. What do you say?",
    options: ["Mabrouk! I am proud of you.", "I am drinking coffee now.", "She goes to school every day.", "They are playing football."],
    correct: 0,
    explanation: "Mabrouk means congratulations in Arabic. When someone achieves something, we say we are proud of them. The other options describe different situations.",
  },
  {
    id: 2,
    level: "A1",
    question: "Complete: My family ___ dinner together every Friday evening.",
    options: ["eat", "eating", "ate", "eats"],
    correct: 0,
    explanation: "'My family' uses a plural verb in English, so we say 'eat' not 'eats'. This is different from Arabic where the verb comes before the subject.",
  },
  {
    id: 3,
    level: "A1",
    question: "Which sentence is correct?",
    options: ["We pray Fajr early in the morning.", "We prays Fajr early in the morning.", "We praying Fajr early in the morning.", "We is pray Fajr early in the morning."],
    correct: 0,
    explanation: "With 'we', we use the base form of the verb without any change. This is a common point for Arabic speakers because Arabic verbs change form based on the subject.",
  },
  {
    id: 4,
    level: "A1",
    question: "Choose the correct word: I would like a glass of ___ with my mansaf.",
    options: ["water", "waters", "a water", "the waters"],
    correct: 0,
    explanation: "Water is an uncountable noun, so we do not add an 's'. We use 'a glass of water' or just 'water'. Many Arabic speakers confuse countable and uncountable nouns in English.",
  },
  {
    id: 5,
    level: "A1",
    question: "What does 'How are you?' mean?",
    options: ["Asking about your health or feelings", "Asking your name", "Asking where you live", "Asking what you do"],
    correct: 0,
    explanation: "'How are you?' (كيف حالك؟) is a greeting that asks about your well-being. In Jordan, people often respond with 'Alhamdulillah' (الحمد لله) before continuing the conversation.",
  },
  // B1 Level (5 questions)
  {
    id: 6,
    level: "B1",
    question: "Complete: By the time we arrived in Aqaba, the sun ___.",
    options: ["had already set", "has already set", "already set", "is already setting"],
    correct: 0,
    explanation: "We use the past perfect ('had set') when talking about an action that happened BEFORE another past action. The arrival was past, and the sunset was even earlier.",
  },
  {
    id: 7,
    level: "B1",
    question: "Choose the best response: 'I have been working on this project for three weeks.'",
    options: ["That must be exhausting. Have you taken any breaks?", "You are work on this project.", "Three weeks is too many.", "I was working on that yesterday."],
    correct: 0,
    explanation: "The present perfect continuous ('have been working') means the action started in the past and is still happening. A natural response would show empathy and concern.",
  },
  {
    id: 8,
    level: "B1",
    question: "Which sentence sounds more natural for a job email in Amman?",
    options: ["I am writing to express my interest in the marketing position.", "I want the job that you have.", "Please give me the marketing job.", "I am interesting in the marketing job."],
    correct: 0,
    explanation: "'I am writing to express my interest' is a formal, professional way to start a job application. 'Interesting' (with -ing) is wrong here because it describes the job, not your feeling.",
  },
  {
    id: 9,
    level: "B1",
    question: "Choose the correct form: If I ___ earlier, I would not have missed the bus.",
    options: ["had left", "have left", "would leave", "will leave"],
    correct: 0,
    explanation: "This is a third conditional sentence about a past event that cannot be changed. The structure is: If + past perfect, would + have + past participle.",
  },
  {
    id: 10,
    level: "B1",
    question: "What does 'It is out of the question' mean?",
    options: ["It is absolutely not possible", "It is a great idea", "It is a difficult question", "It is outside the building"],
    correct: 0,
    explanation: "'Out of the question' means something is impossible or not allowed. For example: 'Working on Friday afternoon is out of the question for me.'",
  },
  // C1 Level (5 questions)
  {
    id: 11,
    level: "C1",
    question: "Choose the most precise word: The scholar's ___ on bilingualism challenged long-held assumptions in the field.",
    options: ["treatise", "talk", "paper", "idea"],
    correct: 0,
    explanation: "A 'treatise' is a formal, systematic written work on a specific subject. It carries academic weight that 'talk', 'paper', or 'idea' do not convey in this context.",
  },
  {
    id: 12,
    level: "C1",
    question: "Which sentence demonstrates the most sophisticated use of hedging?",
    options: ["The evidence would appear to suggest that language acquisition is influenced by environmental factors.", "Language acquisition is influenced by the environment.", "The environment influences how we learn language.", "I think the environment affects language learning."],
    correct: 0,
    explanation: "'Would appear to suggest' is an academic hedging technique that softens the claim without weakening it. Hedging is essential in academic writing to show intellectual caution.",
  },
  {
    id: 13,
    level: "C1",
    question: "Choose the sentence that best uses inversion for emphasis:",
    options: ["Not only did the study reveal significant findings, but it also proposed a new framework.", "The study not only revealed significant findings but also proposed a new framework.", "The study revealed significant findings and also proposed a new framework.", "Significant findings were revealed by the study, and it proposed a new framework."],
    correct: 0,
    explanation: "Inversion ('Not only did the study...') is a C1-level rhetorical device used for emphasis and stylistic variety. It makes the writing more engaging and impactful.",
  },
  {
    id: 14,
    level: "C1",
    question: "What is the pragmatic function of 'I was wondering if you might consider...'?",
    options: ["A highly indirect, polite request that preserves the listener's autonomy", "A question about the past", "An expression of uncertainty about the future", "A statement about personal curiosity"],
    correct: 0,
    explanation: "This is an example of indirect speech act theory. The speaker is not literally wondering; they are making a polite request. The indirectness allows the listener to refuse without losing face.",
  },
  {
    id: 15,
    level: "C1",
    question: "Complete: The government's policy, ___ has been widely criticized, remains unchanged.",
    options: ["which", "that", "what", "where"],
    correct: 0,
    explanation: "'Which' is used in non-defining relative clauses (set off by commas) to add extra information. 'That' cannot be used in non-defining clauses. This distinction is crucial in formal English.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   IDIOMS DATA (12 idioms for rotation)
   ═══════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════
   GRAMMAR LESSONS DATA
   ═══════════════════════════════════════════════════════════════ */

const grammarLessons: GrammarLesson[] = [
  {
    title: "Present Perfect Continuous",
    level: "B1",
    content: [
      "The present perfect continuous connects the past to the present. It tells us that an action started in the past and is still happening now, or it just stopped. In Jordanian daily life, we use this tense more often than you might think.",
      "Structure: Subject + have/has been + verb(-ing). For example: 'I have been studying English for three years.' This means you started three years ago, you are still studying, and you will probably continue.",
      "Compare: 'I study English every day' (simple present, a habit) vs 'I have been studying English every day for three years' (started in the past, still going). The continuous form adds the dimension of time and duration.",
      "In a Jordanian context, think of it this way: 'My mother has been cooking mansaf since morning' means she started early and the cooking is either still happening or just finished. The smell fills the whole house.",
    ],
    tips: [
      "Use 'for' with a period of time: for two hours, for six months, for a long time.",
      "Use 'since' with a point in time: since 2020, since last Ramadan, since I was a child.",
      "Do NOT use this tense with verbs that describe states (know, believe, own): say 'I have known him for years' NOT 'I have been knowing him'.",
      "Common mistake: dropping 'been'. Remember: 'I have been working' not 'I have working'.",
    ],
  },
  {
    title: "Hamburger Essay Transitions",
    level: "B2",
    content: [
      "The hamburger essay is a classic writing structure used in academic contexts worldwide. The top bun is your introduction (with the thesis statement), the meat patties are your body paragraphs, and the bottom bun is your conclusion. The secret ingredient that holds it all together? Transition words.",
      "Order transitions help your reader follow your logic. Start with 'First and foremost' or 'To begin with' for your strongest point. Move to 'Furthermore' or 'In addition' for supporting points. Use 'Finally' or 'Last but not least' for your closing argument.",
      "Contrast transitions show different sides of an argument. Use 'However' or 'On the other hand' to introduce a counterpoint. 'Nevertheless' or 'Despite this' are powerful ways to acknowledge an opposing view while standing your ground.",
      "In academic writing at Jordanian universities, good transitions can raise your essay score significantly. Examiners look for smooth flow between ideas, and transition words are the bridge that connects your thoughts.",
    ],
    tips: [
      "Avoid starting every sentence with 'Also' or 'And'. Use variety: 'Moreover', 'Additionally', 'Similarly'.",
      "'In conclusion' is useful but overused. Try 'To sum up', 'Ultimately', or 'All things considered' for variety.",
      "Do not overuse transitions. One transition per paragraph is usually enough.",
      "Practice: rewrite a paragraph you wrote, focusing only on adding or improving transitions.",
    ],
  },
  {
    title: "P vs B Pronunciation",
    level: "A2",
    content: [
      "Many Arabic speakers find it difficult to hear the difference between the 'P' sound and the 'B' sound in English. This is because Modern Standard Arabic does not have a 'P' sound. In Arabic, both sounds are represented by the letter 'baa' (ب). This is why many Jordanian English learners say 'bark' instead of 'park' or 'big' instead of 'pig'.",
      "The key difference is that 'P' is voiceless (your vocal cords do not vibrate) and 'B' is voiced (your vocal cords vibrate). Try this test: put your fingers on your throat and say 'pppp'. Then say 'bbbb'. You should feel a buzzing with 'B' but not with 'P'.",
      "Practice with these minimal pairs (words that differ by only one sound): park/bark, pat/bat, cap/cab, rope/robe, pear/bear, pin/bin, rope/robe. Start slowly, exaggerating the difference, then gradually speed up.",
      "Another useful trick: when you say 'P', you release a small puff of air. Hold a piece of paper in front of your mouth. When you say 'P', the paper should move. When you say 'B', it should barely move.",
    ],
    tips: [
      "Record yourself saying minimal pairs and compare with a native speaker recording.",
      "Practice with words relevant to your life: 'Pepsi' vs 'Bebzi', 'phone' vs 'bone'.",
      "Try tongue twisters: 'Peter Piper picked a peck of pickled peppers.'",
      "Remember: this takes time. Be patient with yourself. Even advanced speakers sometimes mix these up.",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   INTEREST CATEGORIES (with MULTIPLE passages per category)
   ═══════════════════════════════════════════════════════════════ */

const interests: InterestCategory[] = [
  {
    emoji: "🚗",
    title: "Automotive & Tech",
    description: "Vocab: Luxury vehicles & engineering",
    level: "B2",
    vocab: [
      { word: "infotainment system", example: "The BMW 5 Series features an advanced infotainment system with navigation, voice commands, and wireless connectivity." },
      { word: "collision avoidance", example: "Modern vehicles use radar and cameras for collision avoidance, helping prevent accidents on Amman's busy highways." },
      { word: "fuel efficiency", example: "Many Jordanian families prioritize fuel efficiency because fuel prices have risen steadily in recent years." },
      { word: "adaptive cruise control", example: "On long drives from Amman to Aqaba, adaptive cruise control automatically adjusts your speed to maintain a safe distance from the car ahead." },
      { word: "regenerative braking", example: "Hybrid vehicles use regenerative braking to convert kinetic energy back into battery power when the driver slows down." },
      { word: "horsepower", example: "The BMW 5 Series delivers impressive horsepower while maintaining a smooth, comfortable ride through city traffic." },
      { word: "blind spot", example: "Before changing lanes on the Airport Road in Amman, always check your blind spot carefully for motorcycles." },
      { word: "anti-lock braking system", example: "The anti-lock braking system prevents the wheels from locking up during sudden braking on wet roads." },
    ],
    passages: [
      {
        title: "From Green North to Red South",
        body: [
          "The Al-Rashid family had been planning this trip for months. Abu Fadi had finally purchased a brand-new Toyota Land Cruiser — a silver 2025 model with leather seats, a large sunroof, and enough space to comfortably seat seven passengers. On a cool Friday morning in late October, with the car packed with home-cooked food, blankets, and plenty of Arabic coffee in a thermos, the family set off from their home in Irbid, heading south toward Aqaba.",
          "The first hour of the journey was familiar territory. They drove through the green, rolling hills of northern Jordan, passing through Jerash and then Ajloun, where the pine forests lined both sides of the road. As they descended toward the Jordan Valley, the landscape began to change dramatically. The green fields gradually gave way to rocky, brown hillsides, and the temperature climbed noticeably.",
          "South of Karak, the transformation was even more dramatic. The mountains gave way to vast, open desert. As they approached Wadi Rum, the desert turned a deep, burnt red. Towering sandstone cliffs rose on both sides of the road, sculpted by thousands of years of wind into shapes that looked almost human — arches, pillars, and bridges of rock reaching toward the pale blue sky. They reached Aqaba just after Maghrib prayer. The city lights were reflecting on the calm waters of the Red Sea.",
        ],
        boldWords: ["Toyota Land Cruiser", "sweeping", "barren", "canyon", "breathtaking", "milestone"],
      },
      {
        title: "The Mechanic Who Dreams Big",
        body: [
          "Rami opened his garage on the outskirts of Irbid when he was just twenty-two years old. It was a small place — two bays, a cramped office, and a hand-painted sign that read 'Rami Auto Care.' His father, who had worked as a mechanic for thirty years, was skeptical. 'The market is crowded,' he warned. But Rami had something his competitors did not: a deep understanding of modern automotive technology.",
          "While other garages in the area still relied on traditional diagnostic methods, Rami invested in an OBD-II scanner and learned to read electronic fault codes. He took online courses in hybrid engine repair and attended workshops in Amman on advanced driver assistance systems. Word spread quickly. Car owners from as far as Mafraq and Jerash began bringing their vehicles to Rami's small garage.",
          "Five years later, Rami Auto Care has expanded to six bays and employs four mechanics. Rami's latest project is converting petrol vehicles to run on both petrol and LPG, a modification that many Jordanian families are requesting due to rising fuel costs. 'Every car has a story,' Rami says, wiping his hands on a rag. 'My job is to keep that story going.'",
        ],
        boldWords: ["diagnostic", "hybrid", "skeptical", "modified", "expanded", "investment"],
      },
    ],
  },
  {
    emoji: "💪",
    title: "Gym & Fitness",
    description: "Vocab: Resistance training & health",
    level: "A2",
    vocab: [
      { word: "routine", example: "Ahmad follows the same routine every morning before class." },
      { word: "resistance training", example: "Resistance training helps build strong muscles over time." },
      { word: "bicep curls", example: "She does three sets of bicep curls with light weights." },
      { word: "focused", example: "After his workout, Fadi feels more focused when he studies." },
      { word: "progress", example: "If you keep going to the gym, you will see progress in a few weeks." },
      { word: "stretches", example: "He starts with ten minutes of stretches to warm up his body." },
      { word: "dumbbells", example: "Resistance training uses bands and light dumbbells to make your muscles work harder." },
      { word: "repetitions", example: "He uses eight-kilogram weights and does three sets of twelve repetitions." },
    ],
    passages: [
      {
        title: "Study Hard, Train Hard",
        body: [
          "Ahmad is a twenty-year-old student at Al al-Bayt University in Mafraq. Five days a week, he wakes up early, prays Fajr, and gets ready for his day. But Ahmad has a special part of his morning that most of his classmates do not know about. Before he opens a single textbook, he puts on his sports clothes, fills his water bottle, and walks to a small gym near his apartment in Sweifieh, Amman.",
          "Ahmad's routine at the gym is simple but effective. He starts with ten minutes of stretching to warm up his body. Then he moves on to resistance training, which uses bands and light dumbbells to make his muscles work harder. His favorite exercise is bicep curls. He uses eight-kilogram weights and does three sets of twelve repetitions. 'I started with three kilograms,' Ahmad says with a smile. 'Now my arms are much stronger.'",
          "After the gym, Ahmad goes home, showers, and eats a healthy breakfast. His mother always prepares labneh, olives, and fresh bread for him. Then he sits at his desk and studies for three to four hours. Ahmad believes that his morning workout helps him think more clearly. His classmate Omar joined the gym last month, and they train together on Saturdays.",
        ],
        boldWords: ["routine", "resistance training", "bicep curls", "focused", "progress"],
      },
      {
        title: "The Women-Only Gym in Jabal Hussein",
        body: [
          "When Noor opened her women-only gym in Jabal Hussein two years ago, many people in her family were surprised. 'A woman running a business?' her uncle asked. But Noor had noticed a real problem: many women in Amman wanted to exercise but felt uncomfortable in mixed gyms. She decided to create a space where women could train freely.",
          "The gym is on the third floor of a building near the Grand Husseini Mosque. It is small but well-equipped, with treadmills, stationary bikes, free weights, and a mirrored room for yoga classes. Every morning from six to eight, a group of fifteen to twenty women gathers for the early session. Most of them are university students or working professionals who come before their day begins.",
          "Noor offers three types of classes: cardio, strength training, and yoga. 'The most popular class is the Saturday morning strength session,' she says. 'The women love it because they can see real progress in their energy levels and overall health.' Noor also provides nutritional advice, recommending traditional Jordanian foods like lentil soup, grilled chicken, and tabbouleh as part of a balanced diet.",
        ],
        boldWords: ["well-equipped", "professionals", "cardio", "progress", "balanced diet"],
      },
    ],
  },
  {
    emoji: "🏛️",
    title: "History & Heritage",
    description: "Passages: Culture & identity",
    level: "B1–C1",
    vocab: [
      { word: "Sumud", example: "Sumud, often translated as steadfastness, is a deeply rooted resilience that permeates Palestinian daily life." },
      { word: "ancestral", example: "The olive trees symbolize an unbreakable bond between the people and their ancestral land." },
      { word: "heritage", example: "Palestine's historical heritage stretches back millennia, encompassing a rich tapestry of civilizations." },
      { word: "olive harvest", example: "The olive harvest brought families together, where children learned patience and hard work under the autumn sun." },
      { word: "resilience", example: "The resilience of the Palestinian people inspires the whole world." },
      { word: "steadfastness", example: "Sumud — steadfastness — remains unbroken despite decades of hardship." },
      { word: "preservation", example: "The preservation of ancient olive trees is both an environmental and cultural responsibility." },
      { word: "displacement", example: "Palestinian families demonstrate extraordinary resilience in the face of systematic displacement." },
    ],
    passages: [
      {
        title: "Finding Her Voice",
        body: [
          "Layla had always been a quiet student. Throughout her first two years at the University of Jordan, she sat in the back rows of her lecture halls, took careful notes, and rarely raised her hand. When her academic advisor suggested she take Essentials of Public Speaking as an elective, Layla's first reaction was fear. She had experienced severe stage fright ever since she was a child.",
          "Layla thought about her professor's words for days. What did she truly care about? The answer came to her during a family dinner in Al Hashemiyyeh, Irbid. Her grandmother was telling stories about their family's olive groves near Nablus, before the occupation changed everything. Layla listened as her grandmother described the deep green hills, the sound of the wind through the olive branches, and the smell of fresh olive oil that filled every kitchen.",
          "She spent two weeks writing and rewriting her speech. She spoke about the olive trees of Palestine as a symbol of Sumud — steadfastness — and how her grandmother carried that strength to Jordan. On the day of the final presentation, Layla walked to the front of the classroom. Her heart was beating fast, but she took a deep breath, looked at her audience, and began to speak confidently. When she finished, the room was completely silent for a moment. Then her classmates began to clap.",
        ],
        boldWords: ["stage fright", "persuasive", "audience", "confidently", "breakthrough"],
      },
      {
        title: "The Olive Trees of Palestine",
        body: [
          "In the hills of the West Bank, some olive trees are over a thousand years old. Their gnarled trunks twist upward like ancient sculptures, and their silver-green leaves catch the Mediterranean light in a way that has inspired poets and painters for generations. For Palestinians, these trees are far more than an agricultural crop — they are a living connection to the land and a symbol of an unbreakable heritage.",
          "Every October, during the olive harvest season, Palestinian families gather in their groves. Children help their parents pick the olives by hand, spreading large nets beneath the branches. The harvest is not just work — it is a celebration of family, community, and Sumud. Despite the challenges of restricted access, settler violence, and land confiscation, Palestinian farmers continue to tend their trees with extraordinary devotion.",
          "Olive oil from Palestine is considered among the finest in the world. In Jordan, Palestinian olive oil is prized in markets and homes, especially in cities like Irbid and Salt, which have strong family ties to Palestinian villages. The oil is used in everything from salads to za'atar and bread, and its rich, peppery flavor is unmistakable. Every bottle carries within it the story of the land, the people, and their enduring resilience.",
        ],
        boldWords: ["gnarled", "heritage", "devotion", "confiscation", "resilience", "unmistakable"],
      },
    ],
  },
  {
    emoji: "💼",
    title: "Business in Amman",
    description: "Passages: Startups & interviews",
    level: "B1–B2",
    vocab: [
      { word: "startup", example: "Amman is becoming a hub for tech startups in the MENA region." },
      { word: "entrepreneur", example: "A young entrepreneur launched a delivery app that serves all neighborhoods in Amman." },
      { word: "investment", example: "Ethical investment portfolios increasingly screen out companies that profit from settlement expansion." },
      { word: "commute", example: "The daily commute from Irbid to Amman can take over an hour during rush hour." },
      { word: "deadline", example: "We have to submit the business plan before the deadline on Friday." },
      { word: "networking", example: "Networking events in Amman bring together entrepreneurs, investors, and mentors." },
      { word: "pitch", example: "She prepared a strong pitch for the investors at the startup incubator in Jabal Amman." },
      { word: "revenue", example: "The company doubled its revenue in the second year by expanding to the Gulf market." },
    ],
    passages: [
      {
        title: "The Startup Scene in Amman",
        body: [
          "Amman's startup ecosystem has been growing rapidly over the past decade. Co-working spaces have opened across the city — from the trendy cafes of Jabal Amman to the modern business parks near the 7th Circle. Young Jordanian entrepreneurs are building apps, launching e-commerce platforms, and creating innovative solutions to local challenges.",
          "The daily commute to these hubs can be challenging. Traffic on the Airport Road is notoriously heavy during rush hour, and the roundabouts near Shmeisani and Abdali are often gridlocked. Despite this, young professionals arrive each morning full of energy, ready to meet deadlines, attend networking events, and refine their pitches for potential investors.",
          "What makes Amman unique is the sense of community. Startups share resources, experienced founders mentor newcomers, and weekend hackathons bring together developers, designers, and business students from the University of Jordan, Jordan University of Science and Technology, and beyond. It is this spirit of collaboration — rooted in Arab traditions of generosity and mutual support — that drives the city's growing reputation as a regional center for innovation.",
        ],
        boldWords: ["startup", "commute", "deadline", "networking", "revenue", "pitch"],
      },
      {
        title: "From University to CEO",
        body: [
          "When Lina graduated from the University of Jordan with a degree in Computer Science in 2019, she had two job offers from major tech companies. She turned them both down. Instead, she rented a small office in Shmeisani and launched her own software company, CodeDaleel, an app that helps Arabic-speaking students find affordable coding tutors online.",
          "The first year was difficult. Lina worked twelve-hour days, often eating falafel sandwiches at her desk for dinner. She cold-emailed over two hundred potential investors and received only three replies. But she persisted. Her breakthrough came when a Jordanian angel investor saw her pitch at a tech meetup in Abdali and agreed to fund the first round of development.",
          "By 2024, CodeDaleel had over fifty thousand active users across Jordan, Egypt, and the UAE. Lina now employs a team of twelve developers, designers, and content creators. She regularly speaks at tech conferences and mentors young entrepreneurs. 'My advice to every young person in Jordan,' she says, 'is to believe in your idea, but also listen to feedback. The market will tell you what it needs.'",
        ],
        boldWords: ["turned down", "persisted", "breakthrough", "angel investor", "active users", "mentors"],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function boldPassageWords(text: string, boldWords: string[]): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  const positions = boldWords
    .map((w) => {
      const idx = remaining.indexOf(w);
      return idx >= 0 ? { word: w, index: idx, length: w.length } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.index - b!.index) as { word: string; index: number; length: number }[];

  if (positions.length === 0) return [text];

  let lastEnd = 0;
  positions.forEach((pos, i) => {
    if (pos.index > lastEnd) {
      parts.push(remaining.slice(lastEnd, pos.index));
    }
    parts.push(
      <strong key={`b-${i}`} className="text-aqaba font-semibold">
        {pos.word}
      </strong>
    );
    lastEnd = pos.index + pos.length;
  });

  if (lastEnd < remaining.length) {
    parts.push(remaining.slice(lastEnd));
  }

  return parts;
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getPlacementLevel(score: number): { level: string; description: string } {
  const a1Count = score > 0 && score <= 5 ? score : Math.min(5, score);
  const b1Count = score > 5 ? Math.min(5, score - 5) : 0;
  const c1Count = score > 10 ? score - 10 : 0;

  if (c1Count >= 4) return { level: "C1–C2", description: "Advanced! You have an excellent command of English. Focus on academic writing and nuanced vocabulary." };
  if (c1Count >= 2 && b1Count >= 3) return { level: "B2–C1", description: "Upper Intermediate to Advanced! You are very strong. Push into complex grammar and professional English." };
  if (b1Count >= 4) return { level: "B1–B2", description: "Intermediate! Solid foundation. Work on complex sentences, professional vocabulary, and idiomatic expressions." };
  if (b1Count >= 2 && a1Count >= 3) return { level: "A2–B1", description: "Pre-Intermediate! Good basics. Focus on verb tenses, longer conversations, and reading short articles." };
  if (a1Count >= 3) return { level: "A1–A2", description: "Beginner! You know the basics. Practice daily vocabulary, simple sentences, and listening skills." };
  return { level: "A1", description: "Welcome! Start with basic vocabulary, simple greetings, and everyday phrases. You are at the beginning of an exciting journey!" };
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function VocabCard({ item, index }: { item: VocabItem; index: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="group border border-gray-100 rounded-lg p-4 hover:border-aqaba/30 hover:bg-blue-50/30 transition-all cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-bold text-gray-900 group-hover:text-aqaba transition-colors">
          {item.word}
        </h4>
        <span className="text-xs text-gray-400 shrink-0 mt-0.5">#{index + 1}</span>
      </div>
      {flipped ? (
        <p className="text-sm text-olive bg-green-50 p-2 rounded border-l-3 border-olive font-medium">
          Click to show example
        </p>
      ) : (
        <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded border-l-3 border-aqaba/50">
          &ldquo;{item.example}&rdquo;
        </p>
      )}
    </div>
  );
}

/* ─── Interest Sheet Content with Renewable Passages ─── */

function InterestSheetContent({ data, onRefresh }: { data: InterestCategory; onRefresh: () => void }) {
  const [passageIdx, setPassageIdx] = useState(() => Math.floor(Math.random() * data.passages.length));
  const currentPassage = data.passages[passageIdx];

  function handleNewPassage() {
    let next = (passageIdx + 1) % data.passages.length;
    if (data.passages.length > 1) {
      while (next === passageIdx) {
        next = Math.floor(Math.random() * data.passages.length);
      }
    }
    setPassageIdx(next);
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-5 text-aqaba" />
          <h3 className="text-lg font-bold text-gray-900">
            Vocabulary ({data.vocab.length} words)
          </h3>
        </div>
        <div className="space-y-3">
          {data.vocab.map((item, i) => (
            <VocabCard key={item.word} item={item} index={i} />
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookText className="size-5 text-petra" />
            <h3 className="text-lg font-bold text-gray-900">Reading Passage</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Level: {data.level}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewPassage}
            className="gap-1 text-xs text-aqaba border-aqaba/30 hover:bg-aqaba/10"
          >
            <RefreshCw className="size-3" />
            New Passage
          </Button>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Passage {passageIdx + 1} of {data.passages.length} — Click &ldquo;New Passage&rdquo; for a different story
        </p>
        <h4 className="text-xl font-bold text-gray-900 mb-3">{currentPassage.title}</h4>
        <div className="space-y-3">
          {currentPassage.body.map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed text-[15px]">
              {boldPassageWords(paragraph, currentPassage.boldWords)}
            </p>
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Key Words in This Passage
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentPassage.boldWords.map((w) => (
            <Badge key={w} className="bg-aqaba/10 text-aqaba border-aqaba/20 hover:bg-aqaba/20">
              {w}
            </Badge>
          ))}
        </div>
      </section>

      <div className="h-8" />
    </ScrollArea>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLACEMENT TEST COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function PlacementTest({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const question = placementQuestions[currentQ];
  const totalQuestions = placementQuestions.length;

  function handleAnswer(optionIdx: number) {
    const newAnswers = { ...answers, [question.id]: optionIdx };
    setAnswers(newAnswers);
  }

  function handleNext() {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  }

  function handlePrev() {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  }

  function calculateScore() {
    let score = 0;
    placementQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  }

  function resetTest() {
    setCurrentQ(0);
    setAnswers({});
    setShowResults(false);
    setStarted(false);
  }

  function handleClose() {
    onOpenChange(false);
    resetTest();
  }

  const score = calculateScore();
  const result = getPlacementLevel(score);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-aqaba to-aqaba-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="size-6" />
            Placement Test
          </SheetTitle>
          <SheetDescription className="text-blue-100 text-sm">
            Answer {totalQuestions} questions to find your CEFR level
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pt-4">
          {!started ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Test Your English?</h3>
              <p className="text-gray-600 mb-2 max-w-md mx-auto">
                This placement test has {totalQuestions} questions across three levels: A1 (Beginner), B1 (Intermediate), and C1 (Advanced).
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Answer honestly — there are no wrong answers, only honest ones. The test takes about 10 minutes.
              </p>
              <Button onClick={() => setStarted(true)} className="bg-aqaba hover:bg-aqaba-dark text-white px-8 py-3 text-lg">
                Start the Test
              </Button>
            </div>
          ) : showResults ? (
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="text-center py-6">
                <Trophy className="size-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {score} / {totalQuestions}
                </h3>
                <Badge className="bg-aqaba text-white text-lg px-4 py-1 mb-3">
                  {result.level}
                </Badge>
                <p className="text-gray-600 max-w-md mx-auto mb-6">{result.description}</p>
              </div>
              <Separator className="my-4" />
              <h4 className="text-lg font-bold text-gray-800 mb-4">Review Your Answers</h4>
              <div className="space-y-4 pb-6">
                {placementQuestions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correct;
                  return (
                    <div key={q.id} className={`p-4 rounded-lg border-2 ${isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? <CheckCircle className="size-5 text-green-600 shrink-0 mt-0.5" /> : <XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />}
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">{q.level}</Badge>
                          <p className="font-semibold text-gray-900 text-sm">Q{idx + 1}: {q.question}</p>
                        </div>
                      </div>
                      {userAnswer !== undefined && !isCorrect && (
                        <p className="text-sm text-red-700 ml-7 mb-1">
                          Your answer: <span className="line-through">{q.options[userAnswer]}</span>
                        </p>
                      )}
                      <p className="text-sm text-green-700 ml-7 mb-1">
                        Correct answer: <span className="font-semibold">{q.options[q.correct]}</span>
                      </p>
                      <p className="text-sm text-gray-600 ml-7 italic">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center pb-8">
                <Button onClick={resetTest} className="bg-aqaba hover:bg-aqaba-dark text-white px-8">
                  <RefreshCw className="size-4 mr-2" />
                  Retake the Test
                </Button>
              </div>
            </ScrollArea>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-xs">{question.level}</Badge>
                <span className="text-sm text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-aqaba h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{question.question}</h3>
              <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => {
                  const selected = answers[question.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selected
                          ? "border-aqaba bg-blue-50 text-aqaba font-semibold"
                          : "border-gray-200 hover:border-aqaba/50 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={currentQ === 0} className="gap-1">
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[question.id] === undefined}
                  className="bg-aqaba hover:bg-aqaba-dark text-white gap-1"
                >
                  {currentQ === totalQuestions - 1 ? "See Results" : "Next"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRAMMAR LESSON SHEET COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function GrammarSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  function handleSelectLesson(lesson: GrammarLesson) {
    setSelectedLesson(lesson);
    setDetailOpen(true);
  }

  function handleDetailClose(v: boolean) {
    setDetailOpen(v);
    if (!v) setSelectedLesson(null);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
          <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-olive to-olive-dark">
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Languages className="size-6" />
              Grammar Lessons
            </SheetTitle>
            <SheetDescription className="text-green-100 text-sm">
              Practical grammar with real-world examples
            </SheetDescription>
          </SheetHeader>
          <div className="px-6 pt-4 space-y-3">
            {grammarLessons.map((lesson) => (
              <Card
                key={lesson.title}
                className="cursor-pointer hover:border-olive/50 hover:shadow-md transition-all"
                onClick={() => handleSelectLesson(lesson)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-gray-900">{lesson.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-olive text-xs">{lesson.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{lesson.content[0].slice(0, 120)}...</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={detailOpen && !!selectedLesson} onOpenChange={handleDetailClose}>
        <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
          {selectedLesson && (
            <>
              <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-olive to-olive-dark">
                <div className="flex items-center gap-2 mb-1">
                  <SheetTitle className="text-xl font-bold text-white">{selectedLesson.title}</SheetTitle>
                  <Badge className="bg-white/20 text-white text-xs">{selectedLesson.level}</Badge>
                </div>
                <SheetDescription className="text-green-100 text-sm">Practical grammar lesson</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-10rem)] px-6 pt-4">
                <div className="space-y-4">
                  {selectedLesson.content.map((para, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed">{para}</p>
                  ))}
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-sm font-bold text-olive uppercase tracking-wide mb-3">Practical Tips</h3>
                  <ul className="space-y-2">
                    {selectedLesson.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="size-4 text-olive shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-8" />
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHATBOT COMPONENT
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-gray-600 hover:bg-gray-700 rotate-0" : "bg-aqaba hover:bg-aqaba-dark hover:scale-110"
        }`}
      >
        {isOpen ? <X className="size-6 text-white" /> : <MessageCircle className="size-6 text-white" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: "500px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-aqaba to-aqaba-dark p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Nibras — Your English Tutor</h3>
              <p className="text-blue-200 text-xs">Ask me anything about English</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">👋</div>
                <p className="text-gray-500 text-sm mb-1">Hi! I am Nibras, your English tutor.</p>
                <p className="text-gray-400 text-xs">Ask me about vocabulary, grammar, pronunciation, or anything related to learning English!</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["What does 'break the ice' mean?", "How do I improve my speaking?", "P vs B pronunciation tips"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setInput(suggestion); }}
                      className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-aqaba hover:bg-blue-50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-aqaba text-white rounded-br-md"
                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about English..."
                className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-aqaba focus:ring-1 focus:ring-aqaba/30 bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-aqaba hover:bg-aqaba-dark text-white flex items-center justify-center disabled:opacity-40 transition-colors"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE EXPLORER DROPDOWN
   ═══════════════════════════════════════════════════════════════ */

function FeatureExplorer({
  onGrammar,
  onVocab,
  onReading,
  onTest,
  onIdioms,
}: {
  onGrammar: () => void;
  onVocab: () => void;
  onReading: () => void;
  onTest: () => void;
  onIdioms: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(!open)}
        className="bg-olive hover:bg-olive-dark text-white shadow rounded-md transition-colors text-sm gap-1"
      >
        <Compass className="size-4" />
        Explore Features
        <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2 overflow-hidden">
            {[
              { icon: <GraduationCap className="size-4" />, label: "Placement Test", desc: "Find your CEFR level", color: "text-aqaba", onClick: onTest },
              { icon: <BookText className="size-4" />, label: "Reading Passages", desc: "Daily reading practice", color: "text-petra", onClick: onReading },
              { icon: <BookOpen className="size-4" />, label: "Vocabulary Lists", desc: "Words by topic & level", color: "text-olive", onClick: onVocab },
              { icon: <Languages className="size-4" />, label: "Grammar Lessons", desc: "Practical grammar tips", color: "text-purple-600", onClick: onGrammar },
              { icon: <HelpCircle className="size-4" />, label: "Idiom Practice", desc: "Learn everyday expressions", color: "text-amber-600", onClick: onIdioms },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className={`${item.color}`}>{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <ArrowRight className="size-3 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DAILY DROP SHEET
   ═══════════════════════════════════════════════════════════════ */

function DailyDropSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-aqaba to-aqaba-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <BookText className="size-6" />
            Today&apos;s Daily Drop
          </SheetTitle>
          <SheetDescription className="text-blue-100 text-sm">
            Level: {dailyDrop.level} — Read the full passage
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] px-6 pt-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{dailyDrop.title}</h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Ahmad took a deep breath before walking to the front of the classroom. It was his final presentation for the Essentials of Public Speaking course at the University of Jordan. His hands were shaking slightly, but he remembered his professor&apos;s advice: &ldquo;Confidence is built, not given.&rdquo; As he looked at his classmates, he realized they wanted him to succeed. He smiled, introduced his topic on AI integration, and the words began to flow naturally.
            </p>
            <p className="text-gray-700 leading-relaxed">
              His presentation covered three main areas: how AI is being used in Jordanian hospitals to assist doctors, how Jordanian universities are incorporating AI research into their computer science programs, and what ethical concerns come with this rapid technological change. He used real examples from King Abdullah University Hospital and the University of Jordan&apos;s AI lab to make his points clear and relatable.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When Ahmad finished, there was a brief moment of silence. Then his professor, Dr. Hala, stood up and began to clap. The entire class joined in. Dr. Hala told Ahmad that his presentation was one of the best she had seen all semester. Ahmad felt a wave of relief and gratitude. He realized that stage fright was not a wall — it was a door, and he had just walked through it.
            </p>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-sm font-bold text-aqaba uppercase tracking-wide mb-3">Key Vocabulary</h3>
            <div className="flex flex-wrap gap-2">
              {["stage fright", "confidence", "essentials", "integration", "ethical concerns", "relief", "gratitude"].map((w) => (
                <Badge key={w} className="bg-aqaba/10 text-aqaba border-aqaba/20">{w}</Badge>
              ))}
            </div>
          </div>
          <div className="h-8" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   IDIOM SHEET (Multiple Idioms)
   ═══════════════════════════════════════════════════════════════ */

function IdiomSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [displayedIdioms, setDisplayedIdioms] = useState<Idiom[]>(() => getRandomItems(allIdioms, 5));

  function refreshIdioms() {
    setDisplayedIdioms(getRandomItems(allIdioms, 5));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-amber-500 to-amber-600">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="size-6" />
            Idiom Practice
          </SheetTitle>
          <SheetDescription className="text-amber-100 text-sm">
            Common English expressions with examples
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing 5 of {allIdioms.length} idioms
            </p>
            <Button variant="outline" size="sm" onClick={refreshIdioms} className="gap-1 text-xs text-amber-600 border-amber-300 hover:bg-amber-50">
              <RefreshCw className="size-3" />
              Shuffle
            </Button>
          </div>
          <div className="space-y-4">
            {displayedIdioms.map((idiom, i) => (
              <Card key={idiom.idiom} className="border-l-4 border-l-amber-400">
                <CardContent className="pt-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{idiom.idiom}</h4>
                  <p className="text-sm text-gray-600 mb-2">{idiom.definition}</p>
                  <p className="text-sm text-gray-500 italic bg-amber-50 p-2 rounded border-l-3 border-amber-400">
                    &ldquo;{idiom.example}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-8" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORD OF DAY SHEET
   ═══════════════════════════════════════════════════════════════ */

const wordOfDay = {
  word: "Resilience",
  partOfSpeech: "(Noun)",
  phonetic: "/rɪˈzæl.jəns/",
  example: "The resilience of the Palestinian people inspires the whole world.",
};

const dailyDrop = {
  level: "B1",
  title: "Overcoming Stage Fright",
  body: `Ahmad took a deep breath before walking to the front of the classroom. It was his final presentation for the Essentials of Public Speaking course at the University of Jordan. His hands were shaking slightly, but he remembered his professor's advice: "Confidence is built, not given." As he looked at his classmates, he realized they wanted him to succeed. He smiled, introduced his topic on AI integration, and the words began to flow naturally.`,
};

function WordOfDaySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-petra to-petra-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="size-6" />
            Word of the Day
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pt-6">
          <h3 className="text-4xl font-bold text-petra mb-2">{wordOfDay.word}</h3>
          <p className="text-sm text-gray-500 italic mb-1">{wordOfDay.partOfSpeech} &bull; {wordOfDay.phonetic}</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Meaning</h4>
              <p className="text-gray-700">
                The capacity to withstand or to recover quickly from difficulties; mental toughness and the ability to bounce back after challenges.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Example</h4>
              <p className="text-gray-700 italic bg-pink-50 p-3 rounded border-l-4 border-petra">
                &ldquo;{wordOfDay.example}&rdquo;
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Related Words</h4>
              <div className="flex flex-wrap gap-2">
                {["perseverance", "endurance", "tenacity", "fortitude", "grit"].map((w) => (
                  <Badge key={w} className="bg-petra/10 text-petra border-petra/20">{w}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">In Context</h4>
              <p className="text-sm text-gray-600">
                In Jordanian culture, resilience is a deeply valued trait. From the people of Palestine who demonstrate extraordinary Sumud, to Jordanian students who overcome challenges to achieve their academic goals, resilience is woven into daily life.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [selectedInterest, setSelectedInterest] = useState<InterestCategory | null>(null);
  const [interestSheetOpen, setInterestSheetOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [grammarListOpen, setGrammarListOpen] = useState(false);
  const [dailyDropOpen, setDailyDropOpen] = useState(false);
  const [wordOfDayOpen, setWordOfDayOpen] = useState(false);
  const [idiomSheetOpen, setIdiomSheetOpen] = useState(false);
  const [displayedIdioms, setDisplayedIdioms] = useState<Idiom[]>(() => getRandomItems(allIdioms, 4));

  function refreshMainIdioms() {
    setDisplayedIdioms(getRandomItems(allIdioms, 4));
  }

  function handleOpenInterest(data: InterestCategory) {
    setSelectedInterest(data);
    setInterestSheetOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Navigation ─── */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
          <h1 className="text-2xl font-bold text-aqaba tracking-tight cursor-pointer">
            Nibras English
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge className="bg-green-100 text-olive border-none hover:bg-green-100 py-1 px-3 text-xs sm:text-sm font-semibold">
              🔥 5 Day Streak
            </Badge>
            <FeatureExplorer
              onGrammar={() => setGrammarListOpen(true)}
              onVocab={() => handleOpenInterest(interests[0])}
              onReading={() => setDailyDropOpen(true)}
              onTest={() => setPlacementOpen(true)}
              onIdioms={() => setIdiomSheetOpen(true)}
            />
            <Button
              onClick={() => setPlacementOpen(true)}
              className="bg-petra hover:bg-petra-dark text-white shadow rounded-md transition-colors text-sm"
            >
              Placement Test
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <header className="max-w-6xl mx-auto mt-8 sm:mt-10 px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 tracking-tight">
          Master English. Stay Rooted.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Explore daily readings, practical vocabulary, and grammar tailored to
          your world.
        </p>
      </header>

      {/* ─── Main Content Grid ─── */}
      <main className="max-w-6xl mx-auto px-4 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Drop (2 cols) */}
        <Card
          className="md:col-span-2 border-t-4 border-t-aqaba shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setDailyDropOpen(true)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl sm:text-2xl text-aqaba">
                Today&apos;s Daily Drop
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm">
                Level: {dailyDrop.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              {dailyDrop.title}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
              {dailyDrop.body}
            </p>
            <span className="text-aqaba font-semibold hover:underline transition-colors text-sm sm:text-base inline-flex items-center gap-1">
              Read full passage &amp; take quiz <ArrowRight className="size-4" />
            </span>
          </CardContent>
        </Card>

        {/* Sidebar: Word + Idioms */}
        <aside className="space-y-6">
          {/* Word of the Day */}
          <Card
            className="border-t-4 border-t-petra shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setWordOfDayOpen(true)}
          >
            <CardContent className="pt-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                Word of the Day
              </h3>
              <h4 className="text-2xl sm:text-3xl font-bold text-petra mb-1">
                {wordOfDay.word}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 italic mb-3">
                {wordOfDay.partOfSpeech} &bull; {wordOfDay.phonetic}
              </p>
              <p className="text-sm sm:text-base text-gray-600 bg-gray-50 p-2 rounded border-l-4 border-petra">
                &ldquo;{wordOfDay.example}&rdquo;
              </p>
              <span className="text-petra text-xs font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
                Tap to learn more <ArrowRight className="size-3" />
              </span>
            </CardContent>
          </Card>

          {/* Idioms Section (Multiple) */}
          <Card className="border-t-4 border-t-olive shadow-lg rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide">
                  Idioms to Know
                </h3>
                <button
                  onClick={refreshMainIdioms}
                  className="text-olive hover:text-olive-dark transition-colors"
                  title="Show different idioms"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>
              <div className="space-y-3">
                {displayedIdioms.map((idiom) => (
                  <div
                    key={idiom.idiom}
                    className="cursor-pointer group"
                    onClick={() => setIdiomSheetOpen(true)}
                  >
                    <h4 className="text-sm font-bold text-olive group-hover:text-olive-dark transition-colors">
                      {idiom.idiom}
                    </h4>
                    <p className="text-xs text-gray-500 leading-snug">{idiom.definition}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIdiomSheetOpen(true)}
                className="text-olive text-xs font-semibold mt-3 inline-flex items-center gap-1 hover:underline"
              >
                See all idioms <ArrowRight className="size-3" />
              </button>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* ─── Explore by Interest ─── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
          Explore by Interest
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {interests.map((item) => (
            <Card
              key={item.title}
              className="text-center cursor-pointer shadow hover:shadow-md transition-all duration-200 border-b-2 border-gray-200 hover:border-aqaba rounded-lg group"
              onClick={() => handleOpenInterest(item)}
            >
              <CardContent className="pt-5 sm:pt-6 pb-5 sm:pb-6">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h4 className="font-semibold text-gray-800 group-hover:text-aqaba transition-colors text-sm sm:text-base">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-snug">
                  {item.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">Level: {item.level}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-aqaba opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold">Explore</span>
                  <ArrowRight className="size-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Quick Feature Cards ─── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
          Quick Practice
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-aqaba"
            onClick={() => setPlacementOpen(true)}
          >
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <GraduationCap className="size-6 text-aqaba" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Take the Placement Test</h4>
                <p className="text-xs text-gray-500">15 questions to find your level</p>
              </div>
              <ArrowRight className="size-5 text-gray-400 ml-auto shrink-0" />
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-olive"
            onClick={() => setGrammarListOpen(true)}
          >
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Languages className="size-6 text-olive" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Grammar Lessons</h4>
                <p className="text-xs text-gray-500">Practical tips for real improvement</p>
              </div>
              <ArrowRight className="size-5 text-gray-400 ml-auto shrink-0" />
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-amber-500"
            onClick={() => setIdiomSheetOpen(true)}
          >
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <HelpCircle className="size-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Idiom Practice</h4>
                <p className="text-xs text-gray-500">{allIdioms.length} expressions to master</p>
              </div>
              <ArrowRight className="size-5 text-gray-400 ml-auto shrink-0" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p className="font-semibold text-aqaba">Nibras English</p>
          <p>Built for Jordanian learners, by Jordanian educators.</p>
        </div>
      </footer>

      {/* ═══ ALL SHEETS & OVERLAYS ═══ */}

      {/* Interest Category Sheet */}
      <Sheet open={interestSheetOpen} onOpenChange={setInterestSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
          {selectedInterest && (
            <>
              <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-sand to-white">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedInterest.emoji}</span>
                  <div>
                    <SheetTitle className="text-xl font-bold text-gray-900">{selectedInterest.title}</SheetTitle>
                    <SheetDescription className="text-sm text-gray-500 mt-0.5">{selectedInterest.description}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="px-6">
                <InterestSheetContent data={selectedInterest} onRefresh={() => {}} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Placement Test */}
      <PlacementTest open={placementOpen} onOpenChange={setPlacementOpen} />

      {/* Grammar Lesson */}
      <GrammarSheet open={grammarListOpen} onOpenChange={setGrammarListOpen} />

      {/* Daily Drop Full Passage */}
      <DailyDropSheet open={dailyDropOpen} onOpenChange={setDailyDropOpen} />

      {/* Word of Day */}
      <WordOfDaySheet open={wordOfDayOpen} onOpenChange={setWordOfDayOpen} />

      {/* Idioms */}
      <IdiomSheet open={idiomSheetOpen} onOpenChange={setIdiomSheetOpen} />

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
