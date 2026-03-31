const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const authController = {
    // 1. Mostrar el formulario de Login
    showLogin: (req, res) => {
        res.render('auth/login'); // Renderiza views/auth/login.ejs
    },

    // 2. Mostrar el formulario de Registro
    showRegister: (req, res) => {
        res.render('auth/register'); // Renderiza views/auth/register.ejs
    },

    // 3. Procesar el Registro
    register: async (req, res) => {
        try {
            const { nombre, email, password } = req.body;

            // Verificar si el usuario ya existe
            const existe = await Usuario.findOne({ where: { email } });
            if (existe) return res.send('El correo ya está registrado.');

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear el usuario en la base de datos
            await Usuario.create({
                nombre,
                email,
                password: hashedPassword,
                rol: 'cliente' // Rol por defecto
            });

            console.log(`✅ Usuario registrado: ${nombre}`);
            res.redirect('/login');
        } catch (error) {
            console.error('❌ Error en registro:', error);
            res.status(500).send('Error interno en el servidor');
        }
    },

    // 4. Procesar el Login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar al usuario por email
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.send('Correo electrónico no encontrado.');
            }

            // Comparar contraseñas
            const match = await bcrypt.compare(password, usuario.password);
            if (!match) {
                return res.send('Contraseña incorrecta.');
            }

            // Guardar datos en la sesión
            req.session.userId = usuario.id;
            req.session.userNombre = usuario.nombre;
            req.session.userRol = usuario.rol;

            console.log(`🚀 Sesión iniciada para: ${usuario.nombre}`);

            // Redirección según el rol
            if (usuario.rol === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/cliente/listado');
            }

        } catch (error) {
            console.error('❌ Error en login:', error);
            res.status(500).send('Error interno en el servidor');
        }
    },

    // 5. Cerrar Sesión
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('Error al cerrar sesión:', err);
            res.redirect('/login');
        });
    }
};

module.exports = authController;