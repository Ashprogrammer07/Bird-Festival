import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllFestivalInfo,
  getFestivalById,
  createFestival,
  updateFestival,
  deleteFestival,
} from '../../controllers/admin/adminFestival.controller.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', getAllFestivalInfo);
router.get('/:id', getFestivalById);
router.post('/', createFestival);
router.put('/:id', updateFestival);
router.delete('/:id', deleteFestival);

export default router;
