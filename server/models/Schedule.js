import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, 'Day number is required'],
      min: 1,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    title: {
      en: {
        type: String,
        required: [true, 'English title is required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi title is required'],
        trim: true,
      },
    },
    events: [
      {
        time: {
          type: String,
          required: true,
        },
        activity: {
          en: {
            type: String,
            required: true,
          },
          hi: {
            type: String,
            required: true,
          },
        },
        location: {
          en: {
            type: String,
            default: '',
          },
          hi: {
            type: String,
            default: '',
          },
        },
        description: {
          en: {
            type: String,
            default: '',
          },
          hi: {
            type: String,
            default: '',
          },
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
