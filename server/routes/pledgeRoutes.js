import express from 'express';
import {
  takePledge,
  getAllPledges,
} from '../controllers/pledgeController.js';

const router = express.Router();

router.post('/', takePledge);
router.get('/', getAllPledges);

export default router;

