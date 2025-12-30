import express from 'express';
import {
  registerPhotoCompetition,
  getAllPhotoCompetitions,
  registerReelCompetition,
  getAllReelCompetitions,
  registerPaintingCompetition,
  getAllPaintingCompetitions,
} from '../controllers/competitionController.js';
import upload from '../config/upload.js';

const router = express.Router();

// Photo Competition Routes
router.post('/photo', upload.single('photo'), registerPhotoCompetition);
router.get('/photo', getAllPhotoCompetitions);

// Reel Competition Routes
router.post('/reel', registerReelCompetition);
router.get('/reel', getAllReelCompetitions);

// Painting Competition Routes
router.post('/painting', registerPaintingCompetition);
router.get('/painting', getAllPaintingCompetitions);

export default router;

