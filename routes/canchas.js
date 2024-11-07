const express = require("express");
const router = express.Router();
const canchaController = require("../controllers/canchaController");
const checkPermission = require("../middlewares/checkPermission");
const { verifyToken } = require("../utils/token");

// Ruta protegida para crear una cancha (solo para propietarios)
router.post("/", verifyToken, checkPermission("cancha", "create"), canchaController.createCancha);

// Ruta protegida para actualizar una cancha (solo para propietarios)
router.put("/:id", verifyToken, checkPermission("cancha", "edit"), canchaController.updateCancha);

// Ruta protegida para eliminar una cancha (solo para propietarios)
router.delete("/:id", verifyToken, checkPermission("cancha", "delete"), canchaController.deleteCancha);

module.exports = router;
