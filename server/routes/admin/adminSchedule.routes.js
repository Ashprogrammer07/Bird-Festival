import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllSchedulesAdmin,
  getScheduleByIdAdmin,
  createScheduleAdmin,
  updateScheduleAdmin,
  deleteScheduleAdmin,
} from '../../controllers/admin/adminSchedule.controller.js';

const router = express.Router();

// 🔒 Protect all admin schedule routes
router.use(adminAuth);

router.get('/', getAllSchedulesAdmin);
router.get('/:id', getScheduleByIdAdmin);
router.post('/', createScheduleAdmin);
router.put('/:id', updateScheduleAdmin);
router.delete('/:id', deleteScheduleAdmin);

export default router;
