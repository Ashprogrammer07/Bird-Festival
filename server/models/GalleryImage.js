
import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
    title: {
        en: {
            type: String,
            default: 'Festival Photo'
        },
        hi: {
            type: String,
            default: 'त्योहार फोटो'
        }
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        en: {
            type: String,
            default: 'General'
        },
        hi: {
            type: String,
            default: 'सामान्य'
        }
    }
}, {
    timestamps: true
});

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);
export default GalleryImage;
