import express from 'express';
import adminAuth from '../../middleware/adminAuthMiddleware.js';
import {
  getAllPhotoCompetitionsAdmin,
  getPhotoCompetitionByIdAdmin,
  deletePhotoCompetitionAdmin,
  getAllReelCompetitionsAdmin,
  getReelCompetitionByIdAdmin,
  deleteReelCompetitionAdmin,
  getAllPaintingCompetitionsAdmin,
  getPaintingCompetitionByIdAdmin,
  deletePaintingCompetitionAdmin,
} from '../../controllers/admin/adminCompetition.controller.js';

const router = express.Router();

// 🔒 Protect all admin competition routes
router.use(adminAuth);

// PHOTO
router.get('/photo', getAllPhotoCompetitionsAdmin);
router.get('/photo/:id', getPhotoCompetitionByIdAdmin);
router.delete('/photo/:id', deletePhotoCompetitionAdmin);

// REEL
router.get('/reel', getAllReelCompetitionsAdmin);
router.get('/reel/:id', getReelCompetitionByIdAdmin);
router.delete('/reel/:id', deleteReelCompetitionAdmin);

// PAINTING
router.get('/painting', getAllPaintingCompetitionsAdmin);
router.get('/painting/:id', getPaintingCompetitionByIdAdmin);
router.delete('/painting/:id', deletePaintingCompetitionAdmin);

export default router;
