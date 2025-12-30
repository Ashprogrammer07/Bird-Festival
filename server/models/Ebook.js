import mongoose from 'mongoose';

const ebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'E-book title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
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
      type: String,
      default: 'Rajasthan Birding Festival',
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
