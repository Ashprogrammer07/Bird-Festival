import mongoose from 'mongoose';

const reelCompetitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
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
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    reelTitle: {
      type: String,
      required: [true, 'Reel title is required'],
      trim: true,
    },
    reelDescription: {
      type: String,
      trim: true,
    },
    reelUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReelCompetition = mongoose.model('ReelCompetition', reelCompetitionSchema);

export default ReelCompetition;

