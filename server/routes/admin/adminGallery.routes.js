
import express from 'express';
import { uploadGalleryImage, deleteGalleryImage } from '../../controllers/admin/adminGallery.controller.js';
import galleryUpload from '../../config/galleryUpload.js';
import adminAuth from '../../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.use(adminAuth);

router.post('/', galleryUpload.single('image'), uploadGalleryImage);
router.delete('/:id', deleteGalleryImage);

export default router;
