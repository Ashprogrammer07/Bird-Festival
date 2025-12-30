import express from 'express';
import {
  createContact,
  getAllContacts,
  markAsRead,
} from '../controllers/contactController.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', getAllContacts);
router.patch('/:id/read', markAsRead);

export default router;
