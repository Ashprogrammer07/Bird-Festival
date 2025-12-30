import PhotoCompetition from '../models/PhotoCompetition.js';
import ReelCompetition from '../models/ReelCompetition.js';
import PaintingCompetition from '../models/PaintingCompetition.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Photo Competition Controllers
export const registerPhotoCompetition = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      photoTitle,
      photoDescription,
    } = req.body;

    // Validate required fields (check for empty strings too)
    const requiredFields = { name, email, phone, address, city, state, pincode, photoTitle };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: 'Photo file is required' });
    }

    // Handle file upload
    const photoUrl = `/uploads/photos/${req.file.filename}`;
    const photoFileName = req.file.filename;

    const participant = new PhotoCompetition({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      photoTitle: photoTitle.trim(),
      photoDescription: photoDescription ? photoDescription.trim() : '',
      photoUrl,
      photoFileName,
    });

    const savedParticipant = await participant.save();
    res.status(201).json({
      message: 'Registration successful! We will contact you soon.',
      data: savedParticipant,
    });
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/photos', req.file.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(400).json({ message: error.message });
  }
};

export const getAllPhotoCompetitions = async (req, res) => {
  try {
    const participants = await PhotoCompetition.find().sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reel Competition Controllers
export const registerReelCompetition = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      reelTitle,
      reelDescription,
      reelUrl,
    } = req.body;

    const participant = new ReelCompetition({
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      reelTitle,
      reelDescription,
      reelUrl,
    });

    const savedParticipant = await participant.save();
    res.status(201).json({
      message: 'Registration successful! We will contact you soon.',
      data: savedParticipant,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllReelCompetitions = async (req, res) => {
  try {
    const participants = await ReelCompetition.find().sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Painting Competition Controllers
export const registerPaintingCompetition = async (req, res) => {
  try {
    const {
      name,
      age,
      category,
      email,
      phone,
      guardianName,
      guardianPhone,
      school,
      address,
      previousExperience,
      artStyle,
    } = req.body;

    // Validate required fields
    const requiredFields = { name, age, category, email, phone, address };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const participant = new PaintingCompetition({
      name: name.trim(),
      age: parseInt(age),
      category: category.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      guardianName: guardianName ? guardianName.trim() : '',
      guardianPhone: guardianPhone ? guardianPhone.trim() : '',
      school: school ? school.trim() : '',
      address: address.trim(),
      previousExperience: previousExperience ? previousExperience.trim() : '',
      artStyle: artStyle ? artStyle.trim() : '',
    });

    const savedParticipant = await participant.save();
    res.status(201).json({
      message: 'Registration successful! We will contact you soon.',
      data: savedParticipant,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPaintingCompetitions = async (req, res) => {
  try {
    const participants = await PaintingCompetition.find().sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

