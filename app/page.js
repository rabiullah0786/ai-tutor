
"use client";
import { MicOff, Mic, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoginButton from "./components/LoginButton";
import { marked } from "marked";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DashboardMenu from "./components/DashboardMenu";


export default function Page({ comfort, setComfort }) {
  const { data: session } = useSession();

  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [selectedMode, setSelectedMode] = useState("Normal");

  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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

  // mic button
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setMessage((prev) => prev + finalTranscript);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };


  const downloadPDF = async (htmlContent) => {
    // Create temporary container
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "800px"; // maintain layout
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    // Convert HTML → Canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      backgroundColor: "#fff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190; // page width in mm
    const pageHeight = 295; // page height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight + 10;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("answer.pdf");
    document.body.removeChild(tempDiv);
  };


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
      <nav className="flex justify-between items-center py-1 px-2 shadow-md sticky top-0 z-20">

        <div className=" reletive ">
          <button
            onClick={() => setShowLoginOptions(!showLoginOptions)}
            className="px-3 py-2 bg-blue-500 text-white rounded-full font-medium shadow hover:bg-blue-600 transition flex items-center gap-2"
          >
            {/* MOBILE VIEW */}
            <span className="md:hidden text-sm">
              {session ? (
                <img
                  src="/account-logo.svg"
                  alt="Logo"
                  className="w-5 h-5"
                />
              ) : (
                "Login"
              )}
            </span>

            {/* DESKTOP TEXT (unchanged) */}
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

        <div className="flex items-center gap-1 text-xl font-bold text-blue-600">
          {/* Logo */}
          <div className="w-9 h-10">
            <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />
          </div>

          {/* Text */}
          <span>Televora-AI</span>
        </div>

        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-semibold"></h1>
          <DashboardMenu />
        </div>
      </nav>


      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col items-center text-center px-2 py-2">
        <h1 className="text-3xl font-semibold mb-2">
          Ask with <span className="text-blue-600">AI</span>
        </h1>

        <div className="text-gray-600 mb-2 text-sm">
          <p>Get instant answers, explanations, and more</p>
          <p>specially created for 9-12 students.</p>
        </div>



        {/* MODE SELECT BUTTONS */}
        <div className="flex gap-3 mb-4 text-sm">
          <button
            onClick={() => setSelectedMode("Normal")}
            className={`px-4 py-2 rounded-xl border ${selectedMode === "Normal"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            Normal
          </button>

          <button
            onClick={() => setSelectedMode("Explain")}
            className={`px-4 py-2 rounded-xl border ${selectedMode === "Explain"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            Explain
          </button>

          <button
            onClick={() => setSelectedMode("Notes")}
            className={`px-4 py-2 rounded-xl border ${selectedMode === "Notes"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
              }`}
          >
            Notes
          </button>
        </div>

        {/* CHAT BOX */}
        <div
          className="w-full max-w-4xl space-y-4 text-left px-3 py-3 rounded-xl h-[65vh] overflow-y-auto shadow pb-20"
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


          {messages.map((msg, i) => {
            const isLastBotMessage = i === messages.length - 1 && msg.role === "assistant";

            return (
              <div
                key={i}
                className={
                  "relative p-5 rounded-2xl shadow-md max-w-none leading-relaxed text-[16px] " +
                  "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:underline [&_h1]:mb-6 " +
                  "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:underline [&_h2]:mb-5 " +
                  "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-4 " +
                  "[&_p]:mb-6 " +
                  "[&_ul]:mb-3 [&_ol]:mb-3 " +
                  (msg.role === "user"
                    ? "bg-blue-100 text-blue-900 py-2 mx-2 max-w-[70%]"
                    : "bg-gray-100 text-gray-900 mr-auto max-w-[85%]")
                }
              >
                {/* AI Answer */}
                <div dangerouslySetInnerHTML={{ __html: marked(msg.content || "") }} />

                {/* PDF Button */}
                {isLastBotMessage && (
                  <button
                    onClick={() => downloadPDF(msg.content)}
                    className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            );
          })}



          {loading && (
            <div className="text-gray-500 italic animate-pulse">Thinking...</div>
          )}
        </div>
      </main>


      {/* INPUT AREA */}
      <form
        onSubmit={handleSend}
        className="
    fixed bottom-4
    w-[94%] sm:w-[92%] md:max-w-xl
    left-1/2 -translate-x-1/2
    flex items-center
    gap-2 sm:gap-1.5 md:gap-2
    bg-white shadow-lg rounded-full
    p-2 sm:p-1.5 md:p-2
    border
  "
      >
        {/* + BUTTON */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="
        w-7 h-7 sm:w-8 sm:h-8
        flex items-center justify-center
        bg-gray-200 rounded-full
        text-xl sm:text-2xl font-bold
      "
          >
            +
          </button>

          {showPlusMenu && (
            <div className="absolute bottom-12 left-0 bg-white shadow-xl border rounded-xl p-3 w-40 space-y-2 z-50">
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

        {/* INPUT */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask your question... (${selectedMode})`}
          className="
      flex-1
      px-2 sm:px-2.5 md:px-3
      py-1 sm:py-1.5 md:py-2
      text-sm sm:text-sm md:text-base
      rounded-xl
      focus:outline-none focus:ring-0
    "
        />

        {/* SEND BUTTON */}
        <button
          type="submit"
          className="
      p-1.5 sm:p-1.5 md:p-2
      rounded-full
      bg-blue-600 hover:bg-blue-700
    "
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* MIC BUTTON */}
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          className={`
      p-1.5 sm:p-1.5 md:p-2
      -translate-x-1 sm:-translate-x-0.5 md:translate-x-0
      rounded-full transition
      ${listening
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
    `}
          title={listening ? "Stop dictation" : "Start dictation"}
        >
          {listening ? (
            <MicOff size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <Mic size={18} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </form>



      <footer className="text-center text-sm text-gray-500 ">
        © {new Date().getFullYear()} EduMind AI — All rights reserved.
      </footer>
    </div>
  );
}


