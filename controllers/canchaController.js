const Cancha = require("../models/Cancha"); // Modelo de la cancha, ajusta la ruta según sea necesario

// Crear una nueva cancha
exports.createCancha = async (req, res) => {
  try {
    const { name, location, numeroContacto, rutaGoogleMaps, tipo, capacidad } = req.body;
    const ownerId = req.user.userId; // ID del propietario extraído del token

    // Ruta de la imagen cargada
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    const newCancha = new Cancha({
      name,
      location,
      owner: ownerId,
      numeroContacto,
      rutaGoogleMaps,
      foto,
      tipo,
      capacidad,
    });

    await newCancha.save();
    res.status(201).json({ message: "Cancha creada con éxito", cancha: newCancha });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la cancha", error });
  }
};

// Obtener solo las canchas del usuario autenticado
exports.getMyCanchas = async (req, res) => {
  try {
    const ownerId = req.user.userId; // ID del usuario autenticado obtenido del token
    const canchas = await Cancha.find({ owner: ownerId }).select('name location tipo numeroContacto rutaGoogleMaps foto capacidad createdAt');
    res.status(200).json(canchas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las canchas del usuario", error });
  }
};

// Actualizar una cancha
exports.updateCancha = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, numeroContacto, rutaGoogleMaps, tipo, capacidad } = req.body;
    const ownerId = req.user.userId;

    const cancha = await Cancha.findOne({ _id: id, owner: ownerId });
    if (!cancha) {
      return res.status(404).json({ message: "Cancha no encontrada o no tienes permisos para editarla" });
    }

    // Actualizar solo si los valores están presentes en el cuerpo de la solicitud
    cancha.name = name || cancha.name;
    cancha.location = location || cancha.location;
    cancha.numeroContacto = numeroContacto || cancha.numeroContacto;
    cancha.rutaGoogleMaps = rutaGoogleMaps || cancha.rutaGoogleMaps;
    cancha.tipo = tipo || cancha.tipo;
    cancha.capacidad = capacidad || cancha.capacidad;

    if (req.file) {
      cancha.foto = `/uploads/${req.file.filename}`;
    }

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

exports.getAllCanchasPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página solicitada (por defecto, página 1)
    const limit = parseInt(req.query.limit) || 5; // Límite de canchas por página (por defecto, 5)

    const canchas = await Cancha.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCanchas = await Cancha.countDocuments(); // Total de canchas para calcular el número de páginas

    res.status(200).json({
      canchas,
      totalPages: Math.ceil(totalCanchas / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las canchas", error });
  }
};