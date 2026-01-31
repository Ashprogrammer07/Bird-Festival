import Pledge from "../../models/Pledge.js";
import { Parser } from 'json2csv';

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

/* ================= CREATE PLEDGE ================= */
export const createPledgeAdmin = async (req, res) => {
  try {
    const newPledge = new Pledge(req.body);
    const savedPledge = await newPledge.save();
    res.status(201).json(savedPledge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= UPDATE PLEDGE ================= */
export const updatePledgeAdmin = async (req, res) => {
  try {
    const updatedPledge = await Pledge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPledge) {
      return res.status(404).json({ message: "Pledge not found" });
    }

    res.json(updatedPledge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ EXPORT pledges to CSV
export const exportPledgesCSV = async (req, res) => {
  try {
    const pledges = await Pledge.find().sort({ createdAt: -1 }).lean();

    if (pledges.length === 0) {
      return res.status(404).json({ message: 'No pledges to export' });
    }

    // Format data for CSV
    const csvData = pledges.map(p => ({
      Name: p.name,
      Email: p.email || 'N/A',
      Phone: p.phone || 'N/A',
      State: p.location?.state || 'N/A',
      District: p.location?.district || 'N/A',
      City: p.location?.city || 'N/A',
      Pincode: p.location?.pincode || 'N/A',
      Country: p.location?.country || 'India',
      'Pledged On': new Date(p.createdAt).toLocaleDateString('en-IN'),
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=pledges_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Export CSV Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ BULK DELETE pledges
export const bulkDeletePledges = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of pledge IDs' });
    }

    const result = await Pledge.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `Successfully deleted ${result.deletedCount} pledge(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Bulk Delete Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET pledge analytics
export const getPledgeAnalytics = async (req, res) => {
  try {
    const totalPledges = await Pledge.countDocuments();

    // Get pledges per day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pledgesPerDay = await Pledge.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get recent pledges (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentPledges = await Pledge.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get pledges by state
    const pledgesByState = await Pledge.aggregate([
      {
        $group: {
          _id: '$location.state',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Get pledges by district (top 10)
    const pledgesByDistrict = await Pledge.aggregate([
      {
        $group: {
          _id: {
            state: '$location.state',
            district: '$location.district',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      totalPledges,
      recentPledges,
      pledgesPerDay: pledgesPerDay.map(item => ({
        date: item._id,
        count: item.count,
      })),
      pledgesByState: pledgesByState.map(item => ({
        state: item._id,
        count: item.count,
      })),
      pledgesByDistrict: pledgesByDistrict.map(item => ({
        state: item._id.state,
        district: item._id.district,
        count: item.count,
      })),
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: err.message });
  }
};
