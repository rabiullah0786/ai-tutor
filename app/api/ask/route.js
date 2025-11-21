

import mongoose from "mongoose";
import OpenAI from "openai";
import { marked } from "marked";
import connectDB from "../../../lib/mongodb";
import Question from "../../../models/Question";

// ================================
// 📌 AI + DATABASE ENABLED ROUTE
// ================================
export async function POST(req) {
  try {
    await connectDB(); // <- DB Connect
    const contentType = req.headers.get("content-type") || "";
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // ===========================
    // 📌 CLEAN MARKDOWN PROMPT
    // ===========================
    function formatPrompt(userMessage) {
      return `
You MUST answer ONLY in clean Markdown.

Markdown Formatting Rules:
- Use ## for headings
- Use **bold** for important words
- Use - or numbers for bullet points
- Always write easy-to-understand explanation
- Make layout clean like ChatGPT

User question:
${userMessage}
`;
    }

    // ================================
    // 🖼 IMAGE REQUEST HANDLER
    // ================================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image");
      const message = formData.get("message") || "Describe this image.";
      const email = formData.get("email") || "guest";

      if (!file) {
        return new Response(
          JSON.stringify({ error: "No image provided." }),
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");

      const response = await client.chat.completions.create({
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
        max_tokens: 500,
      });

      const aiResponse = response.choices[0].message.content;

      // 👇 Markdown → HTML + padding & gap
      const html =
        `<div style="padding:12px; line-height:1.55; display:block; gap:8px;">` +
        marked(aiResponse) +
        `</div>`;

      // ===========================
      // 📌 SAVE TO DATABASE
      // ===========================
      await Question.create({
        email,
        question: message,
        type: "image",
      });

      return new Response(
        JSON.stringify({
          success: true,
          type: "image",
          content: html,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ================================
    // ✍ TEXT MESSAGE HANDLER
    // ================================
    const { message, email } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required." }),
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: formatPrompt(message) }],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // 👇 Markdown → HTML + padding & gap
    const html =
      `<div style="padding:12px; line-height:1.55; display:block; gap:8px;">` +
      marked(aiResponse) +
      `</div>`;

    // ===========================
    // 📌 SAVE TO DATABASE
    // ===========================
    await Question.create({
      email: email || "guest",
      question: message,
      type: "text",
    });

    return new Response(
      JSON.stringify({
        success: true,
        type: "text",
        content: html,
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
        rateLimited: error?.status === 429,
      }),
      { status: error?.status || 500 }
    );
  }
}
