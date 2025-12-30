import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllContactsAdmin,
  getContactByIdAdmin,
  updateContactReadStatusAdmin,
  deleteContactAdmin,
} from '../../controllers/admin/adminContact.controller.js';

const router = express.Router();

// 🔒 Protect all admin contact routes
router.use(adminAuth);

router.get('/', getAllContactsAdmin);
router.get('/:id', getContactByIdAdmin);
router.put('/:id/read', updateContactReadStatusAdmin);
router.delete('/:id', deleteContactAdmin);

export default router;
