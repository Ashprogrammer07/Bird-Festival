import express from 'express';
import {
  getFestivalInfo,
  createFestivalInfo,
  updateFestivalInfo,
} from '../controllers/festivalController.js';

const router = express.Router();

router.get('/', getFestivalInfo);
router.post('/', createFestivalInfo);
router.put('/:id', updateFestivalInfo);

export default router;
