import Schedule from '../../models/Schedule.js';

// ✅ GET ALL schedules (admin sees all, active + inactive)
export const getAllSchedulesAdmin = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ day: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET schedule by ID
export const getScheduleByIdAdmin = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE schedule
export const createScheduleAdmin = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ UPDATE schedule
export const updateScheduleAdmin = async (req, res) => {
  try {
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE schedule (soft delete recommended)
export const deleteScheduleAdmin = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
