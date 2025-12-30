import Quiz from "../../models/Quiz.js";
import QuizSubmission from "../../models/QuizSubmission.js";

/* ================= QUIZ CRUD ================= */

// GET all quizzes
export const getAllQuizzesAdmin = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE quiz
export const createQuizAdmin = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE quiz (used for adding/removing questions)
export const updateQuizAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ Update allowed fields only
    if (req.body.title !== undefined) quiz.title = req.body.title;
    if (req.body.description !== undefined)
      quiz.description = req.body.description;
    if (req.body.difficulty !== undefined)
      quiz.difficulty = req.body.difficulty;

    if (req.body.questions !== undefined) {
      quiz.questions = req.body.questions;
    }

    await quiz.save(); // 🔥 IMPORTANT (triggers full validation)

    res.json(quiz);
  } catch (error) {
    console.error("QUIZ UPDATE ERROR:", error); // 🔥 LOG IT
    res.status(400).json({
      message: error.message,
      details: error.errors || null,
    });
  }
};



// DELETE quiz
export const deleteQuizAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE publish/unpublish
export const togglePublishQuizAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SUBMISSIONS ================= */

// GET all quiz submissions
export const getQuizSubmissionsAdmin = async (req, res) => {
  try {
    const submissions = await QuizSubmission.find()
      .populate("quizId", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
