const express = require('express');
const router = express.Router();
const canchaController = require('../controllers/canchaController');
const reservaController = require('../controllers/reservaController');
const { isLoggedIn } = require('../middleware/authMiddleware');


console.log('CanchaController cargado:', !!canchaController.listarCanchas);
console.log('ReservaController cargado:', !!reservaController.misReservas);


router.get('/listado', isLoggedIn, canchaController.listarCanchas);


router.get('/cancha/:id', isLoggedIn, canchaController.verDetalle);


router.get('/mis-reservas', isLoggedIn, reservaController.misReservas);

router.post('/reservar', isLoggedIn, reservaController.crearReserva);

router.post('/cancelar/:id', isLoggedIn, reservaController.cancelarReserva);


router.get('/resena/:id', canchaController.mostrarFormularioResena);


router.post('/resena/guardar', canchaController.guardarResena);

module.exports = router;