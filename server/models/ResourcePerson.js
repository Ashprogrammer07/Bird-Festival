import mongoose from 'mongoose';

const resourcePersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    designation: {
      en: {
        type: String,
        required: [true, 'English designation is required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi designation is required'],
        trim: true,
      },
    },
    organization: {
      en: {
        type: String,
        required: [true, 'English organization is required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi organization is required'],
        trim: true,
      },
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
    expertise: {
      en: {
        type: String,
        required: [true, 'English expertise is required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi expertise is required'],
        trim: true,
      },
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, 'Qualifications are required'],
      trim: true,
    },
    bio: {
      en: {
        type: String,
        trim: true,
      },
      hi: {
        type: String,
        trim: true,
      },
    },
    topics: {
      en: {
        type: String,
        required: [true, 'English topics are required'],
        trim: true,
      },
      hi: {
        type: String,
        required: [true, 'Hindi topics are required'],
        trim: true,
      },
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResourcePerson = mongoose.model('ResourcePerson', resourcePersonSchema);

export default ResourcePerson;

