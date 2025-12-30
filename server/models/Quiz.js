import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(v) => v.length >= 2, "At least 2 options required"],
  },
  correctAnswer: {
  type: String,
  required: true,
  validate: {
    validator: function (v) {
      return this.options.includes(v);
    },
    message: "Correct answer must be one of the options",
  },
},

});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
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
