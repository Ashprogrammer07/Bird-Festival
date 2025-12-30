import Contact from '../../models/Contact.js';

// ✅ GET ALL contacts
export const getAllContactsAdmin = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET contact by ID
export const getContactByIdAdmin = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ MARK AS READ / UNREAD
export const updateContactReadStatusAdmin = async (req, res) => {
  try {
    const { isRead } = req.body;

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE contact
export const deleteContactAdmin = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
