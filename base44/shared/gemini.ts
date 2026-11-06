import { secrets } from "base44:runtime";

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";
// Tried in order; the next model is used when one is unavailable or overloaded.
const MODELS = ["gemini-3.5-flash", "gemini-3.6-flash"];
const RETRYABLE = [404, 429, 500, 503];
const MAX_INLINE_BYTES = 8 * 1024 * 1024;

function toBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function parseJson(text) {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("Gemini did not return valid JSON");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

/**
 * Fetches a file (public or signed URL) and turns it into a Gemini inline part.
 */
export async function filePart(url, timeoutMs = 20000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`Could not open the attached file (${res.status})`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength > MAX_INLINE_BYTES) throw new Error("The attached file is too large");
  const mimeType = (res.headers.get("content-type") || "").split(";")[0].trim() || "application/octet-stream";
  return { inlineData: { mimeType, data: toBase64(bytes) } };
}

/**
 * Sends parts ({ text } plus optional inline files) to Gemini and returns the reply text.
 */
export async function generate(parts, options = {}) {
  const apiKey = secrets.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const { temperature = 0.7, maxOutputTokens = 4096, timeoutMs = 60000 } = options;

  const payload = {
    contents: [{ role: "user", parts }],
    generationConfig: { temperature, maxOutputTokens },
  };

  let lastError = null;

  for (const model of MODELS) {
    const res = await fetch(`${API_ROOT}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      const candidate = data?.candidates?.[0];
      const text = (candidate?.content?.parts || [])
        .map((part) => part?.text || "")
        .join("")
        .trim();
      if (text) return text;
      lastError = new Error(
        candidate?.finishReason === "SAFETY"
          ? "That request was blocked by the safety filters."
          : "Gemini returned an empty reply."
      );
      break;
    }

    lastError = new Error(data?.error?.message || `Gemini request failed (${res.status})`);
    if (!RETRYABLE.includes(res.status)) break;
  }

  throw lastError || new Error("Gemini request failed");
}

/**
 * Same as generate() but asks Gemini for JSON matching the given schema and parses it.
 */
export async function generateJson(parts, schema, options = {}) {
  const settings = { maxOutputTokens: 4096, ...options };
  const instruction = {
    text: `Return only JSON, with no commentary and no markdown fences outside it, matching this schema exactly:\n${JSON.stringify(schema)}`,
  };

  const text = await generate([...parts, instruction], settings);
  try {
    return parseJson(text);
  } catch {
    const retry = await generate(
      [...parts, instruction, { text: "Your previous answer was not valid JSON. Reply with ONLY the JSON object." }],
      settings
    );
    return parseJson(retry);
  }
}
