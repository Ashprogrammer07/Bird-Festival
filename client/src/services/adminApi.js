import api from "./api";

/* ================= ADMIN AUTH ================= */
export const adminAuthAPI = {
  login: (data) => api.post("/admin/login", data),
};

/* ================= FESTIVAL INFO ================= */
export const adminFestivalAPI = {
  getAll: () => api.get("/admin/festival"),
  getById: (id) => api.get(`/admin/festival/${id}`),
  create: (data) => api.post("/admin/festival", data),
  update: (id, data) => api.put(`/admin/festival/${id}`, data),
  delete: (id) => api.delete(`/admin/festival/${id}`),
};

/* ================= SCHEDULE ================= */
export const adminScheduleAPI = {
  getAll: () => api.get("/admin/schedule"),
  getById: (id) => api.get(`/admin/schedule/${id}`),
  create: (data) => api.post("/admin/schedule", data),
  update: (id, data) => api.put(`/admin/schedule/${id}`, data),
  delete: (id) => api.delete(`/admin/schedule/${id}`),
};

/* ================= EBOOK ================= */
export const adminEbookAPI = {
  getAll: () => api.get("/admin/ebooks"),
  getById: (id) => api.get(`/admin/ebooks/${id}`),
  create: (data) => api.post("/admin/ebooks", data),
  update: (id, data) => api.put(`/admin/ebooks/${id}`, data),
  delete: (id) => api.delete(`/admin/ebooks/${id}`),
};

/* ================= CONTACT ================= */
export const adminContactAPI = {
  getAll: () => api.get("/admin/contacts"),
  getById: (id) => api.get(`/admin/contacts/${id}`),
  markRead: (id, isRead) =>
    api.put(`/admin/contacts/${id}/read`, { isRead }),
  delete: (id) => api.delete(`/admin/contacts/${id}`),
};

/* ================= PLEDGE ================= */
/* ================= PLEDGE ================= */
export const adminPledgeAPI = {
  getAll: () => api.get("/admin/pledges"),
  getById: (id) => api.get(`/admin/pledges/${id}`),
  create: (data) => api.post("/admin/pledges", data),       // ✅ Create
  update: (id, data) => api.put(`/admin/pledges/${id}`, data), // ✅ Update
  delete: (id) => api.delete(`/admin/pledges/${id}`),
  exportCSV: () => api.get("/admin/pledges/export/csv", { responseType: 'blob' }),
  bulkDelete: (ids) => api.post("/admin/pledges/bulk-delete", { ids }),
  getAnalytics: () => api.get("/admin/pledges/analytics"),
};

/* ================= COMPETITIONS ================= */
// Photo
export const adminPhotoCompetitionAPI = {
  getAll: () => api.get("/admin/competitions/photo"),
  getById: (id) => api.get(`/admin/competitions/photo/${id}`),
  delete: (id) => api.delete(`/admin/competitions/photo/${id}`),
};

// Reel
export const adminReelCompetitionAPI = {
  getAll: () => api.get("/admin/competitions/reel"),
  getById: (id) => api.get(`/admin/competitions/reel/${id}`),
  delete: (id) => api.delete(`/admin/competitions/reel/${id}`),
};

// Painting
export const adminPaintingCompetitionAPI = {
  getAll: () => api.get("/admin/competitions/painting"),
  getById: (id) => api.get(`/admin/competitions/painting/${id}`),
  delete: (id) => api.delete(`/admin/competitions/painting/${id}`),
};

/* ================= VOLUNTEERS ================= */
export const adminVolunteerAPI = {
  getAll: () => api.get("/admin/volunteers"),
  getById: (id) => api.get(`/admin/volunteers/${id}`),
  delete: (id) => api.delete(`/admin/volunteers/${id}`),
  exportCSV: () => api.get("/admin/volunteers/export/csv", { responseType: 'blob' }),
  bulkDelete: (ids) => api.post("/admin/volunteers/bulk-delete", { ids }),
  getAnalytics: () => api.get("/admin/volunteers/analytics"),
};

/* ================= READING PROGRESS ================= */
export const adminReadingAPI = {
  getAll: () => api.get("/admin/reading"),
  getStats: () => api.get("/admin/reading/stats"),
  getByEbook: (ebookId) =>
    api.get(`/admin/reading/ebook/${ebookId}`),
  getByReader: (email) =>
    api.get(`/admin/reading/reader/${email}`),
  delete: (id) => api.delete(`/admin/reading/${id}`),
};


/* ================= RESOURCE PERSON ================= */
export const adminResourcePersonAPI = {
  getAll: () => api.get("/admin/resource-persons"),
  getById: (id) => api.get(`/admin/resource-persons/${id}`),
  delete: (id) => api.delete(`/admin/resource-persons/${id}`),
};

/* ================= QUIZZES ================= */
export const adminQuizAPI = {
  // QUIZ CRUD
  getAll: () => api.get("/admin/quizzes"),
  getById: (id) => api.get(`/admin/quizzes/${id}`),
  create: (data) => api.post("/admin/quizzes", data),
  update: (id, data) => api.put(`/admin/quizzes/${id}`, data), // ✅ REQUIRED
  delete: (id) => api.delete(`/admin/quizzes/${id}`),

  // PUBLISH / UNPUBLISH
  togglePublish: (id) => api.put(`/admin/quizzes/${id}/publish`),

  // SUBMISSIONS
  submissions: () => api.get("/admin/quizzes/submissions/all"),
};

