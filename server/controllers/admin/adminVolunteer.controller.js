import Volunteer from '../../models/Volunteer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ GET ALL volunteers
export const getAllVolunteersAdmin = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
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
