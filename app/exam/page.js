// "use client";

// import { useState, useEffect } from "react";

// const QUESTIONS = [
//   // Level 1 — Class 10th Math
//   [
//     { q: "What is the value of √144 ?", options: ["10", "11", "12", "14"], correct: 2 },
//     { q: "What is sin(90°)?", options: ["1", "0", "0.5", "-1"], correct: 0 },
//     { q: "Solve: 3x + 5 = 20. What is x?", options: ["3", "5", "10", "15"], correct: 0 },
//     { q: "What is the area of a circle? ", options: ["2πr", "πr²", "πd", "πr"], correct: 1 },
//     { q: "The value of (a+b)² is?", options: ["a²+b²", "a²+2ab+b²", "2ab", "a²−b²"], correct: 1 },
//   ],

//   // Level 2 — Science
//   [
//     { q: "Which gas is essential for photosynthesis?", options: ["CO₂", "O₂", "N₂", "H₂"], correct: 0 },
//     { q: "Which organ purifies blood?", options: ["Heart", "Liver", "Kidney", "Lungs"], correct: 2 },
//     { q: "Which vitamin is produced by sunlight?", options: ["Vitamin A", "Vitamin D", "Vitamin B12", "Vitamin C"], correct: 1 },
//     { q: "Plant roots absorb water by?", options: ["Diffusion", "Osmosis", "Evaporation", "Filtration"], correct: 1 },
//     { q: "Which cell organelle is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"], correct: 2 },
//   ],

//   // Level 3 — Social + Environment
//   [
//     { q: "Which is the largest democracy in the world?", options: ["USA", "China", "India", "Russia"], correct: 2 },
//     { q: "Which layer of Earth contains life?", options: ["Lithosphere", "Hydrosphere", "Biosphere", "Atmosphere"], correct: 2 },
//     { q: "Which river is known as the Ganga of the South?", options: ["Krishna", "Kaveri", "Godavari", "Yamuna"], correct: 2 },
//     { q: "UN stands for?", options: ["United Nation", "Union Nation", "United Network", "Universal Nation"], correct: 0 },
//     { q: "Cutting of trees is called?", options: ["Afforestation", "Deforestation", "Reforestation", "Cultivation"], correct: 1 },
//   ],

//   // Level 4 — Physics
//   [
//     { q: "Unit of force is?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1 },
//     { q: "Speed of light is approximately?", options: ["3×10⁵ m/s", "3×10⁸ m/s", "3×10⁶ m/s", "3×10³ m/s"], correct: 1 },
//     { q: "Which mirror is used in car rear-view?", options: ["Convex", "Concave", "Plane", "Spherical"], correct: 0 },
//     { q: "SI unit of energy?", options: ["Joule", "Newton", "Watt", "Hertz"], correct: 0 },
//     { q: "Electric current is measured in?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 1 },
//   ],

//   // Level 5 — Reasoning
//   [
//     { q: "Find the odd one out: 2, 4, 8, 16, 30", options: ["16", "8", "4", "30"], correct: 3 },
//     { q: "If CAT = 3120, then DOG = ?", options: ["4157", "4720", "4158", "4170"], correct: 0 },
//     { q: "Mirror of EAST is?", options: ["TSAE", "SAET", "TAES", "TSAE"], correct: 1 },
//     { q: "Which number comes next? 5, 11, 17, 23, ?", options: ["26", "28", "29", "30"], correct: 1 },
//     { q: "If A = 1, Z = 26, then C + D = ?", options: ["5", "6", "3", "7"], correct: 0 },
//   ],
// ];


// export default function ExamPage() {
//   const [mounted, setMounted] = useState(false);
//   const [level, setLevel] = useState(0);
//   const [qIndex, setQIndex] = useState(0);
//   const [score, setScore] = useState(0);
//   const [finished, setFinished] = useState(false);
//   const [time, setTime] = useState(20);

//   const totalQuestions = 25;

//   // FIX hydration issue
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Timer
//   useEffect(() => {
//     if (!mounted || finished) return;

//     if (time === 0) {
//       nextQuestion();
//       return;
//     }

//     const t = setTimeout(() => setTime(time - 1), 1000);
//     return () => clearTimeout(t);
//   }, [time, mounted, finished]);

//   const question = QUESTIONS[level][qIndex];

//   const answer = (i) => {
//     if (i === question.correct) {
//       setScore(score + 1);
//     }
//     nextQuestion();
//   };

//   const nextQuestion = () => {
//     if (qIndex + 1 < 5) {
//       setQIndex(qIndex + 1);
//       setTime(20);
//     } else {
//       if (level + 1 < 5) {
//         setLevel(level + 1);
//         setQIndex(0);
//         setTime(20);
//       } else {
//         setFinished(true);
//       }
//     }
//   };

//   // ------------------ RENDERING ------------------
//   if (!mounted) {
//     return <div className="p-6 text-center">Loading Exam...</div>;
//   }

//   if (finished) {
//     const percent = Math.round((score / totalQuestions) * 100);
//     const status =
//       percent >= 80 ? "🎉 PERFECT" : percent >= 50 ? "✔ PASS" : "❌ FAIL";

//     return (
//       <div className="p-6 text-center">
//         <h1 className="text-3xl font-bold mb-4">Exam Result</h1>
//         <p className="text-xl">Score: {score} / {totalQuestions}</p>
//         <p className="text-3xl mt-3">{status}</p>
//         <p className="text-gray-500 mt-2">Percentage: {percent}%</p>
//       </div>
//     );
//   }

//   const progress = ((level * 5 + qIndex) / totalQuestions) * 100;

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-2">Exam Mode</h1>

//       <div className="w-full bg-gray-300 h-3 rounded-full mb-4">
//         <div
//           className="bg-blue-500 h-3 rounded-full"
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>

//       <h2 className="text-lg font-bold">Level {level + 1}</h2>
//       <p className="text-gray-600">Question {qIndex + 1} / 5</p>

//       <div className="text-right text-red-500 font-bold mb-4">Time: {time}s</div>

//       <h3 className="text-lg font-semibold mb-4">{question.q}</h3>

//       <div className="space-y-2">
//         {question.options.map((opt, i) => (
//           <button
//             key={i}
//             onClick={() => answer(i)}
//             className="w-full p-3 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QrCode } from "lucide-react";

/* ---------------- QUESTIONS (unchanged) ---------------- */
const QUESTIONS = [
  // Level 1 — Class 10th Math
  [
    { q: "What is the value of √144 ?", options: ["10", "11", "12", "14"], correct: 2 },
    { q: "What is sin(90°)?", options: ["1", "0", "0.5", "-1"], correct: 0 },
    { q: "Solve: 3x + 5 = 20. What is x?", options: ["3", "5", "10", "15"], correct: 0 },
    { q: "What is the area of a circle? ", options: ["2πr", "πr²", "πd", "πr"], correct: 1 },
    { q: "The value of (a+b)² is?", options: ["a²+b²", "a²+2ab+b²", "2ab", "a²−b²"], correct: 1 },
  ],
  // Level 2 — Science
  [
    { q: "Which gas is essential for photosynthesis?", options: ["CO₂", "O₂", "N₂", "H₂"], correct: 0 },
    { q: "Which organ purifies blood?", options: ["Heart", "Liver", "Kidney", "Lungs"], correct: 2 },
    { q: "Which vitamin is produced by sunlight?", options: ["Vitamin A", "Vitamin D", "Vitamin B12", "Vitamin C"], correct: 1 },
    { q: "Plant roots absorb water by?", options: ["Diffusion", "Osmosis", "Evaporation", "Filtration"], correct: 1 },
    { q: "Which cell organelle is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"], correct: 2 },
  ],
  // Level 3 — Social + Environment
  [
    { q: "Which is the largest democracy in the world?", options: ["USA", "China", "India", "Russia"], correct: 2 },
    { q: "Which layer of Earth contains life?", options: ["Lithosphere", "Hydrosphere", "Biosphere", "Atmosphere"], correct: 2 },
    { q: "Which river is known as the Ganga of the South?", options: ["Krishna", "Kaveri", "Godavari", "Yamuna"], correct: 2 },
    { q: "UN stands for?", options: ["United Nation", "Union Nation", "United Network", "Universal Nation"], correct: 0 },
    { q: "Cutting of trees is called?", options: ["Afforestation", "Deforestation", "Reforestation", "Cultivation"], correct: 1 },
  ],
  // Level 4 — Physics
  [
    { q: "Unit of force is?", options: ["Joule", "Newton", "Pascal", "Watt"], correct: 1 },
    { q: "Speed of light is approximately?", options: ["3×10⁵ m/s", "3×10⁸ m/s", "3×10⁶ m/s", "3×10³ m/s"], correct: 1 },
    { q: "Which mirror is used in car rear-view?", options: ["Convex", "Concave", "Plane", "Spherical"], correct: 0 },
    { q: "SI unit of energy?", options: ["Joule", "Newton", "Watt", "Hertz"], correct: 0 },
    { q: "Electric current is measured in?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 1 },
  ],
  // Level 5 — Reasoning
  [
    { q: "Find the odd one out: 2, 4, 8, 16, 30", options: ["16", "8", "4", "30"], correct: 3 },
    { q: "If CAT = 3120, then DOG = ?", options: ["4157", "4720", "4158", "4170"], correct: 0 },
    { q: "Mirror of EAST is?", options: ["TSAE", "SAET", "TAES", "TSAE"], correct: 1 },
    { q: "Which number comes next? 5, 11, 17, 23, ?", options: ["26", "28", "29", "30"], correct: 1 },
    { q: "If A = 1, Z = 26, then C + D = ?", options: ["5", "6", "3", "7"], correct: 0 },
  ],
];

/* -------------------- MAIN PAGE -------------------- */
export default function ExamPage() {
  const { data: session } = useSession(); // NextAuth session
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(20);

  const totalQuestions = 25;
  const QR_LINK = "https://televora.in";
  // google chart QR image (no deps)
  const qrSrc = `https://chart.googleapis.com/chart?cht=qr&chs=160x160&chl=${encodeURIComponent(QR_LINK)}&chld=M|0`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // TIMER
  useEffect(() => {
    if (!mounted || finished) return;
    if (time === 0) {
      nextQuestion();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, mounted, finished]);

  const question = QUESTIONS[level][qIndex];

  const answer = (i) => {
    setSelected(i);
    setTimeout(() => {
      if (i === question.correct) setScore((s) => s + 1);
      nextQuestion();
      setSelected(null);
    }, 600);
  };

  const nextQuestion = () => {
    if (qIndex + 1 < 5) {
      setQIndex(qIndex + 1);
      setTime(20);
    } else if (level + 1 < 5) {
      setLevel(level + 1);
      setQIndex(0);
      setTime(20);
    } else {
      setFinished(true);
    }
  };

  // student name logic:
  // If logged-in and email endsWith @gmail.com -> show session.user.name (if available) or derived name
  // else show "Mr Boy"
  const getStudentName = () => {
    try {
      const email = session?.user?.email || "";
      const name = session?.user?.name || "";
      if (email.toLowerCase().endsWith("@gmail.com")) {
        if (name && name.trim() !== "") return name;
        // derive from email local-part and capitalize
        const local = email.split("@")[0] || "Student";
        return local.charAt(0).toUpperCase() + local.slice(1);
      }
      return "Mr Boy";
    } catch (e) {
      return "Mr Boy";
    }
  };

  // -------------------- CERTIFICATE PDF (with QR) --------------------
  const downloadPDF = async () => {
    const element = document.getElementById("certificate-card");
    if (!element) return;
    // render to canvas
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, allowTaint: true });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();

    pdf.addImage(img, "PNG", 0, 0, w, h);
    const studentName = getStudentName();
    pdf.save(`${studentName}-Televora-Certificate.pdf`);
  };

  // -------------------- RENDER: Certificate Screen --------------------
  if (finished) {
    const percent = Math.round((score / totalQuestions) * 100);
    const studentName = getStudentName();

    return (
      <div className="flex flex-col items-center p-6">

        {/* Certificate Card */}
        <div
          id="certificate-card"
          className="
    relative 
    w-full 
    max-w-[900px] 
    bg-gradient-to-br from-white to-gray-50 
    shadow-2xl border-4 border-yellow-500 
    p-4 sm:p-10 rounded-xl overflow-hidden

    /* height fix */
    h-auto          /* mobile height auto */
    sm:h-[600px]    /* desktop height same as original */
  "
        >

          {/* Decorative top strip */}
          <div className="absolute top-0 left-0 right-0 h-10 sm:h-16 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

          {/* Title */}
          <h1 className="relative text-2xl sm:text-4xl font-extrabold text-yellow-700 mb-2 mt-4 py-2 text-center tracking-wider">
            Televora-AI Achievement Certificate
          </h1>

          {/* Awarded to */}
          <p className="relative text-sm sm:text-lg text-gray-600 mt-6 text-center">
            Awarded To
          </p>
          <p className="relative text-3xl sm:text-5xl font-bold text-gray-800 text-center mt-2">
            {studentName}
          </p>

          {/* Description */}
          <p className="relative mt-6 text-xs sm:text-base text-gray-600 text-center px-4 sm:px-20">
            This certificate is proudly presented to <b>{studentName}</b> for successfully completing
            the Televora-AI Online Examination.
          </p>

          {/* Score */}
          <div className="relative mt-4 sm:mt-8 text-center">
            <span className="text-sm sm:text-2xl font-semibold text-gray-800">Score: </span>
            <span className="text-sm sm:text-2xl font-extrabold">{score}</span>
            <span className="text-sm sm:text-2xl font-semibold text-gray-800"> / {totalQuestions}</span>
            <div className="mt-1 sm:mt-2 text-[10px] sm:text-base text-gray-600">
              Percentage: {percent}%
            </div>
          </div>

          {/* Company */}
          <div className="absolute bottom-14 sm:bottom-20 right-4 sm:right-10 text-right text-[10px] sm:text-base">
            <p className="font-medium text-gray-700">Company</p>
            <p className="font-semibold text-xs sm:text-lg">Televora-AI</p>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-4 left-4 flex flex-col items-start">
            <img
              src="/qrcode.png"
              alt="Televora QR"
              className="w-14 h-14 sm:w-28 sm:h-28 border p-1 bg-white rounded-sm shadow cursor-pointer"
              onClick={() => (window.location.href = QR_LINK)}
            />

            {/* Text starting exactly from QR left edge */}
            <div className="mt-1 text-[8px] sm:text-xs text-gray-600 leading-tight">
              <div>Scan to visit</div>
              <div className="font-semibold text-gray-800">televora.in</div>
            </div>
          </div>


          {/* Badge */}
          <div className="absolute top-20 sm:top-32 right-4 sm:right-12 w-14 h-14 sm:w-24 sm:h-24 rounded-full bg-yellow-500 flex items-center justify-center shadow-xl">
            <img src="/favicon.ico" className="w-6 h-6 sm:w-12 sm:h-12" alt="" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={downloadPDF}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg shadow-lg text-base sm:text-lg w-full sm:w-auto"
          >
            Download Certificate PDF
          </button>

          <button
            onClick={() => {
              setLevel(0);
              setQIndex(0);
              setScore(0);
              setFinished(false);
              setTime(20);
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg w-full sm:w-auto"
          >
            Retake Exam
          </button>
        </div>


      </div>
    );
  }

  // -------------------- EXAM SCREEN --------------------
  if (!mounted) return <div className="p-6 text-center">Loading Exam...</div>;

  const progress = ((level * 5 + qIndex) / totalQuestions) * 100;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-3">Exam Mode</h1>

      <div className="w-full bg-gray-200 h-3 rounded-full mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Level {level + 1}</h2>
          <p className="text-sm text-gray-600">Question {qIndex + 1} / 5</p>
        </div>

        <div className="text-red-500 font-bold">⏱ {time}s</div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm mb-4">
        <h3 className="text-xl font-semibold mb-3">{question.q}</h3>

        <div className="space-y-3">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correct;
            const isSelected = selected === i;

            return (
              <button
                key={i}
                onClick={() => answer(i)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${isSelected ? (isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600") : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
