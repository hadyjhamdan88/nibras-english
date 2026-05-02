// src/app/api/chat/route.ts
// Nibras English chatbot — powered by Qwen 3.6 via OpenRouter (free tier)
// Replaces the previous z-ai-web-dev-sdk implementation.

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
      console.error("OPENROUTER_API_KEY is not set in environment variables");
      return NextResponse.json(
        { reply: "The chatbot is not configured yet. Please try again later!" },
        { status: 500 }
      );
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: NIBRAS_SYSTEM_PROMPT },
      ...messages.map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nibrasenglish.vercel.app",
          "X-Title": "Nibras English",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: fullMessages,
          temperature: 0.7,
          max_tokens: 800,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return NextResponse.json(
        {
          reply:
            "I'm sorry, I had trouble connecting. Please try asking again in a moment!",
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      "I'm sorry, I couldn't think of a reply. Could you try rephrasing?";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === "AbortError";

    if (isAbort) {
      return NextResponse.json(
        {
          reply:
            "Sorry, that took too long. Please try a shorter question or try again!",
        },
        { status: 504 }
      );
    }

    console.error("Chat route error:", error);
    return NextResponse.json(
      {
        reply:
          "I'm sorry, something went wrong on my end. Please try asking again!",
      },
      { status: 500 }
    );
  }
}
