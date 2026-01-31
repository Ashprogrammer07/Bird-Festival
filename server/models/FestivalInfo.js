import mongoose from 'mongoose';

const festivalInfoSchema = new mongoose.Schema(
  {
    title: {
      en: {
        type: String,
        required: [true, 'English festival title is required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi festival title is required'],
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
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      en: {
        type: String,
        required: [true, 'English location is required'],
      },
      hi: {
        type: String,
        required: [true, 'Hindi location is required'],
      },
    },
    heroImage: {
      type: String,
      default: '',
    },
    mission: {
      en: {
        type: String,
        default: '',
      },
      hi: {
        type: String,
        default: '',
      },
    },
    vision: {
      en: {
        type: String,
        default: '',
      },
      hi: {
        type: String,
        default: '',
      },
    },
    about: {
      en: {
        type: String,
        default: '',
      },
      hi: {
        type: String,
        default: '',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    features: [
      {
        title: {
          en: { type: String, required: true },
          hi: { type: String, required: true },
        },
        description: {
          en: { type: String, required: true },
          hi: { type: String, required: true },
        },
        icon: { type: String, default: 'sprout' }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const FestivalInfo = mongoose.model('FestivalInfo', festivalInfoSchema);

export default FestivalInfo;
