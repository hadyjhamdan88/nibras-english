"use client";

import { useState } from "react";
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
import { BookOpen, ArrowRight } from "lucide-react";

/* ─────────────────────────── TYPES ─────────────────────────── */

interface VocabItem {
  word: string;
  example: string;
}

interface ContentData {
  emoji: string;
  title: string;
  description: string;
  level: string;
  vocab: VocabItem[];
  passageTitle: string;
  passageBody: string[];
  passageBoldWords: string[];
}

/* ─────────────────────────── DATA ─────────────────────────── */

const dailyDrop = {
  level: "B1",
  title: "Overcoming Stage Fright",
  body: `Ahmad took a deep breath before walking to the front of the classroom. It was his final presentation for the Essentials of Public Speaking course at the University of Jordan. His hands were shaking slightly, but he remembered his professor\u2019s advice: \u201cConfidence is built, not given.\u201d As he looked at his classmates, he realized they wanted him to succeed. He smiled, introduced his topic on AI integration, and the words began to flow naturally.`,
};

const wordOfDay = {
  word: "Resilience",
  partOfSpeech: "(Noun)",
  phonetic: "/r\u026A\u02C8z\u026Al.j\u0259ns/",

  example: "The resilience of the Palestinian people inspires the whole world.",
};

const idiomOfDay = {
  idiom: "Break the ice",
  definition: "To make people feel more comfortable in a new situation.",
  example: "Serving Arabic coffee is a great way to break the ice before a meeting.",
};

const interests: ContentData[] = [
  {
    emoji: "\uD83D\uDE97",
    title: "Automotive & Tech",
    description: "Vocab: Luxury vehicles & engineering",
    level: "B2",
    vocab: [
      {
        word: "infotainment system",
        example: "The BMW 5 Series features an advanced infotainment system with navigation, voice commands, and wireless connectivity.",
      },
      {
        word: "collision avoidance",
        example: "Modern vehicles use radar and cameras for collision avoidance, helping prevent accidents on Amman\u2019s busy highways.",
      },
      {
        word: "fuel efficiency",
        example: "Many Jordanian families prioritize fuel efficiency because fuel prices have risen steadily in recent years.",
      },
      {
        word: "adaptive cruise control",
        example: "On long drives from Amman to Aqaba, adaptive cruise control automatically adjusts your speed to maintain a safe distance from the car ahead.",
      },
      {
        word: "regenerative braking",
        example: "Hybrid vehicles use regenerative braking to convert kinetic energy back into battery power when the driver slows down.",
      },
      {
        word: "horsepower",
        example: "The BMW 5 Series delivers impressive horsepower while maintaining a smooth, comfortable ride through city traffic.",
      },
      {
        word: "blind spot",
        example: "Before changing lanes on the Airport Road in Amman, always check your blind spot carefully for motorcycles.",
      },
      {
        word: "anti-lock braking system",
        example: "The anti-lock braking system prevents the wheels from locking up during sudden braking on wet roads.",
      },
    ],
    passageTitle: "From Green North to Red South",
    passageBody: [
      "The Al-Rashid family had been planning this trip for months. Abu Fadi had finally purchased a brand-new Toyota Land Cruiser \u2014 a silver 2025 model with leather seats, a large sunroof, and enough space to comfortably seat seven passengers. On a cool Friday morning in late October, with the car packed with home-cooked food, blankets, and plenty of Arabic coffee in a thermos, the family set off from their home in Irbid, heading south toward Aqaba.",
      "The first hour of the journey was familiar territory. They drove through the green, rolling hills of northern Jordan, passing through Jerash and then Ajloun, where the pine forests lined both sides of the road. As they descended toward the Jordan Valley, the landscape began to change dramatically. The green fields gradually gave way to rocky, brown hillsides, and the temperature climbed noticeably.",
      "South of Karak, the transformation was even more dramatic. The mountains gave way to vast, open desert. As they approached Wadi Rum, the desert turned a deep, burnt red. Towering sandstone cliffs rose on both sides of the road, sculpted by thousands of years of wind into shapes that looked almost human \u2014 arches, pillars, and bridges of rock reaching toward the pale blue sky. They reached Aqaba just after Maghrib prayer. The city lights were reflecting on the calm waters of the Red Sea.",
    ],
    passageBoldWords: [
      "Toyota Land Cruiser",
      "sweeping",
      "barren",
      "canyon",
      "breathtaking",
      "milestone",
    ],
  },
  {
    emoji: "\uD83D\uDCAA",
    title: "Gym & Fitness",
    description: "Vocab: Resistance training & health",
    level: "A2",
    vocab: [
      {
        word: "routine",
        example: "Ahmad follows the same routine every morning before class.",
      },
      {
        word: "resistance training",
        example: "Resistance training helps build strong muscles over time.",
      },
      {
        word: "bicep curls",
        example: "She does three sets of bicep curls with light weights.",
      },
      {
        word: "focused",
        example: "After his workout, Fadi feels more focused when he studies.",
      },
      {
        word: "progress",
        example: "If you keep going to the gym, you will see progress in a few weeks.",
      },
      {
        word: "stretches",
        example: "He starts with ten minutes of stretches to warm up his body.",
      },
      {
        word: "dumbbells",
        example: "Resistance training uses bands and light dumbbells to make your muscles work harder.",
      },
      {
        word: "repetitions",
        example: "He uses eight-kilogram weights and does three sets of twelve repetitions.",
      },
    ],
    passageTitle: "Study Hard, Train Hard",
    passageBody: [
      "Ahmad is a twenty-year-old student at Al al-Bayt University in Mafraq. Five days a week, he wakes up early, prays Fajr, and gets ready for his day. But Ahmad has a special part of his morning that most of his classmates do not know about. Before he opens a single textbook, he puts on his sports clothes, fills his water bottle, and walks to a small gym near his apartment in Sweifieh, Amman.",
      "Ahmad\u2019s routine at the gym is simple but effective. He starts with ten minutes of stretching to warm up his body. Then he moves on to resistance training, which uses bands and light dumbbells to make his muscles work harder. His favorite exercise is bicep curls. He uses eight-kilogram weights and does three sets of twelve repetitions. \u201CI started with three kilograms,\u201D Ahmad says with a smile. \u201CNow my arms are much stronger.\u201D",
      "After the gym, Ahmad goes home, showers, and eats a healthy breakfast. His mother always prepares labneh, olives, and fresh bread for him. Then he sits at his desk and studies for three to four hours. Ahmad believes that his morning workout helps him think more clearly. His classmate Omar joined the gym last month, and they train together on Saturdays.",
    ],
    passageBoldWords: [
      "routine",
      "resistance training",
      "bicep curls",
      "focused",
      "progress",
    ],
  },
  {
    emoji: "\uD83C\uDFDB\uFE0F",
    title: "History & Heritage",
    description: "Passages: Culture & identity",
    level: "B1\u2013C1",
    vocab: [
      {
        word: "Sumud",
        example: "Sumud, often translated as steadfastness, is a deeply rooted resilience that permeates Palestinian daily life.",
      },
      {
        word: "ancestral",
        example: "The olive trees symbolize an unbreakable bond between the people and their ancestral land.",
      },
      {
        word: "heritage",
        example: "Palestine\u2019s historical heritage stretches back millennia, encompassing a rich tapestry of civilizations.",
      },
      {
        word: "olive harvest",
        example: "The olive harvest brought families together, where children learned patience and hard work under the autumn sun.",
      },
      {
        word: "resilience",
        example: "The resilience of the Palestinian people inspires the whole world.",
      },
      {
        word: " steadfastness",
        example: "Sumud \u2014 steadfastness \u2014 remains unbroken despite decades of hardship.",
      },
      {
        word: "preservation",
        example: "The preservation of ancient olive trees is both an environmental and cultural responsibility.",
      },
      {
        word: "displacement",
        example: "Palestinian families demonstrate extraordinary resilience in the face of systematic displacement.",
      },
    ],
    passageTitle: "Finding Her Voice",
    passageBody: [
      "Layla had always been a quiet student. Throughout her first two years at the University of Jordan, she sat in the back rows of her lecture halls, took careful notes, and rarely raised her hand. When her academic advisor suggested she take Essentials of Public Speaking as an elective, Layla\u2019s first reaction was fear. She had experienced severe stage fright ever since she was a child.",
      "Layla thought about her professor\u2019s words for days. What did she truly care about? The answer came to her during a family dinner in Al Hashemiyyeh, Irbid. Her grandmother was telling stories about their family\u2019s olive groves near Nablus, before the occupation changed everything. Layla listened as her grandmother described the deep green hills, the sound of the wind through the olive branches, and the smell of fresh olive oil that filled every kitchen.",
      "She spent two weeks writing and rewriting her speech. She spoke about the olive trees of Palestine as a symbol of Sumud \u2014 steadfastness \u2014 and how her grandmother carried that strength to Jordan. On the day of the final presentation, Layla walked to the front of the classroom. Her heart was beating fast, but she took a deep breath, looked at her audience, and began to speak confidently. When she finished, the room was completely silent for a moment. Then her classmates began to clap.",
    ],
    passageBoldWords: [
      "stage fright",
      "persuasive",
      "audience",
      "confidently",
      "breakthrough",
    ],
  },
  {
    emoji: "\uD83D\uDCBC",
    title: "Business in Amman",
    description: "Passages: Startups & interviews",
    level: "B1\u2013B2",
    vocab: [
      {
        word: "startup",
        example: "Amman is becoming a hub for tech startups in the MENA region.",
      },
      {
        word: "entrepreneur",
        example: "A young entrepreneur launched a delivery app that serves all neighborhoods in Amman.",
      },
      {
        word: "investment",
        example: "Ethical investment portfolios increasingly screen out companies that profit from settlement expansion.",
      },
      {
        word: "commute",
        example: "The daily commute from Irbid to Amman can take over an hour during rush hour.",
      },
      {
        word: "deadline",
        example: "We have to submit the business plan before the deadline on Friday.",
      },
      {
        word: "networking",
        example: "Networking events in Amman bring together entrepreneurs, investors, and mentors.",
      },
      {
        word: "pitch",
        example: "She prepared a strong pitch for the investors at the startup incubator in Jabal Amman.",
      },
      {
        word: "revenue",
        example: "The company doubled its revenue in the second year by expanding to the Gulf market.",
      },
    ],
    passageTitle: "The Startup Scene in Amman",
    passageBody: [
      "Amman\u2019s startup ecosystem has been growing rapidly over the past decade. Co-working spaces have opened across the city \u2014 from the trendy cafes of Jabal Amman to the modern business parks near the 7th Circle. Young Jordanian entrepreneurs are building apps, launching e-commerce platforms, and creating innovative solutions to local challenges.",
      "The daily commute to these hubs can be challenging. Traffic on the Airport Road is notoriously heavy during rush hour, and the roundabouts near Shmeisani and Abdali are often gridlocked. Despite this, young professionals arrive each morning full of energy, ready to meet deadlines, attend networking events, and refine their pitches for potential investors.",
      "What makes Amman unique is the sense of community. Startups share resources, experienced founders mentor newcomers, and weekend hackathons bring together developers, designers, and business students from the University of Jordan, Jordan University of Science and Technology, and beyond. It is this spirit of collaboration \u2014 rooted in Arab traditions of generosity and mutual support \u2014 that drives the city\u2019s growing reputation as a regional center for innovation.",
    ],
    passageBoldWords: [
      "startup",
      "commute",
      "deadline",
      "networking",
      "revenue",
      "pitch",
    ],
  },
];

/* ─────────────────────── HELPERS ─────────────────────── */

function boldPassageWords(text: string, boldWords: string[]): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  // Find all bold word positions
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

/* ─────────────────────── COMPONENTS ─────────────────────── */

function VocabCard({ item, index }: { item: VocabItem; index: number }) {
  return (
    <div
      className="group border border-gray-100 rounded-lg p-4 hover:border-aqaba/30 hover:bg-blue-50/30 transition-colors"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-bold text-gray-900 group-hover:text-aqaba transition-colors">
          {item.word}
        </h4>
        <span className="text-xs text-gray-400 shrink-0 mt-0.5">#{index + 1}</span>
      </div>
      <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded border-l-3 border-aqaba/50">
        &ldquo;{item.example}&rdquo;
      </p>
    </div>
  );
}

function InterestSheetContent({ data }: { data: ContentData }) {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
      {/* Vocab Section */}
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

      {/* Reading Passage Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-5 text-petra" />
          <h3 className="text-lg font-bold text-gray-900">Reading Passage</h3>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 text-xs"
          >
            Level: {data.level}
          </Badge>
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-3">
          {data.passageTitle}
        </h4>
        <div className="space-y-3">
          {data.passageBody.map((paragraph, i) => (
            <p
              key={i}
              className="text-gray-700 leading-relaxed text-[15px]"
            >
              {boldPassageWords(paragraph, data.passageBoldWords)}
            </p>
          ))}
        </div>
      </section>

      <Separator className="my-6" />

      {/* Key Words Reference */}
      <section>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
          Key Words in This Passage
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.passageBoldWords.map((w) => (
            <Badge
              key={w}
              className="bg-aqaba/10 text-aqaba border-aqaba/20 hover:bg-aqaba/20"
            >
              {w}
            </Badge>
          ))}
        </div>
      </section>

      {/* Bottom padding for scroll */}
      <div className="h-8" />
    </ScrollArea>
  );
}

/* ─────────────────────── PAGE ─────────────────────── */

export default function Home() {
  const [selectedInterest, setSelectedInterest] = useState<ContentData | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleOpenInterest(data: ContentData) {
    setSelectedInterest(data);
    setSheetOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Navigation ─── */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
          <h1 className="text-2xl font-bold text-aqaba tracking-tight">
            Nibras English
          </h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <Badge className="bg-green-100 text-olive border-none hover:bg-green-100 py-1 px-3 text-xs sm:text-sm font-semibold">
              {"\uD83D\uDD25"} 5 Day Streak
            </Badge>
            <Button className="bg-petra hover:bg-petra-dark text-white shadow rounded-md transition-colors text-sm">
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
        <Card className="md:col-span-2 border-t-4 border-t-aqaba shadow-lg rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl sm:text-2xl text-aqaba">
                Today&apos;s Daily Drop
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 text-xs sm:text-sm"
              >
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
            <button className="text-aqaba font-semibold hover:underline transition-colors text-sm sm:text-base">
              Read full passage &amp; take quiz &rarr;
            </button>
          </CardContent>
        </Card>

        {/* Sidebar: Word + Idiom */}
        <aside className="space-y-6">
          {/* Word of the Day */}
          <Card className="border-t-4 border-t-petra shadow-lg rounded-xl">
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
            </CardContent>
          </Card>

          {/* Idiom of the Day */}
          <Card className="border-t-4 border-t-olive shadow-lg rounded-xl">
            <CardContent className="pt-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                Idiom of the Day
              </h3>
              <h4 className="text-lg sm:text-xl font-bold text-olive mb-2">
                {idiomOfDay.idiom}
              </h4>
              <p className="text-xs sm:text-sm text-gray-700">
                {idiomOfDay.definition}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded border-l-4 border-olive">
                &ldquo;{idiomOfDay.example}&rdquo;
              </p>
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
                <div className="mt-3 flex items-center justify-center gap-1 text-aqaba opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold">Explore</span>
                  <ArrowRight className="size-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Interest Sheet (slides from right) ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg bg-white p-0 overflow-hidden"
        >
          {selectedInterest && (
            <>
              <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-sand to-white">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {selectedInterest.emoji}
                  </span>
                  <div>
                    <SheetTitle className="text-xl font-bold text-gray-900">
                      {selectedInterest.title}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500 mt-0.5">
                      {selectedInterest.description}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="px-6">
                <InterestSheetContent data={selectedInterest} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Footer ─── */}
      <footer className="mt-auto bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p className="font-semibold text-aqaba">Nibras English</p>
          <p>Built for Jordanian learners, by Jordanian educators.</p>
        </div>
      </footer>
    </div>
  );
}
