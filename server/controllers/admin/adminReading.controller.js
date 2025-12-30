import ReadingProgress from '../../models/ReadingProgress.js';
import Ebook from '../../models/Ebook.js';

// ✅ GET ALL reading progress (admin dashboard view)
export const getAllReadingProgressAdmin = async (req, res) => {
  try {
    const data = await ReadingProgress.find()
      .populate('ebookId', 'title')
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET reading progress by ebook
export const getReadingByEbookAdmin = async (req, res) => {
  try {
    const data = await ReadingProgress.find({ ebookId: req.params.ebookId })
      .populate('ebookId', 'title')
      .sort({ progressPercent: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET reading progress by reader
export const getReadingByReaderAdmin = async (req, res) => {
  try {
    const data = await ReadingProgress.find({ readerEmail: req.params.email })
      .populate('ebookId', 'title')
      .sort({ updatedAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE / RESET reading progress
export const deleteReadingProgressAdmin = async (req, res) => {
  try {
    const deleted = await ReadingProgress.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }
    res.json({ message: 'Reading progress deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ COMPLETION STATS (Admin Dashboard)
export const getReadingStatsAdmin = async (req, res) => {
  try {
    const totalReaders = await ReadingProgress.countDocuments();
    const completedReaders = await ReadingProgress.countDocuments({
      isCompleted: true,
    });

    const ebooks = await Ebook.countDocuments();

    res.json({
      totalReaders,
      completedReaders,
      completionRate:
        totalReaders > 0
          ? Math.round((completedReaders / totalReaders) * 100)
          : 0,
      totalEbooks: ebooks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
