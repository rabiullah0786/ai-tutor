

import mongoose from "mongoose";

let Question;

// 👉 Date ko 24-hour IST format me convert karne ka function
function getISTDate() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,       // 24-hour format
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

if (mongoose.models.Question) {
  Question = mongoose.models.Question;
} else {
  const QuestionSchema = new mongoose.Schema(
    {
      email: { type: String },
      question: { type: String, required: true },

      createdAt: {
        type: String,
        default: getISTDate,  // <-- here
      },
      updatedAt: {
        type: String,
        default: getISTDate,  // <-- here
      },
    }
  );

  // 👉 Jab bhi document save/update ho, updatedAt ko refresh kare
  QuestionSchema.pre("save", function (next) {
    this.updatedAt = getISTDate();
    next();
  });

  Question = mongoose.model("Question", QuestionSchema);
}

export default Question;
