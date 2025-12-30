import ResourcePerson from "../../models/ResourcePerson.js";

// ✅ GET all resource persons (admin)
export const getAllResourcePersonsAdmin = async (req, res) => {
  try {
    const persons = await ResourcePerson.find().sort({ createdAt: -1 });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET resource person by ID (admin)
export const getResourcePersonByIdAdmin = async (req, res) => {
  try {
    const person = await ResourcePerson.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Resource person not found" });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE resource person (admin)
export const deleteResourcePersonAdmin = async (req, res) => {
  try {
    const deleted = await ResourcePerson.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Resource person not found" });
    }
    res.json({ message: "Resource person deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
