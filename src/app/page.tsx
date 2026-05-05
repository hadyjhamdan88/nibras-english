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
  Paperclip,
  Mic2,
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
  level: string; // "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  type: "grammar" | "vocab" | "reading" | "pragmatic"; // NEW: question type tag
  passage?: string; // NEW: optional reading passage (only for type: "reading")
  question: string;
  options: string[]; // 4 options
  correct: number; // index 0-3
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
  // ============== A1 (5 questions) ==============
  {
    id: 1, level: "A1", type: "grammar",
    question: "Complete the sentence: My name ___ Layla and I am from Amman.",
    options: ["are", "is", "am", "be"],
    correct: 1,
    explanation: "We use 'is' with he, she, it, and singular names. 'My name is Layla.'",
  },
  {
    id: 2, level: "A1", type: "vocab",
    question: "Which word means a place where you buy fresh bread?",
    options: ["pharmacy", "library", "bakery", "garage"],
    correct: 2,
    explanation: "A bakery is a shop that sells bread and pastries. In Jordan, you can find one on almost every street.",
  },
  {
    id: 3, level: "A1", type: "grammar",
    question: "Choose the correct sentence:",
    options: ["She have two brothers.", "She has two brothers.", "She having two brothers.", "She is have two brothers."],
    correct: 1,
    explanation: "With he, she, and it, we use 'has' instead of 'have'.",
  },
  {
    id: 4, level: "A1", type: "pragmatic",
    question: "Your aunt gives you a gift. What do you say?",
    options: ["See you later.", "How are you?", "I am tired.", "Thank you very much."],
    correct: 3,
    explanation: "When someone gives us something, we say 'thank you'. The other phrases are for different situations.",
  },
  {
    id: 5, level: "A1", type: "reading",
    passage: "Hi, I am Omar. I am a student at the University of Jordan. I live in Amman with my family. Every morning, I drink tea and eat bread with za'atar before class.",
    question: "What does Omar do every morning?",
    options: ["He goes shopping.", "He drinks coffee at a café.", "He plays football.", "He has tea and bread with za'atar."],
    correct: 3,
    explanation: "The passage clearly says 'Every morning, I drink tea and eat bread with za'atar before class.'",
  },
  // ============== A2 (5 questions) ==============
  {
    id: 6, level: "A2", type: "grammar",
    question: "Complete: Yesterday, we ___ to Petra with our cousins.",
    options: ["go", "going", "went", "goes"],
    correct: 2,
    explanation: "'Yesterday' tells us this is in the past. The past form of 'go' is 'went'.",
  },
  {
    id: 7, level: "A2", type: "vocab",
    question: "Which word best fits? The traffic in Amman is very ___ at 8 a.m.",
    options: ["heavy", "tall", "deep", "loud"],
    correct: 0,
    explanation: "We say 'heavy traffic' to mean there are a lot of cars. The other words do not fit with traffic.",
  },
  {
    id: 8, level: "A2", type: "pragmatic",
    question: "You arrive late to class. What is the most polite thing to say to your teacher?",
    options: ["I am late, sorry.", "Why is class early?", "Sorry I am late, may I come in?", "Hello, where is my seat?"],
    correct: 2,
    explanation: "Adding 'may I come in?' shows politeness and respect for the teacher's authority over the classroom.",
  },
  {
    id: 9, level: "A2", type: "grammar",
    question: "Choose the correct comparison: Aqaba is ___ than Amman in winter.",
    options: ["warmer", "more warm", "warmest", "warm more"],
    correct: 0,
    explanation: "Short adjectives like 'warm' add '-er' for comparison. Aqaba's coast is indeed warmer than Amman in winter.",
  },
  {
    id: 10, level: "A2", type: "reading",
    passage: "My sister works at a hospital in Irbid. She starts work at 7 a.m. and finishes at 3 p.m. After work, she usually visits our grandmother. On Fridays, she stays home and cooks maqloubeh for the family.",
    question: "What does the writer's sister do on Fridays?",
    options: ["She works extra hours.", "She visits her grandmother.", "She cooks for the family at home.", "She travels to Amman."],
    correct: 2,
    explanation: "The last sentence says 'On Fridays, she stays home and cooks maqloubeh for the family.'",
  },
  // ============== B1 (5 questions) ==============
  {
    id: 11, level: "B1", type: "grammar",
    question: "Complete: By the time we arrived in Aqaba, the sun ___.",
    options: ["has already set", "already set", "is already setting", "had already set"],
    correct: 3,
    explanation: "We use the past perfect ('had set') to talk about an action that finished BEFORE another past action.",
  },
  {
    id: 12, level: "B1", type: "vocab",
    question: "Which word best completes the sentence? My father gave me valuable ___ before my job interview.",
    options: ["advice", "advices", "advise", "advisement"],
    correct: 0,
    explanation: "'Advice' is uncountable, so it has no plural form. The verb form is 'advise' (with an 's' sound).",
  },
  {
    id: 13, level: "B1", type: "pragmatic",
    question: "Which is the most professional way to start a job application email?",
    options: ["Hey, I want this job.", "Dear Sir or Madam, I am writing to apply for the marketing position.", "Hi, please give me the job.", "I am interesting in your job."],
    correct: 1,
    explanation: "Formal job applications use 'Dear Sir or Madam' and 'I am writing to apply...' These signal professionalism.",
  },
  {
    id: 14, level: "B1", type: "grammar",
    question: "Choose the correct conditional: If I ___ earlier, I would not have missed the bus to Salt.",
    options: ["have left", "would leave", "will leave", "had left"],
    correct: 3,
    explanation: "This is a third conditional sentence. The pattern is: If + past perfect, would + have + past participle.",
  },
  {
    id: 15, level: "B1", type: "reading",
    passage: "Sumud is an Arabic word that means 'steadfastness' or 'staying firm.' For Palestinians, sumud is more than a word — it is a way of life. It means staying connected to the land, planting olive trees, raising children, and continuing daily life despite great difficulty. Many writers describe sumud as quiet resistance.",
    question: "According to the passage, what is the main meaning of sumud?",
    options: ["A type of olive tree.", "Quiet, daily resistance through staying connected to the land.", "A famous Palestinian writer.", "A historical event that happened once."],
    correct: 1,
    explanation: "The passage explains that sumud is 'quiet resistance' shown through staying on the land and continuing daily life.",
  },
  // ============== B2 (5 questions) ==============
  {
    id: 16, level: "B2", type: "grammar",
    question: "Complete: The proposal ___ by the committee before being sent to the dean.",
    options: ["will review", "will be reviewed", "will reviewing", "will been reviewed"],
    correct: 1,
    explanation: "The future passive is 'will be + past participle.' The proposal does not review itself; it is reviewed by others.",
  },
  {
    id: 17, level: "B2", type: "vocab",
    question: "Choose the word that best fits: The young entrepreneur was ___ to take the financial risk despite the warnings.",
    options: ["fearless", "fearful", "feared", "fearing"],
    correct: 0,
    explanation: "'Fearless' means without fear — appropriate for someone willing to take a risk. 'Fearful' would mean the opposite.",
  },
  {
    id: 18, level: "B2", type: "pragmatic",
    question: "Your colleague suggests an idea you disagree with in a meeting. What is the most diplomatic response?",
    options: ["That is wrong.", "I see what you mean, but I would suggest we also consider another angle.", "No, that will not work.", "I do not like your idea."],
    correct: 1,
    explanation: "Acknowledging the other person's view ('I see what you mean') before offering an alternative is standard professional disagreement.",
  },
  {
    id: 19, level: "B2", type: "grammar",
    question: "Choose the correct sentence using a relative clause:",
    options: ["The student which won the prize is from Karak.", "The student that wins the prize is from Karak.", "The student who won the prize is from Karak.", "The student whose won the prize is from Karak."],
    correct: 2,
    explanation: "We use 'who' for people. 'Which' is for things, and 'whose' shows possession.",
  },
  {
    id: 20, level: "B2", type: "reading",
    passage: "Jordan's tech sector has grown remarkably over the past decade. Once dominated by traditional industries, the country now hosts a vibrant ecosystem of startups in Amman, particularly in the Abdali and Shmeisani districts. Young entrepreneurs, many of them returning graduates from abroad, are launching companies in fintech, e-commerce, and AI translation tools. While funding remains a challenge compared to Gulf neighbours, the talent pool is widely considered one of the strongest in the region.",
    question: "What is the writer's main point about Jordan's tech sector?",
    options: ["It is the largest in the Arab world.", "It struggles with poor talent compared to neighbours.", "It has grown significantly and has strong talent, despite funding challenges.", "It only focuses on fintech and nothing else."],
    correct: 2,
    explanation: "The passage describes growth and talent strength while acknowledging funding remains a challenge — answer C captures all three points accurately.",
  },
  // ============== C1 (5 questions) ==============
  {
    id: 21, level: "C1", type: "grammar",
    question: "Choose the sentence that best uses inversion for emphasis:",
    options: ["Not only did the study reveal significant findings, but it also proposed a new framework.", "The study not only revealed significant findings but also proposed a new framework.", "The study revealed significant findings and also proposed a new framework.", "Significant findings were revealed by the study, and it proposed a new framework."],
    correct: 0,
    explanation: "Inversion ('did the study reveal' instead of 'the study revealed') after 'not only' is a C1-level rhetorical device that adds emphasis.",
  },
  {
    id: 22, level: "C1", type: "vocab",
    question: "Choose the most precise word: The scholar's ___ on bilingualism challenged long-held assumptions in the field.",
    options: ["talk", "treatise", "paper", "idea"],
    correct: 1,
    explanation: "A 'treatise' is a formal, systematic written work on a specific subject. 'Paper' and 'idea' are too general; 'talk' suggests speech, not writing.",
  },
  {
    id: 23, level: "C1", type: "pragmatic",
    question: "What is the pragmatic function of 'I was wondering if you might possibly consider...'?",
    options: ["A highly indirect, polite request that softens the imposition on the listener.", "A question about a past wondering.", "An expression of doubt about the future.", "A statement about personal curiosity only."],
    correct: 0,
    explanation: "This is a classic example of indirect speech act theory — multiple hedges ('wondering', 'might', 'possibly') minimise face threat in formal requests.",
  },
  {
    id: 24, level: "C1", type: "grammar",
    question: "Complete: The government's policy, ___ has been widely criticised, remains unchanged.",
    options: ["that", "what", "where", "which"],
    correct: 3,
    explanation: "'Which' is the correct relative pronoun for non-restrictive clauses (those set off by commas). 'That' cannot be used in non-restrictive clauses.",
  },
  {
    id: 25, level: "C1", type: "reading",
    passage: "The notion that language merely reflects thought has long been contested. Sapir and Whorf, in their now-canonical work, argued that the linguistic structures of one's native tongue actively shape cognition, predisposing speakers to particular ways of categorising experience. While the strong version of this hypothesis has fallen out of favour, contemporary research suggests a more nuanced relationship: language and thought appear to be mutually constitutive, each subtly informing the other in domains ranging from spatial reasoning to colour perception.",
    question: "What does the passage suggest about the current view of language and thought?",
    options: ["Language has no influence on thought whatsoever.", "Sapir and Whorf's strong claim has been entirely vindicated by modern research.", "Language and thought influence each other in complex, mutual ways.", "Only spatial reasoning is affected by language."],
    correct: 2,
    explanation: "The phrase 'mutually constitutive, each subtly informing the other' indicates a two-way, nuanced relationship — answer C.",
  },
  // ============== C2 (5 questions) ==============
  {
    id: 26, level: "C2", type: "grammar",
    question: "Identify the sentence with the most sophisticated structure:",
    options: ["Were she to reconsider her position, the entire negotiation would shift in our favour.", "If she would reconsider her position, the negotiation would shift.", "If she reconsidered, things would change.", "She might reconsider, and then things would change."],
    correct: 0,
    explanation: "Inverted conditional 'Were she to reconsider...' (without 'if') is a hallmark of C2 register, used in formal writing and rhetoric.",
  },
  {
    id: 27, level: "C2", type: "vocab",
    question: "Choose the most apt word: The minister's response was characterised by deliberate ___, neither confirming nor denying the allegations.",
    options: ["clarity", "vagueness", "honesty", "equivocation"],
    correct: 3,
    explanation: "'Equivocation' specifically means using ambiguous language to avoid committing oneself — more precise than the broader 'vagueness'.",
  },
  {
    id: 28, level: "C2", type: "pragmatic",
    question: "Which utterance best demonstrates pragmatic mitigation in academic discourse?",
    options: ["The author is completely wrong about this.", "It might be argued that the author's framework, while compelling, somewhat overlooks this dimension.", "The author missed this point.", "I think the author did not see this."],
    correct: 1,
    explanation: "Hedges ('might be argued', 'while compelling', 'somewhat') and impersonal construction ('it') soften critique while preserving academic rigour — textbook C2 mitigation.",
  },
  {
    id: 29, level: "C2", type: "grammar",
    question: "Choose the sentence that correctly uses a cleft construction for emphasis:",
    options: ["What surprised the committee most was the proposal's elegance.", "The committee was surprised by the proposal's elegance.", "The committee surprised by the elegance of the proposal.", "What the committee surprised most was the elegance."],
    correct: 0,
    explanation: "A wh-cleft ('What X was Y') foregrounds new information and signals advanced rhetorical control.",
  },
  {
    id: 30, level: "C2", type: "reading",
    passage: "Postcolonial scholarship has compellingly demonstrated that the metropolitan archive, far from being a neutral repository of the past, operates as a site of epistemic violence — its silences, exclusions, and hierarchical taxonomies actively producing the very subjects it purports merely to document. To engage critically with such archives, then, is not simply to read against the grain but to reconstitute the conditions of legibility themselves, attending to those whose presence registers only as absence, whose voices the colonial record systematically renders inaudible.",
    question: "What is the central argument of the passage?",
    options: ["Archives are simple records of past events.", "Postcolonial scholars have abandoned archive-based research.", "Engaging critically with colonial archives requires recognising and challenging their inherent biases and silences, not just reading them differently.", "Archives should be destroyed because they are biased."],
    correct: 2,
    explanation: "The passage argues that critical engagement requires 'reconstitut[ing] the conditions of legibility' — going beyond surface re-reading to challenge the archive's structural exclusions. Answer C captures this nuance.",
  },
];

/* ═══════════════════════════════════════════════════════════════
   IDIOMS DATA (50 idioms for rotation)
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
  { idiom: "Spill the beans", definition: "To reveal a secret or share private information.", example: "Do not spill the beans about the surprise iftar we are planning for grandmother." },
  { idiom: "Burn the midnight oil", definition: "To work or study very late into the night.", example: "Sara burned the midnight oil for three nights to finish her thesis on Palestinian poetry." },
  { idiom: "Cost an arm and a leg", definition: "To be very expensive.", example: "A small apartment near 7th Circle in Amman can cost an arm and a leg these days." },
  { idiom: "Cut corners", definition: "To do something in the cheapest or quickest way, often sacrificing quality.", example: "A good carpenter in Salt never cuts corners — every piece of olive wood deserves careful work." },
  { idiom: "Hit the road", definition: "To leave or start a journey.", example: "If we want to reach Petra before sunset, we need to hit the road right after Fajr." },
  { idiom: "Raining cats and dogs", definition: "Raining very heavily.", example: "We were planning to walk down Rainbow Street, but it is raining cats and dogs." },
  { idiom: "Bite the bullet", definition: "To accept a difficult situation and deal with it bravely.", example: "He had to bite the bullet and retake the TOEFL to qualify for the scholarship." },
  { idiom: "Get cold feet", definition: "To suddenly feel nervous about something you planned to do.", example: "I almost got cold feet before my first presentation at the Faculty of Foreign Languages." },
  { idiom: "Down to earth", definition: "Practical, modest, and easy to talk to.", example: "Despite his success, the engineer from Karak is very down to earth." },
  { idiom: "Sleep on it", definition: "To take time to think before making a decision.", example: "It is a big choice — let me sleep on it and answer you tomorrow." },
  { idiom: "Touch base", definition: "To briefly contact or check in with someone.", example: "I will touch base with the suppliers in Aqaba next week to confirm the shipment dates." },
  { idiom: "Get the ball rolling", definition: "To start something or make progress on a task.", example: "Let us get the ball rolling on the Ramadan charity drive before the holy month begins." },
  { idiom: "Back to the drawing board", definition: "To start over from the beginning after a plan has failed.", example: "The first design did not impress the client, so the team went back to the drawing board." },
  { idiom: "Learn the ropes", definition: "To learn how to do a particular job or activity.", example: "It took Yousef a few weeks to learn the ropes at the new tech company in Abdali." },
  { idiom: "Cut to the chase", definition: "To get to the main point without wasting time.", example: "We only have ten minutes before the next class, so let us cut to the chase." },
  { idiom: "Pull your weight", definition: "To do your fair share of the work in a group.", example: "In every successful project at JUST, every team member has to pull their weight." },
  { idiom: "Get your foot in the door", definition: "To take a small first step into a desirable career or place.", example: "An internship at the ministry is a great way to get your foot in the door." },
  { idiom: "Up in the air", definition: "Uncertain, not yet decided.", example: "The conference dates are still up in the air because of the schedule changes." },
  { idiom: "On the back burner", definition: "Set aside as a low priority for now.", example: "We put the new branding on the back burner until the main project is finished." },
  { idiom: "Game changer", definition: "Something that significantly changes a situation.", example: "Free shipping was a real game changer for the small bookshop in Jabal Amman." },
  { idiom: "Speak your mind", definition: "To say honestly what you think.", example: "In our family meetings, my grandfather always encourages us to speak our minds." },
  { idiom: "Read between the lines", definition: "To understand a hidden meaning that is not directly stated.", example: "If you read between the lines of her message, you can tell she is worried." },
  { idiom: "Get on the same wavelength", definition: "To start understanding each other well.", example: "After a few weeks of teamwork, the new colleagues finally got on the same wavelength." },
  { idiom: "Beat around the bush", definition: "To avoid talking about something directly.", example: "Stop beating around the bush and tell me what really happened at the meeting." },
  { idiom: "Pay someone a compliment", definition: "To say something kind and admiring about someone.", example: "She paid me a lovely compliment about my Arabic calligraphy." },
  { idiom: "Take with a grain of salt", definition: "To listen to something but not believe all of it.", example: "Take online reviews with a grain of salt — they are not always honest." },
  { idiom: "Walk on eggshells", definition: "To be very careful not to upset someone.", example: "Everyone in the office is walking on eggshells before the big inspection." },
  { idiom: "Over the moon", definition: "Extremely happy or delighted.", example: "My cousin was over the moon when she received her acceptance letter from the University of Jordan." },
  { idiom: "See eye to eye", definition: "To agree with someone; to share the same opinion.", example: "My father and I do not always see eye to eye on politics, but we both love a good plate of mansaf on Fridays." },
  { idiom: "In the same boat", definition: "To be in the same difficult situation as someone else.", example: "All the graduates looking for work in Amman this year are in the same boat." },
  { idiom: "Pull yourself together", definition: "To regain control of your emotions and calm down.", example: "After hearing the news from Gaza, she took a deep breath and tried to pull herself together." },
  { idiom: "Have a heart of gold", definition: "To be very kind, generous, and caring.", example: "Our neighbour in Jabal Amman has a heart of gold — she sends labneh and bread to every new family on the street." },
  { idiom: "Lend a hand", definition: "To help someone with a task.", example: "When the olive harvest season starts in the northern villages, everyone in the family lends a hand." },
  { idiom: "Stand your ground", definition: "To firmly hold your position or beliefs despite pressure to change.", example: "The Palestinian farmers stood their ground and continued to tend their olive trees, embodying true sumud." },
  { idiom: "Lose your cool", definition: "To suddenly become very angry or upset.", example: "It is easy to lose your cool in Amman traffic, but patience always wins." },
  { idiom: "Have butterflies in your stomach", definition: "To feel very nervous about something.", example: "I had butterflies in my stomach before my first lecture at the conference." },
  { idiom: "On cloud nine", definition: "Extremely happy.", example: "My sister was on cloud nine the whole week after her graduation from JUST." },
  { idiom: "Bend over backwards", definition: "To make a great effort to help someone.", example: "Our hosts in Karak bent over backwards to make us feel at home." },
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
      { word: "dashboard", example: "The new electric cars sold in Amman have a fully digital dashboard." },
      { word: "engine", example: "The mechanic on Airport Road said my engine needed only a small repair." },
      { word: "transmission", example: "An automatic transmission is now more common than a manual one in new cars." },
      { word: "warranty", example: "Make sure your warranty covers parts and labour before you sign the papers." },
      { word: "spare parts", example: "Finding spare parts for older cars is easier in the Wehdat market than at the dealership." },
      { word: "hybrid", example: "Hybrid cars have become very popular in Jordan because of the customs discounts." },
      { word: "charging station", example: "The number of charging stations in Amman has doubled in the last two years." },
      { word: "tyre pressure", example: "Always check your tyre pressure before a long trip to Aqaba." },
      { word: "navigation system", example: "The navigation system guided us through the narrow streets of Salt." },
      { word: "firmware update", example: "After the firmware update, the car's screen finally supports Arabic menus." },
      { word: "smartphone", example: "Most students at the University of Jordan rely on their smartphone for everything." },
      { word: "wireless charger", example: "I keep a wireless charger in the car for long meetings in Shmeisani." },
      { word: "Bluetooth", example: "Connect your phone via Bluetooth so you can take calls hands-free." },
      { word: "cloud storage", example: "I save all my lecture notes in cloud storage so I can access them anywhere." },
      { word: "cybersecurity", example: "Many Jordanian banks now hire cybersecurity experts to protect their customers." },
      { word: "data privacy", example: "Data privacy is becoming a serious concern for app users across the region." },
      { word: "artificial intelligence", example: "Several startups in Abdali are using artificial intelligence to translate Arabic dialects." },
      { word: "user interface", example: "A clean user interface makes any app feel professional and trustworthy." },
      { word: "subscription", example: "I cancelled my subscription because I was not using the service enough." },
      { word: "wearable device", example: "His wearable device tracks his steps during the morning walk in Sports City." },
      { word: "remote work", example: "Remote work has allowed many engineers in Irbid to join companies based in Dubai." },
      { word: "battery life", example: "Modern hybrid cars have impressive battery life, even in hot summer weather." },
      { word: "backup camera", example: "The backup camera makes parking on narrow streets in Jabal Amman much easier." },
      { word: "traffic congestion", example: "Traffic congestion on the way to the airport can add an hour to your trip." },
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
      { word: "exercise", example: "I do exercise three times a week at the gym near my home." },
      { word: "workout", example: "My workout today was very hard, but I feel great." },
      { word: "warm up", example: "We warm up for ten minutes before every training session." },
      { word: "cool down", example: "Do not forget to cool down after a strong workout." },
      { word: "treadmill", example: "I run on the treadmill for thirty minutes every morning." },
      { word: "weights", example: "He started lifting small weights last month." },
      { word: "push-up", example: "I can do twenty push-ups now without stopping." },
      { word: "sit-up", example: "Sit-ups are good for your stomach muscles." },
      { word: "squat", example: "Squats help to make your legs stronger." },
      { word: "muscle", example: "My arm muscle hurts after yesterday's training." },
      { word: "fitness", example: "His fitness has improved a lot in the past year." },
      { word: "trainer", example: "My trainer at the gym in Sweifieh is very patient." },
      { word: "energy", example: "I have more energy when I sleep eight hours." },
      { word: "healthy", example: "A healthy breakfast helps me focus during my morning classes." },
      { word: "water bottle", example: "I always bring my water bottle to the gym." },
      { word: "running shoes", example: "I bought new running shoes for my morning walk." },
      { word: "track", example: "Many people walk on the track at Sports City in Amman." },
      { word: "cardio", example: "Cardio exercises are good for your heart." },
      { word: "rest day", example: "Sunday is my rest day, so I do not go to the gym." },
      { word: "yoga", example: "Yoga classes are now very popular in Jordan." },
      { word: "swimming pool", example: "We swim in the swimming pool every Friday afternoon." },
      { word: "team sport", example: "Football is a team sport that I play with my friends." },
      { word: "heart rate", example: "My heart rate goes up quickly when I run." },
      { word: "flexibility", example: "Yoga improves my flexibility and helps me feel calm." },
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
      { word: "ancestors", example: "Our ancestors planted these olive trees more than a hundred years ago." },
      { word: "civilization", example: "The Nabataean civilization left us the breathtaking city of Petra." },
      { word: "ruins", example: "The ruins of Jerash give visitors a vivid glimpse into Roman life." },
      { word: "archaeology", example: "Archaeology students at the University of Jordan often work on digs in Madaba." },
      { word: "excavation", example: "The excavation revealed pottery dating back two thousand years." },
      { word: "monument", example: "The Treasury in Petra is the most photographed monument in the country." },
      { word: "restoration", example: "The restoration of the Roman Theatre in Amman took several years to complete." },
      { word: "manuscript", example: "Ancient manuscripts from the region are kept in libraries around the world." },
      { word: "indigenous", example: "Indigenous communities have lived in these mountains for centuries." },
      { word: "occupation", example: "Life under occupation has shaped generations of Palestinian writers and poets." },
      { word: "olive grove", example: "Each olive grove in the West Bank carries the memory of a family." },
      { word: "narrative", example: "The Palestinian narrative deserves to be told in its own voice." },
      { word: "pilgrimage", example: "Many travellers consider a visit to Jerusalem a deeply meaningful pilgrimage." },
      { word: "embroidery", example: "Traditional Palestinian embroidery, called tatreez, tells the story of each village." },
      { word: "diaspora", example: "The Jordanian-Palestinian diaspora has preserved its traditions across many countries." },
      { word: "indigeneity", example: "Scholars increasingly use the concept of indigeneity to discuss the region." },
      { word: "colonial legacy", example: "The colonial legacy still shapes borders and identities throughout the Levant." },
      { word: "oral history", example: "Grandmothers carry an oral history that no textbook can replace." },
      { word: "collective memory", example: "Songs, recipes, and proverbs all keep the collective memory alive." },
      { word: "mosaic", example: "The mosaic floors of Madaba's churches are admired by visitors from around the world." },
      { word: "caravan route", example: "Petra grew wealthy because it sat on a major caravan route between Arabia and the Mediterranean." },
      { word: "Bedouin tradition", example: "Bedouin tradition emphasises hospitality, generosity, and respect for guests." },
      { word: "calligraphy", example: "Arabic calligraphy is considered one of the highest forms of Islamic art." },
      { word: "scripture", example: "Scripture has shaped both literature and daily speech throughout the region." },
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
      { word: "investor", example: "We are looking for an investor who understands the local market." },
      { word: "funding round", example: "The team in Abdali successfully closed their second funding round last month." },
      { word: "profit margin", example: "Restaurants in Sweifieh have a thinner profit margin than people imagine." },
      { word: "cash flow", example: "Healthy cash flow is more important than rapid growth in the early years." },
      { word: "client", example: "Our biggest client is a logistics company based in Aqaba." },
      { word: "supplier", example: "We changed our supplier because the previous one delivered late too often." },
      { word: "inventory", example: "Check the inventory before ordering new products from the warehouse." },
      { word: "logistics", example: "Logistics across the region have improved since the new ports were upgraded." },
      { word: "negotiation", example: "Successful negotiation often comes down to listening more than speaking." },
      { word: "agreement", example: "Both partners signed the agreement in the lawyer's office in Shmeisani." },
      { word: "marketing campaign", example: "The new marketing campaign focuses on Jordanian families during the summer holidays." },
      { word: "branding", example: "Strong branding helped the bakery in Jabal Amman attract a loyal customer base." },
      { word: "target audience", example: "Our target audience is university students who love affordable street food." },
      { word: "customer service", example: "Excellent customer service is what keeps a small business alive." },
      { word: "feedback", example: "We collect feedback from every customer who visits our shop." },
      { word: "freelance", example: "Many translators in Amman now work freelance from their home offices." },
      { word: "income", example: "Side projects can be a useful source of extra income for young professionals." },
      { word: "expenses", example: "Tracking your monthly expenses is the first step towards financial freedom." },
      { word: "tax invoice", example: "Please always ask the supplier for a tax invoice for your records." },
      { word: "scaling up", example: "Scaling up too quickly can put unnecessary pressure on a young company." },
      { word: "stakeholder", example: "Every stakeholder needs to feel heard before a major decision is made." },
      { word: "co-founder", example: "She met her co-founder during a workshop at a tech accelerator in Amman." },
      { word: "business model", example: "A clear business model helps investors understand how the company will earn money." },
      { word: "pricing strategy", example: "The team revised its pricing strategy after studying competitors in the Gulf." },
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

/* ─── Date-based rotation helpers ─── */

// Launch anchor: Wednesday, May 6, 2026, midnight local time.
// Day 1 of the site is this date.
const LAUNCH_YEAR = 2026;
const LAUNCH_MONTH = 4; // 0-indexed: 4 = May
const LAUNCH_DAY = 6;

function getDaysSinceLaunch(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const launch = new Date(LAUNCH_YEAR, LAUNCH_MONTH, LAUNCH_DAY);
  const diffMs = today.getTime() - launch.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getDayNumber(): number {
  // 1-indexed for display: Day 1, Day 2, ...
  // Negative days (visitors before launch with wrong system clock) clamp to 1.
  return Math.max(1, getDaysSinceLaunch() + 1);
}

function getRotatedIndex(poolSize: number, offset: number = 0): number {
  if (poolSize <= 0) return 0;
  const days = getDaysSinceLaunch() + offset;
  return ((days % poolSize) + poolSize) % poolSize;
}

function getRotatedItems<T>(pool: T[], count: number): T[] {
  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];
  const start = getRotatedIndex(pool.length) * count;
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[(start + i) % pool.length]);
  }
  return result;
}

function formatDatePill(): string {
  try {
    const today = new Date();
    const dateStr = today.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return `Day ${getDayNumber()} · ${dateStr}`;
  } catch {
    return `Day ${getDayNumber()}`;
  }
}

function todayISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayISODate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface StreakState {
  count: number;
  label: string;
}

function loadAndUpdateStreak(): StreakState {
  // Safe wrapper: any localStorage failure returns a sane default.
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return { count: 1, label: "🔥 First day" };
    }
    const today = todayISODate();
    const yesterday = yesterdayISODate();
    const lastVisit = window.localStorage.getItem("nibras-last-visit");
    const stored = parseInt(window.localStorage.getItem("nibras-streak") || "0", 10);
    let next: number;
    if (lastVisit === today) {
      next = stored > 0 ? stored : 1;
    } else if (lastVisit === yesterday) {
      next = (stored > 0 ? stored : 0) + 1;
    } else {
      next = 1;
    }
    window.localStorage.setItem("nibras-streak", String(next));
    window.localStorage.setItem("nibras-last-visit", today);
    return {
      count: next,
      label: next === 1 ? "🔥 First day" : `🔥 ${next} day streak`,
    };
  } catch {
    return { count: 1, label: "🔥 First day" };
  }
}

/* ─── Rotating content interfaces ─── */

interface DailyDropEntry {
  level: string;
  title: string;
  body: string;
  keyVocab: string[];
}

interface WordOfDayEntry {
  word: string;
  partOfSpeech: string;
  phonetic: string;
  meaning: string;
  example: string;
  cultural: string;
  relatedWords: { word: string; definition: string; example: string }[];
}

interface PlacementResult {
  level: string; // e.g. "B1", "B1+", "Below A1"
  description: string; // friendly explanation
  breakdown: { level: string; correct: number; total: number }[];
}

function getPlacementLevel(
  questions: QuizQuestion[],
  answers: (number | null)[]
): PlacementResult {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const breakdown = levels.map((lvl) => {
    const levelQuestions = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.level === lvl);
    const correctCount = levelQuestions.filter(
      ({ q, i }) => answers[i] === q.correct
    ).length;
    return { level: lvl, correct: correctCount, total: levelQuestions.length };
  });

  // Mastery rule: a learner "has" a level if they got 3 or more out of 5 correct.
  // The placement is the HIGHEST consecutive level mastered, starting from A1.
  // If they score 4-5 out of 5 at a level, mark it as "+" (emerging into next).
  let placedLevel = "Below A1";
  let placementDesc = "";

  for (let idx = 0; idx < levels.length; idx++) {
    const { correct } = breakdown[idx];
    if (correct >= 3) {
      placedLevel = levels[idx];
      // If they did very well (4 or 5), they're emerging into next level
      if (correct >= 4 && idx < levels.length - 1) {
        const nextLevel = levels[idx + 1];
        const nextCorrect = breakdown[idx + 1].correct;
        if (nextCorrect < 3) {
          placedLevel = `${levels[idx]}+`;
        }
      }
    } else {
      // Stop climbing — they didn't pass this level
      break;
    }
  }

  // Build a friendly description
  if (placedLevel === "Below A1") {
    placementDesc =
      "You're just starting your English journey — that's a wonderful place to be! We recommend beginning with our A1 reading passages and basic vocabulary.";
  } else if (placedLevel === "C2") {
    placementDesc =
      "Mastery level. You demonstrate near-native command of English across grammar, vocabulary, and pragmatic discourse.";
  } else if (placedLevel.endsWith("+")) {
    const base = placedLevel.replace("+", "");
    placementDesc = `You're solidly at ${base} and showing emerging strengths at the next level. We recommend ${base} content as your foundation, with selected challenges from the level above.`;
  } else {
    const descriptions: Record<string, string> = {
      A1: "Beginner. You can handle basic everyday phrases and very simple interactions.",
      A2: "Elementary. You can communicate in simple, routine situations and understand familiar topics.",
      B1: "Intermediate. You can handle most situations while travelling and discuss familiar topics with reasonable fluency.",
      B2: "Upper-intermediate. You can interact with native speakers fluently and discuss complex topics in your field.",
      C1: "Advanced. You can express ideas fluently and use language flexibly for social, academic, and professional purposes.",
    };
    placementDesc = descriptions[placedLevel] || "";
  }

  return {
    level: placedLevel,
    description: placementDesc,
    breakdown,
  };
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
        <h4 className="font-bold text-gray-900 group-hover:text-aqaba transition-colors capitalize">
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

  function buildAnswersArray(): (number | null)[] {
    return placementQuestions.map((q) => answers[q.id] ?? null);
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
  const result = getPlacementLevel(placementQuestions, buildAnswersArray());

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-aqaba to-aqaba-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="size-6" />
            Quick CEFR Check
          </SheetTitle>
          <SheetDescription className="text-blue-100 text-sm">
            30 questions across 6 CEFR levels — an estimated self-check, not a formal qualification.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pt-4">
          {!started ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Test Your English?</h3>
              <p className="text-gray-600 mb-2 max-w-md mx-auto">
                30 questions across 6 CEFR levels: A1 (Beginner), A2 (Elementary), B1 (Intermediate), B2 (Upper-Intermediate), C1 (Advanced), and C2 (Mastery).
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Answer honestly — this is a self-check to help you find the right content, not a formal exam. It takes about 15 minutes.
              </p>
              <Button onClick={() => setStarted(true)} className="bg-aqaba hover:bg-aqaba-dark text-white px-8 py-3 text-lg">
                Start the Check
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
                <p className="text-gray-600 max-w-md mx-auto mb-4">{result.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3 mb-2">
                  {result.breakdown.map((b) => (
                    <span
                      key={b.level}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        b.correct >= 3
                          ? "bg-green-50 border-green-300 text-green-700"
                          : b.correct >= 1
                          ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}
                    >
                      {b.level}: {b.correct}/{b.total} {b.correct >= 3 ? "\u2713" : ""}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">This is an estimated self-check, not a formal CEFR qualification.</p>
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
                  Retake the Check
                </Button>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{question.level}</Badge>
                  <span className="text-xs text-gray-500 capitalize">{question.type}</span>
                </div>
                <span className="text-sm text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-aqaba h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <div className="flex-1 overflow-y-auto -mx-1 px-1">
                {question.passage && (
                  <div className="bg-sand/50 border-l-4 border-aqaba p-4 mb-4 rounded text-sm leading-relaxed">
                    {question.passage}
                  </div>
                )}
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
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 mt-2 shrink-0">
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
  fileName?: string;
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend() {
    let text = input.trim();
    let fileName: string | undefined;
    if (attachedFile) {
      text = "Please check the following text for grammar and spelling errors, and explain any corrections in simple language. Show the corrected version after the explanations.\n\n—\n\n" + attachedFile.content;
      fileName = attachedFile.name;
      setAttachedFile(null);
    }
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text, fileName };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data = await res.json();
      const reply = data.reply || data.error || "I couldn't process that. Please try again.";
      const assistantMsg: ChatMessage = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error && err.name === "AbortError"
        ? "The request timed out. Please check your connection and try again."
        : "Sorry, I couldn't reach the server. Please try again in a moment.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [".txt", ".md"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, only .txt and .md files are accepted. Please try again with a plain text file." }]);
      e.target.value = "";
      return;
    }
    if (file.size > 50 * 1024) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, please upload a text file under 50 KB. Try pasting your text directly into the chat for longer pieces." }]);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setAttachedFile({ name: file.name, content: text });
    };
    reader.readAsText(file);
    e.target.value = "";
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
                  {msg.fileName && (
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                      <Paperclip className="size-3" />
                      <span className="text-xs">{msg.fileName}</span>
                    </div>
                  )}
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
            {attachedFile && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <Paperclip className="size-3 text-gray-400" />
                <span className="text-xs text-gray-600 truncate">{attachedFile.name}</span>
                <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-gray-600 ml-auto"><X className="size-3" /></button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-aqaba hover:border-aqaba/30 flex items-center justify-center transition-colors shrink-0"
                title="Attach a .txt or .md file"
              >
                <Paperclip className="size-4" />
              </button>
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
                disabled={(!input.trim() && !attachedFile) || loading}
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
   PRONUNCIATION LAB (Layer 1: Browser TTS)
   ═══════════════════════════════════════════════════════════════ */

interface MinimalPair {
  a: string;
  b: string;
  ipaA: string;
  ipaB: string;
  hint?: string;
}

interface PronunciationModule {
  id: string;
  title: string;
  contrast: string;
  intro: string;
  whyHard: string;
  pairs: MinimalPair[];
}

const pronunciationModules: PronunciationModule[] = [
  {
    id: "p-vs-b",
    title: "P vs B",
    contrast: "/p/ vs /b/",
    intro: "English distinguishes a voiceless P from a voiced B. Modern Standard Arabic has no /p/ sound, so many Jordanian learners say 'bark' when they mean 'park'.",
    whyHard: "Both sounds are made with the lips. The difference is voicing: /p/ has no vibration in your throat, /b/ does. Place your fingers on your throat and feel the buzz on B but not on P.",
    pairs: [
      { a: "park", b: "bark", ipaA: "/pɑːrk/", ipaB: "/bɑːrk/" },
      { a: "pat", b: "bat", ipaA: "/pæt/", ipaB: "/bæt/" },
      { a: "pear", b: "bear", ipaA: "/pɛər/", ipaB: "/bɛər/" },
      { a: "pin", b: "bin", ipaA: "/pɪn/", ipaB: "/bɪn/" },
      { a: "pull", b: "bull", ipaA: "/pʊl/", ipaB: "/bʊl/" },
      { a: "pack", b: "back", ipaA: "/pæk/", ipaB: "/bæk/" },
      { a: "peach", b: "beach", ipaA: "/piːtʃ/", ipaB: "/biːtʃ/" },
      { a: "pig", b: "big", ipaA: "/pɪɡ/", ipaB: "/bɪɡ/" },
      { a: "pen", b: "Ben", ipaA: "/pɛn/", ipaB: "/bɛn/" },
      { a: "pole", b: "bowl", ipaA: "/poʊl/", ipaB: "/boʊl/" },
      { a: "pride", b: "bride", ipaA: "/praɪd/", ipaB: "/braɪd/" },
      { a: "pest", b: "best", ipaA: "/pɛst/", ipaB: "/bɛst/" },
    ],
  },
  {
    id: "ship-sheep",
    title: "Ship vs Sheep",
    contrast: "/ɪ/ vs /iː/",
    intro: "English has two sounds where Arabic has one: a short, relaxed /ɪ/ (as in 'ship') and a long, tense /iː/ (as in 'sheep'). Many Jordanian learners use only the long sound, so 'ship' becomes 'sheep'.",
    whyHard: "The short /ɪ/ is shorter and more relaxed. Your tongue is slightly lower and the muscles around your mouth are loose. The long /iː/ is held longer with your lips pulled wider, almost like a smile.",
    pairs: [
      { a: "ship", b: "sheep", ipaA: "/ʃɪp/", ipaB: "/ʃiːp/" },
      { a: "fit", b: "feet", ipaA: "/fɪt/", ipaB: "/fiːt/" },
      { a: "sit", b: "seat", ipaA: "/sɪt/", ipaB: "/siːt/" },
      { a: "live", b: "leave", ipaA: "/lɪv/", ipaB: "/liːv/" },
      { a: "hit", b: "heat", ipaA: "/hɪt/", ipaB: "/hiːt/" },
      { a: "bit", b: "beat", ipaA: "/bɪt/", ipaB: "/biːt/" },
      { a: "fill", b: "feel", ipaA: "/fɪl/", ipaB: "/fiːl/" },
      { a: "slip", b: "sleep", ipaA: "/slɪp/", ipaB: "/sliːp/" },
      { a: "rich", b: "reach", ipaA: "/rɪtʃ/", ipaB: "/riːtʃ/" },
      { a: "knit", b: "neat", ipaA: "/nɪt/", ipaB: "/niːt/" },
    ],
  },
];

function PronunciationLab({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [activeModuleId, setActiveModuleId] = useState(pronunciationModules[0].id);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(0.85);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const activeModule = pronunciationModules.find((m) => m.id === activeModuleId)!;

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    function loadVoices() {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter((v) => v.lang.startsWith("en"));
      setVoices(englishVoices);

      const saved = typeof window !== "undefined" ? localStorage.getItem("nibras-voice") : null;
      if (saved && englishVoices.some((v) => v.name === saved)) {
        setSelectedVoice(saved);
      } else if (englishVoices.length > 0) {
        const preferred =
          englishVoices.find((v) => v.name.includes("Google US English")) ||
          englishVoices.find((v) => v.lang === "en-US") ||
          englishVoices[0];
        setSelectedVoice(preferred.name);
      }
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (selectedVoice && typeof window !== "undefined") {
      localStorage.setItem("nibras-voice", selectedVoice);
    }
  }, [selectedVoice]);

  useEffect(() => {
    if (!open && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  }, [open]);

  function speakWord(word: string, id: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  }

  function speakPair(pair: MinimalPair, pairIdx: number) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const id = `pair-${pairIdx}`;
    setSpeakingId(id);

    const u1 = new SpeechSynthesisUtterance(pair.a);
    const u2 = new SpeechSynthesisUtterance(pair.b);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      u1.voice = voice;
      u2.voice = voice;
    }
    u1.rate = rate;
    u2.rate = rate;
    u2.onend = () => setSpeakingId(null);

    window.speechSynthesis.speak(u1);
    setTimeout(() => {
      window.speechSynthesis.speak(u2);
    }, 600);
  }

  function stopAll() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }

  const ttsSupported = typeof window !== "undefined" && !!window.speechSynthesis;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-petra to-petra-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Mic2 className="size-6" />
            Pronunciation Lab
          </SheetTitle>
          <SheetDescription className="text-pink-100 text-sm">
            Listen, notice the difference, repeat aloud.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] px-6 pt-4">
          {!ttsSupported ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-2">
                Your browser does not support text-to-speech.
              </p>
              <p className="text-gray-500 text-sm">
                Please try the latest version of Chrome, Safari, or Firefox.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4 border-b border-gray-200">
                {pronunciationModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      stopAll();
                      setActiveModuleId(m.id);
                    }}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      activeModuleId === m.id
                        ? "border-petra text-petra"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-petra"
                  >
                    {voices.length === 0 ? (
                      <option>Loading voices...</option>
                    ) : (
                      voices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Speed: {rate.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.0"
                    step="0.05"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full accent-petra"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">
                These are computer-generated voices. They are a reliable reference for most contrasts, but trust your ear — if a single playback sounds off, try a different voice from the dropdown.
              </p>

              <div className="mb-4">
                <Badge className="bg-petra/10 text-petra border-petra/20 mb-2">
                  {activeModule.contrast}
                </Badge>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  {activeModule.intro}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed bg-amber-50 border-l-4 border-amber-300 p-3 rounded">
                  <strong className="text-amber-700">Why it&apos;s tricky:</strong> {activeModule.whyHard}
                </p>
              </div>

              <Separator className="my-4" />

              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                Minimal Pairs ({activeModule.pairs.length})
              </h3>
              <div className="space-y-3">
                {activeModule.pairs.map((pair, idx) => {
                  const idA = `${activeModule.id}-${idx}-a`;
                  const idB = `${activeModule.id}-${idx}-b`;
                  const idPair = `${activeModule.id}-pair-${idx}`;
                  return (
                    <div
                      key={`${activeModule.id}-${idx}`}
                      className="border border-gray-200 rounded-lg p-3 hover:border-petra/30 transition-colors"
                    >
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                          onClick={() => speakWord(pair.a, idA)}
                          className={`flex items-center gap-2 p-2 rounded border transition-all ${
                            speakingId === idA
                              ? "border-petra bg-pink-50"
                              : "border-gray-200 hover:border-petra/40 hover:bg-pink-50/40"
                          }`}
                        >
                          <span className="size-7 rounded-full bg-petra/10 flex items-center justify-center shrink-0">
                            <span className="text-petra text-xs">▶</span>
                          </span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 text-sm">{pair.a}</div>
                            <div className="text-xs text-gray-500">{pair.ipaA}</div>
                          </div>
                        </button>
                        <button
                          onClick={() => speakWord(pair.b, idB)}
                          className={`flex items-center gap-2 p-2 rounded border transition-all ${
                            speakingId === idB
                              ? "border-petra bg-pink-50"
                              : "border-gray-200 hover:border-petra/40 hover:bg-pink-50/40"
                          }`}
                        >
                          <span className="size-7 rounded-full bg-petra/10 flex items-center justify-center shrink-0">
                            <span className="text-petra text-xs">▶</span>
                          </span>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900 text-sm">{pair.b}</div>
                            <div className="text-xs text-gray-500">{pair.ipaB}</div>
                          </div>
                        </button>
                      </div>
                      <button
                        onClick={() => speakPair(pair, idx)}
                        className={`w-full text-xs font-semibold py-1.5 rounded transition-colors ${
                          speakingId === idPair
                            ? "bg-petra text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-petra/10 hover:text-petra"
                        }`}
                      >
                        Play both, then repeat aloud
                      </button>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  How to Practice
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-olive shrink-0 mt-0.5" />
                    Listen to each pair at least three times before repeating.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-olive shrink-0 mt-0.5" />
                    Slow the speed to 0.75x at first, then build up to 1.0x.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-olive shrink-0 mt-0.5" />
                    Record yourself on your phone&apos;s voice memo app and compare.
                  </li>
                </ul>
              </div>

              <div className="h-8" />
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
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
  onPronunciation,
}: {
  onGrammar: () => void;
  onVocab: () => void;
  onReading: () => void;
  onTest: () => void;
  onIdioms: () => void;
  onPronunciation: () => void;
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
              { icon: <GraduationCap className="size-4" />, label: "Quick CEFR Check", desc: "Estimate your CEFR level", color: "text-aqaba", onClick: onTest },
              { icon: <BookText className="size-4" />, label: "Reading Passages", desc: "Daily reading practice", color: "text-petra", onClick: onReading },
              { icon: <BookOpen className="size-4" />, label: "Vocabulary Lists", desc: "Words by topic & level", color: "text-olive", onClick: onVocab },
              { icon: <Languages className="size-4" />, label: "Grammar Lessons", desc: "Practical grammar tips", color: "text-purple-600", onClick: onGrammar },
              { icon: <HelpCircle className="size-4" />, label: "Idiom Practice", desc: "Learn everyday expressions", color: "text-amber-600", onClick: onIdioms },
              { icon: <Mic2 className="size-4" />, label: "Pronunciation Lab", desc: "Listen and repeat minimal pairs", color: "text-petra", onClick: onPronunciation },
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

function DailyDropSheet({ open, onOpenChange, drop }: { open: boolean; onOpenChange: (v: boolean) => void; drop: DailyDropEntry }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-aqaba to-aqaba-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <BookText className="size-6" />
            Today&apos;s Daily Drop
          </SheetTitle>
          <SheetDescription className="text-blue-100 text-sm">
            Level: {drop.level} — Read the full passage
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] px-6 pt-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{drop.title}</h3>
          <div className="space-y-4">
            {drop.body.split(/\n\n+/).map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-sm font-bold text-aqaba uppercase tracking-wide mb-3">Key Vocabulary</h3>
            <div className="flex flex-wrap gap-2">
              {drop.keyVocab.map((w) => (
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

const wordsOfDay: WordOfDayEntry[] = [
  {
    word: "Resilience",
    partOfSpeech: "(Noun)",
    phonetic: "/rɪˈzæl.jəns/",
    meaning: "The capacity to withstand or to recover quickly from difficulties; mental toughness and the ability to bounce back after challenges.",
    example: "The resilience of the Palestinian people inspires the whole world.",
    cultural: "In Jordanian culture, resilience is a deeply valued trait. From the people of Palestine who demonstrate extraordinary Sumud, to Jordanian students who overcome challenges to achieve their academic goals, resilience is woven into daily life.",
    relatedWords: [
      { word: "perseverance", definition: "Continued effort to achieve something despite difficulties.", example: "After failing the TOEFL twice, Lama's perseverance finally paid off when she got the score she needed." },
      { word: "endurance", definition: "The ability to withstand hardship or pain over a long period.", example: "Running the Amman Marathon requires great endurance, especially in the summer heat." },
      { word: "tenacity", definition: "Holding firmly to something; being persistent and determined.", example: "The tenacity of Jordanian small business owners during economic challenges is truly admirable." },
      { word: "fortitude", definition: "Courage in the face of pain or adversity.", example: "It takes fortitude to move to a new city for university and build a life from scratch." },
      { word: "grit", definition: "Courage and resolve; strength of character.", example: "Maha showed real grit when she completed her engineering degree while working part-time at a cafe in Sweifieh." },
    ],
  },
];

const dailyDrops: DailyDropEntry[] = [
  {
    level: "B1",
    title: "Overcoming Stage Fright",
    body: `Ahmad took a deep breath before walking to the front of the classroom. It was his final presentation for the Essentials of Public Speaking course at the University of Jordan. His hands were shaking slightly, but he remembered his professor's advice: "Confidence is built, not given." As he looked at his classmates, he realized they wanted him to succeed. He smiled, introduced his topic on AI integration, and the words began to flow naturally.

His presentation covered three main areas: how AI is being used in Jordanian hospitals to assist doctors, how Jordanian universities are incorporating AI research into their computer science programs, and what ethical concerns come with this rapid technological change. He used real examples from King Abdullah University Hospital and the University of Jordan's AI lab to make his points clear and relatable.

When Ahmad finished, there was a brief moment of silence. Then his professor, Dr. Hala, stood up and began to clap. The entire class joined in. Dr. Hala told Ahmad that his presentation was one of the best she had seen all semester. Ahmad felt a wave of relief and gratitude. He realized that stage fright was not a wall — it was a door, and he had just walked through it.`,
    keyVocab: ["stage fright", "confidence", "essentials", "integration", "ethical concerns", "relief", "gratitude"],
  },

  /* ── A2 entries (10 new) ── */

  {
    level: "A2",
    title: "A Morning in Jabal Amman",
    body: `Every Friday morning, the streets of Jabal Amman come alive in a special way. While most of Amman is still quiet, the small bakeries are already open. The smell of fresh bread and hot ka'ak fills the air. Old men sit on plastic chairs outside their favourite cafes, drinking sweet tea and reading the morning newspaper. A young boy on a bicycle delivers labneh and za'atar to the neighbours.

My grandmother, Teta Amal, has lived on the same street for forty years. She knows every family on the block. Every Friday, she prepares a large breakfast for the whole family. Her table is never empty — there is always enough food for unexpected guests. "In our culture," she says, "the door is always open and the tea is always hot."

After breakfast, the family walks down to Rainbow Street. The young people check their phones while the older ones stop to greet friends and neighbours. Street vendors sell roasted corn and fresh juice. The sound of the call to prayer mixes with the noise of traffic. It is a simple morning, but it is full of warmth and belonging. For many families in Amman, this Friday routine is the most important part of the week.`,
    keyVocab: ["routine", "neighbourhood", "unexpected", "roasted", "belonging"],
  },
  {
    level: "A2",
    title: "The Olive Harvest in Ajloun",
    body: `In October, the hills around Ajloun turn a beautiful silver-green colour. It is olive harvest season, and families from all over northern Jordan travel to their family orchards to pick the olives by hand. The work starts early in the morning, just after Fajr prayer, and continues until sunset. Children help by spreading large sheets under the trees to catch the olives as they fall.

Abu Khalid has been harvesting olives from the same trees for thirty years. His grandfather planted them, and his father cared for them before him. "These trees are like family," he says with a smile. "They give us oil, they give us food, and they connect us to the land." This year, the harvest was better than expected because of good rainfall in the spring.

After the picking is finished, the olives are taken to a local press in the village. The fresh olive oil is stored in large glass jars — some for the family and some to share with relatives in Amman and Irbid. The olive harvest is not just work; it is a celebration of family, land, and tradition that has continued for generations in Palestine and Jordan.`,
    keyVocab: ["harvest", "orchard", "generation", "press", "tradition"],
  },
  {
    level: "A2",
    title: "First Day at the University of Jordan",
    body: `Layla woke up at six in the morning, earlier than usual. Today was her first day at the University of Jordan, and she wanted everything to be perfect. She chose her outfit the night before — a neat blouse and comfortable shoes for walking across the large campus. Her mother prepared a sandwich of labneh and cucumber and a small bag of nuts for a snack.

When Layla arrived at the university gate, she was surprised by how many students there were. The campus was full of life — groups of friends laughing, professors carrying books, and vendors selling coffee near the library. A friendly student named Dina noticed Layla looking lost and offered to help her find her first class. "Don't worry," Dina said. "Everyone feels confused on the first day. By next week, you will know this place like your own home."

The professor of Layla's first class, English Communication, welcomed everyone warmly. He told the students that making mistakes is part of learning. "Your English does not need to be perfect," he said. "What matters is that you try." Layla felt a wave of relief. She looked around the classroom and realised she was not alone — everyone was starting something new, and that made her feel brave.`,
    keyVocab: ["campus", "confused", "relief", "professor", "brave"],
  },
  {
    level: "A2",
    title: "Cooking Maqloubeh with Mama",
    body: `On a cool Thursday evening, ten-year-old Yazan stood on a small chair next to his mother in the kitchen. Tonight, they were making maqloubeh — the famous upside-down rice dish that his family eats almost every Thursday. "Can I help with the chicken?" Yazan asked. His mother smiled and handed him a pair of gloves. "First, wash your hands well," she said. "Then you can help me add the spices."

The kitchen was warm and filled with wonderful smells. His mother explained each step carefully: first, fry the chicken until it is golden brown. Then, layer the vegetables — eggplant, cauliflower, and potatoes — on the bottom of a large pot. Place the chicken on top, then add the rice and the spices. "The secret," his mother whispered, "is patience. You must cook it on low heat and wait."

When it was time to flip the pot, everyone in the family gathered in the kitchen. His father held the large plate over the pot, and together they turned it upside down. There was a moment of silence. Then his mother lifted the pot slowly, and the maqloubeh stood perfectly on the plate — golden and tall. The whole family cheered. Yazan felt proud. He had helped make something beautiful.`,
    keyVocab: ["spices", "layer", "patience", "golden", "proud"],
  },
  {
    level: "A2",
    title: "A Weekend Trip to Petra",
    body: `The bus left Amman at seven in the morning, full of excited students from different universities. The three-hour journey south passed through some of Jordan's most beautiful scenery. They crossed the desert highway, passed near Karak with its ancient castle on the hill, and watched the landscape change from brown hills to dramatic red cliffs as they got closer to Wadi Musa.

When they finally arrived at the entrance to Petra, their guide, Uncle Mahmoud, gathered the group. "Petra is not just a place," he told them. "It is a story written in stone by the Nabataean people over two thousand years ago." As they walked through the narrow Siq — a long passage between towering sandstone cliffs — the students could hardly believe their eyes. At the end of the Siq, the Treasury appeared, its carved facade glowing pink in the morning sun.

The group spent the whole day exploring. They climbed hundreds of rock-cut steps to reach the Monastery, one of the largest monuments in Petra. From the top, they could see all the way to Palestine and Israel on a clear day. On the way back to the bus, students bought handmade silver jewellery and postcards from local Bedouin vendors. "I have read about Petra in books," said one student, "but standing here, I feel like I am inside a dream."`,
    keyVocab: ["scenery", "ancient", "carved", "monument", "handmade"],
  },
  {
    level: "A2",
    title: "Ramadan Nights in Irbid",
    body: `During Ramadan, the city of Irbid changes completely. The streets that are busy and noisy during the day become quiet and peaceful. Shops close in the afternoon so that people can rest before iftar. But as the sun begins to set, a different kind of energy fills the air. Families hurry home with bags full of dates, milk, and ingredients for the evening meal.

At the home of the Al-Sharif family, the kitchen is the centre of activity. Um Ahmad and her daughters prepare a table full of traditional dishes: fattoush, soup, stuffed vine leaves, and of course, fresh dates and laban. The youngest children help by setting the table and bringing water glasses. Everyone waits together for the call to Maghrib prayer, which signals that it is time to break the fast.

After iftar and prayer, the real magic of Ramadan begins. The streets fill with families walking together, children playing, and the smell of sweets coming from the bakeries. Qatayef — small sweet pancakes filled with cheese or nuts — are the most popular treat. The mosques are full for Taraweeh prayers, and the sound of Quran recitation fills the night. "Ramadan is not just about not eating," says Uncle Sami. "It is about being close to your family, helping others, and remembering what is truly important."`,
    keyVocab: ["peaceful", "ingredients", "traditional", "signal", "recitation"],
  },
  {
    level: "A2",
    title: "My Uncle's Barber Shop in Salt",
    body: `The small barber shop on the main street of Salt has been open for over twenty years. My uncle, Abu Omar, opened it when he was just twenty-five years old. Every morning, he arrives at seven, turns on the old radio, and sweeps the floor until it shines. The walls are covered with photographs of his customers — football players, university professors, and government workers who have been coming to the same chair for years.

Abu Omar's shop is more than a place for haircuts. It is a meeting place. Men come to discuss the news, share stories about their children, and argue about football. On busy days, there is a line of chairs outside the door, and customers sit together drinking Arabic coffee while they wait. "I have cut the hair of three generations of some families," Abu Omar says proudly. "I cut the grandfather's hair, then his son's, and now his grandson's."

The city of Salt is famous for its old Ottoman buildings and its warm hospitality. Abu Omar's shop represents the spirit of the city — simple, welcoming, and connected to the past. When tourists visit Salt, they always stop to take photos of the old shops. Abu Omar waves at them and offers coffee. "Everyone is welcome here," he says. "That is the Salt way."`,
    keyVocab: ["generation", "discuss", "hospitality", "tourists", "welcome"],
  },
  {
    level: "A2",
    title: "Learning to Swim in Aqaba",
    body: `Twelve-year-old Farah had always been afraid of deep water. While her friends spent their summer holidays jumping off the rocks at the public beach in Aqaba, Farah would sit on the sand and watch. This summer, her older brother Hassan decided it was time for a change. "I will teach you myself," he said. "There is nothing to be afraid of."

They went to the shallow part of the beach early in the morning, before it got crowded. Hassan started with the basics: how to hold your breath, how to float on your back, and how to kick your legs. At first, Farah was nervous and held onto Hassan's arm tightly. But he was patient. "Take your time," he said. "The sea is your friend, not your enemy."

By the end of the first week, Farah could float on her own. By the second week, she could swim ten metres without stopping. By the third week, she joined her friends and jumped off the rocks for the first time. The feeling of flying through the clear, warm water of the Red Sea was the most wonderful thing she had ever experienced. "You did it!" Hassan shouted from the beach, clapping his hands. Farah smiled. She had learned something important: courage does not mean you are not afraid — it means you try anyway.`,
    keyVocab: ["afraid", "patient", "float", "courage", "wonderful"],
  },
  {
    level: "A2",
    title: "The Bookshop on Rainbow Street",
    body: `There is a small bookshop on Rainbow Street in Jabal Amman that has been open since 1995. The owner, Miss Nadia, is a retired English teacher who loves books more than anything else in the world. Her shop is small but full — every wall has shelves, and every shelf is packed with books in Arabic and English. There is a smell of old paper and fresh coffee that makes visitors feel calm the moment they walk in.

Miss Nadia does not just sell books. She helps young readers find the right book for their level. "Tell me what you like," she always says to new customers. "Do you like stories about adventure? History? Science?" She then picks three or four books and explains what each one is about. Many university students come to her shop to buy novels for their literature courses, and she always gives them a small discount.

On Saturday mornings, Miss Nadia organises a free reading circle for children aged eight to twelve. The children sit on cushions on the floor and take turns reading aloud. After reading, they discuss the story together and draw pictures of their favourite scenes. "Books open doors," Miss Nadia tells the children. "When you read, you can travel anywhere in the world without leaving this room." Her bookshop is not just a business — it is a gift to the neighbourhood.`,
    keyVocab: ["retired", "packed", "discount", "cushions", "discuss"],
  },
  {
    level: "A2",
    title: "A Visit to Jerash",
    body: `On a bright Saturday in spring, the Al-Rashid family drove from Amman to Jerash, about fifty kilometres north. The children, Sara and Tariq, had been studying Roman history at school, and their father promised them a real-life history lesson. As they entered the ancient city, Sara gasped. "It looks just like the pictures in my textbook," she whispered.

Their guide, a local man named Mr. Nabil, walked them through the South Theatre, a large round theatre that could hold thousands of people. "If you stand in the centre and speak," he explained, "your voice travels to every seat without a microphone." Tariq tried it, and everyone in the family heard him clearly. They walked along the colonnaded street, where tall stone columns still stood after nearly two thousand years.

In the afternoon, they visited the Hippodrome, where chariot races used to take place. Mr. Nabil explained that Jerash was once one of the most important cities in the Roman Empire, a centre of trade and culture in the region. As the family left, Sara turned around for one last look at the ancient ruins. "I want to be an archaeologist," she told her father. He smiled and put his hand on her shoulder. "Then you have come to the right place."`,
    keyVocab: ["ancient", "colonnaded", "chariot", "archaeologist", "ruins"],
  },

  /* ── B1 entries (9 new) ── */

  {
    level: "B1",
    title: "Sumud: More Than a Word",
    body: `The Arabic word sumud is often translated as "steadfastness" in English, but for Palestinians and their descendants across the region, it carries a meaning that no single English word can fully capture. Sumud is not just about staying in one place — it is about continuing to live, grow, and build despite enormous difficulty. It is the olive farmer who returns to his groves every season, the teacher who holds classes even when the power is out, the grandmother who preserves the recipes of a village she may never see again.

In Jordan, where many Palestinian families have lived for decades, sumud takes many forms. Some families have built successful businesses from nothing. Others have sent their children to the University of Jordan, to JUST, or to universities abroad, investing in education as an act of resistance. The famous poet Mahmoud Darwish wrote that sumud is "to be, in order to be" — a simple but powerful idea that existence itself, under pressure, is a form of dignity.

For young Jordanians of Palestinian heritage, sumud is both a family story and a personal choice. It means learning Arabic calligraphy, cooking the dishes of their grandparents' villages, and teaching their children the names of places like Jaffa, Haifa, and Nablus. Sumud is not about looking backward with anger; it is about carrying forward with purpose. In a world that often asks them to forget, choosing to remember is itself an act of courage.`,
    keyVocab: ["steadfastness", "descendants", "dignity", "heritage", "resistance", "perseverance"],
  },
  {
    level: "B1",
    title: "The Start-up Scene in Abdali",
    body: `Five years ago, the Abdali district of Amman was mostly known for its modern shopping mall and expensive apartments. Today, it is also the centre of Jordan's growing start-up ecosystem. Co-working spaces like The Tank and Oasis500 have transformed empty floors into busy offices where young entrepreneurs work on ideas that could change the region. The energy in these spaces is contagious — people from different backgrounds share desks, ideas, and sometimes even meals.

One of the most promising start-ups to emerge from this scene is a food delivery app called "Dawarreh," which was designed specifically for Jordanian neighbourhoods. Unlike international apps that struggle with Amman's complicated address system, Dawarreh uses local landmarks — "near the Kunafa shop on Sweifieh Street" or "the building with the blue gate opposite the mosque" — to help drivers find locations. The founder, a twenty-six-year-old graduate of the University of Jordan, says the idea came from watching her grandmother order groceries by phone.

Jordan's tech sector still faces challenges. Funding is limited compared to Dubai or Riyadh, and many talented developers leave for better opportunities abroad. But the talent pool remains strong. Jordanian universities produce thousands of computer science graduates every year, and many of them are choosing to build their companies at home. "The problems we face here — in education, agriculture, logistics — are real," says one investor. "And real problems make the best start-up ideas."`,
    keyVocab: ["ecosystem", "contagious", "entrepreneurs", "logistics", "complicated"],
  },
  {
    level: "B1",
    title: "A Jordanian Wedding",
    body: `A traditional Jordanian wedding is not a single event — it is a series of celebrations that can last for several days. It usually begins with the henna night, where the bride's female relatives and friends gather at her family home. A henna artist decorates the bride's hands with intricate patterns, while the women sing traditional songs and eat sweets. The atmosphere is joyful, emotional, and deeply rooted in Arabic tradition.

The main wedding celebration, called the zaffeh, is a spectacular affair. The groom's family processes through the streets, accompanied by drummers, dancers, and sometimes even a brass band. Cars honk their horns, children run alongside the procession, and the whole neighbourhood comes out to watch. In some families, the groom rides a horse — a practice that connects modern celebrations to Bedouin heritage.

The reception itself can host hundreds of guests. Food is central: mansaf, the national dish of Jordan, is served on large platters and shared communally. Speeches are made, dances are performed — the debke, a traditional line dance, is always a highlight. But what makes a Jordanian wedding truly special is not the expense or the decoration; it is the sense of community. In Jordan, a wedding is not just a union of two people; it is a celebration that belongs to the entire family and neighbourhood.`,
    keyVocab: ["intricate", "spectacular", "procession", "communally", "heritage", "union"],
  },
  {
    level: "B1",
    title: "Working as a Tour Guide in Wadi Rum",
    body: `At twenty-eight years old, Suleiman Al-Zalabieh is one of the youngest licensed tour guides in Wadi Rum. He grew up in the desert — his family are Bedouins from the Zalabieh tribe, who have lived in the area for generations. As a child, he played among the sandstone cliffs and learned the names of every valley, rock formation, and water source from his grandfather.

Becoming a licensed guide was not easy. Suleiman had to study for two years, learning English, geology, history, and first aid. He also had to pass a strict examination from the Ministry of Tourism. "Many people think being a guide is just about driving a jeep," he says. "But a real guide must understand the land — not just where to go, but why it matters. Every rock in Wadi Rum has a story."

Suleiman now leads tours in both English and Arabic, taking visitors from Europe, Asia, and the Americas through the desert landscape made famous by films like Lawrence of Arabia and The Martian. His favourite part of the job is the evening, when the tour groups sit around a campfire, drink sweet tea, and look up at a sky full of stars with no city lights to dim them. "When my guests look at the stars in Wadi Rum, they forget about their problems," he says. "And for a moment, I forget about mine too."`,
    keyVocab: ["licensed", "formation", "examination", "landscape", "dim"],
  },
  {
    level: "B1",
    title: "The Friday Market in Mafraq",
    body: `Every Friday morning, a large open-air market appears on the outskirts of Mafraq, a city in northern Jordan. By six o'clock, dozens of vendors have set up their stalls on the dusty ground, selling everything from fresh vegetables and spices to second-hand clothes and household items. The market is called Souq al-Juma, and it has been a weekly tradition in the city for as long as anyone can remember.

For many families in Mafraq, the Friday market is the most affordable way to buy what they need. Vegetables are cheaper here than in supermarkets — a kilo of tomatoes might cost half the price. Women from nearby villages arrive early with baskets of eggs, homemade cheese, and olives from their own orchards. The bargaining is friendly but serious; both the buyer and the seller expect to negotiate, and arriving at a fair price is considered a matter of respect.

In recent years, the market has also become a gathering place for the Syrian refugee families who have settled in the area. Some have opened their own stalls, selling handmade crafts, traditional Syrian sweets, or repaired electronics. The integration has not always been easy, but the market has helped. "When people buy from each other, they begin to understand each other," says Abu Raed, who has sold spices at the market for thirty years. "The market does not care where you come from. It only cares that you treat people fairly."`,
    keyVocab: ["affordable", "negotiate", "integration", "refugee", "bargaining"],
  },
  {
    level: "B1",
    title: "My Father's First Job",
    body: `My father, Mahmoud, grew up in a small village near Jerash in the 1980s. His family were farmers — they grew wheat, olives, and vegetables on a small piece of land. Education was not a priority in those days. Most boys in the village left school after the ninth grade to help their families in the fields. But my grandmother, who could not read or write herself, had a different dream for her son.

"You will go to school," she told my father firmly. "You will finish. And you will go to university." It was an unusual thing for a village woman to say in the 1980s, but my grandmother was determined. She sold eggs and homemade butter at the market to pay for his school supplies. When my father passed his Tawjihi exams with high marks, she cried.

My father received a scholarship to study engineering at the University of Jordan. He took a bus from Jerash to Amman every morning — a journey of more than an hour each way. After graduating, he got his first job at a construction company near 7th Circle. The salary was small, but he sent money home every month to his mother. "Everything I have," he told me once, "started with a woman who could not read but believed that education could change everything." That woman was my grandmother, and her belief changed the future of our entire family.`,
    keyVocab: ["priority", "scholarship", "determined", "construction", "firmly"],
  },
  {
    level: "B1",
    title: "The Art of Arabic Calligraphy",
    body: `In a small studio above a coffee shop on Rainbow Street, thirty-two-year-old Rami Al-Qudsi practices an art form that is centuries old. Rami is a professional Arabic calligrapher, one of only a handful in Jordan who make their living entirely from this craft. His studio walls are covered with framed pieces — verses from the Quran, lines of poetry by Mahmoud Darwish, and even contemporary phrases written in styles that blend traditional and modern aesthetics.

Rami discovered calligraphy by accident. While studying graphic design at the University of Jordan, a professor showed the class examples of classical Arabic scripts. "I was amazed," Rami recalls. "The letters were not just writing — they were art. Each stroke had a rhythm, a flow, a personality." He began practising with a bamboo reed pen and homemade ink, spending hours each day on a single letter.

Today, Rami's clients include Jordanian government offices, hotels, and private collectors from across the Gulf. He also teaches free workshops for children at the Jordan National Gallery of Fine Arts, believing that calligraphy is an important cultural heritage that must be passed to the next generation. "In a world of keyboards and touchscreens," he says, "handwriting is becoming rare. But Arabic calligraphy is not just handwriting — it is identity. When a child learns to shape these letters, they are connecting to a thousand years of culture."`,
    keyVocab: ["calligraphy", "aesthetics", "contemporary", "heritage", "manuscripts"],
  },
  {
    level: "B1",
    title: "Football Friday in Amman",
    body: `Every Friday evening during football season, a small cafe in Shmeisani transforms into something much bigger than a coffee shop. The owner, Abu Hassan, sets up a large projector screen against the back wall, and by the time the match begins, every seat is taken. The customers — mostly young men, but increasingly women and families too — come for the atmosphere as much as for the game.

Abu Hassan has been running these football nights for seven years. He serves free tea and sometimes mansaf on special occasions. The customers bring their own snacks, and everyone contributes what they can. When a goal is scored, the whole cafe erupts — people jump, shout, and embrace strangers. When the team loses, the mood is quiet, but Abu Hassan always says the same thing: "There is always next week."

What makes these gatherings special is that they are not just about football. They are about community. Many of the regulars have known each other for years. They discuss politics, family, work, and studies between the plays. Young graduates looking for jobs share advice with older professionals. University students practise their English by reading the commentary aloud. In a city where people are often busy and disconnected, Abu Hassan's Friday football night is a weekly reminder that community can be found in the simplest places.`,
    keyVocab: ["projector", "erupts", "contributes", "atmosphere", "commentary"],
  },
  {
    level: "B1",
    title: "Women Who Code Jordan",
    body: `In 2019, a young software engineer named Lina Al-Masri posted a message on Twitter: "I want to start a coding group for women in Jordan. Who is in?" Within a week, she had received over two hundred replies. Six months later, "Women Who Code Jordan" held its first workshop at a co-working space in Abdali, with fifty women attending and ten volunteer mentors.

The organisation's mission is practical and urgent. Although Jordanian women earn more university degrees than men, they are significantly underrepresented in the technology industry. Women Who Code Jordan addresses this gap by offering free workshops in web development, mobile apps, data science, and cloud computing. The workshops are taught in both Arabic and English, and child care is provided on-site — a deliberate choice to remove the barriers that prevent many women from attending professional events.

Four years on, the group has grown to over three thousand members across Amman, Irbid, and Aqaba. Several members have launched their own tech start-ups, and others have been hired by companies in the Gulf and Europe. But Lina says the impact goes beyond jobs. "When a young woman writes her first line of code and sees it work, something changes inside her," she explains. "She realises that technology is not a foreign world. It is a tool she can use to build whatever she imagines."`,
    keyVocab: ["underrepresented", "deliberate", "mission", "barriers", "launched"],
  },

  /* ── B2 entries (10 new) ── */

  {
    level: "B2",
    title: "Jordan's Water Challenge",
    body: `Jordan is the second most water-scarce country in the world, a fact that shapes nearly every aspect of national planning, agriculture, and daily life. With an annual rainfall averaging just 200 millimetres — most of which falls in a few intense storms between November and March — the country simply does not receive enough water naturally to support its population of over ten million people, including a significant refugee community. The Jordan River, once a powerful waterway, now carries only a fraction of its historical flow due to upstream diversion by neighbouring countries.

The government has responded with a combination of large-scale infrastructure projects and demand-management policies. The Disi Water Conveyance Project, completed in 2013, pumps fossil groundwater from the Disi aquifer in southern Jordan over 300 kilometres to Amman. Meanwhile, the National Water Strategy promotes conservation through tiered pricing — households that consume more pay significantly more per cubic metre — and the construction of wastewater treatment plants that recycle water for agricultural use. Desalination of Red Sea water, currently under study as part of the Red Sea-Dead Sea project, represents the most ambitious long-term proposal.

At the individual level, water scarcity influences daily behaviour in ways that visitors often find surprising. Many Jordanian homes have rooftop water tanks that are filled once or twice a week by municipal trucks. Families have learned to use water efficiently — reusing cooking water for plants, taking shorter showers, and fixing leaks immediately. These habits, born of necessity, have become ingrained in the culture. "Water is more precious than oil in Jordan," says Dr. Marwan Al-Raggad, a hydrologist at the University of Jordan. "And it will become even more precious in the years ahead."`,
    keyVocab: ["water-scarce", "infrastructure", "conveyance", "fossil groundwater", "desalination", "hydrologist"],
  },
  {
    level: "B2",
    title: "Preserving the Dead Sea",
    body: `The Dead Sea, the lowest point on Earth at approximately 430 metres below sea level, is shrinking. Its surface area has contracted by roughly a third since the 1960s, and the water level drops by more than one metre every year. The causes are well documented: the diversion of the Jordan River's headwaters for agricultural and domestic use, mineral extraction by the potash and bromine industries on both the Israeli and Jordanian sides, and the natural evaporation that accelerates as the lake becomes shallower and its surface area decreases.

For Jordan, the Dead Sea is not merely a geographical landmark — it is a pillar of the economy. The cosmetic and pharmaceutical industries generate hundreds of millions of dollars annually from Dead Sea minerals, particularly magnesium, potassium, and bromine. Tourism at sites like the Amman Beach and the private resorts along the coast attracts visitors from around the world, many of whom come specifically for the reputed therapeutic properties of the mud and water. The hotel sector along the Dead Sea coast employs thousands of Jordanians.

Scientists and policymakers have proposed several solutions. The most prominent is the Red Sea-Dead Sea Conduit, a project that would pump seawater from Aqaba northward, generating hydroelectric power along the way and replenishing the Dead Sea. However, environmental concerns — particularly the risk of mixing Red Sea water with Dead Sea brine, which could trigger gypsum precipitation and turn the water white — have delayed implementation. Conservationists argue that the most effective immediate action is simply to reduce the water taken from the Jordan River. "The Dead Sea is a warning," says environmental researcher Dr. Salim Al-Halabi. "If we cannot save a sea, what can we save?"`,
    keyVocab: ["contracted", "extraction", "hydroelectric", "precipitation", "replenishing", "brine"],
  },
  {
    level: "B2",
    title: "The Palestinian Diaspora in Amman",
    body: `Amman is home to one of the largest Palestinian diaspora communities in the world. According to UNRWA, there are approximately two million registered Palestine refugees in Jordan, though this figure does not capture the full picture — many Palestinians in Jordan hold full citizenship and are not registered as refugees. The community's presence in Amman dates back to 1948, when the first wave of refugees arrived from cities like Jaffa, Haifa, and Jerusalem, and was reinforced by a second wave after the 1967 war.

The Palestinian community has profoundly shaped Amman's identity. Neighbourhoods like Wihdat, Jabal Al-Nuzha, and parts of Jabal Amman became cultural centres where Palestinian traditions were preserved and adapted. The cuisine — maqloubeh, musakhan, and knafeh — became part of Jordan's national food culture. Musically, the voices of Um Kulthum and Fairuz filled homes and cafes. Educationally, Palestinian families prioritised schooling as a means of preserving identity and achieving economic stability, a value that has had lasting effects on Jordan's overall educational standards.

For the third generation — young Jordanians of Palestinian descent born in the 1990s and 2000s — the relationship with heritage is complex. Many have never visited Palestine. Their connection to cities like Nablus, Gaza, or Jaffa comes through family stories, recipes, and the keys to old homes that grandparents still keep. At the same time, they are fully Jordanian — they speak Jordanian Arabic, support the national football team, and contribute to every sector of society. Scholars describe this as a "dual consciousness" — being deeply rooted in both the reality of Jordan and the memory of Palestine. It is not a contradiction; it is a lived experience that defines much of Amman's cultural richness.`,
    keyVocab: ["diaspora", "reinforced", "profoundly", "contradiction", "dual consciousness", "descendants"],
  },
  {
    level: "B2",
    title: "The Rise of E-Commerce in Jordan",
    body: `Jordan's e-commerce sector has experienced remarkable growth over the past five years, driven by a young, tech-savvy population, high smartphone penetration, and the lasting behavioural changes brought about by the COVID-19 pandemic. Before 2020, online shopping in Jordan was limited mainly to international purchases through websites like Amazon and AliExpress. Today, a growing ecosystem of local platforms — including MarkaVIP, Jamalon, and OpenSooq — serves millions of customers across the country.

The challenges, however, are significant. Jordan does not have a standardised postal addressing system, which makes last-mile delivery complicated and expensive. Courier companies rely on phone calls and WhatsApp messages to locate customers. Cash on delivery remains the dominant payment method, accounting for roughly 70 percent of transactions. This creates operational inefficiencies: drivers carry large amounts of cash, and return rates — where customers refuse to accept a package — can reach 30 percent for some categories.

Despite these obstacles, entrepreneurs continue to innovate. Some companies have introduced GPS-tagged delivery points, while others are experimenting with QR-code-based payment systems. The Central Bank of Jordan has also introduced regulatory frameworks for digital wallets and fintech services, aiming to gradually shift the culture toward electronic payments. "Jordan's e-commerce story is still being written," says tech analyst Reem Khouri. "The infrastructure is improving, the consumer trust is growing, and the young population is ready. The question is not whether e-commerce will transform Jordan's retail sector — it already has. The question is how fast."`,
    keyVocab: ["tech-savvy", "penetration", "last-mile delivery", "dominant", "inefficiencies", "regulatory"],
  },
  {
    level: "B2",
    title: "Traditional Jordanian Architecture",
    body: `The old city of Salt, perched on three hills in northwestern Jordan, offers one of the finest collections of traditional Ottoman-era architecture in the Levant. In the late nineteenth and early twentieth centuries, Salt was the administrative capital of Transjordan, and its prosperous merchant families built elaborate stone houses that blended Ottoman, European, and local Arab design elements. These buildings — with their domed ceilings, arched windows, and painted interior walls — are now recognised as national treasures.

The construction techniques used in these buildings reflect a deep understanding of the local environment. Walls were built from golden limestone quarried from the surrounding hills, a material that provides natural insulation — keeping interiors cool in the scorching summer and warm in the bitter winter. High ceilings allowed hot air to rise, while small windows on the ground floor provided privacy and security. Many houses featured internal courtyards with citrus trees and water fountains, creating a private outdoor space that served as the family's social centre.

The Salt Heritage Trail, established in recent years with support from the UNESCO and the Jordanian Ministry of Tourism, has helped bring new life to the old city. Several historic houses have been converted into museums, cafes, and cultural centres. The Trail has also created economic opportunities for local residents, who now run small businesses catering to tourists. Yet preservation remains an ongoing challenge. Some historic buildings have deteriorated due to neglect, and developers sometimes prefer to demolish old structures rather than restore them. Balancing development with heritage conservation is a tension that Salt — and Jordan more broadly — will continue to navigate.`,
    keyVocab: ["elaborate", "limestone", "insulation", "courtyards", "deteriorated", "preservation"],
  },
  {
    level: "B2",
    title: "Mental Health Awareness in Jordan",
    body: `For decades, mental health was a topic that families in Jordan rarely discussed openly. Seeking help from a psychologist or psychiatrist carried a significant social stigma, and many people who experienced anxiety, depression, or trauma suffered in silence rather than risk being judged by their community. The cultural expectation was to rely on family, faith, and personal resilience — valuable resources, but not always sufficient for clinical conditions.

In recent years, however, a quiet transformation has begun. Young Jordanians, many of whom have been exposed to global conversations about mental health through social media, are increasingly willing to speak about their experiences. Instagram accounts and podcasts in Arabic that discuss therapy, self-care, and emotional well-being have gained substantial followings. The University of Jordan and JUST have both expanded their counselling services, and several private clinics in Amman now offer therapy in both Arabic and English.

Professional organisations are also contributing. The Jordanian Psychological Association has campaigned to raise awareness, emphasising that mental health conditions are medical issues, not character weaknesses. The Syrian refugee crisis, which brought hundreds of thousands of traumatised individuals to Jordan, forced the healthcare system to confront mental health needs on an unprecedented scale. International organisations like the UNHCR and WHO partnered with local clinics to provide counselling and psychosocial support. While the stigma has not disappeared — older generations remain more reluctant to seek professional help — the conversation has undeniably shifted. "Ten years ago, no one talked about this," says Dr. Lina Naber, a clinical psychologist in Amman. "Today, my waiting room is full. That is not a sign that people are weaker. It is a sign that they are braver."`,
    keyVocab: ["stigma", "clinical", "traumatised", "psychosocial", "unprecedented", "campaign"],
  },
  {
    level: "B2",
    title: "Renewable Energy in the Desert",
    body: `Jordan currently imports over 90 percent of its energy, primarily in the form of oil and natural gas, at an annual cost that has sometimes exceeded 15 percent of the country's GDP. This heavy dependence on imported energy has long been identified as one of the kingdom's most critical economic vulnerabilities. In response, Jordan has embarked on one of the most ambitious renewable energy programmes in the Middle East, leveraging its most abundant natural resource: sunshine.

The country's flagship solar project is the Quweira Solar Park, located in the desert south of Wadi Rum. With a capacity of 103 megawatts, the park generates enough electricity to power approximately 50,000 homes and reduces carbon dioxide emissions by an estimated 160,000 tonnes per year. It was financed through a combination of international loans and private investment, and it represents a model for how developing countries can attract clean energy capital. In total, renewable sources — primarily solar and wind — now account for roughly 20 percent of Jordan's electricity generation, up from virtually zero a decade ago.

The economic implications are substantial. Lower energy costs make Jordanian industries more competitive, and the renewable sector has created thousands of new jobs in installation, maintenance, and engineering. Universities such as the University of Jordan and the Hashemite University have introduced specialised programmes in renewable energy engineering. Yet challenges remain. The national grid requires significant upgrades to handle the intermittent nature of solar and wind power, and energy storage technology is still too expensive for widespread deployment. "We have made enormous progress," says Minister of Energy Dr. Hala Zawati. "But the transition from 20 percent to 50 percent renewable energy will be harder than getting from zero to twenty."`,
    keyVocab: ["vulnerability", "leveraging", "capacity", "intermittent", "deployment", "flagship"],
  },
  {
    level: "B2",
    title: "The Palestinian Kitchen in Exile",
    body: `Food is one of the most powerful carriers of cultural memory, and for the Palestinian diaspora, the kitchen has served as a site of resistance, identity, and continuity. In Amman, where Palestinian refugees and their descendants have lived for over seven decades, traditional Palestinian dishes remain a daily presence on family tables — not merely as food, but as living links to cities, villages, and agricultural practices that may no longer exist.

Consider musakhan, a dish from the Jenin and Tulkarem areas: roasted chicken served on flatbread layered with caramelised onions, sumac, and pine nuts. Preparing musakhan is not a quick task — the onions must be cooked slowly for over an hour, the bread must be thin and crispy, and the sumac must be of high quality. For Palestinian families in Amman, making musakhan is an act of cultural preservation. The recipe is passed from mother to daughter, with each generation making small adjustments, but the core remains unchanged.

Academic research has examined this phenomenon. Anthropologists describe it as "culinary heritage maintenance" — the deliberate practice of preserving food traditions as a form of identity continuity. A 2021 study by researchers at the University of Jordan found that 94 percent of Palestinian-Jordanian families surveyed prepare at least one traditional Palestinian dish per week, and that the practice is strongly associated with a sense of belonging and connection to Palestinian identity. The study also found that younger generations, while more likely to experiment with international cuisines, place equal emotional value on learning to cook their family's traditional dishes. "When I cook my grandmother's maqloubeh," one respondent wrote, "I am not just making dinner. I am telling her story."`,
    keyVocab: ["culinary", "caramelised", "continuity", "anthropologists", "deliberate", "identity"],
  },
  {
    level: "B2",
    title: "The Tech Talent Pipeline",
    body: `Jordan has earned a reputation as one of the Arab world's leading producers of technology talent, a remarkable achievement for a country with limited natural resources and a population of just over ten million. The roots of this reputation lie in the education system: Jordanian universities have been producing strong graduates in computer science, engineering, and information technology since the 1990s, and the quality of the output has consistently attracted the attention of international employers.

The numbers tell part of the story. Jordanian universities graduate approximately 5,000 computer science students annually, a disproportionately high figure for the country's size. Many of these graduates find employment with multinational technology companies — Google, Microsoft, Amazon, and Cisco all have significant operations in the region and actively recruit from Jordanian universities. Others join the growing number of local start-ups or work remotely for companies based in Europe and North America, a trend accelerated by the global shift toward remote work.

However, the talent pipeline also reveals structural problems. Brain drain remains a serious concern — surveys suggest that up to 30 percent of Jordanian tech graduates eventually leave the country for better-paying opportunities abroad. The local job market, while growing, cannot always absorb the supply of graduates, and salaries in Jordan's tech sector lag behind those in the Gulf states. Furthermore, there is a significant gap between what universities teach and what the industry needs, particularly in emerging fields like artificial intelligence, cybersecurity, and cloud architecture. Several initiatives, including coding bootcamps and industry-university partnerships, have emerged to bridge this gap. "Jordan does not have a talent problem," argues venture capitalist Fadi Ghandour. "It has a retention problem. The talent is here. The question is whether we can build an ecosystem that keeps it here."`,
    keyVocab: ["disproportionately", "brain drain", "pipeline", "absorb", "architecture", "ecosystem"],
  },
  {
    level: "B2",
    title: "Amman's Urban Transformation",
    body: `Amman has undergone a dramatic urban transformation over the past three decades, evolving from a quiet administrative city into a sprawling metropolis of over four million people. The changes are visible everywhere: the Abdali Boulevard development has introduced high-rise towers and luxury apartments to the city centre, while the expansion of the ring roads has pushed residential suburbs further into the surrounding hills. Yet beneath this modern facade, Amman retains a character that is uniquely its own.

The city's growth has not been without challenges. Traffic congestion on routes like the Airport Road and the Queen Alia Street corridor now ranks among residents' top complaints. Public transportation remains inadequate — the city relies primarily on shared taxis and private buses with no fixed schedules. Informal settlements have grown on Amman's eastern outskirts, where infrastructure and municipal services lag behind the more affluent western neighbourhoods. Urban planners at the Greater Amman Municipality have proposed bus rapid transit systems and improved zoning regulations, but implementation has been slow.

What makes Amman's urban story distinctive is the coexistence of the ancient and the ultra-modern. A single drive can take you past the Roman Theatre, a cluster of contemporary art galleries, a centuries-old mosque, and a new shopping mall. The city's famous seven hills — originally Jabal Amman, Jabal Al-Qala, Jabal Al-Nuzha, Jabal Al-Weibdeh, Jabal Ashrafieh, Jabal Jofeh, and Jabal Akhdar — have been joined by dozens more as the city has expanded. Weibdeh, once a quiet neighbourhood of old stone houses, has become Amman's bohemian quarter, filled with cafes, studios, and cultural spaces. Despite the rapid pace of change, Amman has somehow managed to grow without losing its soul — a quality that residents, whether born there or arrived as newcomers, consistently cite as the city's greatest asset.`,
    keyVocab: ["sprawling", "facade", "inadequate", "coexistence", "bohemian", "municipal"],
  },
];

function WordOfDaySheet({ open, onOpenChange, word: wod }: { open: boolean; onOpenChange: (v: boolean) => void; word: WordOfDayEntry }) {
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 overflow-hidden">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-petra to-petra-dark">
          <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="size-6" />
            Word of the Day
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-10rem)] px-6 pt-6">
          <h3 className="text-4xl font-bold text-petra mb-2">{wod.word}</h3>
          <p className="text-sm text-gray-500 italic mb-1">{wod.partOfSpeech} &bull; {wod.phonetic}</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Meaning</h4>
              <p className="text-gray-700">
                {wod.meaning}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Example</h4>
              <p className="text-gray-700 italic bg-pink-50 p-3 rounded border-l-4 border-petra">
                &ldquo;{wod.example}&rdquo;
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Related Words</h4>
              <div className="space-y-2">
                {wod.relatedWords.map((rw) => (
                  <div key={rw.word}>
                    <button
                      onClick={() => setExpandedWord(expandedWord === rw.word ? null : rw.word)}
                      className="inline-flex items-center gap-1 text-sm bg-petra/10 text-petra border border-petra/20 rounded-full px-3 py-1.5 hover:bg-petra/20 transition-colors"
                    >
                      <span className="font-medium capitalize">{rw.word}</span>
                      <ChevronDown className={`size-3 transition-transform ${expandedWord === rw.word ? "rotate-180" : ""}`} />
                    </button>
                    {expandedWord === rw.word && (
                      <div className="mt-2 ml-2 p-3 bg-gray-50 rounded-lg border-l-3 border-petra/40 text-sm space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold capitalize">{rw.word}</span>: {rw.definition}
                        </p>
                        <p className="text-gray-600 italic">
                          &ldquo;{rw.example}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">In Context</h4>
              <p className="text-sm text-gray-600">
                {wod.cultural}
              </p>
            </div>
          </div>
          <div className="h-8" />
        </ScrollArea>
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
  const [pronunciationOpen, setPronunciationOpen] = useState(false);
  const [displayedIdioms, setDisplayedIdioms] = useState<Idiom[]>(() => getRotatedItems(allIdioms, 4));

  const [streak, setStreak] = useState<StreakState>({ count: 1, label: "🔥 First day" });

  useEffect(() => {
    setStreak(loadAndUpdateStreak());
  }, []);

  const todaysDrop = dailyDrops[getRotatedIndex(dailyDrops.length)];
  const todaysWord = wordsOfDay[getRotatedIndex(wordsOfDay.length)];
  const todaysDatePill = formatDatePill();

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
              {streak.label}
            </Badge>
            <FeatureExplorer
              onGrammar={() => setGrammarListOpen(true)}
              onVocab={() => handleOpenInterest(interests[0])}
              onReading={() => setDailyDropOpen(true)}
              onTest={() => setPlacementOpen(true)}
              onIdioms={() => setIdiomSheetOpen(true)}
              onPronunciation={() => setPronunciationOpen(true)}
            />
            <Button
              onClick={() => setPlacementOpen(true)}
              className="bg-petra hover:bg-petra-dark text-white shadow rounded-md transition-colors text-sm"
            >
              Quick CEFR Check
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
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div>
                <CardTitle className="text-xl sm:text-2xl text-aqaba">
                  Today&apos;s Daily Drop
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">{todaysDatePill}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm shrink-0">
                Level: {todaysDrop.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              {todaysDrop.title}
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
              {todaysDrop.body.split(/\n\n+/)[0]}
            </p>
            <span className="text-aqaba font-semibold hover:underline transition-colors text-sm sm:text-base inline-flex items-center gap-1">
              Read full passage <ArrowRight className="size-4" />
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
                {todaysWord.word}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 italic mb-3">
                {todaysWord.partOfSpeech} &bull; {todaysWord.phonetic}
              </p>
              <p className="text-sm sm:text-base text-gray-600 bg-gray-50 p-2 rounded border-l-4 border-petra">
                &ldquo;{todaysWord.example}&rdquo;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-aqaba"
            onClick={() => setPlacementOpen(true)}
          >
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <GraduationCap className="size-6 text-aqaba" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Take the Quick CEFR Check</h4>
                <p className="text-xs text-gray-500">30 questions across 6 levels</p>
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
          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-petra"
            onClick={() => setPronunciationOpen(true)}
          >
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                <Mic2 className="size-6 text-petra" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Pronunciation Lab</h4>
                <p className="text-xs text-gray-500">Minimal pairs for Arabic speakers</p>
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

      {/* Quick CEFR Check */}
      <PlacementTest open={placementOpen} onOpenChange={setPlacementOpen} />

      {/* Grammar Lesson */}
      <GrammarSheet open={grammarListOpen} onOpenChange={setGrammarListOpen} />

      {/* Daily Drop Full Passage */}
      <DailyDropSheet open={dailyDropOpen} onOpenChange={setDailyDropOpen} drop={todaysDrop} />

      {/* Word of Day */}
      <WordOfDaySheet open={wordOfDayOpen} onOpenChange={setWordOfDayOpen} word={todaysWord} />

      {/* Idioms */}
      <IdiomSheet open={idiomSheetOpen} onOpenChange={setIdiomSheetOpen} />

      {/* Pronunciation Lab */}
      <PronunciationLab open={pronunciationOpen} onOpenChange={setPronunciationOpen} />

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
