import express from "express";
import adminAuth from "../../middleware/adminAuthMiddleware.js";
import {
  getAllResourcePersonsAdmin,
  getResourcePersonByIdAdmin,
  deleteResourcePersonAdmin,
} from "../../controllers/admin/adminResourcePerson.controller.js";

const router = express.Router();

// 🔒 Protect all admin routes
router.use(adminAuth);

router.get("/", getAllResourcePersonsAdmin);
router.get("/:id", getResourcePersonByIdAdmin);
router.delete("/:id", deleteResourcePersonAdmin);

export default router;
