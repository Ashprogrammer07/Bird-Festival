import Pledge from "../models/Pledge.js";

/* ================= TAKE PLEDGE ================= */
export const takePledge = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location = {},
    } = req.body;

    const { state, district, city, pincode, country } = location;

    // ✅ BASIC VALIDATION
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!state || !district) {
      return res.status(400).json({
        message: "State and District are required",
      });
    }

    const pledge = new Pledge({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : "",
      phone: phone ? phone.trim() : "",
      location: {
        state: state.trim(),
        district: district.trim(),
        city: city ? city.trim() : "",
        pincode: pincode ? pincode.trim() : "",
        country: country || "India",
      },
    });

    const savedPledge = await pledge.save();

    res.status(201).json({
      message: "Thank you for taking the pledge!",
      data: savedPledge,
    });
  } catch (error) {
    console.error("PLEDGE ERROR:", error);
    res.status(400).json({
      message: error.message,
      details: error.errors || null,
    });
  }
};

/* ================= ADMIN: GET ALL PLEDGES ================= */
export const getAllPledges = async (req, res) => {
  try {
    const pledges = await Pledge.find().sort({ createdAt: -1 });
    res.json(pledges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
