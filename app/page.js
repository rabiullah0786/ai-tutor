
"use client";
import { Mic, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginButton from "./components/LoginButton";
import { marked } from "marked";

export default function ChatBox() {
  const { data: session } = useSession();

  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const fileInputRef = useRef(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  


  // ========== SAFE CLEANER FUNCTION (NO ERROR) ==========
  const formatAIText = (text) => {
    const safe = typeof text === "string" ? text : "";

    return safe
      // Remove newlines before :
      .replace(/\n\s*:/g, ":")

      // Convert headings into bold + underline + text-lg
      .replace(/(^|\n)([^:<>\n]{2,}):/g, (m, p1, p2) => {
        return `${p1}<div class="mt-3 mb-1 font-bold underline text-lg">${p2}:</div>`;
      })

      // Convert "-" lists into nice bullets
      .replace(/\n-\s+/g, `\n• `);
  };

  // ========== FILE UPLOAD ==========
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMessages((prev) => [
      ...prev,
      { type: "file", name: file.name, file },
      { role: "user", content: "📎 Uploaded: " + file.name }
    ]);

    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const aiText = data.highlighted || data.answer;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formatAIText(aiText) },
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // ========== SEND TEXT MESSAGE ==========
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message.trim();
    setMessage("");

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      const aiText = data.highlighted || data.answer || "No response.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formatAIText(aiText) },
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="relative">
          <button
            onClick={() => setShowLoginOptions(!showLoginOptions)}
            className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            {session ? "Account" : "Login"}
          </button>

          {showLoginOptions && (
            <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border p-4 z-50">
              {!session ? <LoginButton /> : <LoginButton />}
            </div>
          )}
        </div>

        <div className="text-xl font-bold text-blue-600">EduMind AI</div>
      </nav>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col items-center text-center px-4 py-4">

        <h1 className="text-3xl font-semibold mb-4">
          Ask with <span className="text-blue-600">AI</span> for Better Learning
        </h1>

        <p className="text-gray-600 mb-6 max-w-md">
          Get instant answers, explanations, and highlighted key points.
        </p>

        {/* INPUT BOX (BOTTOM FIXED) */}
        <form
          onSubmit={handleSend}
          className="fixed bottom-2 left-0 right-0 w-full max-w-md mx-auto flex items-center 
             bg-white shadow-lg rounded-xl p-3 border mb-3"
        >
          {/* ADD BUTTON */}
          <label className="cursor-pointer bg-gray-200 rounded-full shadow hover:bg-gray-300 
                    w-12 h-12 flex items-center justify-center text-2xl font-bold">
            +
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>

          {/* TEXT INPUT */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your question..."
            className="flex-1 px-4 py-2 border rounded-lg ml-3"
          />

          {/* MIC ICON */}
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 ml-2">
            <Mic className="w-5 h-5 text-gray-600" />
          </button>

          {/* SEND BUTTON */}
          <button type="submit" className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 ml-2">
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>


        {/* 🟨 Messages Display */}
        <div
          className="mt-6 w-full space-y-4 text-left px-4 h-full overflow-y-auto"
          ref={scrollRef}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl shadow leading-relaxed prose prose-lg max-w-none
      ${msg.role === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-yellow-50 text-black"
                }`}
              dangerouslySetInnerHTML={{
  __html: typeof msg.content === "string" ? marked(msg.content) : ""
}}

            />
          ))}

          {loading && <div className="text-gray-500 italic mt-2">Thinking...</div>}
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 ">
        © {new Date().getFullYear()} EduMind AI — All rights reserved.
      </footer>
    </div>
  );
}
