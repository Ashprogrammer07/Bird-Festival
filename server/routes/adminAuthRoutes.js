import express from 'express';
import { adminLogin, createAdmin } from '../controllers/adminAuthController.js';

const router = express.Router();

// Admin login
router.post('/login', adminLogin);

// Create admin (remove after first admin creation)
router.post('/create', createAdmin);

export default router;
