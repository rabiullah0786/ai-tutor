"use client";

import { useState, useEffect } from "react";

const QUESTIONS = [
  // Level 1
  [
    { q: "2 + 2 = ?", options: ["3", "4", "5", "6"], correct: 1 },
    { q: "5 × 2 = ?", options: ["10", "7", "12", "8"], correct: 0 },
    { q: "Which is a vowel?", options: ["A", "C", "D", "B"], correct: 0 },
    { q: "Sun rises in?", options: ["West", "East", "North", "South"], correct: 1 },
    { q: "Capital of India?", options: ["Delhi", "Mumbai", "Kolkata", "Chennai"], correct: 0 },
  ],

  // Level 2
  [
    { q: "Largest planet?", options: ["Mars", "Earth", "Jupiter", "Venus"], correct: 2 },
    { q: "10 ÷ 2 = ?", options: ["6", "5", "10", "4"], correct: 1 },
    { q: "Which is metal?", options: ["Plastic", "Iron", "Glass", "Wood"], correct: 1 },
    { q: "Fastest bird?", options: ["Ostrich", "Parrot", "Eagle", "Cheetah"], correct: 2 },
    { q: "Shape with 3 sides?", options: ["Square", "Triangle", "Circle", "Oval"], correct: 1 },
  ],

  // Level 3
  [
    { q: "H2O is?", options: ["Water", "Fire", "Air", "Ice"], correct: 0 },
    { q: "5 + 9 = ?", options: ["14", "10", "12", "15"], correct: 0 },
    { q: "Which is fruit?", options: ["Potato", "Carrot", "Apple", "Onion"], correct: 2 },
    { q: "National animal of India?", options: ["Lion", "Tiger", "Cow", "Elephant"], correct: 1 },
    { q: "CPU stands for?", options: ["Central Process Unit", "Central Processing Unit", "Control Power Unit", "None"], correct: 1 },
  ],

  // Level 4
  [
    { q: "Speed formula?", options: ["D/T", "DT", "T/D", "D+T"], correct: 0 },
    { q: "12 × 3 = ?", options: ["36", "40", "30", "26"], correct: 0 },
    { q: "Gas used for breathing?", options: ["CO2", "Oxygen", "Nitrogen", "Helium"], correct: 1 },
    { q: "National flower?", options: ["Lily", "Lotus", "Rose", "Sunflower"], correct: 1 },
    { q: "Largest ocean?", options: ["Indian", "Pacific", "Atlantic", "Arctic"], correct: 1 },
  ],

  // Level 5
  [
    { q: "Light travels?", options: ["Slow", "Fast", "Medium", "Very Slow"], correct: 1 },
    { q: "Square root of 81?", options: ["9", "8", "7", "6"], correct: 0 },
    { q: "Who wrote Ramayan?", options: ["Valmiki", "Tulsidas", "Kabir", "Surdas"], correct: 0 },
    { q: "Smallest bone?", options: ["Stapes", "Rib", "Femur", "Skull"], correct: 0 },
    { q: "Sun is a?", options: ["Planet", "Star", "Comet", "Asteroid"], correct: 1 },
  ],
];

export default function ExamPage() {
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(20);

  const totalQuestions = 25;

  // FIX hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer
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
    if (i === question.correct) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (qIndex + 1 < 5) {
      setQIndex(qIndex + 1);
      setTime(20);
    } else {
      if (level + 1 < 5) {
        setLevel(level + 1);
        setQIndex(0);
        setTime(20);
      } else {
        setFinished(true);
      }
    }
  };

  // ------------------ RENDERING ------------------
  if (!mounted) {
    return <div className="p-6 text-center">Loading Exam...</div>;
  }

  if (finished) {
    const percent = Math.round((score / totalQuestions) * 100);
    const status =
      percent >= 80 ? "🎉 PERFECT" : percent >= 50 ? "✔ PASS" : "❌ FAIL";

    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Exam Result</h1>
        <p className="text-xl">Score: {score} / {totalQuestions}</p>
        <p className="text-3xl mt-3">{status}</p>
        <p className="text-gray-500 mt-2">Percentage: {percent}%</p>
      </div>
    );
  }

  const progress = ((level * 5 + qIndex) / totalQuestions) * 100;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">Exam Mode</h1>

      <div className="w-full bg-gray-300 h-3 rounded-full mb-4">
        <div
          className="bg-blue-500 h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <h2 className="text-lg font-bold">Level {level + 1}</h2>
      <p className="text-gray-600">Question {qIndex + 1} / 5</p>

      <div className="text-right text-red-500 font-bold mb-4">Time: {time}s</div>

      <h3 className="text-lg font-semibold mb-4">{question.q}</h3>

      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className="w-full p-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
