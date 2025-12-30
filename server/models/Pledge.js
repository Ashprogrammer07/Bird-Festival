import mongoose from "mongoose";

const pledgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    phone: {
      type: String,
      trim: true,
    },

    /* ================= LOCATION DETAILS ================= */
    location: {
      state: {
        type: String,
        trim: true,
        required: [true, "State is required"],
      },
      district: {
        type: String,
        trim: true,
        required: [true, "District is required"],
      },
      city: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
        match: [/^[1-9][0-9]{5}$/, "Please provide a valid pincode"],
      },
      country: {
        type: String,
        default: "India",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Pledge = mongoose.model("Pledge", pledgeSchema);

export default Pledge;
