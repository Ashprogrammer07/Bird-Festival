import express from 'express';
import {
  startReading,
  updateReading,
  getReadingProgress,
  getCompletionStats,
} from '../controllers/readingController.js';

const router = express.Router();

router.post('/start', startReading);
router.post('/update', updateReading);
router.get('/progress/:ebookId/:readerId', getReadingProgress);
router.get('/stats/:ebookId', getCompletionStats);

export default router;
