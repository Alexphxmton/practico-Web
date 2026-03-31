const express = require('express');
const router = express.Router();
const canchaController = require('../controllers/canchaController');
const reservaController = require('../controllers/reservaController');
const { isLoggedIn } = require('../middleware/authMiddleware');

// ESTO TE DIRÁ QUÉ ESTÁ FALLANDO EN LA TERMINAL
console.log('CanchaController cargado:', !!canchaController.listarCanchas);
console.log('ReservaController cargado:', !!reservaController.misReservas);

// Ruta: http://localhost:3000/cliente/listado
router.get('/listado', isLoggedIn, canchaController.listarCanchas);

// Ruta: http://localhost:3000/cliente/cancha/1
router.get('/cancha/:id', isLoggedIn, canchaController.verDetalle);

// Línea 12 (Probablemente esta es la que falla)
router.get('/mis-reservas', isLoggedIn, reservaController.misReservas);

router.post('/reservar', isLoggedIn, reservaController.crearReserva);

module.exports = router;