import Pledge from "../../models/Pledge.js";

/* ================= GET ALL PLEDGES (ADMIN) ================= */
// Supports optional filters: ?state=&district=
export const getAllPledgesAdmin = async (req, res) => {
  try {
    const { state, district } = req.query;

    const filter = {};

    if (state) {
      filter["location.state"] = state;
    }

    if (district) {
      filter["location.district"] = district;
    }

    const pledges = await Pledge.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      count: pledges.length,
      data: pledges,
    });
  } catch (error) {
    console.error("ADMIN GET PLEDGES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PLEDGE BY ID ================= */
export const getPledgeByIdAdmin = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id);

    if (!pledge) {
      return res.status(404).json({ message: "Pledge not found" });
    }

    res.json(pledge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE PLEDGE ================= */
export const deletePledgeAdmin = async (req, res) => {
  try {
    const deleted = await Pledge.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Pledge not found" });
    }

    res.json({
      message: "Pledge deleted successfully",
      id: deleted._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
