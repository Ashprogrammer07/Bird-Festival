import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllEbooksAdmin,
  getEbookByIdAdmin,
  createEbookAdmin,
  updateEbookAdmin,
  deleteEbookAdmin,
} from '../../controllers/admin/adminEbook.controller.js';

const router = express.Router();

// 🔒 Protect all admin ebook routes
router.use(adminAuth);

router.get('/', getAllEbooksAdmin);
router.get('/:id', getEbookByIdAdmin);
router.post('/', createEbookAdmin);
router.put('/:id', updateEbookAdmin);
router.delete('/:id', deleteEbookAdmin);

export default router;
