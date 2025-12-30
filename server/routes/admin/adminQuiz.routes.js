import express from "express";
import adminAuth from "../../middleware/adminAuthMiddleware.js";
import {
  getAllQuizzesAdmin,
  createQuizAdmin,
  updateQuizAdmin,
  deleteQuizAdmin,
  togglePublishQuizAdmin,
  getQuizSubmissionsAdmin,
} from "../../controllers/admin/adminQuiz.controller.js";

const router = express.Router();

/* 🔒 Protect all admin quiz routes */
router.use(adminAuth);

// Quiz CRUD
router.get("/", getAllQuizzesAdmin);
router.post("/", createQuizAdmin);
router.put("/:id", updateQuizAdmin);
router.delete("/:id", deleteQuizAdmin);
router.put("/:id/publish", togglePublishQuizAdmin);

// Submissions
router.get("/submissions/all", getQuizSubmissionsAdmin);

export default router;
