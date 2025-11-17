

import OpenAI from "openai";
export const runtime = "edge";
import { marked } from "marked";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // =============================================================
    // 📌 CLEAN MARKDOWN PROMPT (NO HTML ANYMORE)
    // =============================================================
    function formatPrompt(userMessage) {
      return `
You MUST answer ONLY in clean Markdown.

Markdown Formatting Rules:
- Use ## for headings
- Use **bold** for important words
- Use - or numbers for bullet points
- Use normal paragraphs for explanation
- Make it clean like ChatGPT answers

User question:
${userMessage}
`;
    }

    // =============================================================
    // 🖼 IMAGE REQUEST HANDLER
    // =============================================================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      const message = formData.get("message") || "Describe this image.";

      if (!file) {
        return new Response(JSON.stringify({ error: "No image provided." }), {
          status: 400,
        });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Image = buffer.toString("base64");

      const completion = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: formatPrompt(message) },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 400,
      });

      const aiResponse = completion.choices[0].message.content;

      // Convert Markdown → HTML
      const html = marked(aiResponse);

      return new Response(
        JSON.stringify({
          success: true,
          answer: html,
          type: "image",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // =============================================================
    // ✍ TEXT MESSAGE HANDLER
    // =============================================================
    const { message } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: formatPrompt(message) }],
      max_tokens: 400,
    });

    const aiResponse = completion.choices[0].message.content;

    // Convert Markdown → HTML
    const html = marked(aiResponse);

    return new Response(
      JSON.stringify({
        success: true,
        answer: html,
        type: "text",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ API Error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "AI request failed",
        rateLimited: error?.status === 429 ? true : false,
      }),
      { status: error?.status || 500 }
    );
  }
}
