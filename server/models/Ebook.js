import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema(
  {
    title: {
      en: {
        type: String,
        required: [true, 'English e-book title is required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi e-book title is required'],
        trim: true,
      },
    },
    description: {
      en: {
        type: String,
        required: [true, 'English description is required'],
      },
      hi: {
        type: String,
        required: [true, 'Hindi description is required'],
      },
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      en: {
        type: String,
        default: 'Rajasthan Birding Festival',
      },
      hi: {
        type: String,
        default: 'राजस्थान बर्डिंग फेस्टिवल',
      },
    },
    pages: {
      type: Number,
      default: 0,
    },
    fileSize: {
      type: String,
      default: '',
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ebook = mongoose.model('Ebook', ebookSchema);

export default Ebook;
