const Cancha = require('../models/Cancha');

// Crear una nueva cancha
exports.createCancha = async (req, res) => {
  try {
    const { name, location } = req.body;
    const ownerId = req.user.userId; // Obtenemos el ID del usuario autenticado

    const newCancha = new Cancha({
      name,
      location,
      owner: ownerId,
    });

    await newCancha.save();
    res.status(201).json({ message: "Cancha creada con éxito", cancha: newCancha });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la cancha", error });
  }
};

// Actualizar una cancha
exports.updateCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const ownerId = req.user.userId;

    const cancha = await Cancha.findOne({ _id: id, owner: ownerId });
    if (!cancha) {
      return res.status(404).json({ message: "Cancha no encontrada o no tienes permisos para editarla" });
    }

    cancha.name = name || cancha.name;
    cancha.location = location || cancha.location;

    await cancha.save();
    res.status(200).json({ message: "Cancha actualizada con éxito", cancha });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cancha", error });
  }
};

// Eliminar una cancha
exports.deleteCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.userId;

    const cancha = await Cancha.findOneAndDelete({ _id: id, owner: ownerId });
    if (!cancha) {
      return res.status(404).json({ message: "Cancha no encontrada o no tienes permisos para eliminarla" });
    }

    res.status(200).json({ message: "Cancha eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la cancha", error });
  }
};
