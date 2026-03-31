const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- RUTAS DE REGISTRO ---
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

// --- RUTAS DE LOGIN (CORREGIDO) ---
// Antes tenías un res.send aquí, ahora llamamos al controlador
router.get('/login', authController.showLogin); 
router.post('/login', authController.login);

// --- LOGOUT ---
router.get('/logout', authController.logout);

module.exports = router;