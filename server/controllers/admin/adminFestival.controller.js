import FestivalInfo from '../../models/FestivalInfo.js';

export const getAllFestivalInfo = async (req, res) => {
  const data = await FestivalInfo.find().sort({ createdAt: -1 });
  res.json(data);
};

export const getFestivalById = async (req, res) => {
  const item = await FestivalInfo.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const createFestival = async (req, res) => {
  const festival = await FestivalInfo.create(req.body);
  res.status(201).json(festival);
};

export const updateFestival = async (req, res) => {
  const updated = await FestivalInfo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteFestival = async (req, res) => {
  await FestivalInfo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Festival deleted' });
};
