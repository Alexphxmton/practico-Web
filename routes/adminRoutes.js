const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/adminPrinc', adminController.mostrarPanel);
router.get('/canchas', adminController.mostrarCanchas);
module.exports = router;