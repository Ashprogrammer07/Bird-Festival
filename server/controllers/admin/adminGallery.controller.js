
import GalleryImage from '../../models/GalleryImage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadGalleryImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const { title, category } = req.body;

        const imageUrl = `/uploads/gallery/${req.file.filename}`;

        const newImage = new GalleryImage({
            title: title || 'Festival Photo',
            imageUrl: imageUrl,
            category: category || 'General'
        });

        await newImage.save();

        res.status(201).json({ success: true, data: newImage, message: "Image uploaded successfully" });

    } catch (error) {
        // Cleanup file if DB save fails
        if (req.file) {
            const filePath = path.join(__dirname, '../../uploads/gallery', req.file.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);
        if (!image) return res.status(404).json({ message: "Image not found" });

        // Delete file from filesystem
        const filePath = path.join(__dirname, '../../', image.imageUrl); // imageUrl starts with /uploads...
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await GalleryImage.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Image deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
