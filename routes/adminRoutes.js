const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');


router.get('/dashboard', isLoggedIn, isAdmin, (req, res) => {
    res.send(`Bienvenido Administrador: ${req.session.userNombre}`);
});

module.exports = router;