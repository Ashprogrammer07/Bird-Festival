import Schedule from '../models/Schedule.js';
import { getLanguageFromRequest, toLocalizedObjects, toLocalizedObject } from '../utils/i18nHelper.js';

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ isActive: true }).sort({ day: 1 });

    // Check if language parameter is provided for localization
    const lang = req.query.lang;

    if (lang && ['en', 'hi'].includes(lang)) {
      // Return localized version
      const localizedSchedules = toLocalizedObjects(schedules, lang);
      return res.json(localizedSchedules);
    }

    // Return full bilingual data (for admin or when no lang specified)
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduleByDay = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      day: req.params.day,
      isActive: true
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found for this day' });
    }

    // Check if language parameter is provided for localization
    const lang = req.query.lang;

    if (lang && ['en', 'hi'].includes(lang)) {
      // Return localized version
      const localizedSchedule = toLocalizedObject(schedule, lang);
      return res.json(localizedSchedule);
    }

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const savedSchedule = await schedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
