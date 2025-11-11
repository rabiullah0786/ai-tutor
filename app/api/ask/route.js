// import OpenAI from "openai";

// export async function POST(req) {
//   console.log("🔑 OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

//   try {
//     const body = await req.json();

//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: body.message }],
//     });

//     console.log("✅ AI response:", response.choices[0].message.content);

//     return Response.json({ reply: response.choices[0].message.content });
//   } catch (err) {
//     console.error("❌ Gemini API error:", err);
//     return Response.json({ error: err.message });
//   }
// }



import OpenAI from "openai";

export const runtime = "edge"; // fast edge runtime (if Next.js 13+)

export async function POST(req) {
  try {
    console.log("🔑 OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

    const { message } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
   
    });

    const aiResponse = completion.choices[0].message.content;
    console.log("✅ AI response:", aiResponse);

    // ✅ frontend ke liye JSON me proper key send karo
    return new Response(JSON.stringify({ answer: aiResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return new Response(JSON.stringify({ error: "AI request failed" }), {
      status: 500,
    });
  }
}




// import OpenAI from "openai";

// export const runtime = "edge"; // fast edge runtime (if Next.js 13+)

// export async function POST(req) {
//   const { message } = await req.json();

//   const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//   const stream = await client.chat.completions.create({
//     model: "gpt-4o-mini", // fastest model
//     messages: [{ role: "user", content: message }],
//     stream: true, // 👈 ye important hai
//   });

//   const encoder = new TextEncoder();
//   const decoder = new TextDecoder();

//   const readableStream = new ReadableStream({
//     async start(controller) {
//       for await (const chunk of stream) {
//         const text = chunk.choices[0]?.delta?.content || "";
//         controller.enqueue(encoder.encode(text));
//       }
//       controller.close();
//     },
//   });

//   return new Response(readableStream, {
//     headers: { "Content-Type": "text/plain" },
//   });
// }
