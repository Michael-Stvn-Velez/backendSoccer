const permissions = require("../utils/permissions");

const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles) {
      console.log('Acceso denegado: req.user o req.user.roles no está definido');
      return res.status(403).json({ message: "Acceso denegado: no tienes permisos." });
    }

    console.log(`Roles del usuario: ${user.roles}`); 

    // Verificar si el usuario tiene el rol necesario para la acción en el recurso
    const hasPermission = user.roles.some((role) => {
      console.log(`Verificando permisos para el rol: ${role}`);
      return (
        permissions[role] && // Verificar que el rol existe en el archivo de permisos
        permissions[role][resource] && // Verificar que el recurso existe para el rol
        permissions[role][resource].includes(action) // Verificar que la acción está permitida
      );
    });

    if (!hasPermission) {
      console.log('Acceso denegado: el usuario no tiene los permisos necesarios');
      return res.status(403).json({ message: "Acceso denegado: no tienes permisos." });
    }

    console.log('Permiso concedido: el usuario tiene los permisos necesarios');
    next();
  };
};

module.exports = checkPermission;
