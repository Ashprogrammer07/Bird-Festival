import express from "express";
import upload from "../config/volunteerUpload.js";
import {
  registerVolunteer,
  getAllVolunteers,
} from "../controllers/volunteerController.js";

const router = express.Router();

// ✅ Field name MUST match frontend
router.post("/", upload.single("addressProof"), registerVolunteer);
router.get("/", getAllVolunteers);

export default router;
