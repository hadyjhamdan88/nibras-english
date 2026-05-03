// src/app/api/chat/route.ts
// Nibras English chatbot — OpenRouter integration with reliable chat models
// Uses fallback list of confirmed-working free chat models, with proper
// response parsing and detailed error logging.

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

const MODEL_FALLBACK_LIST = [
  "openrouter/free",
  "deepseek/deepseek-chat-v3.2:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-small-3.1:free",
];

async function callOpenRouter(
  apiKey: string,
  modelId: string,
  messages: ChatMessage[]
): Promise<{ ok: true; reply: string } | { ok: false; error: string; status?: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
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
          model: modelId,
          messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Nibras] Model ${modelId} returned ${response.status}: ${errorText}`);
      return { ok: false, error: errorText, status: response.status };
    }

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      data?.message?.content ??
      null;

    if (!reply || typeof reply !== "string" || reply.trim() === "") {
      console.error(`[Nibras] Model ${modelId} returned empty or malformed response:`, JSON.stringify(data).slice(0, 500));
      return { ok: false, error: "Empty response from model" };
    }

    console.log(`[Nibras] Success with model ${modelId}, reply length: ${reply.length}`);
    return { ok: true, reply };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const isAbort = error instanceof Error && error.name === "AbortError";
    const errorMsg = isAbort
      ? "Request timed out"
      : error instanceof Error
        ? error.message
        : "Unknown error";
    console.error(`[Nibras] Model ${modelId} threw error:`, errorMsg);
    return { ok: false, error: errorMsg };
  }
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
      console.error("[Nibras] OPENROUTER_API_KEY is not set");
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

    let lastError = "All models failed";
    for (const modelId of MODEL_FALLBACK_LIST) {
      const result = await callOpenRouter(apiKey, modelId, fullMessages);
      if (result.ok) {
        return NextResponse.json({ reply: result.reply });
      }
      lastError = result.error;
      if (result.status === 401) {
        break;
      }
    }

    console.error("[Nibras] All models in fallback list failed. Last error:", lastError);
    return NextResponse.json(
      {
        reply:
          "I'm sorry, I had trouble connecting. Please try asking again in a moment!",
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error("[Nibras] Chat route fatal error:", error);
    return NextResponse.json(
      {
        reply:
          "I'm sorry, something went wrong on my end. Please try asking again!",
      },
      { status: 500 }
    );
  }
}
