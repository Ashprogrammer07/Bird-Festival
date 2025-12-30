import mongoose from 'mongoose';

const paintingCompetitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [5, 'Age must be at least 5'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['junior', 'senior', 'adult'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    guardianPhone: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    previousExperience: {
      type: String,
      trim: true,
    },
    artStyle: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaintingCompetition = mongoose.model('PaintingCompetition', paintingCompetitionSchema);

export default PaintingCompetition;

