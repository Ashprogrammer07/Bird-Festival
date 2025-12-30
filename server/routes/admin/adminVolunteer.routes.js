import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllVolunteersAdmin,
  getVolunteerByIdAdmin,
  deleteVolunteerAdmin,
} from '../../controllers/admin/adminVolunteer.controller.js';

const router = express.Router();

// 🔒 Protect all admin volunteer routes
router.use(adminAuth);

router.get('/', getAllVolunteersAdmin);
router.get('/:id', getVolunteerByIdAdmin);
router.delete('/:id', deleteVolunteerAdmin);

export default router;
