import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllVolunteersAdmin,
  getVolunteerByIdAdmin,
  deleteVolunteerAdmin,
  exportVolunteersCSV,
  bulkDeleteVolunteers,
  getVolunteerAnalytics,
} from '../../controllers/admin/adminVolunteer.controller.js';

const router = express.Router();

// 🔒 Protect all admin volunteer routes
router.use(adminAuth);

router.get('/', getAllVolunteersAdmin);
router.get('/export/csv', exportVolunteersCSV);
router.get('/analytics', getVolunteerAnalytics);
router.get('/:id', getVolunteerByIdAdmin);
router.delete('/:id', deleteVolunteerAdmin);
router.post('/bulk-delete', bulkDeleteVolunteers);

export default router;
