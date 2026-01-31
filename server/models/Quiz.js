import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    en: {
      type: String,
      required: true,
    },
    hi: {
      type: String,
      required: true,
    },
  },
  options: {
    type: [{
      en: { type: String, required: true },
      hi: { type: String, required: true },
    }],
    required: true,
    validate: [(v) => v.length >= 2, "At least 2 options required"],
  },
  correctAnswer: {
    type: Number, // Index of correct answer (0-based)
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v < this.options.length;
      },
      message: "Correct answer must be a valid option index",
    },
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
    },
    description: {
      en: { type: String },
      hi: { type: String },
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    isPublished: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
