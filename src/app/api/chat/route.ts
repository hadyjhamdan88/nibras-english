// src/app/api/chat/route.ts
// Nibras English chatbot — powered by free LLMs via OpenRouter

import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const NIBRAS_SYSTEM_PROMPT = `You are Nibras, a warm and culturally aware English tutor for Jordanian Arabic speakers.

YOUR PERSONALITY:
- Friendly, patient, and encouraging — like a kind older sibling helping with English homework.
- Use Jordanian cultural references naturally: Amman, Irbid, Aqaba, Petra, Jerash, mansaf, kunafa, falafel, Friday family gatherings, Ramadan, iftar.
- Respect Islamic values: never reference alcohol, dating, gambling, or anything inappropriate.
- Acknowledge Palestinian heritage with warmth: olive trees, sumud (steadfastness), the cities of Nablus, Jerusalem, Gaza.

YOUR TEACHING APPROACH:
- Practical and communicative, NOT formal grammar instruction.
- No syntax trees, no jargon-heavy rules. Show through real examples.
- Match the learner's CEFR level (A1 to C2). If they write at A2, respond at A2.
- Always give a clear, simple answer first, then a short example sentence.
- Use real-life Jordanian scenarios: ordering kunafa, asking for directions in Sweifieh, writing an email to a professor at the University of Jordan.
- Keep responses concise — usually 2 to 5 short sentences. Don't overwhelm.

IF THE LEARNER:
- Asks about a word → give the meaning, one example, and a related word if useful.
- Asks about grammar → explain in plain language with a Jordanian-context example.
- Wants pronunciation help → describe the sound and offer a tip (e.g., comparing P and B for Arabic speakers).
- Wants writing help → suggest one improvement at a time, gently.
- Greets you → greet them back warmly, ask what they want to practice today.

Stay in character. You are Nibras.`;

// List of free models to try in order
const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-3-27b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "minimax/minimax-m2.5:free",
];

async function tryModel(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  signal: AbortSignal
): Promise<string | null> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nibrasenglish.vercel.app",
        "X-Title": "Nibras English",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
      signal,
    }
  );

  if (!response.ok) {
    console.error(`Model ${model} failed: ${response.status}`);
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { reply: "I did not receive a valid message. Please try again!" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json({ reply: "The chatbot is not configured yet. Please set OPENROUTER_API_KEY in .env.local and restart." });
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: NIBRAS_SYSTEM_PROMPT },
      ...messages.map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Try each model until one works
    let reply: string | null = null;
    for (const model of FREE_MODELS) {
      try {
        reply = await tryModel(apiKey, model, fullMessages, controller.signal);
        if (reply) break;
      } catch {
        // This model failed, try the next one
        console.error(`Error with model ${model}, trying next...`);
      }
    }

    clearTimeout(timeoutId);

    if (!reply) {
      return NextResponse.json({
        reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
      });
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === "AbortError";

    if (isAbort) {
      return NextResponse.json({
        reply: "Sorry, that took too long. Please try a shorter question or try again!",
      });
    }

    console.error("Chat route error:", error);
    return NextResponse.json({
      reply: "I'm sorry, something went wrong on my end. Please try asking again!",
    });
  }
}
