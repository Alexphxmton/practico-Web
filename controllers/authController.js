const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const authController = {

    showLogin: (req, res) => {
        res.render('auth/login'); 
    },

    showRegister: (req, res) => {
        res.render('auth/register');
    },


    register: async (req, res) => {
        try {
            const { nombre, email, password } = req.body;


            const existe = await Usuario.findOne({ where: { email } });
            if (existe) return res.send('El correo ya está registrado.');


            const hashedPassword = await bcrypt.hash(password, 10);

            await Usuario.create({
                nombre,
                email,
                password: hashedPassword,
                rol: 'cliente' 
            });

            console.log(` Usuario registrado: ${nombre}`);
            res.redirect('/login');
        } catch (error) {
            console.error(' Error en registro:', error);
            res.status(500).send('Error interno en el servidor');
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.send('Correo electrónico no encontrado.');
            }
            const match = await bcrypt.compare(password, usuario.password);
            if (!match) {
                return res.send('Contraseña incorrecta.');
            }
            req.session.userId = usuario.id;
            req.session.userNombre = usuario.nombre;
            req.session.userRol = usuario.rol;

            console.log(`Sesión iniciada para: ${usuario.nombre}`);
            if (usuario.rol === 'admin') {
                res.redirect('/admin/adminPrinc');
            } else {
                res.redirect('/cliente/listado');
            }

        } catch (error) {
            console.error(' Error en login:', error);
            res.status(500).send('Error interno en el servidor');
        }
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('Error al cerrar sesión:', err);
            res.redirect('/login');
        });
    }
};

module.exports = authController;