const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const sequelize = require('./config/database');

dotenv.config();

// MODELOS
const Usuario = require('./models/usuario');
const Cancha = require('./models/cancha');
const TipoCancha = require('./models/TipoCancha');
const Horario = require('./models/horario');
const Reserva = require('./models/reserva');
const Resena = require('./models/resenas');

// RELACIONES
Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id', as: 'detalleTipo' });
TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id', as: 'canchasDelTipo' });

Cancha.hasMany(Horario, { foreignKey: 'cancha_id', as: 'listaHorarios' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'datosCancha' });

Horario.hasOne(Reserva, { foreignKey: 'horario_id', as: 'reservaVinculada' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id', as: 'detalleHorario' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'misReservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'propietario' });

const app = express();

// CONFIGURACIÓN
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


//Relaciones para reseñas

Resena.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autorResena' }); 
Usuario.hasMany(Resena, { foreignKey: 'usuario_id', as: 'susResenas' });

Resena.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'datosCancha' });
Cancha.hasMany(Resena, { foreignKey: 'cancha_id', as: 'todasLasResenas' });

// SESIONES
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_para_desarrollo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// USUARIO GLOBAL EN VISTAS
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        nombre: req.session.userNombre,
        rol: req.session.userRol
    } : null;
    next();
});



Resena.belongsTo(Usuario, { as: 'propietario', foreignKey: 'usuario_id' });
// RUTAS
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const adminRoutes = require('./routes/adminRoutes');

// PÚBLICAS
app.use('/', authRoutes);

// CLIENTE
app.use('/cliente', clienteRoutes);


app.use('/admin', (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    if (req.session.userRol !== 'admin') {
        return res.status(403).send('No autorizado');
    }

    next();
}, adminRoutes);

// HOME
app.get('/', (req, res) => {
    if (req.session.userId) {

        if (req.session.userRol === 'admin') {
            return res.redirect('/admin/adminPrinc');
        }

        return res.redirect('/cliente/listado');
    }

    res.render('index');
});

// SERVIDOR
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) 
    .then(() => {
        console.log('✅ Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor en: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error(' Error DB:', err);
    });