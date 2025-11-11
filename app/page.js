"use client";
import { Mic, Send, Plus } from "lucide-react";
import { useState } from "react";

// Function to highlight important keywords in the answer
const highlightImportant = (text) => {
  if (!text) return "";
  const keywords = [
    "PHOTOSYNTHESIS", "RESPIRATION", "CELL", "ATOM", "MOLECULE",
    "EQUATION", "GRAVITY", "FORCE", "ENERGY", "CURRENT", "RESISTANCE",
    "ACID", "BASE", "SALT", "GLUCOSE", "OXYGEN", "CARBON DIOXIDE",
    "INERTIA", "MASS", "ACCELERATION"
  ];
  let out = text;
  // Replace keywords with highlighted format, case-insensitive
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b${kw}\\b`, "gi");
    out = out.replace(re, (match) => `<u><b>${match}</b></u>`);
  });
  // Convert newlines to <br/>
  out = out.replace(/\n/g, "<br/>");
  return out;
};

export default function ChatBox() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📁 File uploaded:", file.name);
      alert(`File uploaded: ${file.name}`);
    }
  };

  // Send AI request when user submits
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setAnswer("<i>Thinking...</i>");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", { // Endpoint matches api/ask/route.js
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      console.log("✅ API raw response:", data);

      // Highlight important points
      const finalText = highlightImportant(data.answer);
      setAnswer(finalText);
    } catch (error) {
      setAnswer("⚠️ Error fetching answer from AI. Please try again.");
      console.error("❌ Fetch error:", error);
    }
    setLoading(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md relative">
        {/* Left: Login Button */}
        <div className="relative">
          <button
            onClick={() => setShowLoginOptions(!showLoginOptions)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
          {/* Dropdown */}
          {showLoginOptions && (
            <div className="absolute mt-2 bg-white border rounded-lg shadow-lg w-40">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                <span>📱</span>
                <span>Mobile</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                <span>🔍</span>
                <span>Google</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                <span>🍎</span>
                <span>Apple</span>
              </button>
            </div>
          )}
        </div>
        {/* Right: Project Name */}
        <div className="text-xl font-bold text-blue-600">EduMind AI</div>
      </nav>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-semibold mb-4">
          Ask with <span className="text-blue-600">AI</span> for Better Learning
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Get instant answers, explanations, and practice questions for any topic.
        </p>
        {/* Chat Box */}
        <form
          onSubmit={handleSend}
          className="w-full max-w-md flex items-center bg-white shadow-lg rounded-lg p-2 border border-gray-200 transition"
        >
          {/* Upload Button */}
          <label
            htmlFor="fileUpload"
            className="p-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center mx-1 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-gray-600 hover:text-blue-600 transition" />
            <input
              id="fileUpload"
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {/* Input Field */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your question here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 placeholder-gray-500 bg-white"
          />
          {/* Mic Button */}
          <button
            type="button"
            onClick={() => alert("🎙️ Voice input coming soon!")}
            className="p-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center mx-1"
          >
            <Mic className="w-5 h-5 text-gray-600 hover:text-blue-600 transition" />
          </button>
          {/* Send Button */}
          <button
            type="submit"
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center shadow-md"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
        {/* Display answer after question is sent */}
        {answer && (
          <div
            className="mt-6 text-left p-4 bg-blue-50 text-gray-800 rounded-lg border border-blue-200 shadow-md w-full max-w-md"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} EduMind AI — All rights reserved.
      </footer>
    </div>
  );
}
