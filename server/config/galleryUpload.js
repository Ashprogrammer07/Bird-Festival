
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create gallery directory
const galleryDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, galleryDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `gallery-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

const galleryUpload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter,
});

export default galleryUpload;
