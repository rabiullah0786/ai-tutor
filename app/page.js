

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

  const [selectedMode, setSelectedMode] = useState("Normal");

  // NEW STATES (image upload)
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save user on login
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
        }),
      });
    }
  }, [session]);

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowPlusMenu(false);

    // auto message in chat
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "image uploaded. Please analyze it." },
    ]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    const userMsg =
      selectedMode === "Normal"
        ? message.trim()
        : selectedMode === "Notes"
          ? `Make easy notes for: ${message}`
          : selectedMode === "Explain"
            ? `Explain in simple words: ${message}`
            : message.trim();

    if (message.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    }

    setMessage("");
    setLoading(true);

    try {
      let res;
      if (imageFile) {
        // ✅ IMAGE CASE → FormData
        const formData = new FormData();
        formData.append("message", userMsg);
        formData.append("email", session?.user?.email || "guest");
        formData.append("image", imageFile);

        res = await fetch("/api/ask", {
          method: "POST",
          body: formData,
        });
      } else {
        // ✅ TEXT CASE → JSON
        res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg,
            email: session?.user?.email || "guest",
          }),
        });
      }

      const data = await res.json();
      const aiText = data.content || data.html || data.answer || "No response.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);

      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
     
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-20">
        <div className="relative">
          <button
            onClick={() => setShowLoginOptions(!showLoginOptions)}
            className="px-5 py-2 bg-blue-500 text-white rounded-full font-medium shadow hover:bg-blue-600 transition flex items-center gap-2"
          >
            {/* MOBILE IMAGE */}
            
            <img
              src="/account-logo.svg"
              alt="Logo"
              className=" w-6 h-6 md:hidden"
            />
            

            {/* DESKTOP TEXT */}
            <span className="hidden md:block">
              {session ? "Account >" : "Login"}
            </span>
          </button>

          {showLoginOptions && (
            <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border p-4 z-50">
              <LoginButton />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">
        <div className="w-9 h-10  " ><img src="/favicon.png" alt="" /></div>
            Flixy-AI
        </div>
      </nav>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col items-center text-center px-2 py-2">
        <h1 className="text-3xl font-semibold mb-2">
          Ask with <span className="text-blue-600">AI</span>
        </h1>

        <div className="text-gray-600 mb-2 text-sm">
          <p>Get instant answers, explanations, and more</p>
          <p>specially created for 10+12 students.</p>
        </div>

        {/* MODE SELECT BUTTONS */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setSelectedMode("Normal")}
            className={`px-4 py-2 rounded-xl border ${selectedMode === "Normal"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            Normal
          </button>

          <button
            onClick={() => setSelectedMode("Explain")}
            className={`px-4 py-2 rounded-xl border ${selectedMode === "Explain"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            Explain
          </button>

          <button
            onClick={() => setSelectedMode("Notes")}
            className={`px-4 py-2 rounded-xl border ${selectedMode === "Notes"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            Notes
          </button>
        </div>

        {/* CHAT BOX */}
        <div
          className="w-full max-w-4xl space-y-4 text-left px-3 py-3 rounded-xl h-[50vh] overflow-y-auto bg-white shadow pb-16"
          ref={scrollRef}
        >
          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <div className="p-3 bg-gray-100 rounded-xl w-fit">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-36 h-32 rounded-lg shadow"
              />
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl shadow-md prose prose-sm max-w-none ${msg.role === "user"
                ? "bg-blue-100 text-blue-900 ml-auto max-w-[80%]"
                : "bg-gray-100 text-gray-900 mr-auto max-w-[85%]"
                }`}
              dangerouslySetInnerHTML={{
                __html: marked(msg.content || ""),
              }}
            />
          ))}

          {loading && (
            <div className="text-gray-500 italic animate-pulse">Thinking...</div>
          )}
        </div>
      </main>

      {/* INPUT AREA */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-4 left-0 right-0 w-full max-w-2xl mx-auto flex items-center bg-white shadow-lg rounded-full p-2 border"
      >
        {/* + BUTTON */}
        <div className="relative mr-2">
          <button
            type="button"
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-2xl font-bold"
          >
            +
          </button>

          {showPlusMenu && (
            <div className="absolute bottom-12 left-0 bg-white shadow-xl border rounded-xl p-3 w-40 space-y-2 z-50">

              {/* IMAGE UPLOAD */}
              <label
                htmlFor="imageUpload"
                className="w-full block px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Upload Image
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask your question... (${selectedMode})`}
          className="flex-1 px-3 py-2  rounded-xl  focus:ring-0 focus:outline-none"
        />

        <button
          type="submit"
          className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 ml-2"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>

      <footer className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EduMind AI — All rights reserved.
      </footer>
    </div>
  );
}


