import FestivalInfo from '../models/FestivalInfo.js';
import { toLocalizedObject } from '../utils/i18nHelper.js';

export const getFestivalInfo = async (req, res) => {
  try {
    const festivalInfo = await FestivalInfo.findOne({ isActive: true });

    if (!festivalInfo) {
      return res.status(404).json({ message: 'Festival information not found' });
    }

    // Check if language parameter is provided for localization
    const lang = req.query.lang;

    if (lang && ['en', 'hi'].includes(lang)) {
      // Return localized version
      const localizedInfo = toLocalizedObject(festivalInfo, lang);
      return res.json(localizedInfo);
    }

    res.json(festivalInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFestivalInfo = async (req, res) => {
  try {
    const festivalInfo = new FestivalInfo(req.body);
    const savedInfo = await festivalInfo.save();
    res.status(201).json(savedInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFestivalInfo = async (req, res) => {
  try {
    const updatedInfo = await FestivalInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInfo) {
      return res.status(404).json({ message: 'Festival information not found' });
    }

    res.json(updatedInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
