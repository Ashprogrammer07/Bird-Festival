import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    answers: Object,
  },
  { timestamps: true }
);

export default mongoose.model("QuizSubmission", quizSubmissionSchema);
