const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const canchaController = require("../controllers/canchaController");
const { verifyToken } = require("../utils/token");

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta de destino para almacenar las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Genera un nombre único para evitar conflictos
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes en formato JPEG, PNG o GIF"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de tamaño a 5MB
});

// Rutas CRUD para canchas

// Crear una cancha (incluye la carga de imagen)
router.post("/", verifyToken, upload.single("foto"), canchaController.createCancha);

// Editar una cancha
router.put("/:id", verifyToken, upload.single("foto"), canchaController.updateCancha);

// Eliminar una cancha
router.delete("/:id", verifyToken, canchaController.deleteCancha);

// Ruta para obtener las canchas del usuario autenticado
router.get("/my-canchas", verifyToken, canchaController.getMyCanchas);

router.get('/explore', canchaController.getAllCanchasPaginated);

module.exports = router;
