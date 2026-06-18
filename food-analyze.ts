import { Router } from "express";

const router = Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

const PROMPT = `You are a nutrition expert. Analyze the food in this image.
Respond with ONLY a valid JSON object — no markdown, no code fences, no extra text.
Keep each string value short (under 15 words). Limit each array to 3 items max.

Required format:
{"food_name":"...","is_healthy":true,"health_score":7,"reason":"...","nutrition":{"calories":"...","protein":"...","carbs":"...","fat":"...","fiber":"...","sugar":"..."},"benefits":["...","..."],"concerns":["...","..."],"alternatives":["...","..."],"tips":["...","..."]}`;

async function callGemini(
  apiKey: string,
  imageBase64: string,
  mimeType: string,
): Promise<Response> {
  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
        ],
      },
    ],
  });

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, attempt * 5000));
    }
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.status !== 429) return res;
  }

  // Return the last 429 response after exhausting retries
  return fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

router.post("/food-analyze", async (req, res) => {
  const { imageBase64, mimeType } = req.body as {
    imageBase64?: string;
    mimeType?: string;
  };

  if (!imageBase64) {
    res.status(400).json({ error: "imageBase64 is required" });
    return;
  }

  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "Gemini API key not configured" });
    return;
  }

  try {
    const response = await callGemini(
      apiKey,
      imageBase64,
      mimeType || "image/jpeg",
    );

    if (!response.ok) {
      const errText = await response.text();
      req.log.error(
        { status: response.status, body: errText },
        "Gemini API error",
      );
      if (response.status === 429) {
        res
          .status(429)
          .json({ error: "Rate limit reached. Please wait a moment and try again." });
      } else if (response.status === 400) {
        res
          .status(400)
          .json({ error: "Could not process this image. Please upload a clear food photo." });
      } else {
        res.status(502).json({ error: "AI service error. Please try again." });
      }
      return;
    }

    const geminiData = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: unknown;
    try {
      // Strip markdown code fences
      let cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

      // Extract outermost JSON object
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }

      parsed = JSON.parse(cleaned);
    } catch {
      req.log.error({ rawText }, "Failed to parse Gemini JSON response");
      res
        .status(502)
        .json({ error: "Could not parse AI response. Please try again." });
      return;
    }

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Food analyze error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
