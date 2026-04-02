const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/adminPrinc', adminController.mostrarPanel);


router.get('/canchas', adminController.mostrarCanchas);
router.get('/canchas/nueva', adminController.nuevaCanchaForm);

router.post('/canchas/guardar', adminController.crearCancha); 
-
router.get('/horarios', adminController.mostrarHorarios);
router.post('/horarios/agregar', adminController.agregarHorario);


router.get('/reservas', adminController.mostrarReservas);
router.post('/reservas/actualizar/:id', adminController.actualizarEstadoReserva);

router.get('/tipoCancha', adminController.mostrarTipos);
router.post('/tipoCancha/crear', adminController.crearTipo);
router.post('/tipoCancha/eliminar/:id', adminController.eliminarTipo);
router.get('/resenas', adminController.mostrarResenas);

router.get('/reservas', adminController.mostrarReservas);
router.post('/reservas/actualizar/:id', adminController.actualizarEstadoReserva);

router.get('/canchas/editar/:id', adminController.editarCanchaForm);
router.post('/canchas/editar/:id', adminController.actualizarCancha);

router.post('/canchas/eliminar/:id', adminController.eliminarCancha);


module.exports = router;