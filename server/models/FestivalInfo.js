import mongoose from 'mongoose';

const festivalInfoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Festival title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    heroImage: {
      type: String,
      default: '',
    },
    mission: {
      type: String,
      default: '',
    },
    vision: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
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

const FestivalInfo = mongoose.model('FestivalInfo', festivalInfoSchema);

export default FestivalInfo;
