const EBOOK_ID = 'birds-of-indian-subcontinent';
const STORAGE_KEY = `ebook_progress_${EBOOK_ID}`;

export const getEbookProgress = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      ebookId: EBOOK_ID,
      currentPage: 1,
      totalPages: 0,
      percentage: 0
    };
  } catch (error) {
    console.error('Error reading progress:', error);
    return {
      ebookId: EBOOK_ID,
      currentPage: 1,
      totalPages: 0,
      percentage: 0
    };
  }
};

export const saveEbookProgress = (currentPage, totalPages) => {
  try {
    const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
    const progress = {
      ebookId: EBOOK_ID,
      currentPage,
      totalPages,
      percentage
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return progress;
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const initializeEbookProgress = () => {
  const existing = getEbookProgress();
  if (existing.totalPages === 0) {
    saveEbookProgress(1, 0);
  }
  return existing;
};

export { EBOOK_ID };

