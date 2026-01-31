import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllPledgesAdmin,
  getPledgeByIdAdmin,
  deletePledgeAdmin,
  exportPledgesCSV,
  bulkDeletePledges,
  getPledgeAnalytics,
  createPledgeAdmin, // ✅ Import
  updatePledgeAdmin, // ✅ Import
} from '../../controllers/admin/adminPledge.controller.js';

const router = express.Router();

// 🔒 Protect all admin pledge routes
router.use(adminAuth);

router.get('/', getAllPledgesAdmin);
router.post('/', createPledgeAdmin);       // ✅ Create
router.get('/export/csv', exportPledgesCSV);
router.get('/analytics', getPledgeAnalytics);
router.get('/:id', getPledgeByIdAdmin);
router.put('/:id', updatePledgeAdmin);     // ✅ Update
router.delete('/:id', deletePledgeAdmin);
router.post('/bulk-delete', bulkDeletePledges);

export default router;
