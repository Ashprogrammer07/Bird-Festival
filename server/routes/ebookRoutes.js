import express from 'express';
import {
  getEbook,
  createEbook,
  updateEbook,
  incrementDownload,
} from '../controllers/ebookController.js';

const router = express.Router();

router.get('/', getEbook);
router.post('/', createEbook);
router.put('/:id', updateEbook);
router.patch('/:id/download', incrementDownload);

export default router;
