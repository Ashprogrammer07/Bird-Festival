import PhotoCompetition from '../../models/PhotoCompetition.js';
import ReelCompetition from '../../models/ReelCompetition.js';
import PaintingCompetition from '../../models/PaintingCompetition.js';

// ================= PHOTO =================
export const getAllPhotoCompetitionsAdmin = async (req, res) => {
  try {
    const data = await PhotoCompetition.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPhotoCompetitionByIdAdmin = async (req, res) => {
  const item = await PhotoCompetition.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const deletePhotoCompetitionAdmin = async (req, res) => {
  await PhotoCompetition.findByIdAndDelete(req.params.id);
  res.json({ message: 'Photo competition entry deleted' });
};

// ================= REEL =================
export const getAllReelCompetitionsAdmin = async (req, res) => {
  try {
    const data = await ReelCompetition.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReelCompetitionByIdAdmin = async (req, res) => {
  const item = await ReelCompetition.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const deleteReelCompetitionAdmin = async (req, res) => {
  await ReelCompetition.findByIdAndDelete(req.params.id);
  res.json({ message: 'Reel competition entry deleted' });
};

// ================= PAINTING =================
export const getAllPaintingCompetitionsAdmin = async (req, res) => {
  try {
    const data = await PaintingCompetition.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPaintingCompetitionByIdAdmin = async (req, res) => {
  const item = await PaintingCompetition.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const deletePaintingCompetitionAdmin = async (req, res) => {
  await PaintingCompetition.findByIdAndDelete(req.params.id);
  res.json({ message: 'Painting competition entry deleted' });
};
