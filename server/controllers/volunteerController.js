import Volunteer from "../models/Volunteer.js";

export const registerVolunteer = async (req, res) => {
  try {
    const {
      name,
      idNumber,
      educationalQualification,
      email,
      phone,
      address,
      experience,
      interests,
    } = req.body;

    // ✅ Validate required fields
    if (
      !name ||
      !idNumber ||
      !educationalQualification ||
      !email ||
      !phone ||
      !address
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // ✅ Validate file
    if (!req.file) {
      return res.status(400).json({
        message: "Address proof file is required",
      });
    }

    const volunteer = new Volunteer({
      name: name.trim(),
      idNumber: idNumber.trim(),
      educationalQualification: educationalQualification.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      experience: experience?.trim() || "",
      interests: interests?.trim() || "",

      // ✅ SAVE EXACT FORMAT YOU WANT
      addressProofFileName: req.file.originalname,
      addressProofPath: `uploads/volunteers/${req.file.originalname}`,
    });

    const saved = await volunteer.save();

    res.status(201).json({
      message: "Volunteer registered successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin list
export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
