import ResourcePerson from '../models/ResourcePerson.js';

export const registerResourcePerson = async (req, res) => {
  try {
    const {
      name,
      designation,
      organization,
      email,
      phone,
      expertise,
      experience,
      qualifications,
      bio,
      topics,
      availability,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      name,
      designation,
      organization,
      email,
      phone,
      expertise,
      experience,
      qualifications,
      topics,
      availability
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const resourcePerson = new ResourcePerson({
      name: name.trim(),
      designation: designation.trim(),
      organization: organization.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      expertise: expertise.trim(),
      experience: experience.trim(),
      qualifications: qualifications.trim(),
      bio: bio ? bio.trim() : '',
      topics: topics.trim(),
      availability: availability.trim(),
    });

    const savedResourcePerson = await resourcePerson.save();
    res.status(201).json({
      message: 'Registration successful! We will review your application and get back to you soon.',
      data: savedResourcePerson,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllResourcePersons = async (req, res) => {
  try {
    const resourcePersons = await ResourcePerson.find().sort({ createdAt: -1 });

    // Check if language parameter is provided for localization
    const lang = req.query.lang;

    if (lang && ['en', 'hi'].includes(lang)) {
      const { toLocalizedObjects } = await import('../utils/i18nHelper.js');
      const localizedPersons = toLocalizedObjects(resourcePersons, lang);
      return res.json(localizedPersons);
    }

    res.json(resourcePersons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


