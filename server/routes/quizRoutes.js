import express from "express";
import {
  getPublishedQuizzes,
  getQuizById,
  submitQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

/**
 * PUBLIC QUIZ ROUTES
 */

// Get all published quizzes
// GET /api/quiz/published
router.get("/published", getPublishedQuizzes);

// Get a single published quiz by ID
// GET /api/quiz/:id
router.get("/:id", getQuizById);

// Submit quiz answers
// POST /api/quiz/submit
router.post("/submit", submitQuiz);

export default router;
