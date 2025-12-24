

// import mongoose from "mongoose";
// import OpenAI from "openai";
// import { marked } from "marked";
// import connectDB from "../../../lib/mongodb";
// import Question from "../../../models/Question";

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
// - Always write easy-to-understand explanation
// - Make layout clean like ChatGPT

// User question:
// ${userMessage}
// `;
//     }

//     // IMAGE HANDLER
//     if (contentType.includes("multipart/form-data")) {
//       const formData = await req.formData();
//       const file = formData.get("image");
//       const message = formData.get("message") || "Describe this image.";
//       const email = formData.get("email") || "guest";

//       if (!file) {
//         return new Response(JSON.stringify({ error: "No image provided." }), { status: 400 });
//       }

//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       const base64Image = buffer.toString("base64");

//       const response = await client.chat.completions.create({
//         model: "gpt-4.1-mini",
//         messages: [
//           {
//             role: "system",
//             content: `
// You are Televora AI, developed by Televora Company with help of OpenAI.
// Always introduce yourself as Televora AI.
// Never say you are ChatGPT.
// If user asks "What is your name?" respond with "I am Televora AI".
// If user asks "Who developed you?" respond with "I am developed by Televora Company with help of OpenAI".
// Be friendly and helpful.
//             `
//           },
//           {
//             role: "user",
//             content: formatPrompt(message)
//           },
//           {
//             role: "user",
//             content: `Image attached: data:${file.type};base64,${base64Image}`
//           }
//         ],
//         max_tokens: 500,
//       });

//       const aiResponse = response.choices[0].message.content;

//       // SAVE TO DB
//       await Question.create({ email, question: message, type: "image" });

//       const html = `<div style="padding:12px; line-height:1.55; display:block; gap:8px;">${marked(aiResponse)}</div>`;
//       return new Response(JSON.stringify({ success: true, type: "image", content: html }), { status: 200, headers: { "Content-Type": "application/json" } });
//     }

//     // TEXT MESSAGE HANDLER
//     const { message, email } = await req.json();
//     if (!message) return new Response(JSON.stringify({ error: "Message is required." }), { status: 400 });

//     const completion = await client.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages: [
// //         {
// //           role: "system",
// //           content: `
// You are Televora AI, developed by Televora Company with help of OpenAI.
// Always introduce yourself as Televora AI.
// Never say you are ChatGPT.
// If user asks "What is your name?" respond with "I am Televora AI".
// If user asks "Who developed you?" respond with "I am developed by Televora Company with help of OpenAI".
// Be friendly and helpful.
//           `
// //         },
// //         {
// //           role: "user",
// //           content: formatPrompt(message)
// //         }
// //       ],
// //       max_tokens: 500,
// //     });

// //     const aiResponse = completion.choices[0].message.content;

// //     // SAVE TO DB
// //     await Question.create({ email: email || "guest", question: message, type: "text" });

// //     const html = `<div style="padding:14px; line-height:1.55; display:block; gap:10px;">${marked(aiResponse)}</div>`;

// //     return new Response(JSON.stringify({ success: true, type: "text", content: html }), { status: 200, headers: { "Content-Type": "application/json" } });
// //   } catch (error) {
// //     console.error("❌ API Error:", error);
// //     return new Response(JSON.stringify({ error: error.message || "AI request failed", rateLimited: error?.status === 429 }), { status: error?.status || 500 });
// //   }
// // }







import mongoose from "mongoose";
import OpenAI from "openai";
import { marked } from "marked";
import connectDB from "../../../lib/mongodb";
import Question from "../../../models/Question";

/* =========================
   🔎 IDENTITY CHECK
========================= */
function isIdentityQuestion(text = "") {
  const q = text.toLowerCase();
  return (
    q.includes("your name") ||
    q.includes("who are you") ||
    q.includes("who developed you") ||
    q.includes("who created you")
  );
}




  /* =========================
     🧠 PROMPT FORMATTER
  ========================= */
  function formatPrompt(userMessage) {
    return `
You MUST answer ONLY in clean Markdown.

Rules:
- Use ## headings
- Use **bold** for key points
- Use bullet points
- Explain simply
- Layout must look like ChatGPT
- If question is about current affairs, answer with LATEST known info

User question:
${userMessage}
`;
  }

  /* =========================
     🚀 POST HANDLER
  ========================= */
  export async function POST(req) {
    try {
      await connectDB();

      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const contentType = req.headers.get("content-type") || "";
      let message = "";
      let email = "guest";

      /* =========================
         🧾 READ BODY
      ========================= */
      if (!contentType.includes("multipart/form-data")) {
        const body = await req.json();
        message = body.message;
        email = body.email || "guest";
      }

      /* =========================
         🧠 IDENTITY RESPONSE
      ========================= */
      if (message && isIdentityQuestion(message)) {
        return new Response(
          JSON.stringify({
            success: true,
            type: "text",
            content: `
<div style="padding:14px; line-height:1.6;">
<b>I am Televora AI</b>, created by <b>Televora Company</b> with support of <b>OpenAI</b>.
</div>`
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }


      /* =========================
         🖼️ IMAGE HANDLER (FIXED)
      ========================= */
      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const file = formData.get("image");
        const imgMessage = formData.get("message") || "Describe this image.";
        email = formData.get("email") || "guest";

        if (!file) {
          return new Response(
            JSON.stringify({ error: "No image provided" }),
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString("base64");

        // ✅ SAFE for PNG / JPG / HEIC / WebP
        const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

        const response = await client.responses.create({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: `You are Televora AI, developed by Televora Company with help of OpenAI.
              Always introduce yourself as Televora AI.
              Never say you are ChatGPT.
              If user asks "What is your name?" respond with "I am Televora AI".
              If user asks "Who developed you?" respond with "I am developed by Televora Company with help of OpenAI".
              Be friendly and helpful.`
            },
            {
              role: "user",
              content: [
                { type: "input_text", text: formatPrompt(imgMessage) },
                {
                  type: "input_image",
                  image_url: imageDataUrl
                }
              ]
            }
          ]
        });

        const aiResponse = response.output_text;

        await Question.create({
          email,
          question: imgMessage,
          type: "image"
        });

        return new Response(
          JSON.stringify({
            success: true,
            type: "image",
            content: `<div style="padding:12px;">${marked(aiResponse)}</div>`
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      /* =========================
         💬 NORMAL TEXT RESPONSE
      ========================= */
      if (!message) {
        return new Response(
          JSON.stringify({ error: "Message required" }),
          { status: 400 }
        );
      }

      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:  `You are Televora AI, developed by Televora Company with help of OpenAI.
            Always introduce yourself as Televora AI.
            Never say you are ChatGPT.
            If user asks "What is your name?" respond with "I am Televora AI".
            If user asks "Who developed you?" respond with "I am developed by Televora Company with help of OpenAI".
            Be friendly and helpful.`
          },
          {
            role: "user",
            content: formatPrompt(message)
          }
        ]
      });

      const fullText = response.output_text;

      await Question.create({
        email,
        question: message,
        type: "text"
      });

      return new Response(
        JSON.stringify({
          success: true,
          type: "text",
          html: `<div style="padding:14px;">${marked(fullText)}</div>`
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("❌ API ERROR:", error);
      return new Response(
        JSON.stringify({
          error: error.message || "AI failed"
        }),
        { status: 500 }
      );
    }
  }
