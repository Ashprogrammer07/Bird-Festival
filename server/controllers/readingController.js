import ReadingProgress from '../models/ReadingProgress.js';
import Ebook from '../models/Ebook.js';

// Start reading session
export const startReading = async (req, res) => {
  try {
    const { ebookId, readerName, readerEmail } = req.body;

    if (!ebookId || !readerName || readerName.trim() === '') {
      return res.status(400).json({ 
        message: 'Ebook ID and reader name are required' 
      });
    }

    if (!readerEmail || readerEmail.trim() === '') {
      return res.status(400).json({ 
        message: 'Reader email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(readerEmail.trim())) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    // Get ebook to get total pages
    const ebook = await Ebook.findById(ebookId);
    if (!ebook) {
      return res.status(404).json({ message: 'E-book not found' });
    }

    // Generate unique reader ID from name + email combination
    // Same name + email = same readerId = restored progress
    const readerIdString = `${readerName.trim().toLowerCase()}_${readerEmail.trim().toLowerCase()}`;
    const readerId = Buffer.from(readerIdString).toString('base64').substring(0, 30);

    // Check if progress already exists (restore progress for same name+email)
    let progress = await ReadingProgress.findOne({ 
      ebookId, 
      readerId 
    });

    if (progress) {
      // Update reader name and email in case they changed
      progress.readerName = readerName.trim();
      progress.readerEmail = readerEmail.trim().toLowerCase();
      await progress.save();
    } else {
      // Create new progress
      progress = new ReadingProgress({
        ebookId,
        readerName: readerName.trim(),
        readerEmail: readerEmail.trim().toLowerCase(),
        readerId,
        totalPages: ebook.pages || 100, // Default to 100 if not set
        lastPage: 1,
        progressPercent: 0,
        timeSpent: 0,
        isCompleted: false,
      });
      await progress.save();
    }

    res.status(200).json({
      message: 'Reading session started',
      data: progress,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update reading progress
export const updateReading = async (req, res) => {
  try {
    const { ebookId, readerId, currentPage, timeSpent } = req.body;

    if (!ebookId || !readerId || currentPage === undefined) {
      return res.status(400).json({ 
        message: 'Ebook ID, reader ID, and current page are required' 
      });
    }

    const progress = await ReadingProgress.findOne({ ebookId, readerId });
    if (!progress) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }

    // Update progress
    progress.lastPage = Math.max(progress.lastPage, currentPage);
    progress.progressPercent = Math.round((progress.lastPage / progress.totalPages) * 100);
    progress.lastReadAt = new Date();
    
    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }

    // Check if completed (reached last page or 95%+ progress)
    if (progress.lastPage >= progress.totalPages || progress.progressPercent >= 95) {
      if (!progress.isCompleted) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }
    }

    await progress.save();

    res.status(200).json({
      message: 'Progress updated',
      data: progress,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get reading progress
export const getReadingProgress = async (req, res) => {
  try {
    const { ebookId, readerId } = req.params;

    const progress = await ReadingProgress.findOne({ ebookId, readerId });
    if (!progress) {
      return res.status(404).json({ message: 'Reading progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get completion statistics for an ebook
export const getCompletionStats = async (req, res) => {
  try {
    const { ebookId } = req.params;

    const totalReaders = await ReadingProgress.countDocuments({ ebookId });
    const completedReaders = await ReadingProgress.countDocuments({ 
      ebookId, 
      isCompleted: true 
    });

    res.json({
      totalReaders,
      completedReaders,
      completionRate: totalReaders > 0 
        ? Math.round((completedReaders / totalReaders) * 100) 
        : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

