import mongoose from 'mongoose';

const { Schema } = mongoose;

const readingProgressSchema = new Schema(
  {
    ebookId: {
      type: Schema.Types.ObjectId,
      ref: 'Ebook',
      required: true,
      index: true,
    },
    readerName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    readerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    readerId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    lastPage: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timeSpent: {
      type: Number,
      default: 0, // seconds
      min: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

readingProgressSchema.index({ ebookId: 1, readerId: 1 }, { unique: true });

const ReadingProgress = mongoose.model('ReadingProgress', readingProgressSchema);

export default ReadingProgress;
