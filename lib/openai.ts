import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an embedding vector for the given text
 * using text-embedding-3-small (1536 dimensions).
 */
export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });
  return response.data[0].embedding;
}

/**
 * Parse passport OCR text into structured fields.
 * Uses GPT-4o-mini for fast, cheap extraction.
 */
export async function parsePassportOcr(rawText: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Extract passport data from the provided OCR text. " +
          "Return JSON with keys: name_en, gender, birth_date (YYYY-MM-DD), " +
          "nationality, passport_number, expiry_date (YYYY-MM-DD). " +
          "Use null for any missing fields.",
      },
      { role: "user", content: rawText },
    ],
  });

  try {
    return JSON.parse(response.choices[0].message.content ?? "{}");
  } catch {
    return {};
  }
}
