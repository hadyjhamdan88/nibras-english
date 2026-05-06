"use client";

import Image from "next/image";
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

interface VocabEntry {
  term: string;
  definition: string;
  example: string;
}

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

interface WritingLabLesson {
  title: string;
  explanation: string;
  correctExample: string;
  commonMistake: string;
  practice: string;
  answer: string;
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
  {
    id: "ae-vs-eh",
    title: "Cat vs Ket",
    contrast: "/æ/ vs /ɛ/",
    intro: "English has two short front vowels where Arabic has roughly one. The /æ/ in 'cat' is open and front; the /ɛ/ in 'ket' (as in 'ketchup') is mid and slightly higher. Many Jordanian learners pronounce both as a single Arabic /a/, so 'bad' and 'bed' sound identical.",
    whyHard: "Arabic /a/ sits between English /æ/ and /ɛ/. To produce /æ/, drop your jaw lower and spread your lips slightly, almost like you are about to say 'aaah' at the doctor. For /ɛ/, the jaw is more relaxed and the tongue is a bit higher.",
    pairs: [
      { a: "cat", b: "ket", ipaA: "/kæt/", ipaB: "/kɛt/" },
      { a: "bad", b: "bed", ipaA: "/bæd/", ipaB: "/bɛd/" },
      { a: "sat", b: "set", ipaA: "/sæt/", ipaB: "/sɛt/" },
      { a: "man", b: "men", ipaA: "/mæn/", ipaB: "/mɛn/" },
      { a: "pan", b: "pen", ipaA: "/pæn/", ipaB: "/pɛn/" },
      { a: "had", b: "head", ipaA: "/hæd/", ipaB: "/hɛd/" },
      { a: "sad", b: "said", ipaA: "/sæd/", ipaB: "/sɛd/" },
      { a: "lad", b: "led", ipaA: "/læd/", ipaB: "/lɛd/" },
      { a: "ban", b: "Ben", ipaA: "/bæn/", ipaB: "/bɛn/" },
      { a: "dad", b: "dead", ipaA: "/dæd/", ipaB: "/dɛd/" },
    ],
  },
  {
    id: "uh-vs-ae",
    title: "Cup vs Cap",
    contrast: "/ʌ/ vs /æ/",
    intro: "The /ʌ/ in 'cup' is a central vowel made with the tongue relaxed in the middle of the mouth. The /æ/ in 'cap' is a front vowel made with the jaw lower and the tongue forward. Arabic L1 speakers often produce both as the same Arabic /a/, so 'cup' and 'cap' merge.",
    whyHard: "For /ʌ/, keep your tongue and lips relaxed in a neutral position — it should feel like a quick, dull 'uh'. For /æ/, push your tongue forward and drop your jaw a bit more. The difference is location, not length.",
    pairs: [
      { a: "cup", b: "cap", ipaA: "/kʌp/", ipaB: "/kæp/" },
      { a: "bun", b: "ban", ipaA: "/bʌn/", ipaB: "/bæn/" },
      { a: "hut", b: "hat", ipaA: "/hʌt/", ipaB: "/hæt/" },
      { a: "luck", b: "lack", ipaA: "/lʌk/", ipaB: "/læk/" },
      { a: "mud", b: "mad", ipaA: "/mʌd/", ipaB: "/mæd/" },
      { a: "but", b: "bat", ipaA: "/bʌt/", ipaB: "/bæt/" },
      { a: "fun", b: "fan", ipaA: "/fʌn/", ipaB: "/fæn/" },
      { a: "run", b: "ran", ipaA: "/rʌn/", ipaB: "/ræn/" },
      { a: "stuck", b: "stack", ipaA: "/stʌk/", ipaB: "/stæk/" },
      { a: "duck", b: "dack", ipaA: "/dʌk/", ipaB: "/dæk/" },
    ],
  },
  {
    id: "short-u-vs-long-u",
    title: "Full vs Fool",
    contrast: "/ʊ/ vs /uː/",
    intro: "English has a short, relaxed /ʊ/ (as in 'full') and a long, tense /uː/ (as in 'fool'). Arabic has only one back rounded vowel, so most learners produce only the long version. This makes 'full' and 'fool' sound the same, which can confuse listeners.",
    whyHard: "For /ʊ/, the lips are slightly rounded but loose, and the sound is short. For /uː/, push your lips forward into a tight circle and hold the sound longer, almost like you are blowing out a candle. Length and lip tension are the keys.",
    pairs: [
      { a: "full", b: "fool", ipaA: "/fʊl/", ipaB: "/fuːl/" },
      { a: "pull", b: "pool", ipaA: "/pʊl/", ipaB: "/puːl/" },
      { a: "look", b: "Luke", ipaA: "/lʊk/", ipaB: "/luːk/" },
      { a: "should", b: "shoed", ipaA: "/ʃʊd/", ipaB: "/ʃuːd/" },
      { a: "could", b: "cooed", ipaA: "/kʊd/", ipaB: "/kuːd/" },
      { a: "stood", b: "stewed", ipaA: "/stʊd/", ipaB: "/stuːd/" },
      { a: "wood", b: "wooed", ipaA: "/wʊd/", ipaB: "/wuːd/" },
      { a: "good", b: "goo'd", ipaA: "/ɡʊd/", ipaB: "/ɡuːd/" },
      { a: "soot", b: "suit", ipaA: "/sʊt/", ipaB: "/suːt/" },
      { a: "book", b: "buke", ipaA: "/bʊk/", ipaB: "/buːk/" },
    ],
  },
  {
    id: "er-vs-or",
    title: "Bird vs Bored",
    contrast: "/ɜːr/ vs /ɔːr/",
    intro: "Both of these vowels involve the letter 'r' in writing, but they are very different sounds. /ɜːr/ in 'bird' is a central vowel with the tongue in the middle of the mouth. /ɔːr/ in 'bored' is a back rounded vowel with the lips pushed forward. Arabic L1 speakers often merge them into a single 'or' sound.",
    whyHard: "For /ɜːr/, keep your lips relaxed (not rounded) and curl your tongue slightly back — it should feel neutral, almost lazy. For /ɔːr/, round your lips firmly and pull the tongue back. The lip position is the easiest visual cue.",
    pairs: [
      { a: "bird", b: "bored", ipaA: "/bɜːrd/", ipaB: "/bɔːrd/" },
      { a: "heard", b: "horde", ipaA: "/hɜːrd/", ipaB: "/bɔːrd/" },
      { a: "her", b: "horror", ipaA: "/hɜːr/", ipaB: "/hɔːrər/" },
      { a: "burn", b: "born", ipaA: "/bɜːrn/", ipaB: "/bɔːrn/" },
      { a: "turn", b: "torn", ipaA: "/tɜːrn/", ipaB: "/bɔːrn/" },
      { a: "shirt", b: "short", ipaA: "/ʃɜːrt/", ipaB: "/ʃɔːrt/" },
      { a: "hurt", b: "horde", ipaA: "/hɜːrt/", ipaB: "/bɔːrd/" },
      { a: "stir", b: "store", ipaA: "/stɜːr/", ipaB: "/stɔːr/" },
      { a: "fern", b: "fawn", ipaA: "/fɜːrn/", ipaB: "/bɔːn/" },
      { a: "purr", b: "pour", ipaA: "/pɜːr/", ipaB: "/bɔːr/" },
    ],
  },
  {
    id: "ay-vs-eh",
    title: "Late vs Let",
    contrast: "/eɪ/ vs /ɛ/",
    intro: "English /eɪ/ is a diphthong — your tongue glides from one position to another, starting at /ɛ/ and ending close to /i/. The /ɛ/ in 'let' is a single, steady vowel. Arabic L1 speakers sometimes produce both as a flat /e/, missing the glide in 'late'.",
    whyHard: "Say /ɛ/ and hold it. Now, while saying it, slide your tongue up and forward toward /i/ — that movement is /eɪ/. The mouth opens slightly at the start and closes a little at the end. /ɛ/ has no movement; it stays put.",
    pairs: [
      { a: "late", b: "let", ipaA: "/leɪt/", ipaB: "/lɛt/" },
      { a: "pain", b: "pen", ipaA: "/peɪn/", ipaB: "/pɛn/" },
      { a: "taste", b: "test", ipaA: "/teɪst/", ipaB: "/lɛst/" },
      { a: "wait", b: "wet", ipaA: "/weɪt/", ipaB: "/wɛt/" },
      { a: "main", b: "men", ipaA: "/meɪn/", ipaB: "/mɛn/" },
      { a: "sale", b: "sell", ipaA: "/seɪl/", ipaB: "/sɛl/" },
      { a: "raid", b: "red", ipaA: "/reɪd/", ipaB: "/rɛd/" },
      { a: "paper", b: "pepper", ipaA: "/ˈpeɪpər/", ipaB: "/ˈpɛpər/" },
      { a: "fail", b: "fell", ipaA: "/feɪl/", ipaB: "/fɛl/" },
      { a: "gate", b: "get", ipaA: "/ɡeɪt/", ipaB: "/ɡɛt/" },
    ],
  },
  {
    id: "ai-vs-ay",
    title: "Mile vs Male",
    contrast: "/aɪ/ vs /eɪ/",
    intro: "Both of these are diphthongs, but they start in very different places. /aɪ/ begins with the open /a/ sound (like the Arabic فتحة) and glides up to /i/. /eɪ/ begins with /ɛ/ and glides up to /i/. Confusing them turns 'write' into 'rate' and 'mile' into 'male'.",
    whyHard: "Drop your jaw fully for the start of /aɪ/ — your mouth should feel open. For /eɪ/, the jaw stays much higher; only your tongue moves. The starting position is everything: open mouth = /aɪ/, mid mouth = /eɪ/.",
    pairs: [
      { a: "mile", b: "male", ipaA: "/maɪl/", ipaB: "/meɪl/" },
      { a: "bite", b: "bait", ipaA: "/baɪt/", ipaB: "/beɪt/" },
      { a: "write", b: "rate", ipaA: "/raɪt/", ipaB: "/reɪt/" },
      { a: "like", b: "lake", ipaA: "/laɪk/", ipaB: "/leɪk/" },
      { a: "light", b: "late", ipaA: "/laɪt/", ipaB: "/leɪt/" },
      { a: "pie", b: "pay", ipaA: "/paɪ/", ipaB: "/peɪ/" },
      { a: "wide", b: "wade", ipaA: "/waɪd/", ipaB: "/weɪd/" },
      { a: "tile", b: "tail", ipaA: "/taɪl/", ipaB: "/teɪl/" },
      { a: "die", b: "day", ipaA: "/daɪ/", ipaB: "/deɪ/" },
      { a: "five", b: "fave", ipaA: "/faɪv/", ipaB: "/feɪv/" },
    ],
  },
];

const collocationLessons: WritingLabLesson[] = [
  {
    title: "Make a Decision",
    explanation: "Some verbs naturally go with certain nouns. In English, we say \u201Cmake a decision\u201D, not \u201Cdo a decision\u201D.",
    correctExample: "After thinking about her major, Lina finally made a decision.",
    commonMistake: "She did a decision.",
    practice: "Choose the correct sentence: A) He made a decision. B) He did a decision.",
    answer: "A) He made a decision.",
  },
  {
    title: "Take Responsibility",
    explanation: "We use \u201Ctake responsibility\u201D when someone accepts that they must deal with a task, duty, or mistake.",
    correctExample: "Samer took responsibility for the mistake in the email.",
    commonMistake: "Samer carried responsibility for the mistake.",
    practice: "Complete the sentence: A good team member should ___ responsibility.",
    answer: "take",
  },
  {
    title: "Pay Attention",
    explanation: "We say \u201Cpay attention\u201D when someone listens, watches, or thinks carefully about something.",
    correctExample: "Khaled paid attention to the pharmacist's instructions.",
    commonMistake: "Khaled gave attention to the instructions.",
    practice: "Complete the sentence: Students should ___ attention during the lesson.",
    answer: "pay",
  },
  {
    title: "Meet a Deadline",
    explanation: "To \u201Cmeet a deadline\u201D means to finish something before the required time.",
    correctExample: "The group stayed late at the university library to meet the deadline.",
    commonMistake: "The group arrived the deadline.",
    practice: "Choose the correct phrase: A) meet a deadline B) reach a deadline",
    answer: "A) meet a deadline",
  },
  {
    title: "Build Confidence",
    explanation: "We use \u201Cbuild confidence\u201D when confidence grows slowly through practice or experience.",
    correctExample: "Practicing every day helped Ahmad build confidence before his presentation.",
    commonMistake: "Practicing every day made confidence.",
    practice: "Complete the sentence: Speaking often can help you ___ confidence.",
    answer: "build",
  },
  {
    title: "Make Progress",
    explanation: "To \u201Cmake progress\u201D means to improve or move forward in learning, work, or life.",
    correctExample: "With daily practice, Rasha made progress in English.",
    commonMistake: "Rasha did progress in English.",
    practice: "Choose the correct sentence: A) I made progress. B) I did progress.",
    answer: "A) I made progress.",
  },
  {
    title: "Have a Conversation",
    explanation: "We say \u201Chave a conversation\u201D when people talk together.",
    correctExample: "The student had a warm conversation with the elderly woman during iftar.",
    commonMistake: "The student made a conversation.",
    practice: "Complete the sentence: They ___ a conversation after class.",
    answer: "had",
  },
  {
    title: "Give Advice",
    explanation: "In English, we say \u201Cgive advice\u201D, not \u201Csay advice\u201D.",
    correctExample: "Her teacher gave her useful advice before the exam.",
    commonMistake: "Her teacher said her useful advice.",
    practice: "Choose the correct phrase: A) give advice B) say advice",
    answer: "A) give advice",
  },
  {
    title: "Gain Experience",
    explanation: "To \u201Cgain experience\u201D means to learn by doing something over time.",
    correctExample: "Noor gained experience during her internship in Amman.",
    commonMistake: "Noor took experience during her internship.",
    practice: "Complete the sentence: Volunteering helps students ___ experience.",
    answer: "gain",
  },
  {
    title: "Keep a Promise",
    explanation: "To \u201Ckeep a promise\u201D means to do what you said you would do.",
    correctExample: "He kept his promise and helped his brother study.",
    commonMistake: "He saved his promise.",
    practice: "Choose the correct sentence: A) She kept her promise. B) She saved her promise.",
    answer: "A) She kept her promise.",
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
      <SheetContent side="right" className="fixed inset-0 z-50 w-screen h-screen max-w-none overflow-y-auto overflow-x-hidden bg-white p-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-4xl">
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-petra text-white px-4 sm:px-8 py-5 sm:py-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold leading-tight">Pronunciation Lab</h2>
              <p className="text-white/90 mt-2 text-base sm:text-xl leading-relaxed">Listen, notice the difference, repeat aloud.</p>
            </div>
          </div>
        </div>

        {!ttsSupported ? (
          <div className="text-center py-12 px-4">
            <p className="text-gray-600 mb-2">Your browser does not support text-to-speech.</p>
            <p className="text-gray-500 text-sm">Please try the latest version of Chrome, Safari, or Firefox.</p>
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-8 py-6 space-y-6">
            {/* ── Tab row ── */}
            <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
              <div className="flex gap-2 min-w-max">
                {pronunciationModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      stopAll();
                      setActiveModuleId(m.id);
                    }}
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors shrink-0 ${
                      activeModuleId === m.id
                        ? "border-petra text-petra"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Voice / speed settings ── */}
            <div className="w-full max-w-full overflow-hidden rounded-2xl bg-gray-50 p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full max-w-full text-sm border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-petra"
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

            {/* ── Computer voice note ── */}
            <p className="text-gray-600 italic leading-relaxed whitespace-normal break-words max-w-full">
              These are computer-generated voices. They are a reliable reference for most contrasts, but trust your ear — if a single playback sounds off, try a different voice from the dropdown.
            </p>

            {/* ── Module description ── */}
            <div>
              <Badge className="bg-petra/10 text-petra border-petra/20 mb-2">
                {activeModule.contrast}
              </Badge>
              <p className="text-gray-700 leading-relaxed whitespace-normal break-words max-w-full">
                {activeModule.intro}
              </p>
            </div>

            {/* ── Why it&apos;s tricky ── */}
            <div className="w-full max-w-full rounded-xl bg-yellow-50 border-l-4 border-yellow-400 p-4 overflow-visible">
              <p className="text-gray-700 leading-relaxed whitespace-normal break-words max-w-full">
                <strong className="text-amber-700">Why it&apos;s tricky:</strong> {activeModule.whyHard}
              </p>
            </div>

            <Separator />

            {/* ── Minimal Pairs ── */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                Minimal Pairs ({activeModule.pairs.length})
              </h3>
              <div className="space-y-4">
                {activeModule.pairs.map((pair, idx) => {
                  const idA = `${activeModule.id}-${idx}-a`;
                  const idB = `${activeModule.id}-${idx}-b`;
                  const idPair = `${activeModule.id}-pair-${idx}`;
                  return (
                    <div
                      key={`${activeModule.id}-${idx}`}
                      className="w-full max-w-full rounded-2xl border border-gray-200 p-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full">
                        <button
                          onClick={() => speakWord(pair.a, idA)}
                          className={`w-full min-w-0 flex items-center gap-3 rounded-xl border p-3 text-left transition-all overflow-hidden ${
                            speakingId === idA
                              ? "border-petra bg-pink-50"
                              : "border-gray-200 hover:border-petra/40 hover:bg-pink-50/40"
                          }`}
                        >
                          <span className="size-8 rounded-full bg-petra/10 flex items-center justify-center shrink-0">
                            <span className="text-petra text-xs">A</span>
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-base truncate">{pair.a}</div>
                            <div className="text-sm text-gray-500 truncate">{pair.ipaA}</div>
                          </div>
                        </button>
                        <button
                          onClick={() => speakWord(pair.b, idB)}
                          className={`w-full min-w-0 flex items-center gap-3 rounded-xl border p-3 text-left transition-all overflow-hidden ${
                            speakingId === idB
                              ? "border-petra bg-pink-50"
                              : "border-gray-200 hover:border-petra/40 hover:bg-pink-50/40"
                          }`}
                        >
                          <span className="size-8 rounded-full bg-petra/10 flex items-center justify-center shrink-0">
                            <span className="text-petra text-xs">B</span>
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-base truncate">{pair.b}</div>
                            <div className="text-sm text-gray-500 truncate">{pair.ipaB}</div>
                          </div>
                        </button>
                      </div>
                      <button
                        onClick={() => speakPair(pair, idx)}
                        className={`w-full mt-3 text-xs font-semibold py-2 rounded-lg transition-colors ${
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
            </div>

            <Separator />

            {/* ── How to Practice ── */}
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
          </div>
        )}
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

function DailyDropSheet({
  open,
  onOpenChange,
  drop,
  onVocabClick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  drop: DailyDropEntry;
  onVocabClick: (term: string) => void;
}) {
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
                <button
                  key={w}
                  type="button"
                  onClick={() => onVocabClick(w)}
                  className="inline-flex"
                  aria-label={`Open vocabulary entry for ${w}`}
                >
                  <Badge className="bg-aqaba/10 text-aqaba border-aqaba/20 cursor-pointer hover:bg-aqaba/20 transition-colors">
                    {w}
                  </Badge>
                </button>
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
  {
    word: "Neighbour",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈneɪ.bər/",
    meaning: "A person who lives next to or near another person; someone who shares a community or neighbourhood.",
    example: "My neighbour in Jabal Amman brings us a plate of mansaf every Eid.",
    cultural: "In Jordan, the concept of a neighbour goes far beyond living next door. Rooted in Islamic teachings that honour the rights of neighbours, Jordanian communities treat neighbours like extended family. Whether it is sharing food during Ramadan in Sweifieh or checking on elderly neighbours in Salt, the bond between neighbours is a cornerstone of daily life. In Palestinian culture, the saying 'the neighbour before the house' reflects how deeply people value those who live nearby, a tradition carried proudly across Jordan's diverse neighbourhoods.",
    relatedWords: [
      { word: "neighbourhood", definition: "A small area within a town or city where people live.", example: "The neighbourhood of Wehdat in Amman is known for its strong community spirit and lively markets." },
      { word: "community", definition: "A group of people living in the same place or sharing common values.", example: "The Palestinian refugee community in Jerash has preserved its traditions for over fifty years." },
      { word: "friendly", definition: "Kind and pleasant to other people.", example: "The people of Ajloun are famously friendly, always welcoming visitors with tea and sweets." },
      { word: "generosity", definition: "The quality of being kind and willing to give to others.", example: "It is common in Jordan for a neighbour to send over a pot of maqloubeh without expecting anything in return." },
      { word: "gather", definition: "To come together in one place for a shared purpose.", example: "After evening prayer, families gather on their balconies to chat with their neighbours." },
    ],
  },
  {
    word: "Generosity",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌdʒen.əˈrɒs.ə.ti/",
    meaning: "The quality of being kind, understanding, and willing to give freely to others without expecting anything back.",
    example: "The generosity of Jordanian families during Ramadan is truly remarkable — everyone is invited to the iftar table.",
    cultural: "Generosity is one of the most cherished values in Jordanian and Palestinian culture. The Arabic word 'Karam' captures this beautifully — it means both generosity and honour. During Ramadan, tables are set with extra food in Amman, Irbid, and Aqaba so that anyone passing by can join the iftar meal. In Palestinian homes, serving guests abundant food is a sign of respect and love, and refusing a second or third helping is gently discouraged. This spirit of giving is deeply connected to Islamic values and is a source of pride across the region.",
    relatedWords: [
      { word: "hospitable", definition: "Friendly and welcoming to guests or visitors.", example: "Jordanian families are known for being incredibly hospitable to guests from all over the world." },
      { word: "kindness", definition: "The quality of being friendly, generous, and considerate.", example: "A small act of kindness, like helping an elderly woman carry her groceries in Shmeisani, can make someone's day." },
      { word: "charitable", definition: "Relating to giving help or money to those who need it.", example: "Many mosques in Amman organise charitable food drives during the holy month of Ramadan." },
      { word: "abundant", definition: "Existing or available in large quantities; more than enough.", example: "The kunafa shops in Nablus are abundant, each one claiming to make the best version." },
      { word: "share", definition: "To give a portion of something to others.", example: "During the olive harvest, Palestinian families share the first batch of olive oil with their neighbours." },
    ],
  },
  {
    word: "Patience",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈpeɪ.ʃəns/",
    meaning: "The ability to wait calmly or to endure difficulties without getting angry or upset.",
    example: "Learning English takes patience, but every new word you learn brings you closer to your goals.",
    cultural: "Patience, or 'Sabr' in Arabic, is a fundamental virtue in both Islamic teachings and daily life in Jordan. From waiting in traffic on the 7th Circle during rush hour to the careful slow-cooking of mansaf for a Friday family gathering, patience is practised every day. The Palestinian people have shown extraordinary patience through decades of hardship, embodying Sumud — steadfastness and quiet strength. In Jordanian homes, elders often remind younger generations that 'patience is the key to relief,' a proverb passed down through countless families.",
    relatedWords: [
      { word: "calm", definition: "Not showing or feeling nervousness, anger, or other strong emotions.", example: "Despite the noisy streets of downtown Amman, Teta Fatima always remained calm and peaceful." },
      { word: "steady", definition: "Firmly fixed, supported, or balanced; not shaking or moving.", example: "The steady rhythm of life in the old city of Salt gives visitors a sense of peace." },
      { word: "endure", definition: "To suffer something difficult or painful over a long time.", example: "The olive trees of Palestine endure through drought, conflict, and storms — yet they continue to bear fruit." },
      { word: "wait", definition: "To stay in one place or delay doing something until a particular time or event.", example: "The whole family waits excitedly for the evening call to prayer to break their fast during Ramadan." },
      { word: "persistent", definition: "Continuing to do something even when it is difficult or other people are against it.", example: "Sami was persistent in his studies at JUST and graduated at the top of his engineering class." },
    ],
  },
  {
    word: "Harvest",
    partOfSpeech: "(Noun/Verb)",
    phonetic: "/ˈhɑː.vɪst/",
    meaning: "The process of gathering in crops, or the season when crops are gathered; to collect or obtain a result.",
    example: "Every autumn, families in Ajloun gather to harvest olives from trees that have been in their families for generations.",
    cultural: "The harvest season is one of the most important times of year in Jordan and Palestine. In Ajloun and Irbid, the olive harvest in October brings entire families together — children spread sheets under the trees, parents pick the olives, and elders supervise the pressing at local mills. In Palestine, the olive harvest is deeply tied to identity and land, symbolising connection to ancestral soil. The harvest of wheat, figs, and grapes also marks seasonal celebrations across the region. For Jordanian farmers, a good harvest is a blessing from God and a cause for communal gratitude.",
    relatedWords: [
      { word: "crop", definition: "A plant that is grown on a large scale for food or other use.", example: "The tomato crops in the Jordan Valley are among the finest in the region." },
      { word: "season", definition: "Each of the four divisions of the year, or a period when something is available.", example: "The fig season in Jordan is short but sweet — families race to enjoy the fresh fruit." },
      { word: "gather", definition: "To bring together or to pick and collect things.", example: "Women in Palestinian villages gather wild herbs like za'atar from the hills each spring." },
      { word: "yield", definition: "The amount of something that is produced.", example: "This year's olive yield in Ajloun was excellent thanks to the heavy winter rains." },
      { word: "orchard", definition: "A piece of land where fruit trees are grown.", example: "The family's almond orchard near Salt has been producing nuts for over forty years." },
    ],
  },
  {
    word: "Gathering",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈɡæð.ər.ɪŋ/",
    meaning: "A coming together of people, often for a social, family, or community purpose.",
    example: "Friday gatherings at my grandmother's house in Jabal Amman are the highlight of our week.",
    cultural: "Gatherings are at the heart of Jordanian and Palestinian social life. Every Friday, families across Amman gather for a large afternoon meal, often mansaf, at the home of the family patriarch or matriarch. During Ramadan, evening gatherings for iftar and suhoor bring neighbours, friends, and relatives together around one table. In Palestinian culture, gatherings are also moments of storytelling, where elders recount memories of Nablus, Jerusalem, and the villages of the West Bank. Whether in a sitting room in Sweifieh or a courtyard in Karak, gatherings strengthen the bonds that hold communities together.",
    relatedWords: [
      { word: "assembly", definition: "A group of people gathered together for a common purpose.", example: "The university assembly hall at the University of Jordan was filled with students attending the graduation ceremony." },
      { word: "celebration", definition: "A special social event to mark a happy occasion.", example: "The wedding celebration in Aqaba lasted three days, with music, dancing, and feasting." },
      { word: "reunion", definition: "A meeting of people who have been separated for some time.", example: "Every summer, Jordanian families living abroad hold a reunion at their family home in Irbid." },
      { word: "feast", definition: "A large and special meal, often for a celebration.", example: "The Eid feast at Teta's house always includes maqloubeh, fattoush, and fresh fruit." },
      { word: "occasion", definition: "A particular time or instance of an event; a special event.", example: "The opening of the new community centre in Mafraq was a joyous occasion for the whole town." },
    ],
  },
  {
    word: "Journey",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈdʒɜː.ni/",
    meaning: "An act of travelling from one place to another, or a process of personal development and change over time.",
    example: "Her journey from learning basic English in Irbid to studying abroad was filled with challenges and triumphs.",
    cultural: "The concept of a journey resonates deeply in Jordanian and Palestinian life. Many Palestinian families carry the memory of their journey from their homeland to Jordan, a story of displacement, loss, and the courage to rebuild. Today, young Jordanians embark on their own journeys — commuting from Salt to the University of Jordan, travelling to Petra with classmates, or pursuing scholarships abroad. The road from Amman to Aqaba passes through some of the world's most breathtaking landscapes, reminding travellers that every journey, whether physical or personal, shapes who we become.",
    relatedWords: [
      { word: "destination", definition: "The place where someone is going or where something is being sent.", example: "The ancient city of Petra is a popular destination for tourists from all over the world." },
      { word: "adventure", definition: "An unusual and exciting experience or activity.", example: "Hiking through the canyons of Wadi Mujib near the Dead Sea is a real adventure." },
      { word: "voyage", definition: "A long journey involving travel by sea or in space.", example: "The Palestinian diaspora has scattered families across the globe in a great voyage of survival and hope." },
      { word: "expedition", definition: "A journey undertaken by a group of people with a particular purpose.", example: "The biology students from Al al-Bayt University went on an expedition to study wildlife in Dana Nature Reserve." },
      { word: "experience", definition: "Practical contact with and observation of facts or events.", example: "Living and studying in a new city is an experience that changes you forever." },
    ],
  },
  {
    word: "Courage",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈkʌr.ɪdʒ/",
    meaning: "The ability to do something that frightens you; bravery in the face of danger, pain, or difficulty.",
    example: "It took great courage for Noor to speak at the public event at the University of Jordan, but she did it beautifully.",
    cultural: "Courage, or 'Shaja'a' in Arabic, is celebrated throughout Jordanian and Palestinian history. From the defenders of Karak Castle to the steadfastness of Palestinians holding onto their land and identity, courage takes many forms. For many students in Jordan, simply travelling from a small village to study in Amman requires courage. For Palestinian families, courage is the daily act of maintaining hope and dignity despite decades of displacement. In Islam, courage is not the absence of fear, but rather the decision to do what is right in spite of fear — a lesson taught in homes, mosques, and schools across the kingdom.",
    relatedWords: [
      { word: "bravery", definition: "Brave behaviour or the quality of being brave.", example: "The bravery of Jordan's civil defence volunteers during emergencies is deeply respected." },
      { word: "bold", definition: "Showing an ability to take risks; confident and courageous.", example: "The bold decision to open a small café near Rainbow Street paid off for the young entrepreneur." },
      { word: "heroic", definition: "Very brave or courageous, often in a way that is admired by others.", example: "The heroic efforts of doctors and nurses in Gaza during difficult times inspire the world." },
      { word: "fearless", definition: "Lacking fear; very brave.", example: "The fearless students who led the volunteer project in Jerash cleaned up the entire historic site." },
      { word: "strength", definition: "The quality of being physically or mentally strong.", example: "The strength of Palestinian mothers who build lives for their children despite hardship is extraordinary." },
    ],
  },
  {
    word: "Respect",
    partOfSpeech: "(Noun/Verb)",
    phonetic: "/rɪˈspekt/",
    meaning: "A feeling of deep admiration for someone or something; to show regard or consideration for others.",
    example: "In Jordanian culture, younger people show respect to their elders by greeting them first and using formal language.",
    cultural: "Respect, or 'Ihtiram' in Arabic, is a foundational value in Jordanian and Palestinian society. Children are taught from a very young age to greet elders first, to stand when an older person enters the room, and to listen attentively when someone with more experience speaks. In Jordanian homes, respect extends to teachers, neighbours, and guests. Islamic teachings strongly emphasise respect for parents and elders. At family gatherings in Amman, the most respected person is often offered the best seat and served first. This culture of respect creates strong, harmonious communities where everyone feels valued and heard.",
    relatedWords: [
      { word: "honour", definition: "Great respect, or something that brings pride and respect.", example: "Hosting guests well is a matter of honour for every Jordanian family." },
      { word: "admire", definition: "To regard someone or something with wonder, pleasure, and approval.", example: "I really admire my grandfather's dedication to attending every Friday prayer at the mosque." },
      { word: "considerate", definition: "Always thinking of other people's feelings and needs.", example: "It is considerate to remove your shoes before entering someone's home in Jordan." },
      { word: "polite", definition: "Showing good manners and respect towards others.", example: "Jordanian shopkeepers are always polite, greeting customers with a warm 'Ahlan wa Sahlan.'" },
      { word: "dignity", definition: "The state of being worthy of respect and honour.", example: "The people of Palestine carry themselves with great dignity, no matter what challenges they face." },
    ],
  },
  {
    word: "Community",
    partOfSpeech: "(Noun)",
    phonetic: "/kəˈmjuː.nə.ti/",
    meaning: "A group of people living in the same area or sharing common interests, values, and identity.",
    example: "The Palestinian community in Jordan has contributed enormously to the country's culture, education, and economy.",
    cultural: "Community is the backbone of Jordanian life. From the close-knit neighbourhoods of Jabal Amman to the vibrant streets of Irbid, Jordanians take pride in looking after one another. The Palestinian refugee community has built strong, resilient communities in places like Wehdat, Baqa'a, and Jerash, preserving their heritage while contributing to Jordan's rich cultural mosaic. Mosques, schools, and community centres serve as gathering places where people support each other through celebrations and hardships alike. In times of need, whether during a cold winter in Mafraq or a family illness, the community rallies together with food, prayers, and practical help.",
    relatedWords: [
      { word: "neighbourhood", definition: "A district or area within a town or city.", example: "The neighbourhood of Shmeisani in Amman is home to many embassies and cultural centres." },
      { word: "belonging", definition: "A feeling of being happy or comfortable as part of a group.", example: "After moving from Gaza to Amman, Layla finally felt a sense of belonging at her new school." },
      { word: "togetherness", definition: "The state of being close to other people; unity and connection.", example: "The togetherness of Jordanian families during Eid celebrations is truly heartwarming." },
      { word: "support", definition: "To give help, encouragement, or backing to someone.", example: "The community support for small businesses in downtown Amman has kept many shops open during hard times." },
      { word: "unity", definition: "The state of being joined together or in agreement.", example: "Unity among the people of Jordan and Palestine gives hope for a better future." },
    ],
  },
  {
    word: "Wisdom",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈwɪz.dəm/",
    meaning: "The quality of having experience, knowledge, and good judgement; the ability to make sensible decisions.",
    example: "My grandfather's wisdom helped our family through many difficult times — his advice always came from the heart.",
    cultural: "Wisdom, or 'Hikma' in Arabic, is one of the most revered qualities in Arab culture. In Jordan, elders are seen as living libraries of wisdom, and their advice is sought on everything from family matters to important life decisions. Palestinian grandmothers, or 'Teta,' are especially cherished for their wisdom — often expressed through proverbs and stories passed down through generations. Islamic tradition places great emphasis on seeking knowledge and wisdom, and the Quran describes it as a precious gift. Whether sitting with an elder in a Karak village or listening to a lecture at the University of Jordan, wisdom is always being shared and valued.",
    relatedWords: [
      { word: "insight", definition: "A deep understanding of a situation or problem.", example: "Dr. Amin's insight into Jordan's water challenges helped shape the university's research programme." },
      { word: "judgement", definition: "The ability to make sensible decisions after careful thought.", example: "The village elder's good judgement resolved the dispute between the two farming families." },
      { word: "knowledge", definition: "Facts, information, and skills acquired through experience or education.", example: "Seeking knowledge is encouraged in Islam — the first word revealed in the Quran was 'Read.'" },
      { word: "experience", definition: "Knowledge or skill gained from doing something over time.", example: "Years of teaching at a school in Salt gave Miss Huda valuable experience with young learners." },
      { word: "proverb", definition: "A short traditional saying that expresses a common truth or piece of wisdom.", example: "The Arabic proverb 'Patience is the key to relief' is quoted by Jordanian grandmothers everywhere." },
    ],
  },
  {
    word: "Guest",
    partOfSpeech: "(Noun)",
    phonetic: "/ɡest/",
    meaning: "A person who is invited to visit someone's home or attend an event; someone who is welcomed and entertained.",
    example: "In our home, a guest is always greeted with Arabic coffee, dates, and a warm smile.",
    cultural: "The treatment of guests, or 'Diyafa' in Arabic, is one of the most sacred traditions in Jordanian and Palestinian culture. Islam teaches that honouring a guest is a duty, and this teaching is lived out daily in homes across the country. A Jordanian host will always offer the best food and drink to a guest, often preparing special dishes like mansaf or stuffed grape leaves. In Palestinian homes, refusing a guest is unthinkable — even if the family has little, they will share what they have. The Arabic phrase 'Ahlan wa Sahlan' — meaning 'you are family and you have made your home here' — captures the warmth that every guest receives in Jordan.",
    relatedWords: [
      { word: "welcome", definition: "To greet someone arriving in a glad and friendly way.", example: "The hotel staff in Aqaba welcome every visitor with traditional Arabic coffee and fresh dates." },
      { word: "hospitality", definition: "The friendly and generous treatment of guests.", example: "Jordanian hospitality is world-famous — guests are treated like royalty." },
      { word: "companion", definition: "A person who spends time with or travels with another.", example: "My study companion from the University of Jordan and I review vocabulary together every evening." },
      { word: "invite", definition: "To ask someone to come to an event, visit, or do something.", example: "Fatima invited all her classmates to her home in Irbid for a Ramadan iftar." },
      { word: "entertain", definition: "To provide food, drink, or amusement for guests.", example: "The family entertained their guests with stories, music, and a wonderful dinner." },
    ],
  },
  {
    word: "Modesty",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈmɒd.ə.sti/",
    meaning: "The quality of being humble and not drawing attention to oneself or one's achievements; behaving in a way that is not showy.",
    example: "Despite winning the scholarship, Ahmad accepted the award with modesty and thanked his teachers and family.",
    cultural: "Modesty, or 'Haya' in Arabic, is a deeply valued trait in both Islamic teaching and Jordanian culture. It is reflected in the way people dress, speak, and carry themselves — with humility and quiet dignity. In Palestinian culture, modesty is especially important in family life and community interactions. Modesty does not mean thinking less of yourself; rather, it means not needing to boast about your accomplishments. When a Jordanian student achieves something great — like getting into a top university or winning a competition — the community celebrates for them, and the student accepts praise with grace and gratitude. This quiet pride is at the heart of what makes Jordanian and Palestinian communities so admirable.",
    relatedWords: [
      { word: "humble", definition: "Not proud or arrogant; having a modest view of one's importance.", example: "Despite being the most successful businesswoman in Amman, she remained humble and kind to everyone." },
      { word: "graceful", definition: "Moving in a smooth and attractive way, or behaving with elegance and politeness.", example: "The graceful way Um Khaled served tea to her guests was a reflection of her upbringing." },
      { word: "simple", definition: "Easy to understand or not complicated; not luxurious.", example: "The simple life of a farmer in the Jordan Valley has a beauty that many city people appreciate." },
      { word: "reserved", definition: "Slow to show feelings or opinions; keeping things private.", example: "Jordanian culture tends to be more reserved in public, with deeper emotions shared within the family." },
      { word: "dignified", definition: "Having or showing a composed or serious manner worthy of respect.", example: "The dignified way the elders of Nablus carry themselves tells a story of deep pride and heritage." },
    ],
  },
  {
    word: "Heritage",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈher.ɪ.tɪdʒ/",
    meaning: "Valued objects, traditions, and qualities that have been passed down through previous generations.",
    example: "The ancient ruins of Jerash are part of Jordan's rich heritage and attract visitors from around the world.",
    cultural: "Jordan is a land where heritage is not locked away in museums — it is lived and breathed every day. From the Nabataean city of Petra, one of the New Seven Wonders of the World, to the Roman ruins of Jerash, Jordan's history stretches back thousands of years. Palestinian heritage is equally precious — the traditional embroidery, or 'tatreez,' the olive wood carvings of Bethlehem, and the stories of old Jerusalem are all treasured parts of identity that families carry with them. In Amman, the Citadel and the Roman Theatre sit alongside modern buildings, creating a beautiful mix of old and new. Preserving this heritage is a shared responsibility, and Jordanians take great pride in passing traditions to the next generation.",
    relatedWords: [
      { word: "legacy", definition: "Something handed down from the past, such as traditions, values, or achievements.", example: "King Hussein left a lasting legacy of peace and unity that still guides Jordan today." },
      { word: "tradition", definition: "A belief, custom, or way of doing something that has existed for a long time.", example: "Serving Arabic coffee to guests from a traditional dallah is a cherished Jordanian tradition." },
      { word: "preserve", definition: "To keep something in its original state or in good condition.", example: "Jordan has worked hard to preserve its ancient sites so future generations can enjoy them." },
      { word: "ancestral", definition: "Relating to one's ancestors or family from long ago.", example: "Many Palestinian families in Jordan can trace their ancestral roots to villages in the West Bank." },
      { word: "inheritance", definition: "Something that is passed down from one generation to the next.", example: "The recipes Teta passes down to her daughters are a delicious form of cultural inheritance." },
    ],
  },
  {
    word: "Dialect",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈdaɪ.ə.lekt/",
    meaning: "A particular form of a language that is spoken in a specific region or by a specific group of people.",
    example: "The Jordanian dialect has a warm, melodic sound that makes even simple greetings feel friendly and welcoming.",
    cultural: "The Arabic language is rich with diverse dialects, and Jordan is no exception. The Jordanian dialect varies from the soft, musical speech of Amman to the distinctive 'g' sound used in the north around Irbid and Ajloun. Palestinian refugees brought their own dialect, which has blended with Jordanian Arabic over the decades, creating a unique linguistic tapestry. When a Jordanian says 'Ahlan wa Sahlan,' the warmth of the dialect itself conveys genuine hospitality. For English learners, understanding the difference between formal Arabic, dialect, and English helps them navigate the complex but beautiful world of being bilingual in Jordan.",
    relatedWords: [
      { word: "accent", definition: "A distinctive way of pronouncing a language, often linked to a region or country.", example: "Jordanians learning English often speak with a distinctive accent that reflects their Arabic background." },
      { word: "vocabulary", definition: "All the words known and used by a person or within a language.", example: "Every Jordanian dialect has its own unique vocabulary — words you will not hear in formal Arabic." },
      { word: "bilingual", definition: "Able to speak two languages fluently.", example: "Many young Jordanians are bilingual, speaking Arabic at home and English at university." },
      { word: "colloquial", definition: "Used in ordinary or informal conversation, not formal writing.", example: "Colloquial Jordanian Arabic is full of humour and warmth that formal Arabic does not always capture." },
      { word: "expression", definition: "A word or phrase that conveys a particular meaning or feeling.", example: "'Ya Allah' is an expression used by Jordanians to express surprise, gratitude, or even frustration." },
    ],
  },
  {
    word: "Determination",
    partOfSpeech: "(Noun)",
    phonetic: "/dɪˌtɜː.mɪˈneɪ.ʃən/",
    meaning: "The firm decision to achieve something and the willingness to work hard to reach that goal despite obstacles.",
    example: "With great determination, Rania completed her nursing degree at JUST while supporting her younger siblings.",
    cultural: "Determination is a quality that defines many stories across Jordan and Palestine. Jordanian students who wake before dawn to travel from Mafraq to the University of Jordan in Amman show remarkable determination. Palestinian students who pursue education despite limited resources demonstrate that nothing can stop a determined mind. In sports, Jordanian athletes who train hard to represent their country at international competitions inspire a whole generation. Islamic teaching encourages believers to pair prayer with effort — a combination that fuels the determination seen in every corner of Jordanian life, from classrooms to clinics to construction sites.",
    relatedWords: [
      { word: "resolve", definition: "Firm determination to do something; a clear decision.", example: "With quiet resolve, the young woman from Karak opened her own graphic design studio." },
      { word: "motivation", definition: "The reason or willingness for acting or behaving in a particular way.", example: "The desire to help her community was the motivation behind Dr. Salma's medical career." },
      { word: "drive", definition: "Energy and determination to achieve something.", example: "Ahmad's drive to learn English opened doors he never imagined possible." },
      { word: "willpower", definition: "The ability to control one's thoughts and actions to achieve goals.", example: "Fasting during the long summer days of Ramadan requires true willpower and spiritual strength." },
      { word: "commitment", definition: "A promise to do something or a dedication to a cause.", example: "The teacher's commitment to her students at the school in Wehdat changed many lives." },
    ],
  },
  {
    word: "Solidarity",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌsɒl.ɪˈdær.ə.ti/",
    meaning: "Unity or agreement among individuals or groups who share common interests, goals, or struggles.",
    example: "The people of Jordan showed tremendous solidarity with the people of Gaza through donations, prayers, and peaceful demonstrations.",
    cultural: "Solidarity, or 'Tadamun' in Arabic, is a powerful force in Jordanian and Palestinian life. When difficult times strike — whether it is a conflict in Gaza, a harsh winter in Mafraq, or an economic challenge affecting small businesses in downtown Amman — Jordanians come together in remarkable solidarity. During Ramadan, mosques across the kingdom collect food and clothing for families in need. The solidarity between Jordanians and Palestinians runs deep, rooted in shared history, family ties, and a mutual understanding of struggle and hope. This spirit of standing together is one of the region's greatest strengths.",
    relatedWords: [
      { word: "unity", definition: "The state of being joined together as one.", example: "Unity among Arab nations is a goal that many leaders and citizens have long worked towards." },
      { word: "support", definition: "To help someone by giving emotional or practical assistance.", example: "The community organised a fundraiser to support families affected by the crisis." },
      { word: "compassion", definition: "Sympathy and concern for the suffering of others, with a desire to help.", example: "The compassion shown by Jordanian doctors treating refugees is deeply moving." },
      { word: "collective", definition: "Done by or belonging to all members of a group.", example: "The collective effort of volunteers cleaned up the beaches of Aqaba in just one weekend." },
      { word: "ally", definition: "A person or group that supports and helps another.", example: "Jordan has been an important ally in promoting peace and stability in the region." },
    ],
  },
  {
    word: "Gratitude",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈɡræt.ɪ.tjuːd/",
    meaning: "The feeling of being thankful and appreciative for something good that has happened or something someone has done.",
    example: "I feel deep gratitude for my parents, who sacrificed so much to give me a good education.",
    cultural: "Gratitude, or 'Shukr' in Arabic, is woven into the fabric of daily life in Jordan. The phrase 'Alhamdulillah' — meaning 'praise be to God' — is said countless times each day, expressing thanks for everything from a good meal to good health. Jordanian culture teaches children to be grateful to their parents, teachers, and elders. In Palestinian families, gratitude is often expressed through actions rather than words — a mother cooking for her family, a neighbour bringing food, a student writing a heartfelt letter to a teacher who believed in them. During Eid and Ramadan, gratitude fills every home, reminding people that even in difficult times, there is always something to be thankful for.",
    relatedWords: [
      { word: "thankful", definition: "Feeling or showing gratitude; pleased about something good.", example: "We are thankful for the safe arrival of our relatives who travelled from Nablus to visit." },
      { word: "appreciate", definition: "To recognise the full worth of something or to be grateful for something.", example: "I really appreciate the time my English tutor at the University of Jordan spends helping me." },
      { word: "blessing", definition: "Something that brings happiness, or a prayer asking for God's favour.", example: "Good health and a loving family are the greatest blessings anyone can have." },
      { word: "acknowledge", definition: "To accept or admit the existence or truth of something.", example: "During the graduation ceremony, the students acknowledged their teachers' dedication with flowers and cards." },
      { word: "grateful", definition: "Feeling or showing thanks for something good received.", example: "Rami was grateful for the scholarship that allowed him to study engineering at JUST." },
    ],
  },
  {
    word: "Perseverance",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌpɜː.sɪˈvɪə.rəns/",
    meaning: "Continued effort and determination to achieve something despite difficulties, failures, or delays.",
    example: "Through perseverance, Hala passed her IELTS exam on the third attempt and earned a place at a top university.",
    cultural: "Perseverance is a trait that Jordanians and Palestinians know well. For Palestinian refugees who arrived in Jordan with nothing and built new lives from scratch, perseverance was not a choice — it was survival. Today, their children and grandchildren attend the same universities, work in the same hospitals, and contribute to the same society that once welcomed them. In Jordan, perseverance looks like a student in Irbid who studies by candlelight during power cuts, a small business owner in Sweifieh who refuses to close her shop, or a farmer in the Jordan Valley who plants seeds even when the rains are late. Islam teaches that God rewards those who do not give up, a lesson that resonates in every home.",
    relatedWords: [
      { word: "persistence", definition: "Continuing to do something firmly, even when it is difficult or others oppose it.", example: "Through persistence, the young researcher at the University of Jordan published her first scientific paper." },
      { word: "consistency", definition: "The quality of behaving or performing in the same way over time.", example: "Consistency in practising English every day leads to real progress." },
      { word: "steadfastness", definition: "Loyalty and commitment that does not change, even under pressure.", example: "The steadfastness of the Palestinian people is an example of courage admired worldwide." },
      { word: "resilience", definition: "The ability to recover quickly from difficulties.", example: "The resilience of Jordan's tourism sector after difficult years shows the country's strength." },
      { word: "grit", definition: "Courage and resolve; strength of character.", example: "It takes grit to balance a full-time job and evening classes at Al al-Bayt University." },
    ],
  },
  {
    word: "Identity",
    partOfSpeech: "(Noun)",
    phonetic: "/aɪˈden.tə.ti/",
    meaning: "The qualities, beliefs, and characteristics that make a person or group who they are.",
    example: "For young Palestinians growing up in Jordan, their identity is shaped by both their heritage and the country they call home.",
    cultural: "Identity is a complex and beautiful concept in Jordan. Jordanians carry multiple layers of identity — as Arabs, as Muslims or Christians, as members of specific tribes or families, and as citizens of a country that has welcomed people from across the region. For Palestinians in Jordan, identity is especially meaningful — it is carried through food, language, embroidery, music, and the stories told by grandparents about Jerusalem, Jaffa, and Nablus. Being bilingual adds another layer, as young Jordanians navigate between Arabic and English, between tradition and modernity, between local and global. This rich, layered identity is a source of strength and pride.",
    relatedWords: [
      { word: "roots", definition: "The origins or background of a person or family.", example: "Noor always stays connected to her roots by cooking the dishes her grandmother taught her." },
      { word: "belonging", definition: "The feeling of being part of a group or place.", example: "Finding a sense of belonging was the most important thing for Omar when he first moved to Amman." },
      { word: "heritage", definition: "Cultural traditions passed down through generations.", example: "Wearing traditional Palestinian embroidery connects young women to their heritage." },
      { word: "culture", definition: "The beliefs, customs, and arts of a particular society or group.", example: "Jordan's culture is a beautiful blend of Bedouin, Palestinian, Circassian, and other traditions." },
      { word: "character", definition: "The mental and moral qualities that make a person unique.", example: "The strong character of Jordanian women, who balance family, work, and education, is truly inspiring." },
    ],
  },
  {
    word: "Mentor",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈmen.tɔːr/",
    meaning: "An experienced and trusted person who gives advice, support, and guidance to someone less experienced.",
    example: "Professor Ahmad at the University of Jordan became a mentor to dozens of students who are now successful professionals.",
    cultural: "The concept of mentoring has deep roots in Arab culture, where the relationship between a teacher and student is sacred. In Islam, the Prophet Muhammad (peace be upon him) was both a mentor and a guide, and this tradition continues in Jordanian universities and workplaces. A senior colleague who shows a new graduate the ropes at a hospital in Irbid, a teacher who stays after class to help a struggling student in Sweifieh, or a family friend who advises a young person on career choices — all of these are mentors. In Palestinian culture, the wisdom of elders serves a mentoring function, with grandfathers and grandmothers gently guiding the next generation through stories and lived experience.",
    relatedWords: [
      { word: "guide", definition: "To show someone the way, or a person who gives advice.", example: "The tour guide at Petra shared fascinating stories about the Nabataean civilisation with the visitors." },
      { word: "advise", definition: "To give someone guidance, suggestions, or recommendations.", example: "My English teacher advised me to read one English article every day to improve my vocabulary." },
      { word: "role model", definition: "A person whose behaviour and achievements are admired and copied by others.", example: "Queen Rania is a role model for many young Jordanian women who value education and public service." },
      { word: "coach", definition: "A person who trains or teaches someone to improve their skills.", example: "The debate team coach at the University of Jordan helped his students win the national championship." },
      { word: "inspire", definition: "To fill someone with the desire to do something or to achieve a goal.", example: "The stories of successful Palestinian doctors and engineers inspire students across Jordan." },
    ],
  },
  {
    word: "Craftsmanship",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈkræfts.mən.ʃɪp/",
    meaning: "The skill, care, and quality that goes into making something by hand; the work of a skilled artisan.",
    example: "The craftsmanship of the olive wood carvings from Bethlehem is recognised and admired around the world.",
    cultural: "Craftsmanship is a living tradition in Jordan and Palestine. In the old city of Salt, Ottoman-era buildings stand as proof of masterful stone masonry. In Palestine, artisans create beautiful objects from olive wood, mother-of-pearl, and ceramic — each piece carrying centuries of tradition. The Bedouin weaving of Jordan, with its bold geometric patterns, is another form of craftsmanship passed from mother to daughter. In Amman's Rainbow Street and downtown markets, you can find handcrafted jewellery, blown glass, and embroidered textiles. These crafts are not just products; they are stories, memories, and connections to the land and its people.",
    relatedWords: [
      { word: "artisan", definition: "A person who makes things by hand with great skill.", example: "The artisan who makes traditional pottery in Jerash has been practising his craft for thirty years." },
      { word: "handmade", definition: "Made by hand, not by machine.", example: "The handmade Palestinian scarf, or 'kuffiyeh,' is a symbol of identity and solidarity." },
      { word: "skill", definition: "The ability to do something well, especially through practice.", example: "The skill required to create traditional 'tatreez' embroidery takes years to develop." },
      { word: "tradition", definition: "A custom or practice that has been passed down through generations.", example: "Glass-blowing in Hebron is a tradition that dates back hundreds of years." },
      { word: "quality", definition: "The standard of something as measured against others; excellence.", example: "The quality of Jordanian olive oil is among the best in the Mediterranean region." },
    ],
  },
  {
    word: "Ambition",
    partOfSpeech: "(Noun)",
    phonetic: "/æmˈbɪʃ.ən/",
    meaning: "A strong desire and determination to achieve success, power, wealth, or a specific goal.",
    example: "Rasha's ambition to become a doctor led her to study medicine at JUST and then specialise in children's health.",
    cultural: "Ambition in Jordan is balanced with community and family values. Young Jordanians dream big — they want to be engineers, doctors, artists, and entrepreneurs — but they also want to honour their families and give back to their communities. The ambition of a young woman from Karak to become Jordan's first female pilot, or a student from Irbid to develop an app that helps farmers, shows how personal goals and national pride go hand in hand. In Palestinian families, ambition is often born from the desire to rebuild and thrive — the dream that the next generation will have opportunities their parents could only imagine. Jordanian universities nurture this ambition every day.",
    relatedWords: [
      { word: "aspiration", definition: "A strong desire to achieve something important.", example: "Her aspiration to work for the United Nations began when she volunteered at a refugee camp." },
      { word: "goal", definition: "Something that a person wants to achieve.", example: "My goal is to achieve a B2 level in English so I can study for my master's degree abroad." },
      { word: "vision", definition: "A clear idea of what you want to achieve in the future.", example: "The founder of the community centre in Wehdat had a vision of a safe space for young people to learn and grow." },
      { word: "motivation", definition: "The reason or enthusiasm for doing something.", example: "The motivation to succeed comes from wanting to make his parents proud." },
      { word: "drive", definition: "Energy and determination to achieve something.", example: "Hani's drive to start his own tech company in Amman kept him working late every night." },
    ],
  },
  {
    word: "Contribution",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌkɒn.trɪˈbjuː.ʃən/",
    meaning: "Something that you give or do to help achieve a shared goal; a positive input to a group, cause, or society.",
    example: "Palestinian doctors and nurses have made an enormous contribution to Jordan's healthcare system over the decades.",
    cultural: "The story of Jordan is, in many ways, a story of contributions. Palestinian refugees who arrived in Jordan contributed their skills, their culture, and their resilience to building the nation. Today, Palestinians serve as doctors, engineers, teachers, and business owners, contributing to every aspect of Jordanian life. Jordanians from all backgrounds contribute through volunteering — cleaning beaches in Aqaba, teaching at community centres in East Amman, or mentoring young people in Irbid. Islam teaches that even a smile is a form of charity, reminding us that contributions need not be grand to be meaningful. Every act of service, no matter how small, strengthens the whole community.",
    relatedWords: [
      { word: "participate", definition: "To take part in an activity or event.", example: "Students at the University of Jordan participate in many volunteer programmes during the summer." },
      { word: "donate", definition: "To give money, goods, or time to help a cause.", example: "Many Jordanian families donate food and clothing during Ramadan to those in need." },
      { word: "devote", definition: "To give all or a large part of your time, attention, or effort to something.", example: "Teta Amal devoted her life to raising her children and preserving Palestinian traditions." },
      { word: "volunteer", definition: "To offer to do something without being paid.", example: "Young volunteers in Ajloun spend their weekends planting trees to protect the environment." },
      { word: "impact", definition: "A powerful or noticeable effect.", example: "The impact of Jordan's education system on reducing poverty has been recognised internationally." },
    ],
  },
  {
    word: "Hospitality",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌhɒs.pɪˈtæl.ə.ti/",
    meaning: "The friendly, generous, and welcoming treatment of guests and visitors.",
    example: "Jordanian hospitality is legendary — from the moment you enter a home, you are treated like family.",
    cultural: "Hospitality, or 'Diyafa' in Arabic, is more than a custom in Jordan — it is a way of life and a religious obligation. The Prophet Muhammad (peace be upon him) said, 'Whoever believes in God and the Last Day, let him honour his guest,' and this teaching is practised daily across the kingdom. When you visit a Jordanian home, you are greeted with Arabic coffee, tea, and an array of sweets and snacks. During Eid, homes are open to all visitors, and no one is turned away. In Palestinian culture, the hospitality is equally legendary — a guest will never leave an empty table, and hosts will insist on feeding you 'just one more bite.' From the hotels of Aqaba to the simple homes of Mafraq, hospitality defines the Jordanian experience.",
    relatedWords: [
      { word: "generous", definition: "Willing to give more than is expected; unselfish.", example: "The generous people of Karak are known for serving huge plates of mansaf to their guests." },
      { word: "welcoming", definition: "Friendly and glad to receive guests.", example: "The welcoming atmosphere of Amman makes visitors feel at home from the very first day." },
      { word: "gracious", definition: "Courteous, kind, and pleasant, especially towards guests.", example: "Our gracious hostess insisted we stay for dinner even though we had just come for tea." },
      { word: "accommodate", definition: "To provide someone with a place to stay or to adjust to their needs.", example: "The university accommodation in Irbid provides a comfortable home for students from across Jordan." },
      { word: "host", definition: "A person who receives or entertains guests.", example: "Abu Khalid was the perfect host — he made sure every guest felt comfortable and well-fed." },
    ],
  },
  {
    word: "Milestone",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈmaɪl.stəʊn/",
    meaning: "An important event or achievement that marks a significant stage in development or progress.",
    example: "Graduating from the University of Jordan was a major milestone in Dana's life and a proud moment for her family.",
    cultural: "Milestones are celebrated with great joy in Jordanian and Palestinian culture. A child's first day of school, a university graduation, a wedding, the birth of a baby, or buying a first home — each milestone is marked with family gatherings, prayers, and often a special meal. In Palestinian culture, milestones carry added weight because they represent survival and progress against difficult odds. When a young Palestinian in Jordan earns a degree or starts a business, the entire community celebrates, knowing the journey that led to this achievement. Islamic tradition encourages celebrating blessings, and these milestones are seen as gifts from God to be shared with loved ones.",
    relatedWords: [
      { word: "achievement", definition: "Something that has been accomplished through effort or skill.", example: "Passing the Tawjihi exam with high marks is a remarkable achievement for any student in Jordan." },
      { word: "celebrate", definition: "To mark a happy or important occasion with enjoyment.", example: "The family gathered to celebrate Layla's new job at the hospital in Amman." },
      { word: "progress", definition: "Movement towards a better or more advanced state.", example: "The progress Jordan has made in education over the past fifty years is impressive." },
      { word: "turning point", definition: "A time when an important change takes place.", example: "Getting the scholarship to study abroad was a turning point in Ahmad's life." },
      { word: "accomplishment", definition: "Something that has been achieved successfully.", example: "Opening her own bakery in Sweifieh was the proudest accomplishment of Um Khaled's life." },
    ],
  },
  {
    word: "Remembrance",
    partOfSpeech: "(Noun)",
    phonetic: "/rɪˈmem.brəns/",
    meaning: "The act of remembering and showing respect for people or events from the past.",
    example: "Palestinian communities in Jordan hold annual days of remembrance to honour their homeland and those who were lost.",
    cultural: "Remembrance holds a sacred place in Palestinian culture. Every year, on Nakba Day, Palestinians across Jordan and the world remember the displacement of 1948 — a wound that remains open across generations. In Jordan, this remembrance is not about hatred, but about honouring the past and holding onto the hope of return. Families keep the keys to their ancestral homes in Palestine as symbols of remembrance. In Islamic tradition, remembering those who have passed away through prayer and charity is a duty. In Amman, the sounds of the call to prayer echo through neighbourhoods like Wehdat and Jabal Amman, connecting people to their faith, their history, and their continuing story.",
    relatedWords: [
      { word: "memory", definition: "Something remembered from the past, or the ability to remember.", example: "Teta's memories of Jerusalem before 1948 are both beautiful and painful." },
      { word: "memorial", definition: "An object, event, or structure created to remember a person or event.", example: "The memorial in Amman honours the Jordanian soldiers who gave their lives for the country." },
      { word: "commemorate", definition: "To honour the memory of someone or something with a ceremony or event.", example: "Each year, the community commemorates Land Day with cultural events and discussions." },
      { word: "tribute", definition: "An act, statement, or gift that shows respect or admiration.", example: "The poetry reading was a beautiful tribute to the late Palestinian poet Mahmoud Darwish." },
      { word: "heritage", definition: "Traditions and cultural features passed down from previous generations.", example: "Preserving Palestinian heritage through music and dance is a form of living remembrance." },
    ],
  },
  {
    word: "Dedication",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌded.ɪˈkeɪ.ʃən/",
    meaning: "The commitment and hard work someone puts into a task, goal, or cause; being fully devoted to something.",
    example: "Dr. Layla's dedication to her patients at King Abdullah University Hospital in Irbid has earned her widespread respect.",
    cultural: "Dedication is visible everywhere in Jordan — in the teacher who arrives early and stays late, the nurse who works through the night, and the parent who works two jobs to pay for their children's education. In Palestinian culture, dedication takes on an even deeper meaning: the dedication to preserve one's identity, culture, and hope across generations of displacement. Islamic teaching encourages dedication in all endeavours, reminding believers to do everything with excellence and sincerity. From the farmers of the Jordan Valley who tend their crops through heat and drought, to the students at the University of Jordan who study in the library until midnight, dedication is the quiet engine that drives progress in Jordan.",
    relatedWords: [
      { word: "commitment", definition: "A promise to be fully involved in something; devotion.", example: "Her commitment to learning English opened doors to opportunities she never expected." },
      { word: "devotion", definition: "Great love, loyalty, or enthusiasm for a person, activity, or cause.", example: "The devotion of Jordanian mothers to their children's education is truly remarkable." },
      { word: "loyalty", definition: "A strong feeling of support or allegiance to someone or something.", example: "The loyalty of Palestinian families to their homeland, even after decades abroad, never fades." },
      { word: "sacrifice", definition: "To give up something important for the sake of something else.", example: "Many parents in Jordan sacrifice their own comfort so their children can have a better future." },
      { word: "effort", definition: "Physical or mental energy used to achieve something.", example: "Learning a new language requires consistent effort, but the rewards are worth it." },
    ],
  },
  {
    word: "Diaspora",
    partOfSpeech: "(Noun)",
    phonetic: "/daɪˈæs.pər.ə/",
    meaning: "A group of people who have spread or dispersed from their original homeland to live in other countries.",
    example: "The Palestinian diaspora spans the globe, but no matter where they live, they carry the taste of olive oil and the sound of the call to prayer with them.",
    cultural: "The Palestinian diaspora is one of the largest in the world, with millions of people living in Jordan, Lebanon, the Gulf, Europe, and the Americas. Jordan is home to one of the largest Palestinian communities outside the West Bank and Gaza, and the contributions of Palestinians to Jordanian society — in medicine, education, business, and the arts — are immeasurable. Despite being far from their ancestral villages and cities like Jaffa, Haifa, and Jerusalem, Palestinians in the diaspora maintain a powerful connection to their roots through food, language, music, and storytelling. For many, Jordan has become home, yet the dream of returning to Palestine remains alive in every generation.",
    relatedWords: [
      { word: "dispersion", definition: "The spreading of people from one place to various locations.", example: "The dispersion of Palestinian families across the world began in 1948 and continues today." },
      { word: "homeland", definition: "A person's or a people's native land or country of origin.", example: "For Palestinians, the homeland is not just a place — it is a part of who they are." },
      { word: "exile", definition: "The state of being forced to leave one's home country.", example: "Living in exile, many Palestinian writers have produced powerful works about their experience." },
      { word: "migration", definition: "The movement of people from one place to another.", example: "The migration of skilled Jordanian professionals to Gulf countries has shaped the country's economy." },
      { word: "refugee", definition: "A person who has been forced to leave their country to escape war or danger.", example: "UNRWA schools in Jordan provide education for thousands of Palestinian refugee children." },
    ],
  },
  {
    word: "Entrepreneurship",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌɒn.trə.prəˈnɜː.ʃɪp/",
    meaning: "The activity of starting and running a business, especially one that involves taking financial risks and creating new ideas.",
    example: "Young entrepreneurs in Amman are using technology to create apps that solve real problems for Jordanian families.",
    cultural: "Jordan has a thriving entrepreneurial spirit, especially among its young people. In the co-working spaces of Abdali and the startup incubators at the University of Jordan and JUST, young Jordanians and Palestinians are building businesses that range from food delivery apps to solar energy solutions. Palestinian refugees, who often arrived with nothing, have historically been among the most entrepreneurial communities in the Middle East — opening shops, restaurants, and factories that strengthened Jordan's economy. Islamic tradition honours honest trade and hard work, and the Prophet Muhammad (peace be upon him) himself was a merchant. This spirit of enterprise continues to drive innovation across the kingdom.",
    relatedWords: [
      { word: "startup", definition: "A newly established business, often in the technology sector.", example: "The startup founded by two JUST graduates now provides clean water solutions to villages in southern Jordan." },
      { word: "innovation", definition: "A new idea, method, or product that brings positive change.", example: "Innovation in Jordan's agricultural sector has helped farmers grow more food with less water." },
      { word: "venture", definition: "A new business project or activity that involves risk.", example: "Opening a traditional kunafa shop near Rainbow Street was a bold venture that paid off." },
      { word: "enterprise", definition: "A project or business, especially one that is bold and new.", example: "Social enterprises in Jordan are creating jobs while solving community problems." },
      { word: "initiative", definition: "A new plan or action taken to solve a problem or improve a situation.", example: "The government's initiative to support young entrepreneurs has funded over five hundred new businesses." },
    ],
  },
  {
    word: "Nostalgia",
    partOfSpeech: "(Noun)",
    phonetic: "/nɒˈstæl.dʒə/",
    meaning: "A feeling of pleasure and slight sadness when thinking about happy times and places from the past.",
    example: "The smell of fresh za'atar bread fills my grandmother with nostalgia for the mornings she spent in her family's kitchen in Nablus.",
    cultural: "Nostalgia, or 'Haneen' in Arabic, is a gentle ache that many Palestinians and Jordanians know well. For Palestinians, nostalgia is woven into the fabric of daily life — in the old songs played on the radio, in the stories grandparents tell about olive groves and stone houses, in the keys still kept in drawers. For Jordanians who grew up in older neighbourhoods before the rapid modernisation of Amman, nostalgia lives in memories of playing in the streets of Jabal Amman, buying ka'ak from the baker, and visiting family in the countryside. Nostalgia is not a weakness; it is a way of staying connected to who we are and where we come from. It reminds us that what matters most is often the simplest moments.",
    relatedWords: [
      { word: "memory", definition: "Something remembered from the past.", example: "The old family photographs bring back warm memories of Eid celebrations in Salt." },
      { word: "longing", definition: "A deep feeling of wanting something or someone.", example: "There is always a longing for the homeland that lives in the hearts of the diaspora." },
      { word: "sentimental", definition: "Having strong feelings of love, sadness, or nostalgia about the past.", example: "My father gets sentimental whenever he hears the old Palestinian folk songs his mother used to sing." },
      { word: "reminisce", definition: "To think and talk about happy experiences from the past.", example: "On quiet evenings, the family sits together to reminisce about summers spent in Aqaba." },
      { word: "cherish", definition: "To protect and care for something lovingly; to hold something dear.", example: "The embroidered dress from Teta is a cherished piece of family history." },
    ],
  },
  {
    word: "Bilingualism",
    partOfSpeech: "(Noun)",
    phonetic: "/baɪˈlɪŋ.ɡwə.lɪ.zəm/",
    meaning: "The ability to speak and use two languages fluently in everyday life.",
    example: "Bilingualism is a great advantage for Jordanian graduates seeking careers in international companies and organisations.",
    cultural: "Bilingualism is increasingly common and valued in Jordan, where Arabic and English coexist in education, business, and daily life. Many Jordanian students learn English from a young age, and by the time they reach university, they are comfortable switching between Arabic and English — sometimes even within the same sentence. For Palestinians in Jordan, Arabic is the language of home and heritage, while English opens doors to higher education and global careers. Being bilingual allows Jordanians to engage with the wider world while staying rooted in their own culture. The Nibras English project itself is a celebration of bilingualism, empowering Arabic speakers to master English without losing their identity.",
    relatedWords: [
      { word: "fluent", definition: "Able to speak a language easily and correctly.", example: "After two years of practice, Sara became fluent in English and could give presentations confidently." },
      { word: "proficient", definition: "Competent and skilled in doing something.", example: "Aiming to become proficient in English is a worthy goal for any student in Jordan." },
      { word: "multilingual", definition: "Able to speak or use several languages.", example: "In Jordan's diverse communities, it is common to meet people who are multilingual." },
      { word: "translate", definition: "To change words from one language into another.", example: "Translating a poem from Arabic to English requires both skill and cultural understanding." },
      { word: "accent", definition: "A distinctive way of pronouncing a language.", example: "Each region in Jordan has its own accent, but the English spoken by Jordanian professionals is clear and professional." },
    ],
  },
  {
    word: "Preservation",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌprez.əˈveɪ.ʃən/",
    meaning: "The act of keeping something in its original state, or protecting something from harm or decay.",
    example: "The preservation of Petra's ancient carvings ensures that future generations can witness this wonder of the world.",
    cultural: "Preservation is a vital concern in Jordan, a country that serves as a guardian of some of the world's most important historical sites. The ancient city of Petra, the Roman ruins of Jerash, the mosaics of Madaba, and the desert castles all require careful preservation. For Palestinians, cultural preservation takes many forms — keeping the Arabic language alive, practising traditional embroidery, cooking the recipes of grandmothers, and teaching children the history of their homeland. In Amman, efforts to preserve the old architecture of Jabal Amman and the cultural heritage of the downtown area show how much Jordanians value their past. Preservation is not about living in the past; it is about carrying it forward with pride.",
    relatedWords: [
      { word: "conserve", definition: "To protect something from harm, decay, or waste.", example: "Jordan's efforts to conserve water are essential in one of the world's driest countries." },
      { word: "safeguard", definition: "To protect something important from loss or damage.", example: "Programmes in Jordanian schools safeguard traditional music and dance from being forgotten." },
      { word: "restore", definition: "To repair or return something to its original good condition.", example: "The restored Ottoman buildings in downtown Salt are now a popular tourist attraction." },
      { word: "maintain", definition: "To keep something in good condition or at the same level.", example: "Maintaining close family ties is a priority for Jordanian families, no matter how busy life gets." },
      { word: "heritage", definition: "Cultural traditions and objects passed down through generations.", example: "The heritage of Palestinian embroidery is kept alive by women's cooperatives across Jordan." },
    ],
  },
  {
    word: "Empowerment",
    partOfSpeech: "(Noun)",
    phonetic: "/ɪmˈpaʊ.ər.mənt/",
    meaning: "The process of giving people the confidence, authority, and power to take control of their own lives and make decisions.",
    example: "English language education is a form of empowerment that opens doors to opportunities for young people across Jordan.",
    cultural: "Empowerment is transforming Jordan, particularly for women and young people. Jordanian women are increasingly visible in every profession — from engineering and medicine to business and politics. Queen Rania has been a powerful advocate for girls' education and women's empowerment, inspiring a generation of young Jordanian women to pursue their dreams. In Palestinian refugee camps in Jordan, education has been the greatest tool of empowerment — turning children of refugees into doctors, engineers, and teachers. Islamic teaching empowers both men and women to seek knowledge, and Jordan's universities are filled with ambitious students who believe that education is the key to shaping their own futures.",
    relatedWords: [
      { word: "confidence", definition: "The feeling of being certain about your abilities and decisions.", example: "Learning English gave Dina the confidence to apply for a job at an international company in Amman." },
      { word: "enable", definition: "To give someone the ability, means, or opportunity to do something.", example: "Scholarships enable talented students from low-income families to attend the best universities." },
      { word: "strength", definition: "The quality of being physically or mentally strong.", example: "The inner strength of Palestinian women who raise families under difficult conditions is extraordinary." },
      { word: "capability", definition: "The ability or power to do something.", example: "Jordanian youth have the capability to lead the region in technology and innovation." },
      { word: "uplift", definition: "To raise someone to a higher standard or level.", example: "Community education programmes uplift entire families by giving them skills and hope." },
    ],
  },
  {
    word: "Sustainable",
    partOfSpeech: "(Adjective)",
    phonetic: "/səˈsteɪ.nə.bəl/",
    meaning: "Able to continue over a long period of time without using up natural resources or causing harm to the environment.",
    example: "Jordan is investing in sustainable farming methods to make better use of its limited water supply.",
    cultural: "Sustainability is not a new concept in Jordan and Palestine — it has been a way of life for centuries. Traditional Palestinian farming practices, such as terracing hillsides to prevent soil erosion and collecting rainwater in cisterns, were sustainable long before the word became popular. In Jordan, one of the world's most water-scarce countries, sustainability is a matter of survival. Projects in the Jordan Valley use drip irrigation to grow crops with minimal water. Solar panels are appearing on rooftops across Amman. The Dana Nature Reserve and the Mujib Biosphere Reserve protect Jordan's incredible biodiversity. Islamic teaching reminds us that the Earth is a trust, and we must care for it responsibly.",
    relatedWords: [
      { word: "renewable", definition: "Able to be replaced naturally or using methods that do not harm the environment.", example: "Jordan is increasing its use of renewable energy, especially solar power from the southern desert." },
      { word: "conservation", definition: "The protection of nature, animals, and natural resources.", example: "Conservation efforts in Dana Nature Reserve protect rare species of plants and birds." },
      { word: "eco-friendly", definition: "Not harmful to the environment.", example: "More shops in Amman are switching to eco-friendly bags and packaging." },
      { word: "organic", definition: "Produced without artificial chemicals or fertilisers.", example: "Organic olive oil from the hills of Ajloun is becoming popular in Jordanian markets." },
      { word: "stewardship", definition: "The responsibility of taking care of something valuable.", example: "Good stewardship of water resources is one of Jordan's most important national challenges." },
    ],
  },
  {
    word: "Authenticity",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌɔː.θenˈtɪs.ə.ti/",
    meaning: "The quality of being genuine, real, and true to one's own character, culture, or traditions.",
    example: "The authenticity of the handmade Palestinian embroidery cannot be replicated by any machine.",
    cultural: "Authenticity is treasured in Jordanian and Palestinian culture. When a Jordanian family serves mansaf using a recipe passed down through four generations, that authenticity is something money cannot buy. The old souks of Amman, with their handwritten signs and family-run stalls, are more authentic — and beloved — than any modern shopping mall. In Palestinian culture, authenticity is a matter of identity — speaking the dialect of one's village, cooking the food of one's region, wearing the embroidery patterns of one's family. In a globalised world, Jordanians and Palestinians work hard to keep their culture authentic, resisting the pressure to water down traditions for outside audiences.",
    relatedWords: [
      { word: "genuine", definition: "Real and exactly what it appears to be; not false or copied.", example: "The genuine warmth of a Jordanian greeting — a handshake, a cup of coffee, a smile — cannot be faked." },
      { word: "original", definition: "Existing from the beginning; not a copy.", example: "The original recipe for Nabulsi kunafa has been passed down through generations of Palestinian bakers." },
      { word: "traditional", definition: "Following customs and practices that have existed for a long time.", example: "Traditional Jordanian weddings include the zaffe — a lively procession with music and dancing." },
      { word: "sincere", definition: "Genuine, honest, and free from pretence.", example: "The sincere hospitality of a Palestinian family makes every guest feel truly welcome." },
      { word: "heritage", definition: "Valued traditions and objects passed down from ancestors.", example: "Protecting the heritage of old Palestinian embroidery is a labour of love for many women in Jordan." },
    ],
  },
  {
    word: "Intergenerational",
    partOfSpeech: "(Adjective)",
    phonetic: "/ˌɪn.təˌdʒen.əˈreɪ.ʃən.əl/",
    meaning: "Relating to or involving people from different generations, especially between parents, children, and grandparents.",
    example: "The intergenerational bond between Palestinian grandparents and their grandchildren keeps the stories of the homeland alive.",
    cultural: "Intergenerational relationships are the foundation of Jordanian and Palestinian families. It is common for three generations to live together or in the same neighbourhood, sharing meals, celebrations, and daily life. Grandparents — known affectionately as 'Teta' and 'Jiddo' — play a central role in raising children, teaching them Arabic, telling them stories of Palestine, and passing on the values of faith, respect, and hospitality. In return, younger generations care for their elders in old age, a duty that is both a cultural norm and an Islamic teaching. The intergenerational transfer of language, recipes, proverbs, and history is what keeps Jordanian and Palestinian culture alive and vibrant.",
    relatedWords: [
      { word: "generation", definition: "All people born and living at about the same time.", example: "The younger generation of Jordanians is using technology to share their culture with the world." },
      { word: "elder", definition: "An older person who is respected in a community for their wisdom.", example: "The village elder was asked to settle the disagreement between the two families." },
      { word: "ancestor", definition: "A person from whom one is descended, especially one who lived long ago.", example: "The ancestors of many Palestinian families in Jordan came from villages near Jerusalem and Hebron." },
      { word: "descendant", definition: "A person who is related to someone who lived a long time ago.", example: "The descendants of the Nabataean builders of Petra would be amazed to see how many visitors come today." },
      { word: "legacy", definition: "Something passed down from the past, such as values or achievements.", example: "The legacy of Palestinian storytellers lives on in the children who repeat their tales." },
    ],
  },
  {
    word: "Storytelling",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈstɔː.riˌtel.ɪŋ/",
    meaning: "The activity of telling stories, often as a way to share history, culture, and values with others.",
    example: "Teta Fatima's storytelling kept the children in the family captivated every evening with tales of old Palestine.",
    cultural: "Storytelling, or 'Hakawati' in Arabic, is an ancient and honoured tradition in Jordan and Palestine. Before television and smartphones, the Hakawati — the village storyteller — would gather people in the evenings to share tales of heroes, love, and wisdom. In Palestinian families, storytelling is how history is preserved: the story of the village, the journey from the homeland, the olive trees that once belonged to the family. In Jordan, the tradition continues through poetry readings, music, and even modern media. Islamic tradition itself is rich with storytelling — the Quran uses parables to teach lessons, and the Hadith is full of stories from the life of the Prophet Muhammad (peace be upon him).",
    relatedWords: [
      { word: "narrative", definition: "A spoken or written account of connected events; a story.", example: "The Palestinian narrative is one of displacement, resilience, and enduring hope." },
      { word: "folklore", definition: "The traditional stories, customs, and beliefs of a community.", example: "Jordanian folklore includes stories about the Bedouin, desert travellers, and ancient kings." },
      { word: "tale", definition: "A story, often one that is told by word of mouth.", example: "The tale of the clever merchant who outsmarted a thief is a favourite among Jordanian children." },
      { word: "legend", definition: "A famous story from the past that may not be entirely true but is widely believed.", example: "The legend of the lost city of Petra fascinates historians and visitors alike." },
      { word: "oral", definition: "Spoken rather than written.", example: "Oral history projects in Jordan are recording the memories of elderly Palestinians before they are lost." },
    ],
  },
  {
    word: "Adaptability",
    partOfSpeech: "(Noun)",
    phonetic: "/əˌdæp.təˈbɪl.ə.ti/",
    meaning: "The ability to adjust to new conditions, environments, or situations quickly and effectively.",
    example: "Jordan's adaptability in welcoming refugees from neighbouring countries has shown the world the true meaning of generosity.",
    cultural: "Adaptability is a survival skill that Jordanians and Palestinians have mastered over decades. Palestinians who arrived in Jordan as refugees had to adapt to a new country, new schools, and new systems — and they did so with remarkable resilience and resourcefulness. Jordan itself has adapted to waves of refugees, economic changes, and water scarcity, always finding solutions. In the tech sector, young Jordanians adapt quickly to new tools and platforms, building startups that compete on a global level. Islamic teaching encourages believers to be flexible and to trust in God's plan even when circumstances change. Adaptability is not about losing who you are — it is about finding new ways to thrive.",
    relatedWords: [
      { word: "flexible", definition: "Able to change or be changed easily to suit different conditions.", example: "Flexible study schedules at the University of Jordan help students who also work part-time." },
      { word: "versatile", definition: "Able to do many different things well; having many skills.", example: "Jordanian graduates are versatile, able to work in Arabic, English, and sometimes French." },
      { word: "resourceful", definition: "Good at finding solutions to problems using whatever is available.", example: "Palestinian families have always been resourceful, turning limited ingredients into delicious feasts." },
      { word: "innovative", definition: "Using new methods or ideas to create something new or better.", example: "Innovative farming techniques are helping Jordanian farmers grow more food with less water." },
      { word: "resilient", definition: "Able to recover quickly from difficult conditions.", example: "The resilient people of Gaza continue to rebuild their lives despite repeated devastation." },
    ],
  },
  {
    word: "Reconciliation",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌrek.ənˌsɪl.iˈeɪ.ʃən/",
    meaning: "The restoration of friendly relationships after a disagreement or conflict; the process of making peace.",
    example: "Community leaders in Jordan work towards reconciliation between families during times of disagreement, guided by both tradition and Islamic values.",
    cultural: "Reconciliation, or 'Sulh' in Arabic, is an important concept in both traditional Arab culture and Islamic teaching. In Jordanian villages and Palestinian communities, conflicts between families are often resolved through a process called 'Sulh,' where respected elders mediate between the parties and restore peace. The Prophet Muhammad (peace be upon him) taught that making peace between people is one of the greatest deeds in Islam. In Jordan, a country that has welcomed people from many backgrounds, the ability to reconcile differences and live together in harmony is essential. The dream of reconciliation and a just peace is one that Palestinians and their supporters hold close to their hearts.",
    relatedWords: [
      { word: "harmony", definition: "A state of peaceful existence and agreement between people.", example: "The harmony between Muslims and Christians in Jordan is a model of coexistence for the region." },
      { word: "mediation", definition: "The process of helping two sides in a dispute reach an agreement.", example: "The village sheikh's mediation resolved the dispute between the two farming families peacefully." },
      { word: "forgiveness", definition: "The act of stopping blaming someone for something they have done wrong.", example: "Islam teaches that forgiveness is a noble quality that brings peace to both parties." },
      { word: "peace", definition: "Freedom from war, conflict, or disturbance.", example: "People across Jordan and Palestine pray for peace and justice every single day." },
      { word: "restore", definition: "To bring something back to its original good condition.", example: "The community event helped restore the warm relationship between the two neighbouring families." },
    ],
  },
  {
    word: "Innovation",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌɪn.əˈveɪ.ʃən/",
    meaning: "A new idea, method, product, or way of doing something that brings improvement or change.",
    example: "Jordanian engineers are leading innovation in water conservation technology, helping the country manage its scarce water resources.",
    cultural: "Innovation is alive and well in Jordan, a country that has turned challenges into opportunities. From cutting-edge water recycling plants in Amman to solar energy farms in the southern desert, Jordanians are finding innovative solutions to real problems. The startup ecosystem in Jordan is one of the most vibrant in the Arab world, with young entrepreneurs developing apps for education, healthcare, and agriculture. Palestinian innovators in Jordan have contributed significantly to fields like medicine, engineering, and information technology. Islamic civilisation has a long history of innovation — from algebra to optics — and today's Jordanian youth are continuing that proud tradition by thinking creatively and building for the future.",
    relatedWords: [
      { word: "creative", definition: "Having the ability to produce new and original ideas.", example: "Creative approaches to teaching English make learning more enjoyable for students at Al al-Bayt University." },
      { word: "breakthrough", definition: "A sudden or important discovery or development.", example: "The breakthrough in water desalination technology could transform agriculture in the Jordan Valley." },
      { word: "pioneer", definition: "A person who is among the first to do something or explore a new area.", example: "Dr. Rana was a pioneer in developing Arabic-language educational software for children." },
      { word: "inventive", definition: "Having the ability to create or design new things.", example: "The inventive young engineers at JUST designed a low-cost device to help farmers monitor soil moisture." },
      { word: "transform", definition: "To change something completely, often in a positive way.", example: "Technology has the power to transform education in underserved communities across Jordan." },
    ],
  },
  {
    word: "Advocacy",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈæd.və.kə.si/",
    meaning: "Public support for a particular cause, policy, or group of people; speaking up to defend the rights of others.",
    example: "Human rights advocacy has been crucial in raising global awareness about the situation in Gaza and the West Bank.",
    cultural: "Advocacy plays an important role in Jordanian and Palestinian society. Jordanian civil society organisations advocate for women's rights, children's education, environmental protection, and the rights of refugees. Palestinian advocacy on the global stage has been instrumental in keeping the world's attention on the issues of occupation, displacement, and the right to self-determination. In Jordan, journalists, teachers, and community leaders often serve as advocates for their communities, raising awareness about poverty, water scarcity, and access to education. Islam encourages standing up for justice — the Quran repeatedly commands believers to defend the oppressed and speak the truth, a value that fuels advocacy efforts across the country.",
    relatedWords: [
      { word: "campaign", definition: "An organised series of actions to achieve a specific goal.", example: "The campaign to raise funds for clean water in Mafraq received support from across Jordan." },
      { word: "defend", definition: "To protect someone or something from harm or attack.", example: "Human rights lawyers work to defend the rights of vulnerable communities in Jordan." },
      { word: "awareness", definition: "Knowledge or understanding of a particular subject or issue.", example: "Environmental awareness is growing among young Jordanians, who are leading recycling initiatives." },
      { word: "justice", definition: "Fairness, the quality of being reasonable and right.", example: "The pursuit of justice for the Palestinian people is a cause that unites millions around the world." },
      { word: "represent", definition: "To speak or act on behalf of someone else or a group.", example: "The student council represents the voices of thousands of students at the University of Jordan." },
    ],
  },
  {
    word: "Stewardship",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈstjuː.əd.ʃɪp/",
    meaning: "The responsible management and protection of something valuable, such as the environment, resources, or cultural heritage.",
    example: "Good stewardship of Jordan's water resources is essential for the country's future, as it is one of the most water-scarce nations on Earth.",
    cultural: "Stewardship resonates deeply with Islamic and Arab values. The Quran teaches that humans are 'khalifa' — stewards or caretakers — of the Earth, responsible for protecting it for future generations. In Jordan, this sense of stewardship is visible in the care given to natural wonders like Wadi Rum, the Dead Sea, and the forests of Ajloun. Palestinian farmers have been stewards of their land for centuries, practicing agriculture that respects the soil and the seasons. Community organisations in Jordan practice stewardship by cleaning public spaces, planting trees, and teaching children to love and protect their environment. Stewardship is both a duty and a form of worship, reminding us that the Earth is a gift to be cherished.",
    relatedWords: [
      { word: "guardianship", definition: "The responsibility of protecting and caring for something.", example: "The guardianship of Petra is entrusted to Jordanians who work to protect its ancient monuments." },
      { word: "responsibility", definition: "A duty to take care of something or someone.", example: "It is our responsibility to reduce waste and protect the environment for future generations." },
      { word: "caretaker", definition: "A person responsible for looking after something or someone.", example: "Jordanian farmers see themselves as caretakers of the land, not just its users." },
      { word: "protect", definition: "To keep someone or something safe from harm or damage.", example: "Efforts to protect the Dead Sea from further shrinkage are a national priority for Jordan." },
      { word: "conserve", definition: "To prevent something from being wasted, lost, or destroyed.", example: "Jordanians are learning to conserve water at home through simple daily actions like shorter showers." },
    ],
  },
  {
    word: "Pragmatics",
    partOfSpeech: "(Noun)",
    phonetic: "/præɡˈmæt.ɪks/",
    meaning: "The branch of linguistics that studies how context influences the meaning of language — how people use words in real-life situations.",
    example: "Understanding pragmatics helps English learners in Jordan know when to use formal or informal language in different situations.",
    cultural: "Pragmatics is especially important for Jordanian Arabic speakers learning English, because what you say is often less important than how and when you say it. In Jordanian culture, the same greeting can carry different meanings depending on the context — a casual 'kefak' with a friend, a formal 'marhaba' to an elder, or a warm 'ya hala' to a guest. When Jordanians switch to English, understanding pragmatics helps them navigate unfamiliar social situations, such as addressing a university professor, making a phone call to a business, or chatting with an international colleague. The Nibras English project teaches learners not just words and grammar, but how to use English appropriately in the contexts they will actually encounter.",
    relatedWords: [
      { word: "context", definition: "The circumstances or situation in which something happens or exists.", example: "In a Jordanian workplace, using formal Arabic with your boss shows respect, but using it with close colleagues might feel too distant." },
      { word: "nuance", definition: "A subtle difference in meaning, expression, or sound.", example: "The nuances of English politeness — like saying 'could you' instead of 'can you' — are important in professional settings." },
      { word: "register", definition: "A level of language formality appropriate to a social situation.", example: "Shifting from casual Arabic with friends to formal English in a job interview requires knowing the right register." },
      { word: "tone", definition: "The quality or character of a voice or piece of writing that expresses attitude.", example: "The tone of an English email to a professor should be more formal than one to a friend." },
      { word: "implication", definition: "Something that is suggested or understood without being directly stated.", example: "In both Arabic and English, the implication behind a polite refusal is often clearer than the words themselves." },
    ],
  },
  {
    word: "Vernacular",
    partOfSpeech: "(Noun/Adjective)",
    phonetic: "/vəˈnæk.jʊ.lər/",
    meaning: "The language or dialect spoken by ordinary people in a particular region, as opposed to the formal or literary language.",
    example: "The Jordanian vernacular is full of warmth and humour that formal Arabic does not always capture.",
    cultural: "The vernacular Arabic spoken in Jordan is rich, expressive, and constantly evolving. In the streets of Amman, the vernacular blends Palestinian, Bedouin, and Jordanian dialects into a unique linguistic mix that is both charming and practical. The vernacular is where the heart of the culture lives — in the proverbs, the jokes, the lullabies, and the everyday conversations over coffee. Palestinian vernacular, brought to Jordan by refugee communities, has enriched the local language with expressions and words from the cities and villages of Palestine. For English learners, understanding the vernacular helps them appreciate the depth of Arabic while recognising when to use formal or informal English in their own communication.",
    relatedWords: [
      { word: "dialect", definition: "A form of a language spoken in a particular area.", example: "The dialect spoken in Irbid sounds slightly different from the one used in Amman." },
      { word: "colloquial", definition: "Used in everyday, informal conversation.", example: "Colloquial expressions like 'yalla' and 'inshallah' are used by Jordanians dozens of times a day." },
      { word: "slang", definition: "Very informal language used by a particular group.", example: "Jordanian young people have their own slang that changes with each generation." },
      { word: "idiom", definition: "A phrase whose meaning is different from the individual words.", example: "The Arabic idiom 'placing water on the tongue' means to soothe someone's anger." },
      { word: "expression", definition: "A word or phrase that communicates a particular meaning.", example: "'Wallah' is an expression used to emphasise the truth of what someone is saying." },
    ],
  },
  {
    word: "Juxtaposition",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌdʒʌk.stə.pəˈzɪʃ.ən/",
    meaning: "The fact of placing two or more things side by side to highlight their differences or create a striking contrast.",
    example: "The juxtaposition of ancient Roman ruins and modern cafes in downtown Amman creates a uniquely beautiful cityscape.",
    cultural: "Jordan is a land of juxtaposition — and this is what makes it so fascinating. In Amman, ancient Roman columns stand beside gleaming glass towers, and traditional markets operate just streets away from luxury shopping malls. The juxtaposition of Bedouin desert culture and high-tech startup culture shows how Jordan bridges past and future. In Palestinian communities, the juxtaposition of loss and hope, of displacement and belonging, tells a powerful story of human resilience. The Dead Sea and the lush hills of Ajloun exist side by side within the same small country. These juxtapositions are not contradictions — they are the layers that make Jordan's cultural landscape so rich and worth exploring.",
    relatedWords: [
      { word: "contrast", definition: "A noticeable difference between two things when they are compared.", example: "The contrast between the quiet ancient city of Jerash and the busy streets of Amman is striking." },
      { word: "diversity", definition: "The variety of different people, cultures, and ideas within a society.", example: "Jordan's diversity — from Circassians to Chechens to Palestinians — is one of its greatest strengths." },
      { word: "blend", definition: "To mix different things together to create something new.", example: "Jordanian cuisine is a delicious blend of Palestinian, Bedouin, Syrian, and other regional influences." },
      { word: "harmony", definition: "A pleasing combination of different elements.", example: "The harmony between old and new in the city of Salt makes it a UNESCO World Heritage Site." },
      { word: "parallel", definition: "Two things that are similar or happen at the same time but in different places.", example: "There are interesting parallels between Jordanian and Palestinian wedding traditions." },
    ],
  },
  {
    word: "Cosmopolitan",
    partOfSpeech: "(Adjective)",
    phonetic: "/ˌkɒz.məˈpɒl.ɪ.tən/",
    meaning: "Including people and ideas from many different countries and cultures; familiar with and open to the world.",
    example: "Amman has become a cosmopolitan city where Arab traditions blend seamlessly with international culture and modern ideas.",
    cultural: "Amman is one of the most cosmopolitan cities in the Arab world, and this is one of its greatest strengths. Walk through the streets of the capital and you will hear Jordanian Arabic, Palestinian Arabic, English, French, and Circassian. Restaurants serve everything from traditional mansaf to international cuisine. The city hosts international film festivals, art exhibitions, tech conferences, and academic forums that attract participants from around the world. Yet for all its cosmopolitan character, Amman remains deeply rooted in Arab values — family, faith, hospitality, and respect for tradition. This balance between openness and rootedness is what makes Amman such a special place to live and learn.",
    relatedWords: [
      { word: "global", definition: "Relating to or affecting the whole world.", example: "The University of Jordan attracts students from around the region, creating a truly global learning environment." },
      { word: "diverse", definition: "Including many different types of people or things.", example: "Jordan's diverse population is united by shared values of hospitality and mutual respect." },
      { word: "metropolitan", definition: "Relating to a large, busy city and the area around it.", example: "Greater Amman is a growing metropolitan area that includes historic neighbourhoods and modern developments." },
      { word: "international", definition: "Relating to or involving more than one country.", example: "Jordan's international reputation for stability and education makes it a hub for regional conferences." },
      { word: "worldly", definition: "Having wide experience and knowledge of people and the world.", example: "The worldly perspective of Jordanian diplomats has helped the country navigate complex regional politics." },
    ],
  },
  {
    word: "Eloquence",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈel.ə.kwəns/",
    meaning: "The ability to speak or write fluently, persuasively, and beautifully; the art of using language with grace and power.",
    example: "The eloquence of Palestinian poet Mahmoud Darwish gave voice to the feelings of an entire people.",
    cultural: "Eloquence has always been prized in Arab culture. The pre-Islamic poets of Arabia were celebrated for their eloquent verses, and the Quran itself is considered the pinnacle of Arabic eloquence — a miracle of language. In Jordan and Palestine, eloquence lives on in the poetry recited at gatherings, the speeches given at universities, and the sermons delivered in mosques. Palestinian poets like Mahmoud Darwish used eloquence to express the pain, love, and hope of their people. For English learners in Jordan, developing eloquence in English is a worthy goal — it is not just about using big words, but about communicating ideas clearly, persuasively, and beautifully, whether in a classroom, a boardroom, or a community meeting.",
    relatedWords: [
      { word: "articulate", definition: "Able to express ideas clearly and effectively in speech or writing.", example: "The articulate student from JUST impressed the interview panel with her thoughtful answers." },
      { word: "persuasive", definition: "Good at convincing someone to do or believe something.", example: "A persuasive argument in an English essay requires clear logic and good evidence." },
      { word: "rhetoric", definition: "The art of effective or persuasive speaking or writing.", example: "The rhetoric of justice and equality has been central to speeches by Arab leaders and activists." },
      { word: "expressive", definition: "Clearly showing feeling or meaning.", example: "Arabic is an incredibly expressive language — a single word can carry layers of emotion." },
      { word: "fluency", definition: "The ability to speak or write a language easily and smoothly.", example: "Achieving fluency in English takes time, but each day of practice brings you closer." },
    ],
  },
  {
    word: "Diplomacy",
    partOfSpeech: "(Noun)",
    phonetic: "/dɪˈpləʊ.mə.si/",
    meaning: "The art of managing international relations through negotiation and dialogue; skill in handling sensitive situations tactfully.",
    example: "Jordan's diplomacy has made it a trusted mediator in regional conflicts, promoting peace and dialogue.",
    cultural: "Jordan has long been a voice of diplomacy in the Middle East. From the late King Hussein to King Abdullah II, Jordan's leaders have worked tirelessly to promote peace, dialogue, and cooperation in a region often marked by conflict. Jordan's diplomatic role includes hosting peace talks, advocating for Palestinian rights on the world stage, and welcoming refugees from neighbouring countries. For Jordanians, diplomacy is not just a government function — it is a cultural value. The Arab tradition of 'diyafa' — hospitality — is itself a form of diplomacy, as hosting guests and neighbours with warmth creates bonds of trust and respect. In daily life, Jordanians practise personal diplomacy by navigating complex social situations with tact and grace.",
    relatedWords: [
      { word: "negotiation", definition: "Formal discussion between parties to reach an agreement.", example: "The negotiation skills of Jordanian diplomats helped bring multiple parties to the peace table." },
      { word: "mediation", definition: "The process of helping two opposing sides reach an agreement.", example: "Jordan has offered mediation between neighbouring countries on several important occasions." },
      { word: "tactful", definition: "Showing sensitivity in dealing with others or difficult situations.", example: "A tactful response to a difficult question is a skill that takes practice to develop." },
      { word: "ambassador", definition: "A person who represents their country in a foreign nation.", example: "Jordanian ambassadors around the world promote the kingdom's culture, tourism, and values." },
      { word: "dialogue", definition: "A conversation between two or more people or groups to exchange views.", example: "Open dialogue between communities in Jordan helps build understanding and mutual respect." },
    ],
  },
  {
    word: "Philanthropy",
    partOfSpeech: "(Noun)",
    phonetic: "/fɪˈlæn.θrə.pi/",
    meaning: "The desire to promote the welfare of others, expressed especially by the donation of money, time, or resources to good causes.",
    example: "Islamic philanthropy, including zakat and charity, plays a vital role in supporting families in need across Jordan.",
    cultural: "Philanthropy is deeply embedded in Islamic culture and Jordanian society. 'Zakat,' one of the five pillars of Islam, requires Muslims to give a portion of their wealth to those in need, and 'Sadaqah' — voluntary charity — is encouraged at every opportunity. During Ramadan, mosques and community organisations across Amman, Irbid, and Aqaba collect food, clothing, and money for families struggling with poverty. Jordan's royal family is known for its philanthropic work, particularly in education and healthcare. Palestinian communities have a strong tradition of mutual aid, with neighbours and families supporting each other through difficult times. Philanthropy in Jordan is not just about giving money — it is about giving time, skills, and heart to uplift the community.",
    relatedWords: [
      { word: "charity", definition: "The voluntary giving of help, typically in the form of money, to those in need.", example: "The charity organisation in Sweifieh provides free tutoring for children from low-income families." },
      { word: "benefactor", definition: "A person who gives money or other help to a person or cause.", example: "The anonymous benefactor donated funds to build a new library at a school in Mafraq." },
      { word: "donation", definition: "Something that is given to a person or organisation to help them.", example: "During the winter, many Jordanian families donate blankets and warm clothing to refugees." },
      { word: "altruism", definition: "The selfless concern for the well-being of others.", example: "The altruism of doctors who volunteer in remote villages shows the best of Jordanian spirit." },
      { word: "endowment", definition: "A donation of money or property to support an institution or cause.", example: "The endowment fund at the University of Jordan provides scholarships for talented students from across the kingdom." },
    ],
  },
  {
    word: "Bureaucracy",
    partOfSpeech: "(Noun)",
    phonetic: "/bjʊˈrɒk.rə.si/",
    meaning: "A system of government or organisational administration managed by officials who follow complex rules and procedures.",
    example: "Navigating the bureaucracy of university admissions can be challenging, but the staff at JUST are always helpful to new students.",
    cultural: "Bureaucracy is a familiar concept for anyone who has dealt with government offices, universities, or large organisations in Jordan. Whether registering for courses at the University of Jordan, applying for a business licence in Amman, or processing documents at a government ministry, Jordanians have learned to navigate administrative systems with patience and good humour. For Palestinian refugees, bureaucracy can be even more complex — dealing with UNRWA, residency permits, and travel documents requires resilience and resourcefulness. Despite these challenges, Jordanians have developed a remarkable ability to work within bureaucratic systems while also finding creative solutions. Understanding how bureaucracy works is a practical skill that helps in both professional and everyday life.",
    relatedWords: [
      { word: "administration", definition: "The process of managing the operations of an organisation or government.", example: "The administration at the University of Jordan streamlined the registration process to make it faster for students." },
      { word: "procedure", definition: "An established or official way of doing something.", example: "The procedure for obtaining a student visa requires several documents and forms." },
      { word: "regulation", definition: "An official rule or law that controls how something is done.", example: "New regulations on building codes in Amman aim to make the city safer and more organised." },
      { word: "document", definition: "An official paper that provides information or proof of something.", example: "Having all the necessary documents ready before visiting the government office saves a lot of time." },
      { word: "red tape", definition: "Excessive bureaucracy or official rules that slow down processes.", example: "Reducing red tape for small businesses has been a priority for Jordan's economic reform programme." },
    ],
  },
  {
    word: "Displacement",
    partOfSpeech: "(Noun)",
    phonetic: "/dɪˈspleɪs.mənt/",
    meaning: "The forced removal of people from their homes or homeland, often due to conflict, war, or persecution.",
    example: "The displacement of Palestinians in 1948 created one of the longest-standing refugee situations in modern history.",
    cultural: "Displacement is a word that carries immense weight in Jordan and Palestine. The Palestinian 'Nakba' of 1948 — which means 'catastrophe' — forced hundreds of thousands of Palestinians from their homes, creating a refugee crisis that continues to this day. Many of those refugees found safety in Jordan, where they were welcomed and given the opportunity to rebuild their lives. Jordan has also welcomed refugees from Syria, Iraq, and other neighbouring countries, demonstrating a commitment to human dignity that the world often admires. For Palestinians, displacement is not just a historical event — it is a living reality, carried in the keys to ancestral homes, in the stories of grandparents, and in the unwavering hope of return.",
    relatedWords: [
      { word: "refugee", definition: "A person who has been forced to leave their country to escape danger.", example: "Jordan hosts one of the largest refugee populations in the world relative to its size." },
      { word: "exile", definition: "The state of being away from one's home country, often unwillingly.", example: "Life in exile shaped the identity of an entire generation of Palestinians." },
      { word: "asylum", definition: "Protection given by a country to someone who has left their own country for safety.", example: "Jordan's long history of providing asylum to those fleeing conflict is a point of national pride." },
      { word: "uprooted", definition: "Forced to leave one's home or familiar surroundings.", example: "The uprooted olive trees of Palestinian villages have become a powerful symbol of loss." },
      { word: "homeland", definition: "A person's or a people's native country or land.", example: "Despite living in Jordan for decades, many Palestinians still dream of returning to their homeland." },
    ],
  },
  {
    word: "Paradigm",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈpær.ə.daɪm/",
    meaning: "A typical example, pattern, or model of something; a worldview or set of assumptions that shapes how people think about a subject.",
    example: "Online learning has created a new paradigm for English education in Jordan, making quality lessons accessible to students everywhere.",
    cultural: "The concept of a paradigm shift is very relevant to Jordan and Palestine today. In education, there is a shift from rote memorisation to critical thinking and communication skills — a paradigm that Nibras English supports by focusing on real-world language use. In technology, Jordanian startups are shifting the paradigm of how services are delivered, from healthcare to agriculture. For Palestinians, the paradigm of displacement and struggle is being balanced by stories of success, innovation, and cultural pride. In Islam, seeking knowledge is a paradigm that has driven scholarship for over fourteen centuries. Understanding paradigms helps students think critically about the world and imagine new possibilities for the future.",
    relatedWords: [
      { word: "framework", definition: "A structure or set of ideas that provides a basis for understanding something.", example: "The CEFR framework helps English learners in Jordan track their progress from A1 to C2." },
      { word: "model", definition: "A system or pattern used as an example to follow or imitate.", example: "The University of Jordan serves as a model for higher education in the region." },
      { word: "perspective", definition: "A particular way of thinking about or looking at something.", example: "Living between two cultures gives bilingual Jordanians a unique perspective on the world." },
      { word: "approach", definition: "A way of dealing with something or achieving a goal.", example: "A communicative approach to language teaching helps students use English in real-life situations." },
      { word: "concept", definition: "An abstract idea or general notion.", example: "The concept of Sumud — steadfastness — is central to understanding Palestinian identity." },
    ],
  },
  {
    word: "Sociolinguistics",
    partOfSpeech: "(Noun)",
    phonetic: "/ˌsəʊ.si.oʊ.lɪŋˈɡwɪs.tɪks/",
    meaning: "The study of how language is used in society, including how social factors like culture, class, and identity affect the way people speak.",
    example: "Studying sociolinguistics helps explain why a Jordanian speaks differently at home, at the mosque, and at the university.",
    cultural: "Sociolinguistics is fascinating when applied to Jordan, where language choices carry deep social meaning. A Jordanian Palestinian might switch between their village dialect at home, Jordanian Arabic at work, and English at university — a practice called 'code-switching' that reflects complex layers of identity. In Amman, the way someone speaks can reveal their background, education, and social circle. Gender plays a role too: research shows that Jordanian women often use more formal Arabic in public settings than men. For English learners in Jordan, sociolinguistics helps explain why language is never just about words — it is about who you are, where you come from, and how you want to be perceived.",
    relatedWords: [
      { word: "code-switching", definition: "The practice of alternating between two or more languages in a conversation.", example: "Many Jordanian professionals code-switch between Arabic and English depending on who they are speaking with." },
      { word: "linguistics", definition: "The scientific study of language and its structure.", example: "The linguistics department at the University of Jordan offers courses on both Arabic and English." },
      { word: "dialect", definition: "A regional or social variety of a language.", example: "Sociolinguists study how Jordanian dialects vary between Amman, Irbid, and Aqaba." },
      { word: "multilingualism", definition: "The ability to use multiple languages in daily life.", example: "Multilingualism in Jordan's workplace gives professionals an advantage in international business." },
      { word: "discourse", definition: "Written or spoken communication or debate.", example: "The academic discourse at Jordanian universities is increasingly bilingual." },
    ],
  },
  {
    word: "Ethos",
    partOfSpeech: "(Noun)",
    phonetic: "/ˈiː.θɒs/",
    meaning: "The characteristic spirit, beliefs, and moral values of a community, culture, or organisation that guide its behaviour.",
    example: "The ethos of Jordanian culture — rooted in hospitality, faith, and community — shapes every aspect of daily life.",
    cultural: "The ethos of Jordanian and Palestinian culture is built on pillars that have endured for centuries: faith, family, hospitality, education, and Sumud — steadfastness. This ethos is not written in laws or textbooks; it is lived in every home, mosque, and community gathering. It is the mother who teaches her children to respect their elders, the neighbour who brings food during a difficult time, the student who studies late into the night to honour their family's sacrifice. Palestinian culture adds a layer of resistance and hope to this ethos — the belief that justice will come, that home is never truly lost, and that culture can survive even the greatest challenges. Islamic teaching reinforces this ethos through the values of compassion, justice, humility, and perseverance.",
    relatedWords: [
      { word: "values", definition: "Principles or standards of behaviour that are considered important.", example: "Core Jordanian values include respect for elders, generosity towards guests, and love of learning." },
      { word: "integrity", definition: "The quality of being honest and having strong moral principles.", example: "Integrity is expected of every public servant in Jordan, from teachers to government officials." },
      { word: "principle", definition: "A fundamental truth, belief, or rule that guides behaviour.", example: "The principle of treating guests with honour is a cornerstone of Arab culture." },
      { word: "tradition", definition: "A long-established custom or belief passed through generations.", example: "The tradition of gathering for Friday lunch with family reflects the communal ethos of Jordan." },
      { word: "virtue", definition: "A quality considered morally good or desirable.", example: "Patience, generosity, and honesty are virtues that Islamic teaching encourages in every aspect of life." },
    ],
  },
  {
    word: "Ephemeral",
    partOfSpeech: "(Adjective)",
    phonetic: "/ɪˈfem.ər.əl/",
    meaning: "Lasting for a very short time; temporary, fleeting, and transient.",
    example: "The wildflowers that bloom in the Jordanian desert after the spring rains are beautiful but ephemeral, lasting only a few weeks.",
    cultural: "The concept of ephemerality carries a deep philosophical meaning in both Islamic and Arab culture. The Quran reminds believers that the life of this world is temporary — 'ephemeral' — and that what truly lasts are good deeds, knowledge, and faith. In Jordan, the ephemeral beauty of the desert after rain, the brief bloom of wildflowers in Wadi Rum, or the fleeting golden light on the Treasury at Petra during sunset all remind us to appreciate the present moment. For Palestinians, the contrast between ephemeral material things and lasting cultural identity is powerful — homes may be destroyed, but the stories, recipes, and songs endure. This awareness of ephemerality encourages gratitude, mindfulness, and a focus on what truly matters.",
    relatedWords: [
      { word: "fleeting", definition: "Lasting for a very short time.", example: "The fleeting moment when the sun sets over the Dead Sea is a sight that takes your breath away." },
      { word: "transient", definition: "Lasting only for a short time; not permanent.", example: "Life's difficulties are transient, but the lessons they teach remain with us forever." },
      { word: "momentary", definition: "Lasting for only a moment; very brief.", example: "The momentary silence after the call to prayer fills the streets of Amman with a sense of peace." },
      { word: "fragile", definition: "Easily broken or damaged; delicate.", example: "The fragile wildflowers of the Jordanian desert remind us to appreciate beauty before it fades." },
      { word: "impermanent", definition: "Not permanent; likely to change or come to an end.", example: "Islamic teaching reminds us that worldly success is impermanent, but the rewards of faith are eternal." },
    ],
  },
  {
    word: "Quintessential",
    partOfSpeech: "(Adjective)",
    phonetic: "/ˌkwɪn.tɪˈsen.ʃəl/",
    meaning: "Representing the most perfect or typical example of a quality, class, or type.",
    example: "The dish of mansaf with lamb, rice, and jameed is the quintessential Jordanian meal, served at every major celebration.",
    cultural: "When we speak of the quintessential Jordanian experience, we think of the warmth of Arabic coffee, the golden Treasury of Petra at sunrise, the smell of fresh ka'ak on a Friday morning, and the laughter of a family gathered around a large platter of mansaf. For Palestinians, the quintessential symbols are the olive tree, the key to an ancestral home, the embroidered dress, and the call to prayer echoing over the hills of Jerusalem. These quintessential images are more than tourist attractions or cultural markers — they are the essence of identity, the things that instantly say 'home.' Jordan itself is the quintessential example of how a small country can carry the weight of history, the warmth of hospitality, and the hope of an entire region.",
    relatedWords: [
      { word: "definitive", definition: "Providing a final or conclusive answer; the most authoritative example.", example: "The Roman ruins of Jerash are the definitive example of ancient architecture in the Middle East." },
      { word: "exemplary", definition: "Serving as a desirable model; representing the best of its kind.", example: "The exemplary hospitality of Jordanian families is known throughout the Arab world." },
      { word: "archetypal", definition: "A very typical example of a certain person or thing.", example: "The bustling souk of downtown Amman is the archetypal Middle Eastern marketplace." },
      { word: "classic", definition: "Judged over a period of time to be of the highest quality; typical.", example: "The classic combination of labneh, za'atar, and olive oil is a breakfast loved by every Jordanian." },
      { word: "ideal", definition: "Satisfying one's conception of what is perfect; most suitable.", example: "The warm evenings of spring in Amman are the ideal setting for a family gathering on the balcony." },
    ],
  },
  {
    word: "Equivocate",
    partOfSpeech: "(Verb)",
    phonetic: "/ɪˈkwɪv.ə.keɪt/",
    meaning: "To use vague or ambiguous language to avoid giving a clear answer or taking a clear position on something.",
    example: "A good leader does not equivocate when asked to stand up for justice — they speak clearly and honestly.",
    cultural: "In Arab culture, directness and honesty are highly valued, especially when it comes to matters of justice and principle. Islamic teaching is clear about the importance of speaking the truth — 'Speak the truth, even if it is bitter,' says a well-known Hadith. While diplomacy and tact are important in Jordanian culture, there is a meaningful difference between being diplomatic and equivocating. Palestinians have long called on the international community to stop equivocating on the issue of their rights and to take clear, principled stands. In academic and professional settings, equivocating — avoiding a clear thesis in an essay or dodging a question in an interview — is seen as a weakness. For English learners, learning to state opinions clearly and politely is an essential skill.",
    relatedWords: [
      { word: "ambiguous", definition: "Having more than one possible meaning; not clear.", example: "An ambiguous statement in a business email can lead to confusion and misunderstandings." },
      { word: "evasive", definition: "Tending to avoid giving a direct answer.", example: "The politician's evasive response frustrated the journalists who wanted a clear position." },
      { word: "candid", definition: "Truthful and straightforward; honest.", example: "A candid conversation between friends is always more valuable than one filled with hesitation." },
      { word: "forthright", definition: "Direct and outspoken; honest and clear.", example: "The forthright testimony of the witness helped the court reach a fair decision." },
      { word: "transparent", definition: "Honest and open; easy to understand without hidden motives.", example: "Transparent communication between teachers and students builds trust and improves learning." },
    ],
  },
  {
    word: "Conscientious",
    partOfSpeech: "(Adjective)",
    phonetic: "/ˌkɒn.siˈen.ʃəs/",
    meaning: "Very careful, thorough, and attentive to doing what is right; guided by a strong sense of duty and moral responsibility.",
    example: "A conscientious student reviews her English vocabulary every evening, knowing that small daily efforts lead to great results.",
    cultural: "Conscientiousness is a quality deeply admired in Jordanian and Palestinian culture. The conscientious student who never misses a class, the conscientious doctor who checks every detail, the conscientious parent who attends every school meeting — these are the people who earn the respect of their communities. In Islam, being conscientious — or 'muttaqi' — means being mindful of God in all actions, doing everything with care and sincerity. Palestinian families, many of whom have built new lives from nothing, understand that conscientious effort is the foundation of success. From the careful tending of olive trees in Ajloun to the meticulous preparation of Ramadan meals, conscientiousness is woven into the fabric of daily life in Jordan.",
    relatedWords: [
      { word: "diligent", definition: "Having or showing care and effort in one's work or duties.", example: "The diligent researchers at the University of Jordan spent three years studying water conservation methods." },
      { word: "meticulous", definition: "Showing great attention to detail; very careful and precise.", example: "The meticulous restoration of the mosaic map in Madaba preserved its beauty for future generations." },
      { word: "scrupulous", definition: "Diligent, thorough, and extremely attentive to details, especially about doing what is right.", example: "The scrupulous honesty of the old shopkeeper in downtown Amman earned him the trust of the whole neighbourhood." },
      { word: "principled", definition: "Acting according to moral rules or beliefs.", example: "A principled leader makes decisions based on what is right, not what is easy." },
      { word: "dedicated", definition: "Committed to a task or purpose; devoted.", example: "The dedicated teachers in Jordan's public schools go far beyond their job descriptions to help their students succeed." },
    ],
  },
  {
    word: "Transcend",
    partOfSpeech: "(Verb)",
    phonetic: "/trænˈsend/",
    meaning: "To go beyond the usual limits of something; to rise above or overcome limitations, boundaries, or differences.",
    example: "Music and poetry have the power to transcend borders, connecting the hearts of Jordanians and Palestinians to people around the world.",
    cultural: "The idea of transcendence is deeply meaningful in Jordan and Palestine. Palestinian culture has transcended the boundaries of geography and politics — the olive tree is not just a tree but a symbol of rootedness; the kuffiyeh is not just a scarf but a symbol of identity and solidarity. Jordan itself transcends its small size, playing a role on the world stage that far exceeds its geographic or economic scale. In Islam, the concept of transcending worldly concerns through faith and prayer is central to spiritual life. For English learners in Jordan, learning a new language is an act of transcendence — it allows you to go beyond the limits of one language and connect with the entire world. The human spirit, as shown by the people of Jordan and Palestine, is capable of transcending even the greatest challenges.",
    relatedWords: [
      { word: "surpass", definition: "To exceed or go beyond something in quality, amount, or degree.", example: "The beauty of Petra at sunrise surpasses anything you can see in a photograph." },
      { word: "overcome", definition: "To succeed in dealing with a problem or difficulty.", example: "The Palestinian people have overcome incredible hardships to preserve their culture and identity." },
      { word: "elevate", definition: "To raise something to a higher level or standard.", example: "Education has the power to elevate individuals and communities out of poverty." },
      { word: "surmount", definition: "To overcome a difficulty or obstacle.", example: "With determination and hard work, any obstacle can be surmounted — this is a lesson Jordanian students learn early." },
      { word: "transform", definition: "To change something completely, often in a positive way.", example: "The power of storytelling can transform a simple family memory into a lesson for generations." },
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

const dailyDropVocabEntries: VocabEntry[] = [
  {
    term: "stage fright",
    definition: "A feeling of fear or nervousness before speaking in front of people.",
    example: "Ahmad felt stage fright before presenting in his class at the University of Jordan.",
  },
  {
    term: "confidence",
    definition: "A feeling of trust in your abilities.",
    example: "After practicing his presentation many times at home, he gained more confidence.",
  },
  {
    term: "deadline",
    definition: "A time by which something must be finished.",
    example: "They stayed late at the university library to meet the project deadline.",
  },
  {
    term: "communicate",
    definition: "To share information or ideas with others.",
    example: "The group had problems because they did not communicate clearly during the project.",
  },
  {
    term: "responsibility",
    definition: "Something that you must do or take care of.",
    example: "He took responsibility for the mistake instead of blaming others.",
  },
  {
    term: "teamwork",
    definition: "Working together with others to achieve a goal.",
    example: "Their success in the course depended on good teamwork.",
  },
  {
    term: "make a good impression",
    definition: "To create a positive opinion about yourself.",
    example: "She dressed neatly on her first day to make a good impression at the office in Amman.",
  },
  {
    term: "colleagues",
    definition: "People you work with.",
    example: "She had lunch with her colleagues at a small restaurant near the office.",
  },
  {
    term: "opportunity",
    definition: "A chance to do something important or useful.",
    example: "Getting an internship in Amman was a great opportunity for her future.",
  },
  {
    term: "prepare",
    definition: "To get something ready.",
    example: "He woke up early to prepare fresh bread in his bakery before customers arrived.",
  },
  {
    term: "customer",
    definition: "A person who buys something.",
    example: "The bakery became full of customers before people went to work.",
  },
  {
    term: "satisfied",
    definition: "Feeling happy because something met your expectations.",
    example: "He felt satisfied when people enjoyed the bread he made.",
  },
  {
    term: "trip",
    definition: "A short journey to another place.",
    example: "They planned a family trip to the Dead Sea during the weekend.",
  },
  {
    term: "experience",
    definition: "Something that happens to you and teaches you something.",
    example: "Floating in the Dead Sea was a new experience for her.",
  },
  {
    term: "memories",
    definition: "Things you remember from the past.",
    example: "They took photos to keep memories from their day at the Dead Sea.",
  },
  {
    term: "charity",
    definition: "Helping people in need, often by giving time or money.",
    example: "The students joined a charity iftar initiative during Ramadan.",
  },
  {
    term: "initiative",
    definition: "A new plan or action to solve a problem.",
    example: "Their university started an initiative to support local communities.",
  },
  {
    term: "volunteer",
    definition: "To do something to help without getting paid.",
    example: "She volunteered at a care home for elderly women in her area.",
  },
  {
    term: "care home",
    definition: "A place where elderly people live and receive care.",
    example: "The students visited a care home in Amman to spend time with the residents.",
  },
  {
    term: "conversation",
    definition: "A talk between two or more people.",
    example: "She had a warm conversation with an elderly woman during iftar.",
  },
  {
    term: "connection",
    definition: "A feeling of understanding or closeness.",
    example: "They felt a strong connection after sharing stories together.",
  },
  {
    term: "hesitate",
    definition: "To pause before doing something because you are unsure.",
    example: "She hesitated before answering the question in class.",
  },
  {
    term: "courage",
    definition: "The ability to do something even when you feel afraid.",
    example: "It takes courage to speak in front of your classmates.",
  },
  {
    term: "harvest",
    definition: "The time when crops like olives are collected.",
    example: "The whole family joined the olive harvest in their village in northern Jordan.",
  },
  {
    term: "tradition",
    definition: "Something people do regularly as part of their culture.",
    example: "Olive picking is an important tradition in many Jordanian families.",
  },
  {
    term: "belonging",
    definition: "A feeling of being part of a group or place.",
    example: "Working together in the field gave them a strong sense of belonging.",
  },
  {
    term: "frustrated",
    definition: "Feeling upset because something is difficult or not working.",
    example: "Her brother felt frustrated when he couldn't solve the homework.",
  },
  {
    term: "encourage",
    definition: "To give someone support or confidence.",
    example: "She encouraged her brother to try again instead of giving up.",
  },
  {
    term: "improve",
    definition: "To become better.",
    example: "With practice, his English started to improve.",
  },
  {
    term: "unfamiliar",
    definition: "Not known or not recognized.",
    example: "Living in a new city at first felt unfamiliar to her.",
  },
  {
    term: "routine",
    definition: "A regular way of doing things.",
    example: "She slowly built a new routine at university.",
  },
  {
    term: "independent",
    definition: "Able to do things on your own.",
    example: "Living alone helped her become more independent.",
  },
  {
    term: "downtown",
    definition: "The main central area of a city.",
    example: "They walked through Downtown Amman in the afternoon.",
  },
  {
    term: "surroundings",
    definition: "The things and environment around you.",
    example: "She felt more connected to her surroundings after the walk.",
  },
  {
    term: "compare",
    definition: "To look at two or more things to see differences or similarities.",
    example: "She compared different gifts before choosing one.",
  },
  {
    term: "option",
    definition: "A choice that you can make.",
    example: "He had several options for where to study.",
  },
  {
    term: "personal",
    definition: "Something that is special or meaningful to a person.",
    example: "She chose a personal gift instead of something expensive.",
  },
  {
    term: "condition",
    definition: "A person's physical state or health situation.",
    example: "He explained his mother's condition to the pharmacist.",
  },
  {
    term: "instructions",
    definition: "Information about how to do something.",
    example: "The pharmacist gave clear instructions for using the medicine.",
  },
  {
    term: "review",
    definition: "To look at something again carefully.",
    example: "He reviewed the email before sending it to the client.",
  },
  {
    term: "professional",
    definition: "Related to work or a job.",
    example: "She wanted to keep a professional image at work.",
  },
  {
    term: "follow-up",
    definition: "An action taken after something to check or correct it.",
    example: "He sent a follow-up message to fix the mistake.",
  },
  {
    term: "trust",
    definition: "Belief that someone is honest or reliable.",
    example: "Clear communication helps build trust with clients.",
  },
  {
    term: "collaboration",
    definition: "Working together with others.",
    example: "Their success came from good collaboration.",
  },
  {
    term: "identity",
    definition: "Who you are and how you see yourself.",
    example: "His experiences helped shape his identity.",
  },
  {
    term: "planning",
    definition: "Thinking ahead about what you need to do.",
    example: "Good planning helped her prepare everything before the guests arrived.",
  },
  {
    term: "solution",
    definition: "A way to fix a problem.",
    example: "After checking the bulb, he found a simple solution.",
  },
  {
    term: "overwhelming",
    definition: "Too much to deal with at one time.",
    example: "Her week felt overwhelming because she had classes, assignments, and family duties.",
  },
  {
    term: "schedule",
    definition: "A plan that shows when things should happen.",
    example: "She made a weekly schedule to balance university work and home responsibilities.",
  },
  {
    term: "productivity",
    definition: "The ability to complete useful work efficiently.",
    example: "She thought productivity meant doing more, but later learned that rest also matters.",
  },
  {
    term: "clarity",
    definition: "A clear understanding of something.",
    example: "After slowing down, she gained more clarity about what mattered most.",
  },
  {
    term: "take a break",
    definition: "To stop working or studying for a short time to rest.",
    example: "After studying English for two hours, Noor decided to take a break and drink tea.",
  },
  {
    term: "clear your mind",
    definition: "To relax so you can think more calmly.",
    example: "A short walk near the house helped her clear her mind before studying again.",
  },
  {
    term: "make a plan",
    definition: "To decide what you will do before you start.",
    example: "Kareem made a plan for his weekend so he could finish his homework and visit his family.",
  },
  {
    term: "write down",
    definition: "To put information on paper or in your phone so you remember it.",
    example: "He wrote down his tasks before going to the university library.",
  },
  {
    term: "on time",
    definition: "At the correct or expected time.",
    example: "She arrived on time for her lecture at the University of Jordan.",
  },
  {
    term: "figure it out",
    definition: "To understand or solve something after thinking about it.",
    example: "Rasha did not understand the lesson at first, but she figured it out after reviewing her notes.",
  },
  {
    term: "make sense",
    definition: "To become clear and understandable.",
    example: "The grammar rule started to make sense after the teacher gave examples from daily life.",
  },
  {
    term: "fall into place",
    definition: "To become clear or organized after some time.",
    example: "After a week of practice, the new vocabulary began to fall into place.",
  },
  {
    term: "get used to",
    definition: "To become comfortable with something new.",
    example: "Hasan needed time to get used to his new university schedule.",
  },
  {
    term: "keep track",
    definition: "To follow or remember information carefully.",
    example: "He used his phone calendar to keep track of assignments and exams.",
  },
  {
    term: "in the long run",
    definition: "After a long period of time.",
    example: "Studying a little every day helps more in the long run than studying only before exams.",
  },
  {
    term: "stay on top of",
    definition: "To manage your work well and not fall behind.",
    example: "She made a checklist to stay on top of her university tasks.",
  },
  {
    term: "put in effort",
    definition: "To work hard at something.",
    example: "Dima put in effort every day to improve her English speaking skills.",
  },
  {
    term: "keep up",
    definition: "To continue at the same speed or level as others.",
    example: "He worked hard to keep up with his classmates during the intensive course.",
  },
  {
    term: "moving forward",
    definition: "Making progress after difficulty or delay.",
    example: "After weeks of practice, she finally felt that her English was moving forward.",
  },
  {
    term: "add up",
    definition: "To slowly become important or noticeable.",
    example: "Ten minutes of English practice every day can add up over time.",
  },
  {
    term: "come together",
    definition: "To become clear, organized, or successful.",
    example: "After many small steps, her learning plan finally came together.",
  },
  {
    term: "work out",
    definition: "To end well or be solved successfully.",
    example: "She was worried about the project, but everything worked out in the end.",
  },
  {
    term: "essentials",
    definition: "The basic things that someone needs in order to live or do something.",
    example: "Before travelling to Aqaba, Layla packed all the essentials — sunscreen, a water bottle, and a light jacket.",
  },
  {
    term: "integration",
    definition: "The process of becoming part of a community or group and being accepted by its members.",
    example: "The University of Jordan helps new students from different cities feel a sense of integration through orientation programmes.",
  },
  {
    term: "ethical concerns",
    definition: "Worries or doubts about whether something is morally right or wrong.",
    example: "The researchers discussed ethical concerns about collecting data from families in refugee camps without proper permission.",
  },
  {
    term: "relief",
    definition: "A feeling of comfort when something difficult or worrying has ended, or help given to people in need.",
    example: "There was a great sense of relief in the neighbourhood when the rain finally came after weeks of dry weather.",
  },
  {
    term: "gratitude",
    definition: "A feeling of thankfulness towards someone who has helped you or given you something.",
    example: "Omar expressed his gratitude to his grandmother for teaching him how to make the perfect maqloubeh.",
  },
  {
    term: "neighbourhood",
    definition: "A small area within a town or city where people live near each other.",
    example: "Every Friday, the smell of fresh kunafa fills the neighbourhood in Jabal Amman.",
  },
  {
    term: "unexpected",
    definition: "Not expected or planned; surprising.",
    example: "The unexpected rainstorm in Amman caught everyone without umbrellas on their way home from work.",
  },
  {
    term: "roasted",
    definition: "Cooked in an oven or over fire with dry heat.",
    example: "The smell of roasted chestnuts fills the streets of Downtown Amman during winter evenings.",
  },
  {
    term: "orchard",
    definition: "A piece of land where fruit or olive trees are grown.",
    example: "Abu Khalid's olive orchard in Ajloun has been in the family for three generations.",
  },
  {
    term: "generation",
    definition: "People born around the same time, or the average period between the birth of parents and their children.",
    example: "The olive trees in Palestine have been passed down from one generation to the next for centuries.",
  },
  {
    term: "press",
    definition: "A machine used to extract oil from olives or juice from fruit.",
    example: "After the harvest, the family took the olives to the village press to make fresh olive oil.",
  },
  {
    term: "campus",
    definition: "The land and buildings of a university or college.",
    example: "The campus of the University of Jordan is so large that new students often get lost in their first week.",
  },
  {
    term: "confused",
    definition: "Unable to think clearly or understand something.",
    example: "Layla felt confused on her first day at university until a friendly student offered to show her around.",
  },
  {
    term: "professor",
    definition: "A teacher at a university.",
    example: "Dr. Hala, a professor of linguistics at the University of Jordan, always encourages her students to ask questions.",
  },
  {
    term: "brave",
    definition: "Willing to do something difficult or dangerous despite fear.",
    example: "It was brave of her to move to a new city alone to study at university.",
  },
  {
    term: "spices",
    definition: "Substances added to food to give it flavour, such as cumin, cinnamon, or cardamom.",
    example: "Jordanian maqloubeh uses a special blend of spices that gives it its unique taste.",
  },
  {
    term: "layer",
    definition: "A flat sheet of substance spread over a surface or between other layers.",
    example: "Maqloubeh is made by layering rice, vegetables, and meat in a large pot before flipping it upside down.",
  },
  {
    term: "patience",
    definition: "The ability to wait calmly without getting angry or upset.",
    example: "Cooking mansaf requires patience — the jameed sauce needs hours of slow stirring.",
  },
  {
    term: "golden",
    definition: "Having the colour or shine of gold.",
    example: "The golden sandstone of Petra glows beautifully at sunset, attracting visitors from around the world.",
  },
  {
    term: "proud",
    definition: "Feeling pleased and satisfied about something you or someone close to you has achieved.",
    example: "Her father was proud when she graduated from the University of Jordan with honours.",
  },
  {
    term: "scenery",
    definition: "The natural features of a landscape, such as mountains, valleys, and water.",
    example: "The scenery in Wadi Rum is so breathtaking that it has been used as a filming location for many international movies.",
  },
  {
    term: "ancient",
    definition: "Very old; from a time long ago.",
    example: "The ancient city of Jerash has some of the best-preserved Roman ruins in the world.",
  },
  {
    term: "carved",
    definition: "Cut into a hard material to create a shape or design.",
    example: "The Treasury at Petra is carved directly into the rose-red cliff face.",
  },
  {
    term: "monument",
    definition: "A structure built to remember an important person or event in history.",
    example: "The colonnaded street in Jerash is a remarkable monument to Roman engineering.",
  },
  {
    term: "handmade",
    definition: "Made by hand, not by machine.",
    example: "She bought a handmade olive-wood carving from a workshop in Bethlehem as a gift for her mother.",
  },
  {
    term: "peaceful",
    definition: "Quiet and calm; free from disturbance or conflict.",
    example: "The early morning hours in the old city of Salt are peaceful, with only the sound of birds and the distant call to prayer.",
  },
  {
    term: "ingredients",
    definition: "The items used to make a particular dish or product.",
    example: "The main ingredients for mansaf are lamb, jameed, and rice — simple but rich in flavour.",
  },
  {
    term: "traditional",
    definition: "Following customs and practices that have been passed down over a long time.",
    example: "At a traditional Jordanian wedding, the zaffeh procession escorts the groom to the celebration with music and dancing.",
  },
  {
    term: "signal",
    definition: "A sign, sound, or action that gives information or a message.",
    example: "The call to prayer is a familiar signal that it is time to pause and reflect.",
  },
  {
    term: "recitation",
    definition: "The act of reading or repeating something aloud from memory, especially from the Quran.",
    example: "During Ramadan, beautiful Quran recitation can be heard from mosques across Amman late into the night.",
  },
  {
    term: "discuss",
    definition: "To talk about something with others in order to share ideas or reach a decision.",
    example: "After the lecture, students gathered at a cafe near campus to discuss what they had learned.",
  },
  {
    term: "hospitality",
    definition: "The friendly and generous way of treating guests and visitors.",
    example: "Jordanian hospitality is legendary — guests are always served Arabic coffee and sweets as soon as they arrive.",
  },
  {
    term: "tourists",
    definition: "People who travel to a place for pleasure, sightseeing, or holiday.",
    example: "Tourists from around the world visit Petra every year to see the ancient Nabataean city.",
  },
  {
    term: "welcome",
    definition: "To greet someone with pleasure and kindness when they arrive.",
    example: "The family in Irbid always welcome guests with a large plate of mansaf and warm smiles.",
  },
  {
    term: "afraid",
    definition: "Feeling fear or worry about something.",
    example: "She was not afraid to ask questions in class because her professor always encouraged curiosity.",
  },
  {
    term: "patient",
    definition: "A person receiving medical care, or someone who can wait calmly.",
    example: "The doctor was patient and took time to explain the treatment clearly to the elderly woman.",
  },
  {
    term: "float",
    definition: "To stay on top of water without sinking.",
    example: "Floating in the Dead Sea is one of the most popular experiences for visitors to Jordan.",
  },
  {
    term: "wonderful",
    definition: "Extremely good; causing pleasure and happiness.",
    example: "The family had a wonderful time exploring the Roman ruins in Jerash during their weekend trip.",
  },
  {
    term: "retired",
    definition: "Having stopped working, usually because of reaching a certain age.",
    example: "After retiring from teaching at the University of Jordan, Dr. Ahmad spent his days tending his garden in Jerash.",
  },
  {
    term: "packed",
    definition: "Very crowded; filled with people or things.",
    example: "The cafes on Rainbow Street were packed on Friday evening as families gathered to enjoy the cool weather.",
  },
  {
    term: "discount",
    definition: "A reduction in the price of something.",
    example: "The shopkeeper in Downtown Amman gave her a small discount because she was a regular customer.",
  },
  {
    term: "cushions",
    definition: "Soft bags filled with material, used to make seats more comfortable.",
    example: "The living room was arranged with colourful cushions on the floor for the family gathering after dinner.",
  },
  {
    term: "colonnaded",
    definition: "Having a row of columns, usually in ancient architecture.",
    example: "The colonnaded street in Jerash is one of the longest and best-preserved in the Middle East.",
  },
  {
    term: "chariot",
    definition: "A two-wheeled vehicle pulled by horses, used in ancient times for racing and war.",
    example: "The archaeologist showed the students where chariot races once took place in the Roman hippodrome at Jerash.",
  },
  {
    term: "archaeologist",
    definition: "A person who studies ancient cultures by examining remains and artefacts.",
    example: "The archaeologist from the University of Jordan has spent twenty years studying the Nabataean water systems at Petra.",
  },
  {
    term: "ruins",
    definition: "The remains of buildings that have been destroyed or fallen into decay over time.",
    example: "The ruins of the ancient Roman city in Jerash attract thousands of visitors every year.",
  },
  {
    term: "steadfastness",
    definition: "The quality of remaining firm and determined despite difficulties; similar to the concept of Sumud.",
    example: "The steadfastness of the Palestinian people in holding onto their identity and culture is admired around the world.",
  },
  {
    term: "descendants",
    definition: "People who are born from a particular ancestor or family line.",
    example: "The descendants of Palestinian families who left their homes in 1948 still carry the keys and deeds to their houses.",
  },
  {
    term: "dignity",
    definition: "The quality of being worthy of respect and honour.",
    example: "She faced every challenge with dignity, never allowing difficulties to take away her sense of self-worth.",
  },
  {
    term: "heritage",
    definition: "Cultural traditions, buildings, and objects that are passed down from previous generations.",
    example: "The olive harvest is an important part of Palestinian heritage that connects families to their ancestral land.",
  },
  {
    term: "resistance",
    definition: "The act of opposing or fighting against something harmful or unjust.",
    example: "Cultural resistance through storytelling, embroidery, and poetry has kept Palestinian identity alive across generations.",
  },
  {
    term: "perseverance",
    definition: "Continued effort to achieve something despite difficulties or delays.",
    example: "Through perseverance, she completed her degree at the University of Jordan while working part-time to support her family.",
  },
  {
    term: "ecosystem",
    definition: "A community of living organisms and their physical environment, functioning together as a system.",
    example: "The Wadi Rum ecosystem supports a surprising variety of plants and animals that have adapted to the harsh desert conditions.",
  },
  {
    term: "contagious",
    definition: "Spreading easily from one person to another, like an emotion or an idea.",
    example: "The enthusiasm of the tour guide at Petra was contagious — soon everyone in the group was excited and asking questions.",
  },
  {
    term: "entrepreneurs",
    definition: "People who start their own businesses and take financial risks to do so.",
    example: "Young Jordanian entrepreneurs in Abdali are creating innovative apps and services for the Arab market.",
  },
  {
    term: "logistics",
    definition: "The detailed planning and organisation of a complex operation, such as transporting goods.",
    example: "The logistics of delivering food packages to families in remote areas of southern Jordan required careful planning.",
  },
  {
    term: "complicated",
    definition: "Difficult to understand or deal with because of many connected parts.",
    example: "The process of applying for a scholarship can feel complicated, but the university office helps students through every step.",
  },
  {
    term: "intricate",
    definition: "Very detailed and complicated, often beautiful because of its complexity.",
    example: "The intricate patterns of Palestinian embroidery, known as tatreez, tell stories of village life and heritage.",
  },
  {
    term: "spectacular",
    definition: "Very impressive or beautiful, especially in a dramatic way.",
    example: "The view of the Treasury at Petra as you walk through the narrow canyon is truly spectacular.",
  },
  {
    term: "procession",
    definition: "A group of people moving forward in an orderly way, often as part of a ceremony or celebration.",
    example: "The zaffeh procession at a traditional Jordanian wedding moves through the streets with drums and dancing.",
  },
  {
    term: "communally",
    definition: "Done together as a community or group, rather than individually.",
    example: "In many Jordanian villages, the olive harvest is done communally, with neighbours helping each other.",
  },
  {
    term: "union",
    definition: "The act of joining together, or an organised group of workers that protects their rights.",
    example: "The marriage union between the two families was celebrated with a large feast that lasted until the early hours.",
  },
  {
    term: "licensed",
    definition: "Having official permission from an authority to do something.",
    example: "Only licensed tour guides are allowed to lead groups through the ancient sites at Petra.",
  },
  {
    term: "formation",
    definition: "The process of forming or creating something, or the way something is arranged.",
    example: "The rock formations in Wadi Rum were shaped by millions of years of wind and water erosion.",
  },
  {
    term: "examination",
    definition: "A formal test of knowledge or ability, or a careful inspection of something.",
    example: "Students at the University of Jordan prepare carefully for their final examinations each semester.",
  },
  {
    term: "landscape",
    definition: "The overall appearance of an area of land, including its natural features.",
    example: "The landscape of southern Jordan changes dramatically from the green hills of Ajloun to the red desert of Wadi Rum.",
  },
  {
    term: "dim",
    definition: "Not bright; somewhat dark or poorly lit.",
    example: "The dim lighting in the old souq of Salt adds to its historic charm in the late afternoon.",
  },
  {
    term: "affordable",
    definition: "Priced reasonably; not too expensive for most people.",
    example: "Street food in Amman is affordable and delicious — a falafel sandwich costs just one dinar.",
  },
  {
    term: "negotiate",
    definition: "To discuss something in order to reach an agreement, especially about a price.",
    example: "In the souq, it is common to negotiate the price before buying handmade goods.",
  },
  {
    term: "refugee",
    definition: "A person who has been forced to leave their country to escape war, danger, or persecution.",
    example: "Jordan has welcomed millions of refugees over the decades, showing remarkable generosity and compassion.",
  },
  {
    term: "bargaining",
    definition: "The act of discussing the price of something in order to agree on a lower amount.",
    example: "Bargaining in the markets of Downtown Amman is expected — the first price is never the final one.",
  },
  {
    term: "priority",
    definition: "Something that is more important than other things and should be dealt with first.",
    example: "Education is a top priority for many Jordanian families, who often save for years to send their children to university.",
  },
  {
    term: "scholarship",
    definition: "Financial support given to a student to help pay for their education.",
    example: "She received a scholarship to study engineering at the University of Jordan, which was a life-changing opportunity for her family.",
  },
  {
    term: "determined",
    definition: "Having a strong desire to achieve something and not giving up.",
    example: "Despite the challenges, the determined student from Irbid graduated at the top of her class.",
  },
  {
    term: "construction",
    definition: "The process of building something, or a structure that is being built.",
    example: "The construction of new apartment buildings in Abdali has changed the skyline of Amman.",
  },
  {
    term: "firmly",
    definition: "In a strong, definite, and unwavering way.",
    example: "She firmly believes that education is the key to a better future for the next generation.",
  },
  {
    term: "calligraphy",
    definition: "The art of beautiful handwriting, especially in Arabic and other scripts.",
    example: "Arabic calligraphy is taught as an art form at the Institute of Fine Arts at the University of Jordan.",
  },
  {
    term: "aesthetics",
    definition: "The study or appreciation of beauty, especially in art and design.",
    example: "The aesthetics of traditional Jordanian architecture — stone walls, arches, and courtyards — reflect centuries of design wisdom.",
  },
  {
    term: "contemporary",
    definition: "Belonging to the present time; modern.",
    example: "Contemporary Jordanian artists blend traditional Arabic patterns with modern techniques in their work.",
  },
  {
    term: "manuscripts",
    definition: "Handwritten documents, especially from before the printing press era.",
    example: "Ancient Arabic manuscripts in the libraries of Amman contain centuries of scientific and literary knowledge.",
  },
  {
    term: "projector",
    definition: "A device that shows images or videos on a large screen.",
    example: "The professor used a projector to display old photographs of Amman during the lecture on urban history.",
  },
  {
    term: "erupts",
    definition: "Bursts out suddenly and violently, often used for volcanoes or strong emotions.",
    example: "Cheers erupted from the crowd when the Jordanian football team scored the winning goal.",
  },
  {
    term: "contributes",
    definition: "To give something — time, money, effort — to help achieve a goal.",
    example: "Every member of the family contributes to preparing the Friday dinner, from cooking to setting the table.",
  },
  {
    term: "atmosphere",
    definition: "The feeling or mood of a place or situation, or the air around the Earth.",
    example: "The atmosphere during Ramadan nights in Amman is warm and festive, with families gathering after iftar.",
  },
  {
    term: "commentary",
    definition: "A spoken or written description of an event, especially during a sports match or TV programme.",
    example: "The football commentator's enthusiastic commentary made the match feel even more exciting for the listeners at home.",
  },
  {
    term: "underrepresented",
    definition: "Having fewer members or less presence than would be expected or fair in a group or area.",
    example: "Women are still underrepresented in some fields of engineering in Jordan, but organisations like Women Who Code are working to change that.",
  },
  {
    term: "deliberate",
    definition: "Done on purpose; intentional and carefully considered.",
    example: "The deliberate choice to teach in both Arabic and English helps students build bilingual skills from an early age.",
  },
  {
    term: "mission",
    definition: "An important goal or purpose that a person or organisation works to achieve.",
    example: "The organisation's mission is to provide free English classes to young people in refugee camps.",
  },
  {
    term: "barriers",
    definition: "Obstacles or difficulties that prevent progress or access.",
    example: "Language barriers can make it difficult for new students to participate in class, but supportive teachers help them overcome these challenges.",
  },
  {
    term: "launched",
    definition: "Started or introduced something new, such as a product, service, or programme.",
    example: "The university launched a new programme to help students develop entrepreneurship skills.",
  },
  {
    term: "water-scarce",
    definition: "Having very little water available for people, animals, and plants.",
    example: "As one of the most water-scarce countries in the world, Jordan has become a leader in water conservation technology.",
  },
  {
    term: "infrastructure",
    definition: "The basic systems and services a country needs to function, such as roads, water supply, and electricity.",
    example: "Jordan has invested heavily in water infrastructure to ensure clean drinking water reaches every neighbourhood.",
  },
  {
    term: "conveyance",
    definition: "The act of carrying or transporting something from one place to another.",
    example: "The conveyance of water from the reservoir to the farms in the Jordan Valley requires an extensive network of pipes and channels.",
  },
  {
    term: "fossil groundwater",
    definition: "Water stored deep underground for thousands of years, originally from ancient rainfall.",
    example: "Much of Jordan's water comes from fossil groundwater, a resource that took thousands of years to accumulate and cannot be quickly replaced.",
  },
  {
    term: "desalination",
    definition: "The process of removing salt from seawater to make it safe for drinking and farming.",
    example: "Jordan is exploring desalination plants near Aqaba to help address the country's growing water needs.",
  },
  {
    term: "hydrologist",
    definition: "A scientist who studies water — its movement, distribution, and quality on Earth.",
    example: "The hydrologist from the University of Jordan warned that over-pumping groundwater could have serious long-term consequences.",
  },
  {
    term: "contracted",
    definition: "Became smaller or shorter, or entered into a formal agreement.",
    example: "As the population grew, the amount of agricultural land around Amman contracted significantly.",
  },
  {
    term: "extraction",
    definition: "The process of removing something, such as water or minerals, from the ground.",
    example: "The unsustainable extraction of groundwater has led to a drop in water levels across the region.",
  },
  {
    term: "hydroelectric",
    definition: "Related to the production of electricity using the power of flowing water.",
    example: "Jordan has considered building a small hydroelectric plant on the Yarmouk River to generate clean energy.",
  },
  {
    term: "precipitation",
    definition: "Water that falls from the sky as rain, snow, or hail.",
    example: "Jordan receives very little precipitation, making every rainfall a reason for celebration among farmers.",
  },
  {
    term: "replenishing",
    definition: "Filling something up again after it has been used or emptied.",
    example: "Replenishing the country's groundwater reserves will take decades of careful water management.",
  },
  {
    term: "brine",
    definition: "Water that is very salty, especially as a by-product of desalination processes.",
    example: "The brine produced by desalination plants must be disposed of carefully to avoid harming marine life in the Gulf of Aqaba.",
  },
  {
    term: "diaspora",
    definition: "A group of people who have spread or dispersed from their original homeland to live in other countries.",
    example: "The Palestinian diaspora in Jordan has enriched the country's culture, cuisine, and intellectual life for decades.",
  },
  {
    term: "reinforced",
    definition: "Made stronger or more solid, often by adding extra material or support.",
    example: "The cultural bonds between Palestinians and Jordanians have been reinforced through shared history and family ties.",
  },
  {
    term: "profoundly",
    definition: "Very deeply or extremely.",
    example: "The experience of displacement has profoundly shaped the identity and creativity of Palestinian writers and artists.",
  },
  {
    term: "contradiction",
    definition: "A situation in which two things seem to be opposite or cannot both be true.",
    example: "Living in Amman while dreaming of Jerusalem created a contradiction that many Palestinians in the diaspora learned to carry with grace.",
  },
  {
    term: "dual consciousness",
    definition: "The experience of feeling connected to two different identities, places, or cultures at the same time.",
    example: "Many young Palestinians in Jordan live with a dual consciousness — fully at home in Amman, yet deeply connected to the villages of their grandparents.",
  },
  {
    term: "tech-savvy",
    definition: "Good at using modern technology, especially computers and the internet.",
    example: "Jordan's tech-savvy youth are building apps and startups that attract international attention.",
  },
  {
    term: "penetration",
    definition: "The extent to which something reaches or spreads into a market or area.",
    example: "Mobile phone penetration in Jordan is among the highest in the region, with most people using smartphones daily.",
  },
  {
    term: "last-mile delivery",
    definition: "The final step of delivering a product from a distribution centre to the customer's door.",
    example: "Getting last-mile delivery right in the narrow streets of Jabal Amman can be a real challenge for courier companies.",
  },
  {
    term: "dominant",
    definition: "Having the most power, influence, or control over others.",
    example: "Cash on delivery remains the dominant payment method for online shoppers in Jordan.",
  },
  {
    term: "inefficiencies",
    definition: "Waste of time, money, or energy caused by poor systems or methods.",
    example: "The company reduced its inefficiencies by switching to a new inventory management system.",
  },
  {
    term: "regulatory",
    definition: "Related to the rules and laws that control how something is done.",
    example: "Regulatory changes in Jordan have made it easier for small businesses to register and operate legally.",
  },
  {
    term: "elaborate",
    definition: "Very detailed and carefully planned, often with many decorative elements.",
    example: "The elaborate stonework on the buildings in Salt shows the skill of Ottoman-era craftsmen.",
  },
  {
    term: "limestone",
    definition: "A type of light-coloured rock often used in building.",
    example: "The white limestone buildings of Amman give the city its distinctive appearance against the blue sky.",
  },
  {
    term: "insulation",
    definition: "Material that prevents heat, cold, or sound from passing through.",
    example: "The thick stone walls of traditional houses in Salt provide natural insulation against both summer heat and winter cold.",
  },
  {
    term: "courtyards",
    definition: "Open areas surrounded by walls or buildings, often used as outdoor living spaces.",
    example: "The shaded courtyards of old Amman houses were where families gathered in the evening to drink tea and tell stories.",
  },
  {
    term: "deteriorated",
    definition: "Became worse in condition or quality over time.",
    example: "Some of the historic buildings in Salt have deteriorated, but restoration projects are working to save them.",
  },
  {
    term: "preservation",
    definition: "The act of protecting something from damage, decay, or disappearance.",
    example: "The preservation of traditional architecture in Salt has become a priority for the city's cultural organisations.",
  },
  {
    term: "stigma",
    definition: "A negative social attitude or belief about something, often based on misunderstanding.",
    example: "There is still a stigma around mental health in many communities, but awareness campaigns are slowly changing attitudes.",
  },
  {
    term: "clinical",
    definition: "Related to a hospital or medical treatment, or very cold and efficient.",
    example: "The university's clinical psychology programme trains students to provide counselling in community health centres.",
  },
  {
    term: "traumatised",
    definition: "Deeply affected by a very distressing or frightening experience.",
    example: "Many children in conflict zones have been traumatised by violence, and specialised programmes are needed to help them recover.",
  },
  {
    term: "psychosocial",
    definition: "Relating to the connection between the mind and social environment, especially regarding wellbeing.",
    example: "Psychosocial support programmes in Jordan help refugees cope with the stress of displacement and build resilience in their new communities.",
  },
  {
    term: "unprecedented",
    definition: "Never done, experienced, or seen before.",
    example: "Jordan's response to hosting millions of refugees was unprecedented and drew admiration from the international community.",
  },
  {
    term: "campaign",
    definition: "A planned series of actions aimed at achieving a specific social, political, or commercial goal.",
    example: "The mental health awareness campaign in Jordan encouraged young people to speak openly about their feelings.",
  },
  {
    term: "vulnerability",
    definition: "The quality of being easily harmed or affected, physically or emotionally.",
    example: "Acknowledging vulnerability is not a weakness — it is the first step towards finding the support you need.",
  },
  {
    term: "leveraging",
    definition: "Using something you already have to gain an advantage or achieve a result.",
    example: "Jordanian farmers are leveraging solar energy to power water pumps in the Jordan Valley.",
  },
  {
    term: "capacity",
    definition: "The maximum amount that something can hold, produce, or contain.",
    example: "Jordan's solar energy capacity has grown rapidly in recent years, helping to reduce dependence on imported fuel.",
  },
  {
    term: "intermittent",
    definition: "Not continuous; stopping and starting at intervals.",
    example: "Intermittent rainfall in southern Jordan means farmers must use water storage systems carefully.",
  },
  {
    term: "deployment",
    definition: "The act of moving something into position for use, often referring to technology or military forces.",
    example: "The deployment of solar panels across Jordanian universities has significantly reduced their electricity bills.",
  },
  {
    term: "flagship",
    definition: "The most important or best example of something; a leading product or project.",
    example: "The Queen Rania Centre for Entrepreneurship is the flagship programme for startup support at the University of Jordan.",
  },
  {
    term: "culinary",
    definition: "Related to cooking and food preparation.",
    example: "Palestinian culinary traditions, passed down through generations, are a source of pride and identity for families across Jordan.",
  },
  {
    term: "caramelised",
    definition: "Cooked until sugar turns brown and develops a sweet, rich flavour.",
    example: "The caramelised onions on top of the maqloubeh gave it a delicious golden colour and deep flavour.",
  },
  {
    term: "continuity",
    definition: "The state of continuing without interruption over time.",
    example: "Cooking the same dishes her grandmother made gives a sense of continuity that connects the family across generations.",
  },
  {
    term: "anthropologists",
    definition: "Scientists who study human societies, cultures, and their development over time.",
    example: "Anthropologists have documented how Palestinian families preserve their traditions through food, even when living far from home.",
  },
  {
    term: "disproportionately",
    definition: "To an extent that is too large or too small compared to something else.",
    example: "Women in rural areas of Jordan are disproportionately affected by limited access to transport and educational resources.",
  },
  {
    term: "brain drain",
    definition: "The departure of highly educated or skilled people from a country to seek better opportunities abroad.",
    example: "Brain drain is a challenge for Jordan — many talented engineers and doctors move to Gulf countries for higher salaries.",
  },
  {
    term: "pipeline",
    definition: "A channel or system through which something flows, or a process of developing talent over time.",
    example: "Jordanian universities are building a stronger pipeline of tech talent through improved computer science programmes.",
  },
  {
    term: "absorb",
    definition: "To take in or soak up something, such as information, knowledge, or liquid.",
    example: "Young children absorb new languages quickly, which is why starting English lessons early is so effective.",
  },
  {
    term: "architecture",
    definition: "The design and construction of buildings and other structures.",
    example: "The architecture of Amman blends modern towers with traditional stone houses, creating a unique cityscape.",
  },
  {
    term: "sprawling",
    definition: "Spreading out over a large area in an untidy or unplanned way.",
    example: "The sprawling neighbourhoods of West Amman stretch from Sweifieh all the way to the edge of the city.",
  },
  {
    term: "facade",
    definition: "The front of a building, or a false appearance that hides the truth.",
    example: "The ornate facade of the historic building on Rainbow Street hides a modern art gallery inside.",
  },
  {
    term: "inadequate",
    definition: "Not enough or not good enough for a particular purpose.",
    example: "Inadequate public transport in some areas of Amman makes commuting difficult for students and workers.",
  },
  {
    term: "coexistence",
    definition: "The state of living together peacefully despite differences.",
    example: "Jordan has long been a model of coexistence, where Muslims and Christians share neighbourhoods, schools, and celebrations.",
  },
  {
    term: "bohemian",
    definition: "Having an unconventional lifestyle, often associated with art, freedom, and creativity.",
    example: "The bohemian cafes along Rainbow Street in Amman attract artists, writers, and musicians who gather to share ideas.",
  },
  {
    term: "municipal",
    definition: "Relating to a city or town and its local government.",
    example: "The municipal council in Irbid approved a plan to build more public parks and green spaces for families to enjoy.",
  },
];

function findDailyDropVocabEntry(term: string): VocabEntry | undefined {
  return dailyDropVocabEntries.find(
    (entry) => entry.term.toLowerCase() === term.toLowerCase()
  );
}

function VocabEntrySheet({
  open,
  onOpenChange,
  entry,
  fallbackTerm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry?: VocabEntry;
  fallbackTerm: string;
}) {
  const title = entry?.term || fallbackTerm;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl text-aqaba">
            {title}
          </SheetTitle>
          <SheetDescription>
            Daily Drop vocabulary
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="bg-aqaba/5 rounded-xl p-4 border border-aqaba/10">
            <h4 className="font-semibold text-aqaba mb-2">Meaning</h4>
            <p className="text-gray-700 leading-relaxed">
              {entry?.definition || "Definition coming soon."}
            </p>
          </div>

          <div className="bg-olive/5 rounded-xl p-4 border border-olive/10">
            <h4 className="font-semibold text-olive mb-2">Example</h4>
            <p className="text-gray-700 leading-relaxed italic">
              {entry?.example || "Example coming soon."}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

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

function WritingLabSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const comingSoonTopics = [
    "Phrasal verbs",
    "Phrases and their types",
    "Sentences and their types",
    "Paragraphs and their elements",
    "Punctuation marks",
    "Consistency",
    "Formal / informal",
    "Cohesive devices",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-2xl text-aqaba">
            Writing Lab
          </SheetTitle>
          <SheetDescription>
            Learn how English works in real writing, one small skill at a time.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-aqaba/10 bg-aqaba/5 p-4">
            <h3 className="text-xl font-bold text-aqaba mb-2">
              Collocations
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Collocations are words that naturally go together in English.
              Learning them helps your writing sound clearer, smoother, and more natural.
            </p>
          </div>

          <div className="space-y-4">
            {collocationLessons.map((lesson, index) => (
              <div
                key={lesson.title}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-olive/10 text-olive border-olive/20">
                    Lesson {index + 1}
                  </Badge>
                  <h4 className="font-bold text-gray-900">
                    {lesson.title}
                  </h4>
                </div>

                <p className="text-gray-700 leading-relaxed mb-3">
                  {lesson.explanation}
                </p>

                <div className="space-y-3">
                  <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      Correct example
                    </p>
                    <p className="text-gray-700">
                      {lesson.correctExample}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                    <p className="text-sm font-semibold text-red-800 mb-1">
                      Common mistake
                    </p>
                    <p className="text-gray-700">
                      {lesson.commonMistake}
                    </p>
                  </div>

                  <div className="rounded-xl bg-sand/40 border border-sand p-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Quick practice
                    </p>
                    <p className="text-gray-700 mb-2">
                      {lesson.practice}
                    </p>
                    <p className="text-sm text-olive font-semibold">
                      Answer: {lesson.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 p-4 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Coming soon
            </h3>
            <div className="flex flex-wrap gap-2">
              {comingSoonTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="bg-white text-gray-600 border-gray-200"
                >
                  {topic}
                </Badge>
              ))}
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
  const [pronunciationOpen, setPronunciationOpen] = useState(false);
  const [writingLabOpen, setWritingLabOpen] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(false);
  const [selectedVocabTerm, setSelectedVocabTerm] = useState("");
  const [displayedIdioms, setDisplayedIdioms] = useState<Idiom[]>(() => getRotatedItems(allIdioms, 4));

  const [streak, setStreak] = useState<StreakState>({ count: 1, label: "🔥 First day" });

  useEffect(() => {
    setStreak(loadAndUpdateStreak());
  }, []);

  const todaysDrop = dailyDrops[getRotatedIndex(dailyDrops.length)];
  const todaysWord = wordsOfDay[getRotatedIndex(wordsOfDay.length)];
  const todaysDatePill = formatDatePill();

  const selectedVocabEntry = selectedVocabTerm
    ? findDailyDropVocabEntry(selectedVocabTerm)
    : undefined;

  function openVocabEntry(term: string) {
    setSelectedVocabTerm(term);
    setVocabOpen(true);
  }

  function refreshMainIdioms() {
    setDisplayedIdioms(getRandomItems(allIdioms, 4));
  }

  function handleOpenInterest(data: InterestCategory) {
    setSelectedInterest(data);
    setInterestSheetOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* ─── Navigation ─── */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Image
              src="/logo-icon.png"
              alt="Nibras English Logo"
              width={42}
              height={42}
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0"
              priority
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-aqaba tracking-tight leading-tight truncate">
                Nibras English
              </h1>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Master English. Stay Rooted.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-green-100 text-olive border-none hover:bg-green-100 py-1 px-2 sm:px-3 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0">
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
              className="hidden sm:inline-flex bg-petra hover:bg-petra-dark text-white shadow rounded-md transition-colors text-sm"
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
          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-purple-500"
            onClick={() => setWritingLabOpen(true)}
          >
            <CardContent className="pt-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <BookText className="size-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Writing Lab</h4>
                <p className="text-xs text-gray-500">Build stronger writing, one skill at a time</p>
              </div>
              <Badge className="bg-olive/10 text-olive border-olive/20 shrink-0 text-xs">New</Badge>
              <ArrowRight className="size-5 text-gray-400 ml-auto shrink-0" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── About & Identity ─── */}
      <section className="mt-10 sm:mt-14">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-aqaba">
            About & Identity
          </h2>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Nibras English is built to help learners grow in English while staying connected to who they are.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-aqaba">
                About Nibras English
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Nibras English is an ESL learning portal created for Arabic-speaking learners, especially students in Jordan and the wider region. It teaches English through daily reading, vocabulary, pronunciation, writing skills, and practical examples drawn from real life. The mission is simple: to help learners use English with confidence in study, work, and communication while staying rooted in their language, culture, and values.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-olive">
                Rooted in Jordan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Jordan is more than a setting for Nibras English; it is part of its voice. The platform reflects the everyday stories of Jordanian students, families, teachers, workers, and dreamers. It values hospitality, education, resilience, respect, and ambition. Through its examples and learning materials, Nibras presents a Jordanian narrative that is modern, generous, thoughtful, and deeply connected to its Arab identity.
              </p>
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
      <DailyDropSheet
        open={dailyDropOpen}
        onOpenChange={setDailyDropOpen}
        drop={todaysDrop}
        onVocabClick={openVocabEntry}
      />

      {/* Vocabulary Entry */}
      <VocabEntrySheet
        open={vocabOpen}
        onOpenChange={setVocabOpen}
        entry={selectedVocabEntry}
        fallbackTerm={selectedVocabTerm}
      />

      {/* Word of Day */}
      <WordOfDaySheet open={wordOfDayOpen} onOpenChange={setWordOfDayOpen} word={todaysWord} />

      {/* Idioms */}
      <IdiomSheet open={idiomSheetOpen} onOpenChange={setIdiomSheetOpen} />

      {/* Pronunciation Lab */}
      <PronunciationLab open={pronunciationOpen} onOpenChange={setPronunciationOpen} />

      {/* Writing Lab */}
      <WritingLabSheet open={writingLabOpen} onOpenChange={setWritingLabOpen} />

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
}
