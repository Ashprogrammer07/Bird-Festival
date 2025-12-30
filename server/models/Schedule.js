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
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    events: [
      {
        time: {
          type: String,
          required: true,
        },
        activity: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          default: '',
        },
        description: {
          type: String,
          default: '',
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
