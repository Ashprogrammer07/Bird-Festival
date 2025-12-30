import Ebook from '../models/Ebook.js';

export const getEbook = async (req, res) => {
  try {
    const ebook = await Ebook.findOne({ isActive: true });
    
    if (!ebook) {
      return res.status(404).json({ message: 'E-book not found' });
    }
    
    res.json(ebook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEbook = async (req, res) => {
  try {
    const ebook = new Ebook(req.body);
    const savedEbook = await ebook.save();
    res.status(201).json(savedEbook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEbook = async (req, res) => {
  try {
    const updatedEbook = await Ebook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEbook) {
      return res.status(404).json({ message: 'E-book not found' });
    }
    
    res.json(updatedEbook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const incrementDownload = async (req, res) => {
  try {
    const ebook = await Ebook.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    
    if (!ebook) {
      return res.status(404).json({ message: 'E-book not found' });
    }
    
    res.json(ebook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
