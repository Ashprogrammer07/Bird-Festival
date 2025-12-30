import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllPledgesAdmin,
  getPledgeByIdAdmin,
  deletePledgeAdmin,
} from '../../controllers/admin/adminPledge.controller.js';

const router = express.Router();

// 🔒 Protect all admin pledge routes
router.use(adminAuth);

router.get('/', getAllPledgesAdmin);
router.get('/:id', getPledgeByIdAdmin);
router.delete('/:id', deletePledgeAdmin);

export default router;
