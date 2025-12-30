import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idNumber: { type: String, required: true },

    // ✅ Address proof fields
    addressProofFileName: { type: String, required: true },
    addressProofPath: { type: String, required: true }, // uploads/volunteers/file.pdf

    educationalQualification: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    experience: String,
    interests: String,
  },
  { timestamps: true }
);

export default mongoose.model("Volunteer", volunteerSchema);
