import Volunteer from '../../models/Volunteer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Parser } from 'json2csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET ALL volunteers
export const getAllVolunteersAdmin = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ data: volunteers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET volunteer by ID
export const getVolunteerByIdAdmin = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE volunteer + uploaded file
export const deleteVolunteerAdmin = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Remove uploaded address proof file if exists
    if (volunteer.addressProofFileName) {
      const filePath = path.join(
        __dirname,
        '../../uploads/volunteers',
        volunteer.addressProofFileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await volunteer.deleteOne();

    res.json({ message: 'Volunteer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT volunteers to CSV
export const exportVolunteersCSV = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 }).lean();

    if (volunteers.length === 0) {
      return res.status(404).json({ message: 'No volunteers to export' });
    }

    // Format data for CSV
    const csvData = volunteers.map(v => ({
      Name: v.name,
      'ID Number': v.idNumber,
      Email: v.email,
      Phone: v.phone,
      Address: v.address,
      'Educational Qualification': v.educationalQualification,
      Experience: v.experience || 'N/A',
      Interests: v.interests || 'N/A',
      'Registered On': new Date(v.createdAt).toLocaleDateString('en-IN'),
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=volunteers_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Export CSV Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ BULK DELETE volunteers
export const bulkDeleteVolunteers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of volunteer IDs' });
    }

    // Find volunteers to delete their files
    const volunteers = await Volunteer.find({ _id: { $in: ids } });

    // Delete associated files
    volunteers.forEach(volunteer => {
      if (volunteer.addressProofFileName) {
        const filePath = path.join(
          __dirname,
          '../../uploads/volunteers',
          volunteer.addressProofFileName
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // Delete volunteers from database
    const result = await Volunteer.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `Successfully deleted ${result.deletedCount} volunteer(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Bulk Delete Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET volunteer analytics
export const getVolunteerAnalytics = async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();

    // Get volunteers per day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const volunteersPerDay = await Volunteer.aggregate([
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

    // Get recent volunteers (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentVolunteers = await Volunteer.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get top qualifications
    const topQualifications = await Volunteer.aggregate([
      {
        $group: {
          _id: '$educationalQualification',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      totalVolunteers,
      recentVolunteers,
      volunteersPerDay: volunteersPerDay.map(item => ({
        date: item._id,
        count: item.count,
      })),
      topQualifications: topQualifications.map(item => ({
        qualification: item._id,
        count: item.count,
      })),
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: err.message });
  }
};
