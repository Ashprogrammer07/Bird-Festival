import Quiz from "../models/Quiz.js";
import QuizSubmission from "../models/QuizSubmission.js";

/* ================= PUBLIC ================= */

/**
 * GET all published quizzes
 * GET /api/quiz/published
 */
export const getPublishedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

/**
 * GET single published quiz by ID
 * GET /api/quiz/:id
 */
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

/**
 * POST quiz submission
 * POST /api/quiz/submit
 */
export const submitQuiz = async (req, res) => {
  try {
    const submission = new QuizSubmission(req.body);
    await submission.save();

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};
