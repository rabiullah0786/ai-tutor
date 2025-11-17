
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // .env.local me rakho
// });

// export async function highlightWithAI(text) {
//   if (!text) return text;

//   try {
//     // Step 1: Extract important keywords or short phrases
//     const prompt = `
//       Extract the 8 most important keywords or short phrases from the following answer.
//       Return them as a comma-separated list, without explanation.
//       Answer:
//       """${text}"""
//     `;

//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const rawKeywords = aiResponse.choices[0].message.content;
//     const keywords = rawKeywords
//       .split(",")
//       .map((k) => k.trim().toLowerCase())
//       .filter((k) => k.length > 2);

//     // Step 2: Highlight the keywords in the original text
//     let highlighted = text;
//     keywords.forEach((keyword) => {
//       const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
//       highlighted = highlighted.replace(regex, `<mark>$1</mark>`);
//     });

//     return highlighted;
//   } catch (err) {
//     console.error("AI highlight error:", err);
//     return text; // fallback if AI fails
//   }
// }




import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function highlightWithAI(text) {
  if (!text) return text;

  try {
    // Step 1: Extract important keywords or short phrases
    const prompt = `
      Extract the 8 most important keywords or short phrases from the following answer.
      Return them as a comma-separated list, without explanation.
      Answer:
      """${text}"""
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rawKeywords = aiResponse.choices[0].message.content;
    const keywords = rawKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 2);

    // Step 2: Highlight keywords in the text
    let highlighted = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
      highlighted = highlighted.replace(regex, `<mark>$1</mark>`);
    });

    // ✅ Step 3: Format text for browser (terminal-style spacing + line breaks)
    highlighted = highlighted
      // preserve multiple spaces
      .replace(/  /g, "&nbsp;&nbsp;")
      // preserve line breaks
      .replace(/\n/g, "<br/>");

    return highlighted;
  } catch (err) {
    console.error("AI highlight error:", err);
    return text; // fallback if AI fails
  }
}
