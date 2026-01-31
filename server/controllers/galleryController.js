
import GalleryImage from '../models/GalleryImage.js';
import { toLocalizedObjects } from '../utils/i18nHelper.js';

export const getGalleryImages = async (req, res) => {
    try {
        // Fetch newest first
        const images = await GalleryImage.find().sort({ createdAt: -1 });

        // Check if language parameter is provided for localization
        const lang = req.query.lang;

        if (lang && ['en', 'hi'].includes(lang)) {
            const localizedImages = toLocalizedObjects(images, lang);
            return res.json({ success: true, data: localizedImages });
        }

        res.json({ success: true, data: images });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
