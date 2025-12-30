import Ebook from '../../models/Ebook.js';

// ✅ GET ALL ebooks (admin sees all)
export const getAllEbooksAdmin = async (req, res) => {
  try {
    const ebooks = await Ebook.find().sort({ createdAt: -1 });
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ebook by ID
export const getEbookByIdAdmin = async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) {
      return res.status(404).json({ message: 'Ebook not found' });
    }
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE ebook
export const createEbookAdmin = async (req, res) => {
  try {
    const ebook = await Ebook.create(req.body);
    res.status(201).json(ebook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ UPDATE ebook
export const updateEbookAdmin = async (req, res) => {
  try {
    const updated = await Ebook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Ebook not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE ebook (soft delete recommended)
export const deleteEbookAdmin = async (req, res) => {
  try {
    const deleted = await Ebook.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: 'Ebook not found' });
    }

    res.json({ message: 'Ebook deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
