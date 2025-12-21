

import mongoose from "mongoose";
import OpenAI from "openai";
import { marked } from "marked";
import connectDB from "../../../lib/mongodb";
import Question from "../../../models/Question";

export async function POST(req) {
  try {
    await connectDB();
    const contentType = req.headers.get("content-type") || "";
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    // IMAGE HANDLER
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image");
      const message = formData.get("message") || "Describe this image.";
      const email = formData.get("email") || "guest";

      if (!file) {
        return new Response(JSON.stringify({ error: "No image provided." }), { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");

      const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
You are Televora AI, developed by Televora Company with help of OpenAI.
Always introduce yourself as Televora AI.
Never say you are ChatGPT.
If user asks "What is your name?" respond with "I am Televora AI".
If user asks "Who developed you?" respond with "I am developed by Televora Company with help of OpenAI".
Be friendly and helpful.
            `
          },
          {
            role: "user",
            content: formatPrompt(message)
          },
          {
            role: "user",
            content: `Image attached: data:${file.type};base64,${base64Image}`
          }
        ],
        max_tokens: 500,
      });

      const aiResponse = response.choices[0].message.content;

      // SAVE TO DB
      await Question.create({ email, question: message, type: "image" });

      const html = `<div style="padding:12px; line-height:1.55; display:block; gap:8px;">${marked(aiResponse)}</div>`;
      return new Response(JSON.stringify({ success: true, type: "image", content: html }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // TEXT MESSAGE HANDLER
    const { message, email } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: "Message is required." }), { status: 400 });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are Televora AI, developed by Televora Company with help of OpenAI.
Always introduce yourself as Televora AI.
Never say you are ChatGPT.
If user asks "What is your name?" respond with "I am Televora AI".
If user asks "Who developed you?" respond with "I am developed by Televora Company with help of OpenAI".
Be friendly and helpful.
          `
        },
        {
          role: "user",
          content: formatPrompt(message)
        }
      ],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    // SAVE TO DB
    await Question.create({ email: email || "guest", question: message, type: "text" });

    const html = `<div style="padding:14px; line-height:1.55; display:block; gap:10px;">${marked(aiResponse)}</div>`;

    return new Response(JSON.stringify({ success: true, type: "text", content: html }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "AI request failed", rateLimited: error?.status === 429 }), { status: error?.status || 500 });
  }
}






// import mongoose from "mongoose";
// import OpenAI from "openai";
// import { marked } from "marked";
// import connectDB from "../../../lib/mongodb";
// import Question from "../../../models/Question";

// /* =========================
//    🧠 CURRENT AFFAIRS CACHE
// ========================= */
// const CURRENT_AFFAIRS = {
//   usa_president: {
//     questionMatch: [
//       "president of usa",
//       "usa president",
//       "america president",
//       "america ke president",
//       "us president"
//     ],
//     answer: `
// ## President of the United States (2025)

// **Donald J. Trump** is the current President of the United States.

// - **47th President of the USA**
// - Took office on **20 January 2025**
// `
//   },

//   india_president: {
//     questionMatch: [
//       "president of india",
//       "india president",
//       "bharat ke rashtrapati"
//     ],
//     answer: `
// ## President of India

// **Droupadi Murmu** is the President of India.

// - 15th President of India
// - Took office on **25 July 2022**
// `
//   },

//   india_pm: {
//     questionMatch: [
//       "prime minister of india",
//       "india pm",
//       "bharat ke pradhan mantri"
//     ],
//     answer: `
// ## Prime Minister of India

// **Narendra Modi** is the Prime Minister of India.

// - Serving since **2014**
// `
//   }
// };

// /* =========================
//    🔎 CURRENT / RECENT CHECK
// ========================= */
// function isCurrentOrRecentQuestion(text) {
//   const keywords = [
//     "current",
//     "now",
//     "latest",
//     "today",
//     "present",
//     "who is",
//     "president",
//     "prime minister",
//     "election",
//     "2024",
//     "2025"
//   ];
//   return keywords.some(k => text.toLowerCase().includes(k));
// }

// /* =========================
//    🌐 DUCKDUCKGO WEB SEARCH
// ========================= */
// async function webSearch(query) {
//   const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
//     query
//   )}&format=json&no_redirect=1&no_html=1`;

//   const res = await fetch(url);
//   const data = await res.json();

//   let text = "";
//   let sources = [];

//   if (data.AbstractText) {
//     text += data.AbstractText + "\n";
//     if (data.AbstractURL) sources.push(data.AbstractURL);
//   }

//   if (data.RelatedTopics?.length) {
//     data.RelatedTopics.slice(0, 5).forEach(item => {
//       if (item.Text) text += item.Text + "\n";
//       if (item.FirstURL) sources.push(item.FirstURL);
//     });
//   }

//   return {
//     content: text.trim(),
//     sources: [...new Set(sources)].slice(0, 3),
//     hasData: text.trim().length > 30
//   };
// }

// /* =========================
//    📩 API HANDLER
// ========================= */
// export async function POST(req) {
//   try {
//     await connectDB();
//     const contentType = req.headers.get("content-type") || "";
//     const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//     function formatPrompt(userMessage) {
//       return `
// You MUST answer ONLY in clean Markdown.

// Markdown Formatting Rules:
// - Use ## for headings
// - Use **bold** for important words
// - Use - or numbers for bullet points
// - Easy explanation
// - Clean layout like ChatGPT

// User question:
// ${userMessage}
// `;
//     }

//     /* =========================
//        🖼️ IMAGE HANDLER
//     ========================= */
//     if (contentType.includes("multipart/form-data")) {
//       const formData = await req.formData();
//       const file = formData.get("image");
//       const message = formData.get("message") || "Describe this image.";
//       const email = formData.get("email") || "guest";

//       if (!file) {
//         return new Response(JSON.stringify({ error: "No image provided." }), { status: 400 });
//       }

//       const buffer = Buffer.from(await file.arrayBuffer());
//       const base64Image = buffer.toString("base64");

//       const response = await client.chat.completions.create({
//         model: "gpt-4.1-mini",
//         messages: [
//           {
//             role: "system",
//             content: `
// You are Televora AI, developed by Televora Company with help of OpenAI.
// Never say you are ChatGPT.
// Be friendly and helpful.
//             `
//           },
//           { role: "user", content: formatPrompt(message) },
//           { role: "user", content: `Image: data:${file.type};base64,${base64Image}` }
//         ],
//         max_tokens: 500
//       });

//       const aiResponse = response.choices[0].message.content;
//       await Question.create({ email, question: message, type: "image" });

//       return new Response(
//         JSON.stringify({
//           success: true,
//           type: "image",
//           content: `<div style="padding:12px;">${marked(aiResponse)}</div>`
//         }),
//         { status: 200 }
//       );
//     }

//     /* =========================
//        📝 TEXT HANDLER
//     ========================= */
//     const { message, email } = await req.json();
//     if (!message)
//       return new Response(JSON.stringify({ error: "Message is required." }), { status: 400 });

//     /* =========================
//        ⚡ INSTANT CURRENT ANSWER
//     ========================== */
//     const lowerMessage = message.toLowerCase();
//     for (const key in CURRENT_AFFAIRS) {
//       const item = CURRENT_AFFAIRS[key];
//       if (item.questionMatch.some(q => lowerMessage.includes(q))) {
//         return new Response(
//           JSON.stringify({
//             success: true,
//             type: "text",
//             content: `<div style="padding:14px; line-height:1.6;">${item.answer}</div>`
//           }),
//           { status: 200 }
//         );
//       }
//     }

//     /* =========================
//        📝 AI HANDLER
//     ========================== */
//     let finalPrompt = formatPrompt(message);
//     let selectedModel = "gpt-4.1-mini";
//     let webResult = null;

//     if (isCurrentOrRecentQuestion(message)) {
//       webResult = await webSearch(message);

//       if (webResult.hasData) {
//         selectedModel = "gpt-3.5-turbo";
//         finalPrompt = `
// You are Televora AI.
// Answer using the LATEST web information below.

// Web data:
// ${webResult.content}

// User question:
// ${message}

// Add a "Sources" section at the end.
//         `;
//       } else {
//         selectedModel = "gpt-4.1-mini";
//         finalPrompt = formatPrompt(message);
//         webResult = null;
//       }
//     }

//     const completion = await client.chat.completions.create({
//       model: selectedModel,
//       messages: [
//         {
//           role: "system",
//           content: `
// You are Televora AI, developed by Televora Company with help of OpenAI.
// Never say you are ChatGPT.
// Be friendly and helpful.
//         `
//         },
//         { role: "user", content: finalPrompt }
//       ],
//       max_tokens: 500
//     });

//     const aiResponse = completion.choices[0].message.content;

//     await Question.create({
//       email: email || "guest",
//       question: message,
//       type: "text"
//     });

//     let sourceHTML = "";
//     if (webResult?.sources?.length) {
//       sourceHTML = `
// <hr/>
// <h4>🔗 Sources</h4>
// <ul>
// ${webResult.sources.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join("")}
// </ul>`;
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         type: "text",
//         content: `
// <div style="padding:14px; line-height:1.6;">
// ${marked(aiResponse)}
// ${sourceHTML}
// </div>`
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ API Error:", error);
//     return new Response(
//       JSON.stringify({
//         error: error.message || "AI request failed",
//         rateLimited: error?.status === 429
//       }),
//       { status: error?.status || 500 }
//     );
//   }
// }
