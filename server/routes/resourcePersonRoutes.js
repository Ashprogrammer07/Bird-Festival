import express from 'express';
import {
  registerResourcePerson,
  getAllResourcePersons,
} from '../controllers/resourcePersonController.js';

const router = express.Router();

router.post('/', registerResourcePerson);
router.get('/', getAllResourcePersons);

export default router;

