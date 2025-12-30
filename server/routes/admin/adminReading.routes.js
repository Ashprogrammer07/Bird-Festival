import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllReadingProgressAdmin,
  getReadingByEbookAdmin,
  getReadingByReaderAdmin,
  deleteReadingProgressAdmin,
  getReadingStatsAdmin,
} from '../../controllers/admin/adminReading.controller.js';

const router = express.Router();

// 🔒 Protect all admin reading routes
router.use(adminAuth);

router.get('/', getAllReadingProgressAdmin);
router.get('/stats', getReadingStatsAdmin);
router.get('/ebook/:ebookId', getReadingByEbookAdmin);
router.get('/reader/:email', getReadingByReaderAdmin);
router.delete('/:id', deleteReadingProgressAdmin);

export default router;
