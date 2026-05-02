"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ────────────────────────────── DATA ────────────────────────────── */

const dailyDrop = {
  level: "B1",
  title: "Overcoming Stage Fright",
  body: `Ahmad took a deep breath before walking to the front of the classroom. It was his final presentation for the Essentials of Public Speaking course at the University of Jordan. His hands were shaking slightly, but he remembered his professor\u2019s advice: \u201cConfidence is built, not given.\u201d As he looked at his classmates, he realized they wanted him to succeed. He smiled, introduced his topic on AI integration, and the words began to flow naturally.`,
};

const wordOfDay = {
  word: "Resilience",
  partOfSpeech: "(Noun)",
  phonetic: "/r\u026A\u02C8z\u026Al.j\u0259ns/",
  arabic: "\u0635\u0645\u0648\u062F (Sumud)",
  example:
    "The resilience of the Palestinian people inspires the whole world.",
};

const idiomOfDay = {
  idiom: "Break the ice",
  definition:
    "To make people feel more comfortable in a new situation.",
  example:
    "Serving Arabic coffee is a great way to break the ice before a meeting.",
};

const interests = [
  {
    emoji: "\uD83D\uDE97",
    title: "Automotive & Tech",
    description: "Vocab: Luxury vehicles & engineering",
    borderColor: "hover:border-aqaba",
  },
  {
    emoji: "\uD83D\uDCAA",
    title: "Gym & Fitness",
    description: "Vocab: Resistance training & health",
    borderColor: "hover:border-olive",
  },
  {
    emoji: "\uD83C\uDFDB\uFE0F",
    title: "History & Heritage",
    description: "Passages: Culture & identity",
    borderColor: "hover:border-petra",
  },
  {
    emoji: "\uD83D\uDCBC",
    title: "Business in Amman",
    description: "Passages: Startups & interviews",
    borderColor: "hover:border-yellow-500",
  },
];

/* ────────────────────────────── PAGE ────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Navigation ─── */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
          <h1 className="text-2xl font-bold text-aqaba tracking-tight">
            Nibras English
          </h1>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-olive border-none hover:bg-green-100 py-1 px-3 text-sm font-semibold">
              {"\uD83D\uDD25"} 5 Day Streak
            </Badge>
            <Button className="bg-petra hover:bg-petra-dark text-white shadow rounded-md transition-colors">
              Placement Test
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <header className="max-w-6xl mx-auto mt-10 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
          Master English. Stay Rooted.
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore daily readings, practical vocabulary, and grammar tailored to
          your world.
        </p>
      </header>

      {/* ─── Main Content Grid ─── */}
      <main className="max-w-6xl mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Drop (2 cols) */}
        <Card className="md:col-span-2 border-t-4 border-t-aqaba shadow-lg rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-aqaba">
                Today&apos;s Daily Drop
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
                Level: {dailyDrop.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h4 className="text-xl font-semibold mb-3">{dailyDrop.title}</h4>
            <p className="text-gray-700 leading-relaxed mb-4">{dailyDrop.body}</p>
            <button className="text-aqaba font-semibold hover:underline transition-colors">
              Read full passage &amp; take quiz &rarr;
            </button>
          </CardContent>
        </Card>

        {/* Sidebar: Word + Idiom */}
        <aside className="space-y-6">
          {/* Word of the Day */}
          <Card className="border-t-4 border-t-petra shadow-lg rounded-xl">
            <CardContent className="pt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                Word of the Day
              </h3>
              <h4 className="text-3xl font-bold text-petra mb-1">
                {wordOfDay.word}
              </h4>
              <p className="text-sm text-gray-600 italic mb-3">
                {wordOfDay.partOfSpeech} &bull; {wordOfDay.phonetic}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Arabic:</strong> {wordOfDay.arabic}
              </p>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border-l-4 border-petra">
                &ldquo;{wordOfDay.example}&rdquo;
              </p>
            </CardContent>
          </Card>

          {/* Idiom of the Day */}
          <Card className="border-t-4 border-t-olive shadow-lg rounded-xl">
            <CardContent className="pt-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                Idiom of the Day
              </h3>
              <h4 className="text-xl font-bold text-olive mb-2">
                {idiomOfDay.idiom}
              </h4>
              <p className="text-sm text-gray-700">{idiomOfDay.definition}</p>
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded border-l-4 border-olive">
                &ldquo;{idiomOfDay.example}&rdquo;
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* ─── Explore by Interest ─── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Explore by Interest
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {interests.map((item) => (
            <Card
              key={item.title}
              className={`text-center cursor-pointer shadow hover:shadow-md transition-all duration-200 border-b-2 border-gray-200 ${item.borderColor} rounded-lg group`}
            >
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h4 className="font-semibold text-gray-800 group-hover:text-aqaba transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
